"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStory = exports.getMyStories = exports.getStoryViews = exports.markStoryViewed = exports.getFriendsStories = exports.uploadStory = void 0;
const db_1 = require("../util/db");
const schema_1 = require("../model/schema");
const drizzle_orm_1 = require("drizzle-orm");
const upload_1 = require("../middleware/upload");
const STORY_EXPIRY_HOURS = 24;
// Upload a new story
const uploadStory = async (req, res) => {
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
            storyContent = await (0, upload_1.compressAndUpload)(req.file);
        }
        const [newStory] = await db_1.db.insert(schema_1.stories).values({
            userId,
            content: storyContent,
            type,
            createdAt: now,
            expiresAt,
        }).returning();
        res.status(201).json({ story: newStory });
    }
    catch (error) {
        console.error('Upload story error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.uploadStory = uploadStory;
// Get active stories for friends
const getFriendsStories = async (req, res) => {
    const userId = Number(req.user?.id);
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    try {
        //  Get friends 
        const friendRecords = await db_1.db
            .select({ friendId: schema_1.friends.friendId })
            .from(schema_1.friends)
            .where((0, drizzle_orm_1.eq)(schema_1.friends.userId, userId));
        const friendIds = friendRecords.map(f => f.friendId);
        // Check if friendIds is empty
        if (friendIds.length === 0) {
            res.status(200).json({ groupedStories: [] });
            return;
        }
        const now = new Date();
        //  Get stories 
        const rawStories = await db_1.db
            .select({
            id: schema_1.stories.id,
            userId: schema_1.stories.userId,
            content: schema_1.stories.content,
            type: schema_1.stories.type,
            createdAt: schema_1.stories.createdAt,
            expiresAt: schema_1.stories.expiresAt,
            firstname: schema_1.users.firstname,
            lastname: schema_1.users.lastname,
            email: schema_1.users.email,
        })
            .from(schema_1.stories)
            .innerJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.stories.userId, schema_1.users.id))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.inArray)(schema_1.stories.userId, friendIds), (0, drizzle_orm_1.gt)(schema_1.stories.expiresAt, now)))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.stories.createdAt));
        //  Check what stories exist for each friend (including expired ones)
        for (const friendId of friendIds) {
            const friendStories = await db_1.db
                .select({
                id: schema_1.stories.id,
                userId: schema_1.stories.userId,
                expiresAt: schema_1.stories.expiresAt,
                createdAt: schema_1.stories.createdAt
            })
                .from(schema_1.stories)
                .where((0, drizzle_orm_1.eq)(schema_1.stories.userId, friendId));
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
        }, {});
        const result = Object.values(grouped);
        res.status(200).json({ groupedStories: result });
        return;
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
};
exports.getFriendsStories = getFriendsStories;
// Mark story as viewed by the user
const markStoryViewed = async (req, res) => {
    const userId = Number(req.user?.id);
    const storyId = Number(req.params.storyId);
    if (!userId || !storyId) {
        res.status(400).json({ error: 'Missing user or story ID' });
        return;
    }
    try {
        // Check if already viewed
        const existing = await db_1.db.select().from(schema_1.storyViews).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.storyViews.storyId, storyId), (0, drizzle_orm_1.eq)(schema_1.storyViews.viewerId, userId)));
        if (existing.length === 0) {
            await db_1.db.insert(schema_1.storyViews).values({
                storyId,
                viewerId: userId,
                viewedAt: new Date(),
            });
        }
        res.status(200).json({ message: 'Story marked as viewed' });
    }
    catch (error) {
        console.error('Mark story viewed error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.markStoryViewed = markStoryViewed;
// Get who viewed a user's story and count
const getStoryViews = async (req, res) => {
    const userId = Number(req.user?.id);
    const storyId = Number(req.params.storyId);
    if (!userId || !storyId) {
        res.status(400).json({ error: 'Missing user or story ID' });
        return;
    }
    try {
        // Check story belongs to user
        const story = await db_1.db.select().from(schema_1.stories).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.stories.id, storyId), (0, drizzle_orm_1.eq)(schema_1.stories.userId, userId)));
        if (story.length === 0) {
            res.status(403).json({ error: 'Not your story or story not found' });
            return;
        }
        // Get viewers
        const viewers = await db_1.db.select({
            id: schema_1.users.id,
            firstname: schema_1.users.firstname,
            lastname: schema_1.users.lastname,
            email: schema_1.users.email,
            viewedAt: schema_1.storyViews.viewedAt,
        })
            .from(schema_1.storyViews)
            .innerJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.storyViews.viewerId, schema_1.users.id))
            .where((0, drizzle_orm_1.eq)(schema_1.storyViews.storyId, storyId))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.storyViews.viewedAt));
        res.status(200).json({ viewers, count: viewers.length });
    }
    catch (error) {
        console.error('Get story views error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getStoryViews = getStoryViews;
// Get current user's own active stories
const getMyStories = async (req, res) => {
    const userId = Number(req.user?.id);
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    try {
        const now = new Date();
        const rawStories = await db_1.db
            .select({
            id: schema_1.stories.id,
            content: schema_1.stories.content,
            type: schema_1.stories.type,
            createdAt: schema_1.stories.createdAt,
            expiresAt: schema_1.stories.expiresAt,
            firstname: schema_1.users.firstname,
            lastname: schema_1.users.lastname,
            email: schema_1.users.email,
            userId: schema_1.users.id,
        })
            .from(schema_1.stories)
            .innerJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.stories.userId, schema_1.users.id))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.stories.userId, userId), (0, drizzle_orm_1.gt)(schema_1.stories.expiresAt, now)))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.stories.createdAt));
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
        console;
        res.status(200).json({ userStories: grouped });
    }
    catch (error) {
        console.error('Get my stories error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getMyStories = getMyStories;
// Delete a story uploaded by the user
const deleteStory = async (req, res) => {
    const userId = Number(req.user?.id);
    const storyId = Number(req.params.storyId);
    if (!userId || !storyId) {
        res.status(400).json({ error: 'Missing user or story ID' });
        return;
    }
    try {
        // Check if the story belongs to the user
        const story = await db_1.db
            .select()
            .from(schema_1.stories)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.stories.id, storyId), (0, drizzle_orm_1.eq)(schema_1.stories.userId, userId)));
        if (story.length === 0) {
            res.status(403).json({ error: 'Not your story or story not found' });
            return;
        }
        //  delete all story views associated with this story
        await db_1.db.delete(schema_1.storyViews).where((0, drizzle_orm_1.eq)(schema_1.storyViews.storyId, storyId));
        // Then delete the story itself
        await db_1.db.delete(schema_1.stories).where((0, drizzle_orm_1.eq)(schema_1.stories.id, storyId));
        res.status(200).json({ message: 'Story deleted successfully' });
    }
    catch (error) {
        console.error('Delete story error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.deleteStory = deleteStory;
//# sourceMappingURL=storyController.js.map