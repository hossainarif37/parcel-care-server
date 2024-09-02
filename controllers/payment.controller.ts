import { NextFunction, Request, Response } from "express";
import "dotenv/config"
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
import Transaction from "../models/transaction.model";
import Parcel from "../models/parcel.model";

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



export const saveTransaction = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { transactionId, parcel: parcelId } = req.body;
        const parcel = await Parcel.findById(parcelId);
        if (!parcel) {
            return res.status(404).json({ success: false, message: 'Parcel is not found' })
        }
        // Retrieve Payment details from Stripe
        await stripe.paymentIntents.retrieve(transactionId);

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


export const getTransactions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const transactions = await Transaction.find({});
        if (transactions.length === 0) {
            return res.status(404).json({ success: false, message: 'No transactions found' });
        }
        res.status(200).json({ success: true, transactions });
    } catch (error) {
        console.log('Get Transactions Controller: ', (error as Error).message);
        next(error);
    }
}