import { Request, Response } from 'express';
import { db } from '../util/db';
import { stories, storyViews, friends, users } from '../model/schema';
import { eq, and,inArray, gt, desc } from 'drizzle-orm';
import { compressAndUpload } from '../middleware/upload'; 

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
const STORY_EXPIRY_HOURS = 24;

// Upload a new story
export const uploadStory = async (req: Request, res: Response) => {
  const userId = Number(req.user?.id);
  const { content, type } = req.body;

  if (!userId || (!content && !req.file) || !['text', 'image'].includes(type)) {
    res.status(400).json({ error: 'Missing or invalid fields' });
    return;
  }

  try {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + STORY_EXPIRY_HOURS * 60 * 60 * 1000);

    let storyContent = content;

    if (type === 'image') {
      if (!req.file) {
        res.status(400).json({ error: 'Image file is required for type image' });
        return;
      }
      storyContent = await compressAndUpload(req.file);
    }

    const [newStory] = await db.insert(stories).values({
      userId,
      content: storyContent,
      type,
      createdAt: now,
      expiresAt,
    }).returning();

    res.status(201).json({ story: newStory });
  } catch (error) {
    console.error('Upload story error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



// Get all stories from friends that are still active (not expired)
export const getFriendsStories = async (req: Request, res: Response) => {
  const userId = Number(req.user?.id);
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    // Get friends' IDs
    const friendRecords = await db.select({ friendId: friends.friendId }).from(friends).where(eq(friends.userId, userId));
    const friendIds = friendRecords.map(f => f.friendId);

    const now = new Date();

    // Get stories by friends that are not expired
    const storiesList = await db.select({
      id: stories.id,
      userId: stories.userId,
      content: stories.content,
      type: stories.type,
      createdAt: stories.createdAt,
      expiresAt: stories.expiresAt,
    })
      .from(stories)
      .where(
        and(
 inArray(stories.userId, friendIds),
      gt(stories.expiresAt, now)
        )
      )
      .orderBy(desc(stories.createdAt));

    res.status(200).json({ stories: storiesList });
  } catch (error) {
    console.error('Get friends stories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Mark story as viewed by the user
export const markStoryViewed = async (req: Request, res: Response) => {
  const userId = Number(req.user?.id);
  const storyId = Number(req.params.storyId);

  if (!userId || !storyId) {
    res.status(400).json({ error: 'Missing user or story ID' });
    return;
  }

  try {
    // Check if already viewed
    const existing = await db.select().from(storyViews).where(and(eq(storyViews.storyId, storyId), eq(storyViews.viewerId, userId)));

    if (existing.length === 0) {
      await db.insert(storyViews).values({
        storyId,
        viewerId: userId,
        viewedAt: new Date(),
      });
    }

    res.status(200).json({ message: 'Story marked as viewed' });
  } catch (error) {
    console.error('Mark story viewed error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get who viewed a user's story and count
export const getStoryViews = async (req: Request, res: Response) => {
  const userId = Number(req.user?.id);
  const storyId = Number(req.params.storyId);

  if (!userId || !storyId) {
    res.status(400).json({ error: 'Missing user or story ID' });
    return;
  }

  try {
    // Check story belongs to user
    const story = await db.select().from(stories).where(and(eq(stories.id, storyId), eq(stories.userId, userId)));
    if (story.length === 0) {
      res.status(403).json({ error: 'Not your story or story not found' });
      return;
    }

    // Get viewers
    const viewers = await db.select({
      id: users.id,
      firstname: users.firstname,
      lastname: users.lastname,
      email: users.email,
      viewedAt: storyViews.viewedAt,
    })
      .from(storyViews)
      .innerJoin(users, eq(storyViews.viewerId, users.id))
      .where(eq(storyViews.storyId, storyId))
      .orderBy(desc(storyViews.viewedAt));

    res.status(200).json({ viewers, count: viewers.length });
  } catch (error) {
    console.error('Get story views error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
