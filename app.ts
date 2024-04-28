import { NextFunction, Request, Response } from "express";

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL ? [process.env.CLIENT_URL, "http://localhost:3000"] : "http://localhost:3000" || '*'
}));
app.use(express.urlencoded({ extended: true }));

//* home route
app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to TechConnect Community server')
})


//* route not  found
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ success: false, message: 'route not found' })
})

//* server error
const errorHandler = require('./errorHandlers/errorHandler');
app.use(errorHandler);


export default app;