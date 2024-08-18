import { model, Schema, Types } from "mongoose";
import { ITransaction } from "../types/types";

const transactionSchema: Schema = new Schema({
    parcel: { type: Types.ObjectId, ref: 'Parcel', required: true },
    sender: { type: Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    transactionId: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
})

const Transaction = model<ITransaction>('Transaction', transactionSchema);
export default Transaction;