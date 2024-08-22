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

export const getAgentsByDistrict = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { district } = req.query;
        const agents = await User.find({ role: 'agent', district }, { _id: 1, name: 1, profilePicture: 1 });
        res.status(200).json({ success: true, agents });
    } catch (error) {
        console.log('Get Agents By District Controller: ', (error as Error).message);
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
            // Assuming these are the necessary fields for a completed profile
            const requiredFields = ['name', 'email', 'profilePicture', 'phoneNumber', 'fullAddress', 'subDistrict', 'district'];

            for (const field of requiredFields) {
                // Check if the field is empty
                if (user[field] === undefined || user[field] === null || user[field] === '') {
                    // Delete the property from the user object
                    user[field] = undefined;
                }
            }
            const allFieldsCompleted = requiredFields.every(field => user[field] !== undefined && user[field] !== null && user[field] !== '');

            if (allFieldsCompleted) {
                user.isProfileComplete = true;
            } else {
                user.isProfileComplete = false;
            }

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
        const { role } = req.query;
        let users: any = [];
        console.log();
        if (role === 'user') {
            users = await User.find({ role: role }, { password: 0 });
        } else if (role === 'agent') {
            users = await User.find({ role: role, agentRequestStatus: 'accepted' }, { password: 0 });
        }

        // Check if users were found
        if (users.length > 0) {
            return res.status(200).json({
                success: true,
                [role === 'agent' ? 'agents' : 'users']: users
            });
        } else {
            return res.status(404).json({ success: false, message: 'No users found with the specified role.' });
        }
    } catch (error) {
        next(error);
    }
};

export const getPendingAgents = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pendingAgents = await User.find({ role: 'agent', agentRequestStatus: 'pending' }, { password: 0 });
        res.status(200).json({ success: true, pendingAgents });
    } catch (error) {
        console.log('Get Pending Agents Controller: ', (error as Error).message);
        next(error);
    }
}

export const updateAgentRequestStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;
        const { agentRequestStatus } = req.body;
        const user = await User.findOne({ _id: userId, role: 'agent' });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        else if (!user.isProfileComplete) {
            return res.status(400).json({ success: false, message: 'Profile is not completed. Need to complete the profile first' });
        }
        else if (agentRequestStatus === user.agentRequestStatus) {
            return res.status(400).json({ success: false, message: 'Agent request status is already ' + agentRequestStatus });
        } else if (user.agentRequestStatus === 'accepted' && agentRequestStatus === 'rejected' || agentRequestStatus === 'pending') {
            return res.status(400).json({ success: false, message: 'Agent request status cannot be ' + agentRequestStatus });
        }

        user.agentRequestStatus = agentRequestStatus;
        await user.save();
        res.status(200).json({ success: true, message: 'Agent request status updated successfully' });
    } catch (error) {
        console.log('Update Agent Request Status Controller: ', (error as Error).message);
        next(error);
    }
}