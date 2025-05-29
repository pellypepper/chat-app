import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'youraccesstokensecret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'yourrefreshtokensecret';

//  verify Access Token
export function authenticateAccessToken(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.accessToken || (req.headers['authorization']?.split(' ')[1]);


  if (!token) {
 res.status(401).json({ message: 'Access token missing' });
    return ;
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err:any, user:any) => {
    if (err) 
     res.status(403).json({ message: 'Invalid or expired access token' });
    req.user = user;
    next();
    return;
  });
}

//  verify Refresh Token
export function authenticateRefreshToken(req: Request, res: Response, next: NextFunction) {
  const { refreshToken } = req.body;
  if (!refreshToken) {
 res.status(401).json({ message: 'Refresh token missing' });
    return 
  }

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err:any, user:any) => {
    if (err)  res.status(403).json({ message: 'Invalid or expired refresh token' });
    req.user = user;
    next();
       return 
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