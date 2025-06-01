import { Request, Response, NextFunction } from 'express';
import { sendEmail } from "../util/email";
import { db } from "../util/db";
import { messages , messageDeletes, chats, userChats  } from '../model/schema';
import { and, eq, isNull, inArray } from "drizzle-orm";
import { io } from '../util/socket'; 


declare global {
  namespace Express {
    interface User {
      id: number;

    }
    interface Request {
      user?: User;
    }
  }
}


// Get messages for a user or a specific chat
export const getMessage = async (req: Request, res: Response): Promise<any> => {
  const userId = Number(req.user?.id);
  const chatId = req.query.chatId ? Number(req.query.chatId) : undefined;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const query = db
      .select({
        id: messages.id,
        chatId: messages.chatId,
        senderId: messages.senderId,
        content: messages.content,
        createdAt: messages.createdAt
      })
      .from(messages)
      .leftJoin(
        messageDeletes,
        and(
          eq(messageDeletes.messageId, messages.id),
          eq(messageDeletes.userId, userId)
        )
      )
      .where(
        and(
          eq(messages.chatId, chatId!),
          isNull(messageDeletes.messageId)
        )
      )
      .orderBy(messages.createdAt);

    const userMessages = await query;

    res.status(200).json({ messages: userMessages });
    return;
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

// Create a new chat
export const createChat = async (req: Request, res: Response) => {
  const userId = Number(req.user?.id);
  const { participantIds, name, isGroup } = req.body; // participantIds: number[]

  if (!userId || !participantIds || !Array.isArray(participantIds) || participantIds.length === 0) {
   res.status(400).json({ error: 'Missing participants' });
    return 
  }

  // Add the creator to the participants if not already included
  if (!participantIds.includes(userId)) participantIds.push(userId);

  try {
    if (!isGroup && participantIds.length === 2) {
      // For 1-on-1 chat, check if chat exists with exactly these two users

      // Find chats of userId
      const userChatsList = await db
        .select()
        .from(userChats)
        .where(eq(userChats.userId, userId));

      const userChatIds = userChatsList.map(uc => uc.chatId);

      // Find chats which include participantIds only (and exactly 2 users)
      // This requires a bit of logic:
      // We'll fetch chats with the participants and check counts.

      const possibleChats = await db
        .select()
        .from(chats)
        .where(inArray(chats.id, userChatIds));
    

      for (const chat of possibleChats) {
        // Get all users in chat
        const chatUsers = await db
          .select()
          .from(userChats)
          .where(eq(userChats.chatId, chat.id));

        const chatUserIds = chatUsers.map(cu => cu.userId).sort();
        const participantsSorted = participantIds.slice().sort();

        // Check if chat has exactly the same participants
        if (
          chatUserIds.length === participantsSorted.length &&
          chatUserIds.every((val, idx) => val === participantsSorted[idx])
        ) {
          res.status(200).json({ chat });
           return
        }
      }
    }

    // Create new chat
    const [newChat] = await db
      .insert(chats)
      .values({
        name: isGroup ? name : null,
        isGroup: !!isGroup,
      })
      .returning();

    // Insert into userChats
    const userChatEntries = participantIds.map(userId => ({
      chatId: newChat.id,
      userId,
    }));

    await db.insert(userChats).values(userChatEntries);

    res.status(201).json({ chat: newChat });
     return
  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({ error: 'Internal server error' });
     return
  }
};

// Send a message 
export const sendMessage = async (req: Request, res: Response) => {
  const senderId = Number(req.user?.id);
  const { chatId, content } = req.body;

  if (!senderId || !chatId || !content) {
   res.status(400).json({ error: 'Missing required fields' });
     return
  }

  try {
    // Check if sender belongs to chat
    const userChat = await db
      .select()
      .from(userChats)
      .where(
        and(
          eq(userChats.chatId, chatId),
          eq(userChats.userId, senderId)
        )
      );

    if (!userChat.length) {
     res.status(403).json({ error: 'You are not a participant of this chat' });
       return
    }

    // Insert message
    const [newMessage] = await db
      .insert(messages)
      .values({
        chatId,
        senderId,
        content,
      })
      .returning();

    // Optionally emit message with socket.io here if integrated

   res.status(201).json({ message: newMessage });
     return
  } catch (error) {
    console.error('Send message error:', error);
   res.status(500).json({ error: 'Internal server error' });
     return
  }
};

// delete a message for a user
export const deleteMessageForUser = async (req: Request, res: Response) => {
  const userId = Number(req.user?.id);
  const messageId = Number(req.params.messageId);

  if (!userId || !messageId) {
  res.status(400).json({ error: 'Missing user or message ID' });
    return
  }

  try {
    await db.insert(messageDeletes).values({ messageId, userId });
   res.status(200).json({ message: 'Message hidden for user' });
     return
  } catch (error) {
    console.error('Delete message error:', error);
 res.status(500).json({ error: 'Internal server error' });
   return
  }
};

// delete a message for everyone
export const deleteChatForEveryone = async (req: Request, res: Response) => {
  const userId = Number(req.user?.id);
  const chatId = Number(req.params.chatId);

  if (!userId || !chatId) {
   res.status(400).json({ error: 'Missing user or chat ID' });
     return;
  }

  try {
    // Optional: check if user is in the chat
    const isParticipant = await db
      .select()
      .from(userChats)
      .where(and(eq(userChats.chatId, chatId), eq(userChats.userId, userId)));

    if (!isParticipant.length) {
     res.status(403).json({ error: 'You are not a participant of this chat' })
      return;
    }

    // Delete messages
    await db.delete(messages).where(eq(messages.chatId, chatId));

    // Delete user-chat relations
    await db.delete(userChats).where(eq(userChats.chatId, chatId));

    // Delete chat itself
    await db.delete(chats).where(eq(chats.id, chatId));

 res.status(200).json({ message: 'Chat deleted for all users' });
      return
  } catch (error) {
    console.error('Delete chat error:', error);
     res.status(500).json({ error: 'Internal server error' });
       return
  }
};
