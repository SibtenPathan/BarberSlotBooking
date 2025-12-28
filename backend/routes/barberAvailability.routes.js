import express from "express";
import {
    generateAvailability,
    getAvailableSlots,
    getWorkingHours,
    updateWorkingHours
} from "../controllers/barberAvailability.controller.js";

const router = express.Router();

// Get barber working hours
router.get("/:barberId/working-hours", getWorkingHours);

// Update barber working hours (admin only)
router.put("/:barberId/working-hours", updateWorkingHours);

// Generate availability slots for barber
router.post("/:barberId/generate-availability", generateAvailability);

// Get available slots for a specific date and service duration
router.get("/:barberId/available-slots", getAvailableSlots);

export default router;
