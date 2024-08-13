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

export const saveTransaction = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { amount, ...remainingData } = req.body;
        const savedTransaction = await Transaction.create(remainingData);
        console.log(savedTransaction);
    } catch (error) {
        console.log('Save Transaction Controller: ', (error as Error).message);
        next(error)
    }
};