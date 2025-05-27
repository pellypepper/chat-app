import express from 'express';
import { Register, VerifyEmail } from '../controller/registerController';

const router = express.Router();

// Register a new user 
router.post('/', Register);

// Verify email with code
router.post('/verify', VerifyEmail);

export default router;
