// src/controllers/friends.ts
import { Request, Response } from 'express';
import { db } from '../util/db';
import { friends , users, userChats, chats,messages} from '../model/schema';
import {and, eq ,or, not, like, inArray} from 'drizzle-orm';
import { onlineUsers, lastSeenMap } from '../util/socket';

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

export const allUsers = async (req: Request, res: Response) => {
  const userId = Number(req.user?.id);

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const results = await db
      .select({
        id: users.id,
        firstname: users.firstname,
        lastname: users.lastname,
        email: users.email,

        profilePicture: users.profilePicture,
      })
      .from(users)
     .where(not(eq(users.id, userId))) 
      .orderBy(users.firstname); 

    res.status(200).json({ users: results });
    return;
  } catch (error) {
    console.error('Fetch all users error:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
}
// Add a friend
export const addFriend = async (req: Request, res: Response) => {
  const userId = Number(req.user?.id);
  const { friendId } = req.body;

  if (!userId || !friendId) {
    res.status(400).json({ error: 'Missing user or friend ID' });
     return
  }

  if (userId === friendId) {
   res.status(400).json({ error: 'You cannot add yourself as a friend' });
     return
  }

  try {
    // Check if already friends
    const existing = await db
      .select()
      .from(friends)
      .where(and (eq(friends.userId, userId), eq(friends.friendId, friendId)))
        
    if (existing.length) {
      res.status(409).json({ error: 'Already friends' });
       return;
    }

    await db.insert(friends).values([
      { userId, friendId },
      { userId: friendId, friendId: userId }, // mutual friendship
    ]);

res.status(201).json({ message: 'Friend added' });
    return 
  } catch (error) {
    console.error('Add friend error:', error);
  res.status(500).json({ error: 'Internal server error' });
     return
  }
};

// Get all friends of a user
export const getFriends = async (req: Request, res: Response) => {
  const userId = Number(req.user?.id);

  if (!userId) {
   res.status(401).json({ error: 'Unauthorized' });
     return
  }

  try {
    const results = await db
      .select({
        id: users.id,
        firstname: users.firstname,
        lastname: users.lastname,
        email: users.email,

        profilePicture: users.profilePicture,
      })
      .from(friends)
      .innerJoin(users, eq(friends.friendId, users.id))
      .where(eq(friends.userId, userId))
      .orderBy(users.firstname); // Alphabetical

res.status(200).json({ friends: results });
    return 
  } catch (error) {
    console.error('Fetch friends error:', error);
  res.status(500).json({ error: 'Internal server error' });
    return 
  }
};

// Remove a friend
export const removeFriend = async (req: Request, res: Response) => {
  const userId = Number(req.user?.id);
  const { friendId } = req.body;

  if (!userId || !friendId) {
    res.status(400).json({ error: 'Missing user or friend ID' });
    return;
  }

  if (userId === friendId) {
    res.status(400).json({ error: 'You cannot remove yourself as a friend' });
    return;
  }

  try {
    // Check if friendship exists
    const existing = await db
      .select()
      .from(friends)
      .where(and(eq(friends.userId, userId), eq(friends.friendId, friendId)));

    if (!existing.length) {
      res.status(404).json({ error: 'Friend not found' });
      return;
    }

    // Remove both directions of the friendship
    await db
      .delete(friends)
      .where(and(eq(friends.userId, userId), eq(friends.friendId, friendId)));
    await db
      .delete(friends)
      .where(and(eq(friends.userId, friendId), eq(friends.friendId, userId)));

    
    //  Find all non-group chats for the user
    const userChatIds = (
      await db
        .select({ chatId: userChats.chatId })
        .from(userChats)
        .where(eq(userChats.userId, userId))
    ).map(row => row.chatId);

    if (userChatIds.length > 0) {
      // find a non-group chat that includes friendId and only these two users
      const possibleChats = await db
        .select()
        .from(chats)
        .where(and(
          inArray(chats.id, userChatIds),
          eq(chats.isGroup, false)
        ));

      for (const chat of possibleChats) {
        // Find all participants in this chat
        const chatParticipants = await db
          .select({ userId: userChats.userId })
          .from(userChats)
          .where(eq(userChats.chatId, chat.id));

        const chatParticipantIds = chatParticipants.map(p => p.userId).sort();
        const targetIds = [userId, friendId].sort();

        if (
          chatParticipantIds.length === 2 &&
          chatParticipantIds[0] === targetIds[0] &&
          chatParticipantIds[1] === targetIds[1]
        ) {
          // Delete messages in the chat
          await db.delete(messages).where(eq(messages.chatId, chat.id));
          // Delete user-chat links
          await db.delete(userChats).where(eq(userChats.chatId, chat.id));
          // Delete the chat itself
          await db.delete(chats).where(eq(chats.id, chat.id));
        }
      }
    }


    res.status(200).json({ message: 'Friend removed and chat (if any) deleted' });
    return;
  } catch (error) {
    console.error('Remove friend error:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
};
// Get online friends
export const getOnlineFriends = async (req: Request, res: Response) => {
  const userId = Number(req.user?.id);

  console.log("Checking online friends for user:", userId);
  console.log("All online users:", Array.from(onlineUsers.keys()));

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    // Get all friend IDs
    const friendRecords = await db
      .select({ friendId: friends.friendId })
      .from(friends)
      .where(eq(friends.userId, userId));

    const friendIds = friendRecords.map(f => f.friendId);
    console.log("Friend IDs:", friendIds);

    // Filter friends who are currently online
    const onlineFriendIds = friendIds.filter(id => onlineUsers.has(id));
    console.log("Online friend IDs:", onlineFriendIds);

    res.status(200).json({ online: onlineFriendIds });
    return;
  } catch (error) {
    console.error('Get online friends error:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
};

//get friend details by Id
export const getFriendDetails = async (req: Request, res: Response) => {
  const userId = Number(req.user?.id);
  const friendId = Number(req.params.friendId);
 console.log("Fetching details for friend ID:", friendId, "for user ID:", userId);
  if (!userId || !friendId) {
    res.status(400).json({ error: 'Missing user or friend ID' });
    return;
  }

  try {
    const friend = await db
      .select({
        id: users.id,
        firstname: users.firstname,
        lastname: users.lastname,
        email: users.email,
        profilePicture: users.profilePicture,
      })
      .from(users)
      .where(eq(users.id, friendId))
      .limit(1);

    if (!friend.length) {
      res.status(404).json({ error: 'Friend not found' });
      return;
    }

    res.status(200).json({ friend: friend[0] });
    return;
  } catch (error) {
    console.error('Get friend details error:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
};

// Search friends by name or email
export const searchFriends = async (req: Request, res: Response) => {
  const userId = Number(req.user?.id);
  const query = String(req.query.query || '');

  if (!userId || !query.trim()) {
   res.status(400).json({ error: 'Missing user ID or search query' });
     return
  }

  try {
    const results = await db
      .select({
        id: users.id,
        firstname: users.firstname,
        lastname: users.lastname,
        email: users.email,
      })
      .from(friends)
      .innerJoin(users, eq(friends.friendId, users.id))
      .where(and(
        eq(friends.userId, userId),
        or(
          like(users.firstname, `%${query}%`),
          like(users.lastname, `%${query}%`),
          like(users.email, `%${query}%`)
        )
      ))
      .orderBy(users.firstname);

   res.status(200).json({ results });
    return 
  } catch (error) {
    console.error('Search friends error:', error);
   res.status(500).json({ error: 'Internal server error' });
     return
  }
};

// Get user status 
export const getUserStatus = async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);

  if (!userId || isNaN(userId)) {
    res.status(400).json({ error: 'Invalid user ID' });
    return;
  }

 

  const isOnline = onlineUsers.has(userId);
  const lastSeenDate = lastSeenMap.get(userId);



  const response = {
    userId,
    status: isOnline ? 'online' : 'offline',
    lastSeen: isOnline ? null : (lastSeenDate ? lastSeenDate.toISOString() : null),
  };


  res.status(200).json(response);
};