import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import { IUser } from "../types/types";

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

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
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


export const updateUserInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;
        const { role, ...userInfo } = req.body;

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check if userInfo is empty
        if (Object.keys(userInfo).length === 0 && !role) {
            return res.status(400).json({ success: false, message: "No user information or role provided. Please provide the necessary user information or specify a role to update." });
        }

        // Update other user info
        if (Object.keys(userInfo).length > 0) {
            Object.assign(user, userInfo);
            await user.save();
            return res.status(200).json({ success: true, message: 'User info updated successfully', user });
        }

        // Update user role
        if (role) {
            if ((req.user as IUser).role === 'admin') {
                user.role = role;
                await user.save();
                return res.status(200).json({ success: true, message: 'Role updated successfully', user });
            } else {
                return res.status(403).json({ success: false, message: 'Permission denied. Only admins can update user roles.' });
            }
        }

    } catch (error) {
        next(error);
    }
};


// Controller to get users by role
export const getUsersByRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Extract role from request parameters
        const { role } = req.query;

        // Query the database for users with the specified role
        const users = await User.find({ role: role });

        // Check if users were found
        if (users.length > 0) {
            // Return the users in the response
            return res.status(200).json({ success: true, users });
        } else {
            // Return a message if no users were found
            return res.status(404).json({ success: false, message: 'No users found with the specified role.' });
        }
    } catch (error) {
        // Pass the error to the error handling middleware
        next(error);
    }
};