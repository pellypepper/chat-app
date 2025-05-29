
import { authenticateAccessToken } from '../middleware/auth';
import {updateProfile, changePassword, forgetPassword, resetPassword, getResetPasswordPage} from '../controller/profileController';
import express from 'express';

const router = express.Router();

// Update user profile
router.put('/', authenticateAccessToken, updateProfile);

// Change user password
router.put('/change-password', authenticateAccessToken, changePassword);


// forget user password
router.post('/forget-password', forgetPassword);

// get resetpage link 
router.get('/reset-page', getResetPasswordPage)

// Reset user password
router.post('/reset-password', resetPassword);


export default router;