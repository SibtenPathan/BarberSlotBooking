import express from "express";
import {
    cancelBooking,
    createBooking,
    getAllBookings,
    getBookingById,
    getBookingsByUser,
    updateBookingStatus
} from "../controllers/booking.controller.js";

const router = express.Router();

router.post("/", createBooking);
router.get("/", getAllBookings);
router.get("/user/:userId", getBookingsByUser);
router.get("/:id", getBookingById);
router.put("/:id/status", updateBookingStatus);
router.put("/:id/cancel", cancelBooking);

export default router;
