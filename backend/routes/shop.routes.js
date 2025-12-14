import express from "express";
import {
    createShop,
    deleteShop,
    getAllShops,
    getShopById,
    searchShopsByLocation,
    updateShop
} from "../controllers/shop.controller.js";

const router = express.Router();

router.get("/", getAllShops);
router.get("/search", searchShopsByLocation);
router.get("/:id", getShopById);
router.post("/", createShop);
router.put("/:id", updateShop);
router.delete("/:id", deleteShop);

export default router;
