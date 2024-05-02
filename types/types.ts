import { Types } from "mongoose";

// User Interface
export interface IUser extends Document {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: 'user' | 'delivery-man' | 'admin';
    profilePicture?: string;
}

export interface IParcel extends Document {
    userId: Types.ObjectId;
    name: string;
    email: string;
    phoneNumber: string;
    parcelType: string;
    parcelWeight: number;
    receiverName: string;
    receiverPhoneNumber: string;
    deliveryAddress: string;
    requestedDeliveryDate: Date;
    deliveryAddressLatitude: number;
    deliveryAddressLongitude: number;
    price: number;
    bookingStatus: 'pending' | 'on the way' | 'delivered' | 'returned' | 'cancelled';
    deliveryMenId?: Types.ObjectId;
    bookingDate: Date;
}