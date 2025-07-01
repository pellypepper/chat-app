import { Request, Response, NextFunction } from 'express';
import { sendEmail } from "../util/email";
import geoip from 'geoip-lite';
// Option 1: CommonJS require style (works everywhere in Node)
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
      return res.status(500).json({ message: 'Email notification error', error: emailError });
    }

    // Generate tokens
    const accessToken = generateAccessToken({ id: user.id, email: (user as any).email });
    const refreshToken = generateRefreshToken({ id: user.id, email: user.email });

   // Send cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000 
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 
    });

    // Remove sensitive info from user
    const { password, ...userSafe } = user;

 res.status(200).json({
      message: 'Login successful',
      user: userSafe
     
    });

  })(req, res, next);
};

// Google login start
export const googleLogin = passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false,
});

// Google login callback 
export const googleLoginCallback = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('google', { session: false }, (err: any, user: any, info: any) => {
    if (err) return res.status(500).json({ message: 'Google login error', error: err });
    if (!user) return res.status(401).json({ message: info?.message || 'Google login failed' });

    // Generate tokens
    const accessToken = generateAccessToken({ id: user.id, email: user.email });
    const refreshToken = generateRefreshToken({ id: user.id, email: user.email });

    // Send cookies
     res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });


    // Remove sensitive info from user object
    const { password, ...userSafe } = user;

res.redirect('http://localhost:3000/dashboard');


  })(req, res, next);
};

// GET current user 
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as { id: number })?.id;
    if (!userId) {
  res.status(401).json({ message: 'Invalid user in request' });
      return 
    }

    const user = await findUserById(userId);
    if (!user) {
    res.status(404).json({ message: 'User not found' });
       return
    }

    const { password, ...userSafe } = user;
    res.status(200).json({ user: userSafe });
  } catch (err) {
    console.error("Failed to fetch user:", err);
    res.status(500).json({ message: 'Server error' });
  }
};


export const refreshAccessToken = (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }

  

  const accessToken = generateAccessToken({ id: user.id, email: user.email });
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000
  });
  return res.status(200).json({ accessToken });
}

// Logout 
export const logout = (req: Request, res: Response) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.status(200).json({ message: 'Logged out successfully' });
};
