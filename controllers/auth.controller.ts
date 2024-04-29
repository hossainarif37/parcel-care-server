import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import "dotenv/config"
const saltRounds = 10;

// User Registration Controller 
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

//* User Login Controller 
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;


        //* Validate that 'email' and 'password' fields are present in the request body
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email or Password is required' })
        }


        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ success: false, message: 'User not found' })
        }

        const payload = {
            id: user._id,
            email: user.email
        }



        bcrypt.compare(password, user.password, function (err: any, result: any) {
            if (result) {
                //* Generate jwt token
                if (!process.env.JWT_SECRET_KEY) {
                    throw new Error('JWT_SECRET_KEY is not defined in the environment variables');
                }

                const token = jwt.sign(payload, process.env.JWT_SECRET_KEY as string, { expiresIn: '1d' });
                res.status(200).send({
                    success: true,
                    message: "Login in successfully",
                    token: `Bearer ${token}`,
                    user
                })
            } else {
                res.status(401).send({ success: false, message: 'Wrong password' })
            }
        });



    } catch (error) {
        console.log('Login User Controller: ', (error as Error).message);
        next(error);
    }
}
