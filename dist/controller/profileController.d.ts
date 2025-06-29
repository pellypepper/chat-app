import { Request, Response } from "express";
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
export declare const getProfile: (req: Request, res: Response) => Promise<void>;
export declare const updateProfile: (req: Request, res: Response) => Promise<void>;
export declare const changePassword: (req: Request, res: Response) => Promise<void>;
export declare const forgetPassword: (req: Request, res: Response) => Promise<void>;
export declare const UploadProfilePicture: (req: Request, res: Response) => Promise<void>;
export declare const resetPassword: (req: Request, res: Response) => Promise<void>;
