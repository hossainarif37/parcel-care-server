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

export const getAllBookedParcels = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Fetch all parcel documents from the database
        const parcels = await Parcel.find({});

        // Return the parcels in the response
        return res.status(200).json({ success: true, parcels });
    } catch (error) {
        console.log('getAllBookedParcels error', error);
        next(error);
    }
};


export const getBookedParcelsByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.userId;
        const parcels = await Parcel.find({ userId: userId });

        // Check if any parcels were found
        if (parcels.length === 0) {
            return res.status(404).json({ success: false, message: "No parcels found for this user." });
        }

        return res.status(200).json({ success: true, message: "Parcels fetched successfully.", parcels });
    } catch (error) {
        console.log('getBookedParcelsByUserId Error: ', error);
        next(error);
    }
}