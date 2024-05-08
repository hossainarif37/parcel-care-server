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
    bookingStatus: 'order_placed' | 'pickup_agent_assigned' | 'out_for_pickup' | 'parcel_collected' | 'pickup_hub_reached' | 'in_transit' | 'delivery_hub_reached' | 'delivery_agent_assigned' | 'out_for_delivery' | 'delivered';
    assignedAgentId: Types.ObjectId;
    assignedAgentRole: 'pickup' | 'delivery' | null;
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