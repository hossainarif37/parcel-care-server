import { Schema, model } from "mongoose";
import { IParcel } from "../types/types";

// Parcel schema
const parcelSchema: Schema = new Schema({
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    senderName: { type: String, required: true },
    senderEmail: { type: String, required: true },
    senderPhoneNumber: { type: Number, required: true },
    senderAddress: {
        fullAddress: { type: String, required: true },
        subDistrict: { type: String, required: true },
        district: { type: String, required: true }
    },
    parcelType: { type: String, required: true, enum: ['Document', 'Box'] },
    parcelWeight: { type: Number, required: true },
    receiverName: { type: String, required: true },
    receiverEmail: { type: String, required: true },
    receiverPhoneNumber: { type: Number, required: true },
    deliveryAddress: {
        fullAddress: { type: String, required: true },
        subDistrict: { type: String, required: true },
        district: { type: String, required: true }
    },
    requestedDeliveryDate: { type: Date, required: true },
    price: { type: Number, required: true },
    transactionId: { type: String },
    paymentStatus: { type: String, enum: ['Unpaid', 'Paid'], default: 'Unpaid' },
    shipmentStatus: {
        type: String,
        enum: [
            'Order Placed',
            'Pickup Agent Assigned',
            'Parcel Collected',
            'In Transit',
            'Delivery Hub Reached',
            'Delivery Agent Assigned',
            'Out For Delivery',
            'Delivered'
        ],
        default: 'Order Placed'
    },
    shipmentStatusHistory: [{
        status: {
            type: String,
            enum: [
                'Order Placed',
                'Pickup Agent Assigned',
                'Parcel Collected',
                'In Transit',
                'Delivery Hub Reached',
                'Delivery Agent Assigned',
                'Out For Delivery',
                'Delivered'
            ],
        },
        updatedAt: { type: Date }
    }],
    assignedAgent: { type: Schema.Types.ObjectId, ref: 'User' },
    assignedAgentRole: { type: String, enum: ['pickup', 'delivery'] },
    bookingDate: { type: Date, default: Date.now }
});

const Parcel = model<IParcel>('Parcel', parcelSchema);
export default Parcel;