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

        // Ensure shipmentStatusHistory starts with a default entry
        if (!newParcel.shipmentStatusHistory.length) {
            newParcel.shipmentStatusHistory.push({
                status: 'Order Placed',
                updatedAt: new Date()
            });
        }

        // Save the parcel document to the database
        await newParcel.save();

        // Return a success response
        return res.status(201).json({ success: true, message: "Booked successfully. Now make the payment to start the shipment process.", parcel: newParcel });
    } catch (error) {
        next(error);
    }
};

export const getAllBookedParcels = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Fetch all parcel documents from the database
        const parcels: any = await Parcel.find({});

        if (parcels.length === 0) {
            return res.status(404).json({ success: false, message: "No parcels found." });
        }

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
        const parcel = await Parcel.findOne({ _id: parcelId });
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
        if ((req.user as IUser).role === 'user') {
            return res.status(403).json({ success: false, message: 'Permission denied!' });
        }

        const parcelId = req.params.parcelId;
        const data = req.body;


        // Find the parcel by ID and explicitly cast it to the Mongoose Document type
        const parcel: any = await Parcel.findById(parcelId);

        if (!parcel) {
            return res.status(404).json({ success: false, message: "Parcel not found." });
        }

        // Update the parcel information
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                // Special handling for assignedAgent to ensure only admins can assign
                if (key === 'assignedAgent' && (!req.user || (req.user as IUser).role !== 'admin')) {
                    return res.status(403).json({ success: false, message: "Only admin can assign a agent" });
                }
                // Handle shipmentStatus to push into shipmentStatusHistory
                else if (key === 'shipmentStatus') {
                    if (parcel.shipmentStatus === 'Delivered') {
                        return res.status(400).json({ success: false, message: "Cannot update shipment status while parcel is delivered." });
                    }

                    else if (data[key] === parcel.shipmentStatus) {
                        return res.status(400).json({ success: false, message: "Cannot update shipment status to the same value." });
                    }
                    else if (parcel.paymentStatus === 'Unpaid') {
                        return res.status(400).json({ success: false, message: "Cannot update shipment status while parcel is unpaid." });
                    }

                    if (data[key] === 'Delivered') {
                        const agent: any = await User.findById(parcel.assignedAgent);
                        if (!agent.deliveryCount) {
                            agent.deliveryCount = 1;
                        } else {
                            agent.deliveryCount += 1;
                        }

                        await agent.save();

                    }
                    parcel?.shipmentStatusHistory.push({ status: data[key], updatedAt: new Date() });
                }
                // Other updates can be applied directly
                (parcel as any)[key] = data[key];
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

        if (assignedAgentId === 'undefined' || assignedAgentRole === 'undefined') {
            return res.status(400).json({ success: false, message: "Assigned agent id and role are required." });
        }

        // Perform the check in the database
        const isAgent = await User.findOne({
            _id: assignedAgentId,
            role: 'agent'
        });

        if (!isAgent) {
            return res.status(403).json({ success: false, message: "Only agent is allowed to access this route." });
        }

        // Prepare the query object
        const query: any = { assignedAgent: assignedAgentId, assignedAgentRole };

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