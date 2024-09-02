import express from 'express'
import { createPaymentIntent, getTransactions, saveTransaction } from './../controllers/payment.controller';
import { checkAuth } from '../middleware/authorization';
import { isAdmin } from '../middleware/checkAdmin';
const router = express.Router();

router
    .post("/create-payment-intent", createPaymentIntent)

    .post('/transaction', checkAuth, saveTransaction)

    .get('/transactions', checkAuth, isAdmin, getTransactions)


export default router;