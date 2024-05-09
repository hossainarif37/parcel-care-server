import express from "express"
import { createReviewForParcel, getAllReviewsByAgentId, } from "../controllers/review.controller";

const router = express.Router();

router
    // Create a review for a specific parcel after delivered
    .post("/parcel/:parcelId", createReviewForParcel)

    // Get all reviews by agent’s ID
    .get("/agent/:agentId", getAllReviewsByAgentId)

export default router;