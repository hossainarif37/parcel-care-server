import express from "express"
import { bookAParcel, getAllBookedParcels, getBookedParcelsByUserId } from "../controllers/parcelBooking.controller";
import { checkAuth } from "../middleware/authorization";
import { isAdmin } from "../middleware/adminCheck";
const router = express.Router();

router
    .post('/', checkAuth, bookAParcel)

    .get('/', checkAuth, isAdmin, getAllBookedParcels)

    .get('/:userId', checkAuth, getBookedParcelsByUserId)


export default router;