import { Request, Response } from "express";
import "dotenv/config"
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req: Request, res: Response) => {
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
}