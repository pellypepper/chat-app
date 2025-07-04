import express from 'express';
import { login, googleLogin, googleLoginCallback, getCurrentUser ,refreshAccessToken, logout } from '../controller/loginController';
import { authenticateAccessToken } from '../middleware/auth';   

const router = express.Router();

// Login route
router.post("/", login);

// Google login route
router.get("/google", googleLogin);

router.get('/user',  authenticateAccessToken , getCurrentUser); 

router.post('/refresh', authenticateAccessToken, refreshAccessToken);

// Google callback
router.get("/google/callback", googleLoginCallback);

// Logout route
router.post("/logout", logout);

export default router;