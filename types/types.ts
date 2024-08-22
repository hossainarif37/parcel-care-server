import { Types } from "mongoose";

// User Interface
export interface IUser extends Document {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: 'user' | 'agent' | 'admin';
    profilePicture?: string;
    phoneNumber?: number;
    fullAddress?: string;
    subDistrict?: string;
    district?: string;
    isEmailVerified?: boolean;
    isProfileComplete?: boolean;
    agentRequestStatus?: 'pending' | 'accepted' | 'rejected';
    createdAt?: Date;
    [key: string]: any;
}


export interface IParcel extends Document {
    senderId: Types.ObjectId;
    senderName: string;
    senderEmail: string;
    senderPhoneNumber: number;
    senderAddress: {
        fullAddress: string;
        subDistrict: string;
        district: string;
    };
    parcelType: 'Document' | 'Box';
    parcelWeight: number;
    receiverName: string;
    receiverEmail: string;
    receiverPhoneNumber: number;
    deliveryAddress: {
        fullAddress: string;
        subDistrict: string;
        district: string;
    };
    requestedDeliveryDate: Date;
    price: number;
    transactionId?: string;
    paymentStatus: 'Unpaid' | 'Paid';
    deliveryStatus: 'Order Placed' | 'Pickup Agent Assigned' | 'Parcel Collected' | 'In Transit' | 'Delivery Hub Reached' | 'Delivery Agent Assigned' | 'Out For Delivery' | 'Delivered'
    deliveryStatusHistory: Array<{
        status: 'Order Placed' | 'Pickup Agent Assigned' | 'Parcel Collected' | 'In Transit' | 'Delivery Hub Reached' | 'Delivery Agent Assigned' | 'Out For Delivery' | 'Delivered';
        updatedAt: Date;
    }>,
    assignedAgent?: Types.ObjectId;
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

export interface ITransaction extends Document {
    parcel: Types.ObjectId;
    sender: Types.ObjectId;
    amount: number;
    transactionId: string;
    paymentMethod: string;
    createdAt: Date;
}