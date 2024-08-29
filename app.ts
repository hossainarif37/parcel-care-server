import { NextFunction, Request, Response } from "express";

import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import authRoutes from "./routes/auth.routes"
import userRoutes from "./routes/user.routes"
import parcelRoutes from "./routes/parcel.routes"
import reviewRoutes from "./routes/review.routes"
import paymentRoutes from "./routes/payment.routes"

import './config/database'
import './config/passport'


const app = express();

app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL ? [process.env.CLIENT_URL, "http://localhost:3000"] : "http://localhost:3000" || '*',
    methods: "GET, POST, PUT, DELETE, OPTIONS, PATCH",
    credentials: true
}));
app.use(express.urlencoded({ extended: true }));

//* home route
app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Parcel Management server')
})

//* API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/parcel-booking', parcelRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/payment', paymentRoutes);

//* route not  found
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ success: false, message: 'route not found' })
})

//* server error
import errorHandler from "./errorHandlers/errorHandler";
app.use(errorHandler);

export default app;