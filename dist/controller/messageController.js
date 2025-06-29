"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteChatForEveryone = exports.deleteMessageForEveryone = exports.updateGroupChat = exports.sendMessage = exports.createChat = exports.getMessage = exports.getUserChatsSummary = void 0;
const db_1 = require("../util/db");
const schema_1 = require("../model/schema");
const drizzle_orm_1 = require("drizzle-orm");
const socket_1 = require("../util/socket");
const upload_1 = require("../middleware/upload");
const getUserChatsSummary = async (req, res) => {
    const userId = Number(req.user?.id);
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        // Get all chats user participates in
        const userChatsList = await db_1.db
            .select({ chatId: schema_1.userChats.chatId })
            .from(schema_1.userChats)
            .where((0, drizzle_orm_1.eq)(schema_1.userChats.userId, userId));
        const chatIds = userChatsList.map(row => row.chatId);
        if (chatIds.length === 0) {
            return res.status(200).json({ chats: [] });
        }
        // Fetch chat details
        const chatsDetails = await db_1.db
            .select({
            id: schema_1.chats.id,
            name: schema_1.chats.name,
            isGroup: schema_1.chats.isGroup,
        })
            .from(schema_1.chats)
            .where((0, drizzle_orm_1.inArray)(schema_1.chats.id, chatIds));
        // Fetch last messages
        const lastMessages = await db_1.db
            .select({
            chatId: schema_1.messages.chatId,
            content: schema_1.messages.content,
            createdAt: schema_1.messages.createdAt,
        })
            .from(schema_1.messages)
            .where((0, drizzle_orm_1.inArray)(schema_1.messages.chatId, chatIds))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.messages.createdAt));
        const lastMessageMap = new Map();
        for (const msg of lastMessages) {
            if (!lastMessageMap.has(msg.chatId) && msg.createdAt) {
                lastMessageMap.set(msg.chatId, { content: msg.content, createdAt: msg.createdAt });
            }
        }
        // Fetch all users for each chat
        const allUserChats = await db_1.db
            .select({
            chatId: schema_1.userChats.chatId,
            userId: schema_1.userChats.userId,
            userName: (0, drizzle_orm_1.sql) `${schema_1.users.firstname} || ' ' || ${schema_1.users.lastname}`.as("userName"),
            profilePicture: schema_1.users.profilePicture,
        })
            .from(schema_1.userChats)
            .innerJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.userChats.userId, schema_1.users.id))
            .where((0, drizzle_orm_1.inArray)(schema_1.userChats.chatId, chatIds));
        // Group users by chatId
        const chatUsersMap = new Map();
        for (const uc of allUserChats) {
            if (!chatUsersMap.has(uc.chatId)) {
                chatUsersMap.set(uc.chatId, []);
            }
            chatUsersMap.get(uc.chatId).push({
                userId: uc.userId,
                name: uc.userName,
                profilePicture: uc.profilePicture || undefined,
            });
        }
        // Build final chat summaries
        const chatsSummary = chatsDetails.map(chat => {
            const participants = chatUsersMap.get(chat.id) || [];
            let displayName = chat.name;
            if (!chat.isGroup && participants.length > 0) {
                const otherParticipant = participants.find(p => p.userId !== userId);
                displayName = otherParticipant ? otherParticipant.name : 'Unknown';
            }
            const lastMessage = lastMessageMap.get(chat.id);
            return {
                id: chat.id,
                name: displayName,
                isGroup: chat.isGroup,
                participants: participants.map(p => {
                    const isCurrentUser = p.userId === userId;
                    const participantData = {
                        id: p.userId,
                        name: p.name,
                    };
                    // Only include profilePicture if:
                    // 1. It's a 1-on-1 chat
                    // 2. The participant is NOT the current user
                    // 3. The profilePicture exists
                    if (!chat.isGroup && !isCurrentUser && p.profilePicture) {
                        participantData.profilePicture = p.profilePicture;
                    }
                    return participantData;
                }),
                lastMessage: lastMessage?.content || null,
                lastMessageAt: lastMessage?.createdAt || null,
            };
        });
        chatsSummary.sort((a, b) => {
            if (a.lastMessageAt === null && b.lastMessageAt === null)
                return 0;
            if (a.lastMessageAt === null)
                return 1;
            if (b.lastMessageAt === null)
                return -1;
            return b.lastMessageAt.getTime() - a.lastMessageAt.getTime();
        });
        return res.status(200).json({ chats: chatsSummary });
    }
    catch (error) {
        console.error('Error fetching user chats summary:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getUserChatsSummary = getUserChatsSummary;
// Get messages for a user or a specific chat
const getMessage = async (req, res) => {
    const userId = Number(req.user?.id);
    const chatId = req.query.chatId ? Number(req.query.chatId) : undefined;
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    try {
        const query = db_1.db
            .select({
            id: schema_1.messages.id,
            chatId: schema_1.messages.chatId,
            senderId: schema_1.messages.senderId,
            content: schema_1.messages.content,
            contentType: schema_1.messages.type,
            createdAt: schema_1.messages.createdAt
        })
            .from(schema_1.messages)
            .leftJoin(schema_1.messageDeletes, (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.messageDeletes.messageId, schema_1.messages.id), (0, drizzle_orm_1.eq)(schema_1.messageDeletes.userId, userId)))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.messages.chatId, chatId), (0, drizzle_orm_1.isNull)(schema_1.messageDeletes.messageId)))
            .orderBy(schema_1.messages.createdAt);
        const userMessages = await query;
        res.status(200).json({ messages: userMessages });
        return;
    }
    catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Internal server error" });
        return;
    }
};
exports.getMessage = getMessage;
// Create a new chat
const createChat = async (req, res) => {
    const currentUserId = Number(req.user?.id);
    let { participantIds, name, isGroup } = req.body;
    if (!currentUserId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    if (!Array.isArray(participantIds) || participantIds.length === 0) {
        res.status(400).json({ error: 'participantIds must be a non-empty array' });
        return;
    }
    // Ensure current user is included
    if (!participantIds.includes(currentUserId)) {
        participantIds.push(currentUserId);
    }
    const uniqueParticipantIds = [...new Set(participantIds)];
    const participantCount = uniqueParticipantIds.length;
    // Validate inputs
    if (!isGroup && participantCount !== 2) {
        res.status(400).json({ error: '1-on-1 chat must have exactly one other participant' });
        return;
    }
    if (isGroup && participantCount < 3) {
        res.status(400).json({ error: 'Group chat must have at least 2 other participants' });
        return;
    }
    if (!isGroup && name) {
        res.status(400).json({ error: '1-on-1 chats should not have a name' });
        return;
    }
    if (isGroup && !name) {
        res.status(400).json({ error: 'Group chats must have a name' });
        return;
    }
    const participantsSorted = [...uniqueParticipantIds].sort();
    try {
        // ✅ Check for existing 1-on-1 chat
        if (!isGroup) {
            const userChatsList = await db_1.db
                .select()
                .from(schema_1.userChats)
                .where((0, drizzle_orm_1.eq)(schema_1.userChats.userId, currentUserId));
            const userChatIds = userChatsList.map((uc) => uc.chatId);
            const possibleChats = await db_1.db
                .select()
                .from(schema_1.chats)
                .where((0, drizzle_orm_1.inArray)(schema_1.chats.id, userChatIds));
            for (const chat of possibleChats) {
                if (chat.isGroup)
                    continue;
                const chatUsers = await db_1.db
                    .select()
                    .from(schema_1.userChats)
                    .where((0, drizzle_orm_1.eq)(schema_1.userChats.chatId, chat.id));
                const chatUserIds = chatUsers.map((cu) => cu.userId).sort();
                if (chatUserIds.length === participantsSorted.length &&
                    chatUserIds.every((val, idx) => val === participantsSorted[idx])) {
                    const participants = await db_1.db
                        .select()
                        .from(schema_1.users)
                        .where((0, drizzle_orm_1.inArray)(schema_1.users.id, chatUserIds));
                    res.status(200).json({ chat: { ...chat, participants } });
                    return;
                }
            }
        }
        // ✅ Check for existing group chat with same name and same users
        if (isGroup) {
            const existingGroupChats = await db_1.db
                .select()
                .from(schema_1.chats)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.chats.isGroup, true), (0, drizzle_orm_1.eq)(schema_1.chats.name, name)));
            for (const groupChat of existingGroupChats) {
                const chatUsers = await db_1.db
                    .select()
                    .from(schema_1.userChats)
                    .where((0, drizzle_orm_1.eq)(schema_1.userChats.chatId, groupChat.id));
                const chatUserIds = chatUsers.map((cu) => cu.userId).sort();
                if (chatUserIds.length === participantsSorted.length &&
                    chatUserIds.every((val, idx) => val === participantsSorted[idx])) {
                    res.status(200).json({ chat: groupChat });
                    return;
                }
            }
        }
        // ✅ Create new chat
        const [newChat] = await db_1.db
            .insert(schema_1.chats)
            .values({
            name: isGroup ? name : null,
            isGroup: !!isGroup,
        })
            .returning();
        // ✅ Create user-chat links
        const userChatEntries = uniqueParticipantIds.map((userId) => ({
            chatId: newChat.id,
            userId,
        }));
        await db_1.db.insert(schema_1.userChats).values(userChatEntries);
        const participants = await db_1.db
            .select()
            .from(schema_1.users)
            .where((0, drizzle_orm_1.inArray)(schema_1.users.id, uniqueParticipantIds));
        // ✅ Emit via socket.io
        uniqueParticipantIds.forEach((id) => {
            socket_1.io.to(`user_${id}`).emit('chat_created', { chat: newChat });
        });
        res.status(201).json({ chat: { ...newChat, participants } });
    }
    catch (error) {
        console.error('Create chat error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.createChat = createChat;
// Send a message 
const sendMessage = async (req, res) => {
    const senderId = Number(req.user?.id);
    const { chatId, content } = req.body;
    if (!senderId || !chatId) {
        res.status(400).json({ error: "Missing required fields" });
        return;
    }
    //check if text or file  exists
    if (!content && !req.file) {
        res.status(400).json({ error: "Either content or image file must be provided" });
        return;
    }
    try {
        // Verify user is part of the chat
        const userChat = await db_1.db
            .select()
            .from(schema_1.userChats)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.userChats.chatId, chatId), (0, drizzle_orm_1.eq)(schema_1.userChats.userId, senderId)));
        if (!userChat.length) {
            res.status(403).json({ error: "You are not a participant of this chat" });
            return;
        }
        let messageContent = content;
        let messageType = 'text';
        if (req.file) {
            messageContent = await (0, upload_1.compressAndUpload)(req.file);
            messageType = 'image';
        }
        // Insert message into DB
        const [newMessage] = await db_1.db
            .insert(schema_1.messages)
            .values({
            chatId,
            senderId,
            content: messageContent,
            type: messageType,
        })
            .returning();
        // Emit to socket.io clients
        socket_1.io.to(`chat_${chatId}`).emit('new_message', {
            message: newMessage,
        });
        res.status(201).json({ message: newMessage });
    }
    catch (error) {
        console.error("Send message error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.sendMessage = sendMessage;
const updateGroupChat = async (req, res) => {
    const userId = Number(req.user?.id);
    const chatId = Number(req.params.chatId);
    const { name, addUserIds = [], removeUserIds = [] } = req.body;
    if (!userId || !chatId) {
        res.status(400).json({ error: 'Missing user or chat ID' });
        return;
    }
    try {
        // Verify chat exists and is a group
        const [chat] = await db_1.db
            .select()
            .from(schema_1.chats)
            .where((0, drizzle_orm_1.eq)(schema_1.chats.id, chatId));
        if (!chat) {
            res.status(404).json({ error: 'Chat not found' });
            return;
        }
        if (!chat.isGroup) {
            res.status(400).json({ error: 'Only group chats can be updated' });
            return;
        }
        // Check user is a participant
        const [isParticipant] = await db_1.db
            .select()
            .from(schema_1.userChats)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.userChats.chatId, chatId), (0, drizzle_orm_1.eq)(schema_1.userChats.userId, userId)));
        if (!isParticipant) {
            res.status(403).json({ error: 'You are not a participant of this chat' });
            return;
        }
        // ✅ Rename group chat
        if (name && name !== chat.name) {
            await db_1.db.update(schema_1.chats).set({ name }).where((0, drizzle_orm_1.eq)(schema_1.chats.id, chatId));
        }
        // ✅ Add new participants (ignore duplicates)
        if (Array.isArray(addUserIds) && addUserIds.length > 0) {
            const existingUsers = await db_1.db
                .select({ userId: schema_1.userChats.userId })
                .from(schema_1.userChats)
                .where((0, drizzle_orm_1.eq)(schema_1.userChats.chatId, chatId));
            const existingIds = new Set(existingUsers.map(u => u.userId));
            const newUserIds = addUserIds.filter(id => !existingIds.has(id));
            const newLinks = newUserIds.map(userId => ({
                chatId,
                userId
            }));
            if (newLinks.length > 0) {
                await db_1.db.insert(schema_1.userChats).values(newLinks);
                // Notify new users
                newUserIds.forEach(id => {
                    socket_1.io.to(`user_${id}`).emit('added_to_chat', { chatId });
                });
            }
        }
        // ✅ Remove participants (cannot remove self if alone)
        if (Array.isArray(removeUserIds) && removeUserIds.length > 0) {
            // Prevent removing self if it leaves the group empty
            const currentParticipants = await db_1.db
                .select()
                .from(schema_1.userChats)
                .where((0, drizzle_orm_1.eq)(schema_1.userChats.chatId, chatId));
            const remaining = currentParticipants.filter(p => !removeUserIds.includes(p.userId));
            if (remaining.length < 2) {
                res.status(400).json({ error: 'Cannot remove all participants from group chat' });
                return;
            }
            await db_1.db
                .delete(schema_1.userChats)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.userChats.chatId, chatId), (0, drizzle_orm_1.inArray)(schema_1.userChats.userId, removeUserIds)));
            // Notify removed users
            removeUserIds.forEach(id => {
                socket_1.io.to(`user_${id}`).emit('removed_from_chat', { chatId });
            });
        }
        res.status(200).json({ message: 'Group chat updated successfully' });
    }
    catch (error) {
        console.error('Update group chat error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.updateGroupChat = updateGroupChat;
const deleteMessageForEveryone = async (req, res) => {
    const userId = Number(req.user?.id);
    const messageId = Number(req.params.messageId);
    if (!userId || !messageId) {
        res.status(400).json({ error: 'Missing user or message ID' });
        return;
    }
    try {
        // check if the user is the sender of the message
        const [msg] = await db_1.db.select().from(schema_1.messages).where((0, drizzle_orm_1.eq)(schema_1.messages.id, messageId));
        if (!msg) {
            res.status(404).json({ error: 'Message not found' });
            return;
        }
        // delete message if the user is the sender
        if (msg.senderId !== userId) {
            res.status(403).json({ error: 'Only the sender can delete this message for everyone' });
            return;
        }
        // Delete the message for all users
        await db_1.db.delete(schema_1.messages).where((0, drizzle_orm_1.eq)(schema_1.messages.id, messageId));
        // Notify all chat participants (using socket.io)
        socket_1.io.to(`chat_${msg.chatId}`).emit('message_deleted_for_everyone', { messageId });
        res.status(200).json({ message: 'Message deleted for everyone' });
    }
    catch (error) {
        console.error('Delete message for everyone error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.deleteMessageForEveryone = deleteMessageForEveryone;
// delete a message for everyone
const deleteChatForEveryone = async (req, res) => {
    const userId = Number(req.user?.id);
    const chatId = Number(req.params.chatId);
    if (!userId || !chatId) {
        res.status(400).json({ error: 'Missing user or chat ID' });
        return;
    }
    try {
        // check if user is in the chat
        const isParticipant = await db_1.db
            .select()
            .from(schema_1.userChats)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.userChats.chatId, chatId), (0, drizzle_orm_1.eq)(schema_1.userChats.userId, userId)));
        if (!isParticipant.length) {
            res.status(403).json({ error: 'You are not a participant of this chat' });
            return;
        }
        // Delete messages
        await db_1.db.delete(schema_1.messages).where((0, drizzle_orm_1.eq)(schema_1.messages.chatId, chatId));
        // Delete user-chat relations
        await db_1.db.delete(schema_1.userChats).where((0, drizzle_orm_1.eq)(schema_1.userChats.chatId, chatId));
        // Delete chat itself
        await db_1.db.delete(schema_1.chats).where((0, drizzle_orm_1.eq)(schema_1.chats.id, chatId));
        // Emit to socket.io clients
        socket_1.io.to(`chat_${chatId}`).emit('chat_deleted', { chatId });
        res.status(200).json({ message: 'Chat deleted for all users' });
        return;
    }
    catch (error) {
        console.error('Delete chat error:', error);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
};
exports.deleteChatForEveryone = deleteChatForEveryone;
