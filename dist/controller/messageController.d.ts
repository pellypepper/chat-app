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
export declare const getUserChatsSummary: (req: Request, res: Response) => Promise<any>;
export declare const getMessage: (req: Request, res: Response) => Promise<any>;
export declare const createChat: (req: Request, res: Response) => Promise<void>;
export declare const sendMessage: (req: Request, res: Response) => Promise<void>;
export declare const updateGroupChat: (req: Request, res: Response) => Promise<void>;
export declare const deleteMessageForEveryone: (req: Request, res: Response) => Promise<void>;
export declare const deleteChatForEveryone: (req: Request, res: Response) => Promise<void>;
