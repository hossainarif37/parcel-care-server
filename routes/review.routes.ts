import express from "express"
import { createReviewForParcel, getAllReviewsByDeliveryManId } from "../controllers/review.controller";

const router = express.Router();

router
    // Create a review for a specific parcel after delivered
    .post("/parcel/:parcelId", createReviewForParcel)

    // Get all reviews by delivery man’s ID
    .get("/delivery-man/:deliveryManId", getAllReviewsByDeliveryManId)

export default router;