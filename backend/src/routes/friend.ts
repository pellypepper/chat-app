// src/routes/friends.ts
import express from 'express';
import { authenticateAccessToken } from '../middleware/auth';
import { addFriend, getUserStatus, getFriends, removeFriend, searchFriends , getOnlineFriends} from '../controller/friendController';

const router = express.Router();

// Add a friend
router.post('/add', authenticateAccessToken, addFriend);

// Get list of friends
router.get('/list', authenticateAccessToken, getFriends);

// Online friends
router.get('/online', authenticateAccessToken, getOnlineFriends);

// Remove a friend
router.delete('/remove', authenticateAccessToken, removeFriend);

// Search for friends
router.get('/search', authenticateAccessToken, searchFriends);

// Get user status (online/offline)
router.get('/status/:userId', getUserStatus);

export default router;
