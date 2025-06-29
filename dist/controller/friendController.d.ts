import { Request, Response } from 'express';
declare global {
    namespace Express {
        interface User {
            id: number;
        }
        interface Request {
            user?: User;
        }
    }
}
export declare const allUsers: (req: Request, res: Response) => Promise<void>;
export declare const addFriend: (req: Request, res: Response) => Promise<void>;
export declare const getFriends: (req: Request, res: Response) => Promise<void>;
export declare const removeFriend: (req: Request, res: Response) => Promise<void>;
export declare const getOnlineFriends: (req: Request, res: Response) => Promise<void>;
export declare const getFriendDetails: (req: Request, res: Response) => Promise<void>;
export declare const searchFriends: (req: Request, res: Response) => Promise<void>;
export declare const getUserStatus: (req: Request, res: Response) => Promise<void>;
