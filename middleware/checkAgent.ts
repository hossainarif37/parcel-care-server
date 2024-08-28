import { NextFunction, Request, Response } from "express";
import { IUser } from "../types/types";

export const isAgent = (req: Request, res: Response, next: NextFunction) => {
    // Assuming the user object is attached to the request by some authentication middleware
    const user = req.user;

    if (user && (user as IUser).role === 'agent') {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Only agent is allowed to access this route.' });
    }
};