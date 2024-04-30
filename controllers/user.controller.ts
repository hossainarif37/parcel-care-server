import { NextFunction, Request, Response } from "express";

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