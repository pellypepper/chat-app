import express from 'express';
import { login, googleLogin, googleLoginCallback, logout } from '../controller/loginController';

const router = express.Router();

// Login route
router.post("/", login);

// Google login route
router.get("/google", googleLogin);

// Google callback
router.get("/google/callback", googleLoginCallback);

// Logout route
router.post("/logout", logout);

export default router;