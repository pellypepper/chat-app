import { Request, Response, NextFunction } from 'express';
import { sendEmail } from "../util/email";
import geoip from 'geoip-lite';
import passport from 'passport';
import { generateAccessToken, generateRefreshToken } from '../middleware/auth';

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
    const accessToken = generateAccessToken({ id: user.id, email: user.email });
    const refreshToken = generateRefreshToken({ id: user.id, email: user.email });

    // Remove sensitive info from user object
    const { password, ...userSafe } = user;

    return res.status(200).json({
      message: 'Login successful',
      user: userSafe,
      accessToken,
      refreshToken,
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
  passport.authenticate('google', { session: false }, (err, user, info) => {
    if (err) return res.status(500).json({ message: 'Google login error', error: err });
    if (!user) return res.status(401).json({ message: info?.message || 'Google login failed' });

    // Generate tokens
    const accessToken = generateAccessToken({ id: user.id, email: user.email });
    const refreshToken = generateRefreshToken({ id: user.id, email: user.email });

    // Remove sensitive info from user object
    const { password, ...userSafe } = user;

    // Here you can redirect to frontend with tokens as query params or respond as JSON
    return res.status(200).json({
      message: 'Google login successful',
      user: userSafe,
      accessToken,
      refreshToken,
    });
  })(req, res, next);
};

// Logout 
export const logout = (_req: Request, res: Response) => {
  
  res.status(200).json({ message: 'Logout successful' });
};