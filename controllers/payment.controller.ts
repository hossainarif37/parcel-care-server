import { NextFunction, Request, Response } from "express";
import "dotenv/config"
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { price } = req.body;
        const amount = price * 100;

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            payment_method_types: ['card'],
        })

        res.send({
            clientSecret: paymentIntent.client_secret
        })
    } catch (error) {
        console.log('Create Payment Intent Controller: ', (error as Error).message);
        next(error);
    }
}

import Transaction from "../models/transaction.model";
import Parcel from "../models/parcel.model";
import { IParcel } from "../types/types";

export const saveTransaction = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { transactionId, parcel: parcelId } = req.body;
        const parcel = await Parcel.findById(parcelId);
        if (!parcel) {
            return res.status(404).json({ success: false, message: 'Parcel is not found' })
        }
        await Transaction.create(req.body);
        parcel.paymentStatus = 'Paid';
        parcel.transactionId = transactionId;
        await parcel.save();
        res.status(201).json({ success: true, message: 'Transaction saved successfully.' })
    } catch (error) {
        console.log('Save Transaction Controller: ', (error as Error).message);
        next(error)
    }
};