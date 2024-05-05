import express from "express"
import { createReviewForParcel } from "../controllers/review.controller";

const router = express.Router();

router
    // Create a review for a specific parcel after delivered
    .post("/parcel/:parcelId", createReviewForParcel)



export default router;