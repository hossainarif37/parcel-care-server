import { Request, Response, NextFunction } from "express";
import Review from "../models/review.model";
import Parcel from "../models/parcel.model";
"mongoose";



// Create a review for a specific parcel after delivered
export const createReviewForParcel = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, deliveryMenId, rating, feedback } = req.body;
        const { parcelId } = req.params;

        // Check if the parcel has been delivered
        const parcel = await Parcel.findById(parcelId);
        if (!parcel || parcel.bookingStatus !== 'delivered') {
            return res.status(400).json({
                success: false,
                message: "The parcel has not been delivered yet. You cannot add a review."
            });
        }

        const review = new Review({
            userId,
            deliveryMenId,
            parcelId,
            rating,
            feedback
        });

        await review.save();

        res.status(201).json({
            success: true,
            message: "Review created successfully",
        });
    } catch (error) {
        console.log('Create Review Controller: ', (error as Error).message);
        next(error);
    }
};

