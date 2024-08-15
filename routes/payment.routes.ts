import express from 'express'
import { createPaymentIntent, saveTransaction } from './../controllers/payment.controller';
import { checkAuth } from '../middleware/authorization';
const router = express.Router();

router
    .post("/create-payment-intent", checkAuth, createPaymentIntent)

    .post('/transaction', checkAuth, saveTransaction);


export default router;