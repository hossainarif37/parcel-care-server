import { Schema, model } from "mongoose";
import { IUser } from "../types/types";

// User schema
const userSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'agent', 'admin'], default: 'user' },
    profilePicture: { type: String }
});

const User = model<IUser>('User', userSchema);
export default User;