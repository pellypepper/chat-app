import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'youraccesstokensecret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'yourrefreshtokensecret';

//  verify Access Token from Authorization header
export function authenticateAccessToken(req: Request, res: Response, next: NextFunction) {
  // Get token from Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token missing' });
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired access token' });
    req.user = user;
    next();
  });
}

//  verify Refresh Token from header or body
export function authenticateRefreshToken(req: Request, res: Response, next: NextFunction) {
  // Try to get refresh token from header or body
  const refreshToken =
    (req.headers['x-refresh-token'] as string) ||
    req.body.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token missing' });
  }
  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired refresh token' });
    req.user = user;
    next();
  });
}

//  generate tokens
export function generateAccessToken(payload: object) {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

//  generate Refresh Token
export function generateRefreshToken(payload: object) {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}