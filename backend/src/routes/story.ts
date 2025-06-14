import express from 'express';
import { authenticateAccessToken } from '../middleware/auth';
import { uploadStory,  getFriendsStories, markStoryViewed, getStoryViews, getMyStories, deleteStory } from '../controller/storyController';
import { upload } from '../middleware/upload'; 

const router = express.Router();

router.post('/upload', authenticateAccessToken, upload.single('image'), uploadStory);
router.get('/friends', authenticateAccessToken, getFriendsStories);
router.get('/', authenticateAccessToken, getMyStories);
router.post('/view/:storyId', authenticateAccessToken, markStoryViewed);
router.get('/view/:storyId', authenticateAccessToken, getStoryViews);
router.delete('/:storyId',  authenticateAccessToken, deleteStory);


export default router;
