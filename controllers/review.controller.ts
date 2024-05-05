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

// Get all reviews by delivery man’s ID
export const getAllReviewsByDeliveryManId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { deliveryManId } = req.params;

        const reviews = await Review.find({ deliveryMenId: deliveryManId });

        res.status(200).json({
            success: true,
            reviews
        });
    } catch (error) {
        console.log('Get All Reviews By Delivery Man ID Controller: ', (error as Error).message);
        next(error);
    }
};