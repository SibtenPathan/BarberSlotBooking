import express from "express";
import {
    createBarber,
    deleteBarber,
    getAllBarbers,
    getBarberById,
    getBarbersByShop,
    updateBarber
} from "../controllers/barber.controller.js";

const router = express.Router();

router.get("/", getAllBarbers);
router.get("/shop/:shopId", getBarbersByShop);
router.get("/:id", getBarberById);
router.post("/", createBarber);
router.put("/:id", updateBarber);
router.delete("/:id", deleteBarber);

export default router;
