import { Types } from "mongoose";

// User Interface
export interface IUser extends Document {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: 'user' | 'agent' | 'admin';
    profilePicture?: string;
}

export interface IParcel extends Document {
    senderId: Types.ObjectId;
    senderName: string;
    senderEmail: string;
    senderPhoneNumber: string;
    senderAddress: {
        fullAddress: string;
        subDistrict: string;
        district: string;
    };
    parcelType: string;
    parcelWeight: number;
    receiverName: string;
    receiverEmail: string;
    receiverPhoneNumber: string;
    deliveryAddress: {
        fullAddress: string;
        subDistrict: string;
        district: string;
    };
    requestedDeliveryDate: Date;
    price: number;
    deliveryStatus: 'Order Confirmed' | 'Pickup Agent Assigned' | 'Parcel Collected' | 'In Transit' | 'Delivery Hub Reached' | 'Delivery Agent Assigned' | 'Out For Delivery' | 'Delivered'
    assignedAgentId?: Types.ObjectId;
    assignedAgentRole?: 'pickup' | 'delivery';
    bookingDate: Date;
}
export interface IReview extends Document {
    userId: Types.ObjectId;
    deliveryMenId: Types.ObjectId;
    parcelId: Types.ObjectId;
    rating: number;
    feedback: string;
    reviewDate: Date;
}