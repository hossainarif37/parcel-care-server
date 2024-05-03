import { Schema, model } from "mongoose";
import { IParcel } from "../types/types";

// Parcel schema
const parcelSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    parcelType: { type: String, required: true },
    parcelWeight: { type: Number, required: true },
    receiverName: { type: String, required: true },
    receiverPhoneNumber: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    requestedDeliveryDate: { type: Date, required: true },
    deliveryAddressLatitude: { type: Number, required: true },
    deliveryAddressLongitude: { type: Number, required: true },
    price: { type: Number, required: true },
    bookingStatus: { type: String, enum: ['pending', 'on the way', 'delivered', 'returned', 'cancelled'], default: 'pending' },
    deliveryManId: { type: Schema.Types.ObjectId, ref: 'User' },
    bookingDate: { type: Date, default: Date.now }
});

const Parcel = model<IParcel>('Parcel', parcelSchema);
export default Parcel;