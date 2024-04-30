import { NextFunction, Request, Response } from "express";
import { IUser } from "../types/types";
import passport from 'passport';

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', { session: false }, async (err: any, user: IUser) => {
        if (err || !user) {
            // Handle the unauthorized user case here
            return res.status(401).json({ success: false, message: 'Unauthorized access' });
        }
        req.user = user;
        next();
    })(req, res, next);
};