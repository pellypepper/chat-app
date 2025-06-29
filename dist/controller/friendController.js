"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserStatus = exports.searchFriends = exports.getFriendDetails = exports.getOnlineFriends = exports.removeFriend = exports.getFriends = exports.addFriend = exports.allUsers = void 0;
const db_1 = require("../util/db");
const schema_1 = require("../model/schema");
const drizzle_orm_1 = require("drizzle-orm");
const socket_1 = require("../util/socket");
const allUsers = async (req, res) => {
    const userId = Number(req.user?.id);
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    try {
        const results = await db_1.db
            .select({
            id: schema_1.users.id,
            firstname: schema_1.users.firstname,
            lastname: schema_1.users.lastname,
            email: schema_1.users.email,
            profilePicture: schema_1.users.profilePicture,
        })
            .from(schema_1.users)
            .where((0, drizzle_orm_1.not)((0, drizzle_orm_1.eq)(schema_1.users.id, userId)))
            .orderBy(schema_1.users.firstname);
        res.status(200).json({ users: results });
        return;
    }
    catch (error) {
        console.error('Fetch all users error:', error);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
};
exports.allUsers = allUsers;
// Add a friend
const addFriend = async (req, res) => {
    const userId = Number(req.user?.id);
    const { friendId } = req.body;
    if (!userId || !friendId) {
        res.status(400).json({ error: 'Missing user or friend ID' });
        return;
    }
    if (userId === friendId) {
        res.status(400).json({ error: 'You cannot add yourself as a friend' });
        return;
    }
    try {
        // Check if already friends
        const existing = await db_1.db
            .select()
            .from(schema_1.friends)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.friends.userId, userId), (0, drizzle_orm_1.eq)(schema_1.friends.friendId, friendId)));
        if (existing.length) {
            res.status(409).json({ error: 'Already friends' });
            return;
        }
        await db_1.db.insert(schema_1.friends).values([
            { userId, friendId },
            { userId: friendId, friendId: userId }, // mutual friendship
        ]);
        res.status(201).json({ message: 'Friend added' });
        return;
    }
    catch (error) {
        console.error('Add friend error:', error);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
};
exports.addFriend = addFriend;
// Get all friends of a user
const getFriends = async (req, res) => {
    const userId = Number(req.user?.id);
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    try {
        const results = await db_1.db
            .select({
            id: schema_1.users.id,
            firstname: schema_1.users.firstname,
            lastname: schema_1.users.lastname,
            email: schema_1.users.email,
            profilePicture: schema_1.users.profilePicture,
        })
            .from(schema_1.friends)
            .innerJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.friends.friendId, schema_1.users.id))
            .where((0, drizzle_orm_1.eq)(schema_1.friends.userId, userId))
            .orderBy(schema_1.users.firstname); // Alphabetical
        res.status(200).json({ friends: results });
        return;
    }
    catch (error) {
        console.error('Fetch friends error:', error);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
};
exports.getFriends = getFriends;
// Remove a friend
const removeFriend = async (req, res) => {
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
        const existing = await db_1.db
            .select()
            .from(schema_1.friends)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.friends.userId, userId), (0, drizzle_orm_1.eq)(schema_1.friends.friendId, friendId)));
        if (!existing.length) {
            res.status(404).json({ error: 'Friend not found' });
            return;
        }
        // Remove both directions of the friendship
        await db_1.db
            .delete(schema_1.friends)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.friends.userId, userId), (0, drizzle_orm_1.eq)(schema_1.friends.friendId, friendId)));
        await db_1.db
            .delete(schema_1.friends)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.friends.userId, friendId), (0, drizzle_orm_1.eq)(schema_1.friends.friendId, userId)));
        //  Find all non-group chats for the user
        const userChatIds = (await db_1.db
            .select({ chatId: schema_1.userChats.chatId })
            .from(schema_1.userChats)
            .where((0, drizzle_orm_1.eq)(schema_1.userChats.userId, userId))).map(row => row.chatId);
        if (userChatIds.length > 0) {
            // find a non-group chat that includes friendId and only these two users
            const possibleChats = await db_1.db
                .select()
                .from(schema_1.chats)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.inArray)(schema_1.chats.id, userChatIds), (0, drizzle_orm_1.eq)(schema_1.chats.isGroup, false)));
            for (const chat of possibleChats) {
                // Find all participants in this chat
                const chatParticipants = await db_1.db
                    .select({ userId: schema_1.userChats.userId })
                    .from(schema_1.userChats)
                    .where((0, drizzle_orm_1.eq)(schema_1.userChats.chatId, chat.id));
                const chatParticipantIds = chatParticipants.map(p => p.userId).sort();
                const targetIds = [userId, friendId].sort();
                if (chatParticipantIds.length === 2 &&
                    chatParticipantIds[0] === targetIds[0] &&
                    chatParticipantIds[1] === targetIds[1]) {
                    // Delete messages in the chat
                    await db_1.db.delete(schema_1.messages).where((0, drizzle_orm_1.eq)(schema_1.messages.chatId, chat.id));
                    // Delete user-chat links
                    await db_1.db.delete(schema_1.userChats).where((0, drizzle_orm_1.eq)(schema_1.userChats.chatId, chat.id));
                    // Delete the chat itself
                    await db_1.db.delete(schema_1.chats).where((0, drizzle_orm_1.eq)(schema_1.chats.id, chat.id));
                }
            }
        }
        res.status(200).json({ message: 'Friend removed and chat (if any) deleted' });
        return;
    }
    catch (error) {
        console.error('Remove friend error:', error);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
};
exports.removeFriend = removeFriend;
// Get online friends
const getOnlineFriends = async (req, res) => {
    const userId = Number(req.user?.id);
    console.log("Checking online friends for user:", userId);
    console.log("All online users:", Array.from(socket_1.onlineUsers.keys()));
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    try {
        // Get all friend IDs
        const friendRecords = await db_1.db
            .select({ friendId: schema_1.friends.friendId })
            .from(schema_1.friends)
            .where((0, drizzle_orm_1.eq)(schema_1.friends.userId, userId));
        const friendIds = friendRecords.map(f => f.friendId);
        console.log("Friend IDs:", friendIds);
        // Filter friends who are currently online
        const onlineFriendIds = friendIds.filter(id => socket_1.onlineUsers.has(id));
        console.log("Online friend IDs:", onlineFriendIds);
        res.status(200).json({ online: onlineFriendIds });
        return;
    }
    catch (error) {
        console.error('Get online friends error:', error);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
};
exports.getOnlineFriends = getOnlineFriends;
//get friend details by Id
const getFriendDetails = async (req, res) => {
    const userId = Number(req.user?.id);
    const friendId = Number(req.params.friendId);
    console.log("Fetching details for friend ID:", friendId, "for user ID:", userId);
    if (!userId || !friendId) {
        res.status(400).json({ error: 'Missing user or friend ID' });
        return;
    }
    try {
        const friend = await db_1.db
            .select({
            id: schema_1.users.id,
            firstname: schema_1.users.firstname,
            lastname: schema_1.users.lastname,
            email: schema_1.users.email,
            profilePicture: schema_1.users.profilePicture,
        })
            .from(schema_1.users)
            .where((0, drizzle_orm_1.eq)(schema_1.users.id, friendId))
            .limit(1);
        if (!friend.length) {
            res.status(404).json({ error: 'Friend not found' });
            return;
        }
        res.status(200).json({ friend: friend[0] });
        return;
    }
    catch (error) {
        console.error('Get friend details error:', error);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
};
exports.getFriendDetails = getFriendDetails;
// Search friends by name or email
const searchFriends = async (req, res) => {
    const userId = Number(req.user?.id);
    const query = String(req.query.query || '');
    if (!userId || !query.trim()) {
        res.status(400).json({ error: 'Missing user ID or search query' });
        return;
    }
    try {
        const results = await db_1.db
            .select({
            id: schema_1.users.id,
            firstname: schema_1.users.firstname,
            lastname: schema_1.users.lastname,
            email: schema_1.users.email,
        })
            .from(schema_1.friends)
            .innerJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.friends.friendId, schema_1.users.id))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.friends.userId, userId), (0, drizzle_orm_1.or)((0, drizzle_orm_1.like)(schema_1.users.firstname, `%${query}%`), (0, drizzle_orm_1.like)(schema_1.users.lastname, `%${query}%`), (0, drizzle_orm_1.like)(schema_1.users.email, `%${query}%`))))
            .orderBy(schema_1.users.firstname);
        res.status(200).json({ results });
        return;
    }
    catch (error) {
        console.error('Search friends error:', error);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
};
exports.searchFriends = searchFriends;
// Get user status 
const getUserStatus = async (req, res) => {
    const userId = Number(req.params.userId);
    if (!userId || isNaN(userId)) {
        res.status(400).json({ error: 'Invalid user ID' });
        return;
    }
    const isOnline = socket_1.onlineUsers.has(userId);
    const lastSeenDate = socket_1.lastSeenMap.get(userId);
    const response = {
        userId,
        status: isOnline ? 'online' : 'offline',
        lastSeen: isOnline ? null : (lastSeenDate ? lastSeenDate.toISOString() : null),
    };
    res.status(200).json(response);
};
exports.getUserStatus = getUserStatus;
