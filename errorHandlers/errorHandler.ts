import { NextFunction, Request, Response } from "express";

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err.name === 'ValidationError') {
        return res.status(400).json({ success: false, message: err.message });
    }
    else if (err.name === 'CastError') {
        return res.status(400).json({ success: false, message: err.message })
    }

    else if (err.name === 'StripeInvalidRequestError') {
        return res.status(404).json({ success: false, message: "The payment transaction could not be found." })
    }

    console.log(err.message);

    res.status(500).json({
        success: false,
        message: 'Internal server error!'
    })
}

export default errorHandler;