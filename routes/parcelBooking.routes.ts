import express from "express"
import { bookAParcel } from "../controllers/parcelBooking.controller";
import { checkAuth } from "../middleware/authorization";
const router = express.Router();

router
    .post('/', checkAuth, bookAParcel)


export default router;