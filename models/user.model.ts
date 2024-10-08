import { Schema, model } from "mongoose";
import { IUser } from "../types/types";

// User schema
const userSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'agent', 'admin'], default: 'user' },
    profilePicture: { type: String },
    phoneNumber: { type: Number },
    fullAddress: { type: String },
    district: { type: String },
    subDistrict: { type: String },
    isEmailVerified: { type: Boolean, default: false },
    isProfileComplete: { type: Boolean, default: false },
    agentRequestStatus: { type: String, enum: ['pending', 'accepted', 'rejected'] },
    deliveryCount: { type: Number },
    createdAt: { type: Date, default: Date.now }
});

const User = model<IUser>('User', userSchema);
export default User;