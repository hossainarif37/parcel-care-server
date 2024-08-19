// middleware/adminCheck.middleware.ts

import { Request, Response, NextFunction } from "express";
import { IUser } from "../types/types";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    // Assuming the user object is attached to the request by some authentication middleware
    const user = req.user;

    if (user && (user as IUser).role === 'admin') {
        // If the user is an admin, proceed to the next middleware or route handler
        next();
    } else {
        // If the user is not an admin, return an error response
        res.status(403).json({ success: false, message: 'Permission denied. Only admin can access this route.' });
    }
};