import express from 'express';
import { authenticateAccessToken } from '../middleware/auth';
import { uploadStory, getFriendsStories, markStoryViewed, getStoryViews } from '../controller/storyController';
import { upload } from '../middleware/upload'; 

const router = express.Router();

router.post('/upload', authenticateAccessToken, upload.single('image'), uploadStory);router.get('/friends', authenticateAccessToken, getFriendsStories);
router.post('/view/:storyId', authenticateAccessToken, markStoryViewed);
router.get('/views/:storyId', authenticateAccessToken, getStoryViews);

export default router;
