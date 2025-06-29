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
export declare const uploadStory: (req: Request, res: Response) => Promise<void>;
export declare const getFriendsStories: (req: Request, res: Response) => Promise<void>;
export declare const markStoryViewed: (req: Request, res: Response) => Promise<void>;
export declare const getStoryViews: (req: Request, res: Response) => Promise<void>;
export declare const getMyStories: (req: Request, res: Response) => Promise<void>;
export declare const deleteStory: (req: Request, res: Response) => Promise<void>;
