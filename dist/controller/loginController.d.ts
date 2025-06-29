import { Request, Response, NextFunction } from 'express';
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
export declare const login: (req: Request, res: Response, next: NextFunction) => void;
export declare const googleLogin: any;
export declare const googleLoginCallback: (req: Request, res: Response, next: NextFunction) => void;
export declare const getCurrentUser: (req: Request, res: Response) => Promise<void>;
export declare const refreshAccessToken: (req: Request, res: Response) => Response<any, Record<string, any>>;
export declare const logout: (req: Request, res: Response) => void;
