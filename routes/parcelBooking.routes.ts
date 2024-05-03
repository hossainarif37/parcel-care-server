import express from "express"
import { bookAParcel, getAllBookedParcels, getBookedParcelsByUserId, updateParcelInfo } from "../controllers/parcelBooking.controller";
import { checkAuth } from "../middleware/authorization";
import { isAdmin } from "../middleware/adminCheck";
const router = express.Router();

router
    .post('/', checkAuth, bookAParcel)

    .get('/', checkAuth, isAdmin, getAllBookedParcels)

    .get('/:userId', checkAuth, getBookedParcelsByUserId)

    .put('/:parcelId', checkAuth, updateParcelInfo)


export default router;