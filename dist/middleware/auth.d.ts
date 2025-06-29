import { Request, Response, NextFunction } from 'express';
export declare function authenticateAccessToken(req: Request, res: Response, next: NextFunction): void;
export declare function authenticateRefreshToken(req: Request, res: Response, next: NextFunction): void;
export declare function generateAccessToken(payload: object): string;
export declare function generateRefreshToken(payload: object): string;
