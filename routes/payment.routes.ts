import express from 'express'
import { createPaymentIntent, saveTransaction } from './../controllers/payment.controller';
const router = express.Router();

router
    .post("/create-payment-intent", createPaymentIntent)

    .post('/transaction', saveTransaction);


export default router;