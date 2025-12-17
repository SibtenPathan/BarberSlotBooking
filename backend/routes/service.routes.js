import express from "express";
import {
    createService,
    deleteService,
    getAllServices,
    getServiceById,
    getServicesByShop,
    updateService
} from "../controllers/service.controller.js";

const router = express.Router();

router.get("/", getAllServices);
router.get("/shop/:shopId", getServicesByShop);
router.get("/:id", getServiceById);
router.post("/", createService);
router.put("/:id", updateService);
router.delete("/:id", deleteService);

export default router;
