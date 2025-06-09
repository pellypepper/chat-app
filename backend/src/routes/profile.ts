
import { authenticateAccessToken } from '../middleware/auth';
import {updateProfile, getProfile, changePassword, forgetPassword, resetPassword} from '../controller/profileController';
import express from 'express';

const router = express.Router();

router.get('/', authenticateAccessToken, getProfile);

// Update user profile
router.put('/', authenticateAccessToken, updateProfile);

// Change user password
router.put('/change-password', authenticateAccessToken, changePassword);


// forget user password
router.post('/forget-password', forgetPassword);



// Reset user password
router.post('/reset-password', resetPassword);


export default router;