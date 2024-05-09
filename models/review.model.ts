import { Schema, model } from "mongoose";
import { IReview } from "../types/types";

// Review schema
const reviewSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    agentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    parcelId: { type: Schema.Types.ObjectId, ref: 'Parcel', required: true }, // Added parcelId
    rating: { type: Number, required: true },
    feedback: { type: String, required: true },
    reviewDate: { type: Date, default: Date.now }
});

const Review = model<IReview>('Review', reviewSchema);
export default Review;