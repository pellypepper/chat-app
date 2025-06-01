// src/controllers/friends.ts
import { Request, Response } from 'express';
import { db } from '../util/db';
import { friends , users} from '../model/schema';
import {and, eq ,or, like} from 'drizzle-orm';
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
    return 
  }

  if (userId === friendId) {
  res.status(400).json({ error: 'You cannot remove yourself as a friend' });
     return
  }

  try {

    // Check if friendship exists
    const existing = await db
      .select()
      .from(friends)
      .where(and(eq(friends.userId, userId), eq(friends.friendId, friendId)));

    if (!existing.length) {
res.status(404).json({ error: 'Friend not found' });
      return 
    }
     
    // Remove both directions of the friendship
    await db
      .delete(friends)
      .where(and(eq(friends.userId, userId), eq(friends.friendId, friendId)));

    await db
      .delete(friends)
      .where(and(eq(friends.userId, friendId), eq(friends.friendId, userId)));
res.status(200).json({ message: 'Friend removed' });

    return 
  } catch (error) {
    console.error('Remove friend error:', error);
 res.status(500).json({ error: 'Internal server error' });
     return
  }
};

// Get online friends
export const getOnlineFriends = async (req: Request, res: Response) => {
  const userId = Number(req.user?.id);

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

    // Filter friends who are currently online
    const onlineFriendIds = friendIds.filter(id => onlineUsers.has(id));

    res.status(200).json({ online: onlineFriendIds });
    return;
  } catch (error) {
    console.error('Get online friends error:', error);
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

// Get user status (online/offline)
export const getUserStatus = async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);

  if (!userId || isNaN(userId)) {
    res.status(400).json({ error: 'Invalid user ID' });
    return;
  }

  const isOnline = onlineUsers.has(userId);
  const lastSeen = lastSeenMap.get(userId) || null;

  res.status(200).json({
    userId,
    status: isOnline ? 'online' : 'offline',
    lastSeen: isOnline ? null : lastSeen,
  });
};