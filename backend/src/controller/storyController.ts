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



// Get active stories for friends
export const getFriendsStories = async (req: Request, res: Response) => {
  const userId = Number(req.user?.id);
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  
  try {
     
    //  Get friends 
    const friendRecords = await db
      .select({ friendId: friends.friendId })
      .from(friends)
      .where(eq(friends.userId, userId));
    
 
    

    
    const friendIds = friendRecords.map(f => f.friendId);

    
    // Check if friendIds is empty
    if (friendIds.length === 0) {

      res.status(200).json({ groupedStories: [] });
      return;
    }
    
    const now = new Date();
 
    
    //  Get stories 
    const rawStories = await db
      .select({
        id: stories.id,
        userId: stories.userId,
        content: stories.content,
        type: stories.type,
        createdAt: stories.createdAt,
        expiresAt: stories.expiresAt,
        firstname: users.firstname,
        lastname: users.lastname,
        email: users.email,
      })
      .from(stories)
      .innerJoin(users, eq(stories.userId, users.id))
      .where(
        and(
          inArray(stories.userId, friendIds),
          gt(stories.expiresAt, now)
        )
      )
      .orderBy(desc(stories.createdAt));
    

    
    //  Check what stories exist for each friend (including expired ones)
    for (const friendId of friendIds) {
      const friendStories = await db
        .select({
          id: stories.id,
          userId: stories.userId,
          expiresAt: stories.expiresAt,
          createdAt: stories.createdAt
        })
        .from(stories)
        .where(eq(stories.userId, friendId));
      


    }
    
    // Check if stories were found
    if (rawStories.length === 0) {

      res.status(200).json({ groupedStories: [] });
      return;
    }
    
    //  Group by userId 
    const grouped = rawStories.reduce((acc, story) => {
      const key = story.userId;
      if (!acc[key]) {
        acc[key] = {
          userId: story.userId,
          firstname: story.firstname,
          lastname: story.lastname,
          email: story.email,
          stories: [],
        };
      }
      acc[key].stories.push({
        id: story.id,
        content: story.content,
        type: story.type,
        createdAt: story.createdAt ?? new Date(0),
        expiresAt: story.expiresAt ?? new Date(0),
      });
      return acc;
    }, {} as Record<number, {
      userId: number;
      firstname: string;
      lastname: string;
      email: string;
      stories: {
        id: number;
        content: string;
        type: string;
        createdAt: Date;
        expiresAt: Date;
      }[];
    }>);
    

    
    const result = Object.values(grouped);
   
    
    res.status(200).json({ groupedStories: result });
    return;
    
  } catch (error) {

    res.status(500).json({ error: 'Internal server error' });
    return;
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


// Get current user's own active stories
export const getMyStories = async (req: Request, res: Response) => {
  const userId = Number(req.user?.id);
  if (!userId) {
  res.status(401).json({ error: 'Unauthorized' });
     return
  }

  try {
    const now = new Date();

    const rawStories = await db
      .select({
        id: stories.id,
        content: stories.content,
        type: stories.type,
        createdAt: stories.createdAt,
        expiresAt: stories.expiresAt,
        firstname: users.firstname,
        lastname: users.lastname,
        email: users.email,
        userId: users.id,
      })
      .from(stories)
      .innerJoin(users, eq(stories.userId, users.id))
      .where(and(eq(stories.userId, userId), gt(stories.expiresAt, now)))
      .orderBy(desc(stories.createdAt));

    const grouped = {
      userId,
      firstname: rawStories[0]?.firstname || '',
      lastname: rawStories[0]?.lastname || '',
      email: rawStories[0]?.email || '',
      stories: rawStories.map(story => ({
        id: story.id,
        content: story.content,
        type: story.type,
        createdAt: story.createdAt ?? new Date(0),
        expiresAt: story.expiresAt ?? new Date(0),
      })),
    };
 console
    res.status(200).json({ userStories: grouped });
  } catch (error) {
    console.error('Get my stories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Delete a story uploaded by the user
export const deleteStory = async (req: Request, res: Response) => {
  const userId = Number(req.user?.id);
  const storyId = Number(req.params.storyId);

  if (!userId || !storyId) {
    res.status(400).json({ error: 'Missing user or story ID' });
    return;
  }

  try {
    // Check if the story belongs to the user
    const story = await db
      .select()
      .from(stories)
      .where(and(eq(stories.id, storyId), eq(stories.userId, userId)));

    if (story.length === 0) {
      res.status(403).json({ error: 'Not your story or story not found' });
      return;
    }

    //  delete all story views associated with this story
    await db.delete(storyViews).where(eq(storyViews.storyId, storyId));

    // Then delete the story itself
    await db.delete(stories).where(eq(stories.id, storyId));

    res.status(200).json({ message: 'Story deleted successfully' });
  } catch (error) {
    console.error('Delete story error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
