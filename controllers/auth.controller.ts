import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import "dotenv/config"
import { IUser } from "../types/types";
const saltRounds = 10;

// User Registration Controller 
export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, name, profilePicture, agentRequestStatus, role } = req.body;
        const userExist = await User.findOne({ email });

        //* Check user is already exist or not in the database
        if (userExist) {
            return res.status(409).json({
                success: false,
                message: 'Email already exist. Please use a different email or log in'
            })
        }

        if (role === 'agent' && agentRequestStatus !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Agent request status must be pending'
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
                    profilePicture,
                    agentRequestStatus,
                    role
                });

                //* save the user
                const user: any = await newUser.save();
                const payload: any = {
                    id: user._id,
                    email: user.email
                }

                //* Generate jwt token
                if (!process.env.JWT_SECRET_KEY) {
                    throw new Error('JWT_SECRET_KEY is not defined in the environment variables');
                }

                const token = jwt.sign(payload, process.env.JWT_SECRET_KEY as string, { expiresIn: '30d' });
                res.status(201).send({
                    success: true,
                    message: "User registered successfully",
                    token: `Bearer ${token}`,
                    user
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

        const payload: any = {
            id: user._id,
            email: user.email
        }

        bcrypt.compare(password, user.password, function (err: any, result: any) {
            if (result) {
                //* Generate jwt token
                if (!process.env.JWT_SECRET_KEY) {
                    throw new Error('JWT_SECRET_KEY is not defined in the environment variables');
                }

                const token = jwt.sign(payload, process.env.JWT_SECRET_KEY as string, { expiresIn: '30d' });
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


// Update User Password
export const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
    const email = (req.user as IUser).email;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).send({ success: false, message: 'User not found' })
    }

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
        return res.status(404).json({ success: false, message: 'Password are missing. Provide the password as a object via body.' })
    }

    bcrypt.compare(currentPassword, user.password, function (err: any, result: any) {
        if (result) {
            //* hash user password
            bcrypt.hash(newPassword, saltRounds, async function (err: any, hash: any) {
                try {
                    //* user info
                    user.password = hash;

                    //* save the user
                    await user.save();


                    return res.status(201).json({
                        success: true,
                        message: 'Updated the password.'
                    })
                } catch (error) {
                    console.log('Update Password Controller at Bcrypt function: ', (error as Error).message);
                    next(error)
                }

            });
        } else {
            res.status(401).send({ success: false, message: 'Old password is wrong! Provide correct password.' })
        }
    });

}