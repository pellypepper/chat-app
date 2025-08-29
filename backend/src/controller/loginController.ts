import { Request, Response, NextFunction } from 'express';
import { sendEmail } from "../util/email";
import geoip from 'geoip-lite';
const passport = require('passport');
import { generateAccessToken, generateRefreshToken } from '../middleware/auth';
import jwt from 'jsonwebtoken';
import { findUserById } from '../model/userModel'; 

declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
    }
    interface Request {
      user?: User;
    }
  }
}

// Local login 
export const login = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', async (err: any, user: any, info: any) => {
    if (err) {
      return res.status(500).json({ message: 'An error occurred during login', error: err });
    }
    if (!user) {
      return res.status(401).json({ message: info?.message || 'Login failed' });
    }

    // Get user's IP address & location
    const ip = req.headers['x-forwarded-for'] || (req.connection as any).remoteAddress;
    const geo = geoip.lookup(ip as string);
    const location = geo ? `${geo.city}, ${geo.region}, ${geo.country}` : 'Unknown location';

    // Send sign-in email notification
    try {
      await sendEmail(
        user.email,
        'New Sign-in Notification',
        `You have signed in from: ${location}, IP: ${ip}. If this was not you, please contact support.`
      );
    } catch (emailError) {
      // Optionally log/email error, but don't block login
    }

    // Generate tokens
    const accessToken = generateAccessToken({ id: user.id, email: user.email });
    const refreshToken = generateRefreshToken({ id: user.id, email: user.email });

    // Remove sensitive info from user
    const { password, ...userSafe } = user;

    // Send tokens in response (not cookies)
    res.status(200).json({
      message: 'Login successful',
      user: userSafe,
      accessToken,
      refreshToken
    });
  })(req, res, next);
};

// Google login start
export const googleLogin = passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false,
});

// Google login callback - Fixed to handle frontend properly
export const googleLoginCallback = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('google', { session: false }, (err: any, user: any, info: any) => {
    if (err) {
      console.error('Google OAuth error:', err);
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/public?error=oauth_error`);
    }
    
    if (!user) {
      console.error('Google OAuth failed:', info);
      return res.redirect(`${process.env.FRONTEND_URL || 'https://chat-app-frontend-eybx.vercel.app/dashboard'}/public?error=oauth_failed`);
    }

    try {
      // Generate tokens
      const accessToken = generateAccessToken({ id: user.id, email: user.email });
      const refreshToken = generateRefreshToken({ id: user.id, email: user.email });

      // Encode tokens for URL safety
      const encodedAccessToken = encodeURIComponent(accessToken);
      const encodedRefreshToken = encodeURIComponent(refreshToken);

      // Redirect to frontend with tokens
      const frontendUrl = process.env.FRONTEND_URL || 'https://chat-app-frontend-eybx.vercel.app';
      const redirectURL = `${frontendUrl}/auth/callback?accessToken=${encodedAccessToken}&refreshToken=${encodedRefreshToken}&success=true`;
      
      res.redirect(redirectURL);
    } catch (error) {
      console.error('Token generation error:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'https://chat-app-frontend-eybx.vercel.app';
      res.redirect(`${frontendUrl}/public?error=token_error`);
    }
  })(req, res, next);
};

// GET current user 
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as { id: number })?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Invalid user in request' });
    }

    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { password, ...userSafe } = user;
    res.status(200).json({ user: userSafe });
  } catch (err) {
    console.error("Failed to fetch user:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Fixed refresh token endpoint
export const refreshAccessToken = (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }

  const accessToken = generateAccessToken({ id: user.id, email: user.email });
  res.status(200).json({ accessToken });
};

// Logout 
export const logout = (req: Request, res: Response) => {
  // Frontend should clear tokens from localStorage
  res.status(200).json({ message: 'Logged out successfully' });
};