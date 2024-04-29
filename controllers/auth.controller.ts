import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt"
const saltRounds = 10;

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, name, profilePicture } = req.body;
        const userExist = await User.findOne({ email });

        //* Check user is already exist or not in the database
        if (userExist) {
            return res.status(409).json({
                success: false,
                message: 'Email already exist. Please use a different email or log in'
            })
        }

        //* hash user password
        bcrypt.hash(password, saltRounds, async function (err: any, hash: any) {
            try {
                //* user info
                const newUser = new User({
                    name,
                    email,
                    password: hash,
                    profilePicture
                });

                //* save the user
                await newUser.save();

                return res.status(201).json({
                    success: true,
                    message: 'User registered successfully.'
                })
            } catch (error) {
                console.log('Register User Controller at Bcrypt function: ', (error as Error).message);
                next(error)
            }

        });

    } catch (error) {
        console.log('Register User Controller: ', (error as Error).message);
        next(error);
    }
}