import { Request, Response, NextFunction } from "express";
import { IUser } from "../types/types";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (user && (user as IUser).role === 'admin') {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Permission denied!' });
    }
};