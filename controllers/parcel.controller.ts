import { NextFunction, Request, Response } from "express";
import { IParcel, IUser } from "../types/types";
import Parcel from "../models/parcel.model";
import User from "../models/user.model";

export const bookAParcel = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Only user is allowed to access
        if ((req.user as IUser).role !== "user") {
            return res.status(403).json({ success: false, message: "Only user is allowed to access this route." });
        }

        // Assuming req.user contains the authenticated user's ID
        const parcelData: IParcel = {
            ...req.body
        };

        const newParcel = new Parcel(parcelData);

        // Ensure deliveryStatusHistory starts with a default entry
        if (!newParcel.deliveryStatusHistory.length) {
            newParcel.deliveryStatusHistory.push({
                status: 'Order Placed',
                updatedAt: new Date()
            });
        }

        // Save the parcel document to the database
        await newParcel.save();

        // Return a success response
        return res.status(201).json({ success: true, message: "Parcel booked successfully.", parcel: newParcel });
    } catch (error) {
        // Pass the error to the next middleware for error handling
        next(error);
    }
};

export const getAllBookedParcels = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Fetch all parcel documents from the database
        const parcels = await Parcel.find({});

        // Return the parcels in the response
        return res.status(200).json({ success: true, parcels });
    } catch (error) {
        console.log('getAllBookedParcels error', error);
        next(error);
    }
};

export const getBookedParcelsByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const senderId = req.params.userId;
        const parcels: IParcel[] = await Parcel.find({ senderId });

        // Check if any parcels were found
        if (parcels.length === 0) {
            return res.status(404).json({ success: false, message: "No parcels found for this user." });
        }

        return res.status(200).json({ success: true, message: "Parcels fetched successfully.", parcels });
    } catch (error) {
        console.log('getBookedParcelsByUserId Error: ', error);
        next(error);
    }
}

export const getABookedParcelById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parcelId = req.params.parcelId;
        const userId = (req.user as IUser)._id;
        const parcel = await Parcel.findOne({ _id: parcelId, senderId: userId });
        if (!parcel) {
            return res.status(404).json({ success: false, message: "Parcel not found" });
        }
        return res.status(200).json({ success: true, parcel });
    } catch (error) {
        console.log('getABookedParcelById Error: ', error);
        next(error);
    }
}

// Update the updateParcelInfo function in parcelBooking.controller.ts
export const updateParcelInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parcelId = req.params.parcelId;
        const updates = req.body;
        console.log(82, updates);


        // Find the parcel by ID and explicitly cast it to the Mongoose Document type
        const parcel: any = await Parcel.findById(parcelId);

        console.log(88, parcel);
        if (!parcel) {
            return res.status(404).json({ success: false, message: "Parcel not found." });
        }

        // Update the parcel information
        for (const key in updates) {
            if (updates.hasOwnProperty(key)) {
                // Special handling for assignedAgentId to ensure only admins can assign
                if (key === 'assignedAgentId' && (!req.user || (req.user as IUser).role !== 'admin')) {
                    return res.status(403).json({ success: false, message: "Only admins can assign a agent" });
                }
                // Handle deliveryStatus to push into deliveryStatusHistory
                else if (key === 'deliveryStatus') {
                    console.log('Execute');
                    if (updates[key] === parcel.deliveryStatus) {
                        return res.status(400).json({ success: false, message: "Cannot update delivery status to the same value." });

                    }
                    parcel?.deliveryStatusHistory.push({ status: updates[key], updatedAt: new Date() });
                }
                // Other updates can be applied directly
                (parcel as any)[key] = updates[key];
            }
        }

        // Save the updated parcel document
        await parcel.save();

        return res.status(200).json({ success: true, message: "Parcel updated successfully.", parcel });
    } catch (error) {
        next(error);
    }
};

export const getAssignedParcelsByAgentIdAndRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Extract assigned agents id
        const assignedAgentId = req.params.agentId;
        // Extract assignedAgentRole from the query parameters
        const assignedAgentRole = req.query.assignedAgentRole;

        // Perform the check in the database
        const isAgent = await User.findOne({
            _id: assignedAgentId,
            role: 'agent'
        });

        if (!isAgent) {
            return res.status(403).json({ success: false, message: "Only agent is allowed to access this route." });
        }



        // Prepare the query object
        const query: any = { assignedAgentId: assignedAgentId, assignedAgentRole };

        // Fetch all parcels assigned to the agent with the specified role
        const parcels = await Parcel.find(query);

        // Check if any parcels were found
        if (parcels.length === 0) {
            return res.status(404).json({ success: false, message: "No parcels found for this agent with the specified role." });
        }

        return res.status(200).json({ success: true, message: "Parcels fetched successfully.", parcels });
    } catch (error) {
        console.log('getAssignedParcelsByAgentId Error: ', (error as Error).message);
        next(error);
    }
};