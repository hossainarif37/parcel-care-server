import { NextFunction, Request, Response } from "express";
import { IParcel, IUser } from "../types/types";
import Parcel from "../models/parcel.model";

export const bookAParcel = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Only user is allowed to access
        if ((req.user as IUser).role !== "user") {
            return res.status(403).json({ success: false, message: "Only user is allowed to access this route." });
        }

        // Assuming req.user contains the authenticated user's ID
        const parcelData: IParcel = {
            ...req.body,
            userId: (req.user as IUser)._id,
        };

        const newParcel = new Parcel(parcelData);

        // Save the parcel document to the database
        await newParcel.save();

        // Return a success response
        return res.status(201).json({ success: true, message: "Parcel booked successfully.", parcel: newParcel });
    } catch (error) {
        // Pass the error to the next middleware for error handling
        next(error);
    }
};