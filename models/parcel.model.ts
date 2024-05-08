import { Schema, model } from "mongoose";
import { IParcel } from "../types/types";

// Parcel schema
const parcelSchema: Schema = new Schema({
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    senderName: { type: String, required: true },
    senderEmail: { type: String, required: true },
    senderPhoneNumber: { type: String, required: true },
    senderAddress: {
        fullAddress: { type: String, required: true },
        subDistrict: { type: String, required: true },
        district: { type: String, required: true }
    },
    parcelType: { type: String, required: true },
    parcelWeight: { type: Number, required: true },
    receiverName: { type: String, required: true },
    receiverEmail: { type: String, required: true },
    receiverPhoneNumber: { type: String, required: true },
    deliveryAddress: {
        fullAddress: { type: String, required: true },
        subDistrict: { type: String, required: true },
        district: { type: String, required: true }
    },
    requestedDeliveryDate: { type: Date, required: true },
    price: { type: Number, required: true },
    bookingStatus: { type: String, enum: ['order_placed', 'pickup_agent_assigned', 'out_for_pickup', 'parcel_collected', 'pickup_hub_reached', 'in_transit', 'delivery_hub_reached', 'delivery_agent_assigned', 'out_for_delivery', 'delivered'], default: 'order_placed' },
    assignedAgentId: { type: Schema.Types.ObjectId, ref: 'User' },
    assignedAgentRole: { type: String, enum: ['pickup', 'delivery'], default: null },
    bookingDate: { type: Date, default: Date.now }
});

const Parcel = model<IParcel>('Parcel', parcelSchema);
export default Parcel;