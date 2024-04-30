import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(200).json({
            success: true,
            user: req.user
        })
    } catch (error) {
        console.log('Get Current User Controller: ', (error as Error).message);
        next(error);
    }
}

export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const user = await User.findById(req.params.userId, { name: 1, profilePicture: 1, _id: 1 });
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.status(200).json({ success: true, user });

    } catch (error) {
        console.log('Get User Profile Controller: ', (error as Error).message);
        next(error);
    }
}