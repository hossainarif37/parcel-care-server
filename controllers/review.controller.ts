import { Request, Response, NextFunction } from "express";
import Review from "../models/review.model";
import Parcel from "../models/parcel.model";
"mongoose";



// Create a review for a specific parcel after delivered
export const createReviewForParcel = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, agentId, rating, feedback } = req.body;
        const { parcelId } = req.params;

        // Check if the parcel has been delivered
        const parcel = await Parcel.findById(parcelId);
        if (!parcel || parcel.shipmentStatus !== 'Delivered') {
            return res.status(400).json({
                success: false,
                message: "The parcel has not been delivered yet. You cannot add a review."
            });
        }

        const review = new Review({
            userId,
            agentId,
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

// Get all reviews by agent’s ID
export const getAllReviewsByAgentId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { agentId } = req.params;

        const reviews: any = await Review.find({ agentId });

        if (reviews.length === 0) {
            return res.status(404).json({ success: false, message: "No reviews found." });

        }

        res.status(200).json({
            success: true,
            reviews
        });
    } catch (error) {
        console.log('Get All Reviews By agent ID Controller: ', (error as Error).message);
        next(error);
    }
};