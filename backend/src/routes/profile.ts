
import { authenticateAccessToken } from '../middleware/auth';
import {updateProfile, getProfile, changePassword, forgetPassword, resetPassword , UploadProfilePicture} from '../controller/profileController';
import express from 'express';
import { upload } from '../middleware/upload'; 

const router = express.Router();

router.get('/', authenticateAccessToken, getProfile);

// Update user profile
router.put('/update', authenticateAccessToken, updateProfile);

// Change user password
router.put('/change-password', authenticateAccessToken, changePassword);

router.post('/upload-profile-picture', authenticateAccessToken, upload.single('image'), UploadProfilePicture);
// forget user password
router.post('/forget-password', forgetPassword);



// Reset user password
router.post('/reset-password', resetPassword);


export default router;