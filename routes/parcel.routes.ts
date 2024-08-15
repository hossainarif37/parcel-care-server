import express from "express"
import { bookAParcel, getABookedParcelById, getAllBookedParcels, getAssignedParcelsByAgentIdAndRole, getBookedParcelsByUserId, updateParcelInfo } from "../controllers/parcel.controller";
import { checkAuth } from "../middleware/authorization";
import { isAdmin } from "../middleware/adminCheck";
const router = express.Router();

router
    .post('/', checkAuth, bookAParcel)

    .get('/', checkAuth, isAdmin, getAllBookedParcels)

    .get('/:userId/parcels', checkAuth, getBookedParcelsByUserId)

    .get('/:parcelId', checkAuth, getABookedParcelById)

    .put('/:parcelId', checkAuth, updateParcelInfo)

    .get('/assigned-parcels/:agentId', checkAuth, getAssignedParcelsByAgentIdAndRole);


export default router;