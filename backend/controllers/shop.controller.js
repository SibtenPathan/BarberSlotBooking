import Shop from "../models/shop.model.js";

// ⭐ GET ALL SHOPS
export const getAllShops = async (req, res) => {
  try {
    const shops = await Shop.find()
      .populate("owner_id", "FirstName LastName email")
      .populate("barbers", "FirstName LastName")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: shops.length,
      data: shops
    });
  } catch (error) {
    console.error("Get All Shops Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server Error" 
    });
  }
};

// ⭐ GET SHOP BY ID
export const getShopById = async (req, res) => {
  try {
    const { id } = req.params;

    const shop = await Shop.findById(id)
      .populate("owner_id", "FirstName LastName email phone")
      .populate("barbers", "FirstName LastName");

    if (!shop) {
      return res.status(404).json({ 
        success: false,
        message: "Shop not found" 
      });
    }

    // Get barbers and services for this shop
    const Barber = (await import("../models/barber.model.js")).default;
    const Service = (await import("../models/service.model.js")).default;
    
    const barbers = await Barber.find({ shop_id: id })
      .populate("user_id", "FirstName LastName email phone profileImage");
    
    const services = await Service.find({ shop_id: id, isActive: true });

    return res.status(200).json({
      success: true,
      data: {
        ...shop.toObject(),
        barbersDetails: barbers,
        services: services
      }
    });
  } catch (error) {
    console.error("Get Shop By ID Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server Error" 
    });
  }
};

// ⭐ CREATE SHOP
export const createShop = async (req, res) => {
  try {
    const {
      owner_id,
      shopName,
      description,
      location,
      images,
      barbers,
      openTime,
      closeTime,
      closeDays
    } = req.body;

    if (!owner_id || !shopName || !location || !openTime || !closeTime) {
      return res.status(400).json({ 
        success: false,
        message: "Required fields are missing" 
      });
    }

    const newShop = new Shop({
      owner_id,
      shopName,
      description,
      location,
      images,
      barbers,
      openTime,
      closeTime,
      closeDays
    });

    await newShop.save();

    return res.status(201).json({
      success: true,
      message: "Shop created successfully",
      data: newShop
    });
  } catch (error) {
    console.error("Create Shop Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server Error" 
    });
  }
};

// ⭐ UPDATE SHOP
export const updateShop = async (req, res) => {
  try {
    const { id } = req.params;

    const shop = await Shop.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!shop) {
      return res.status(404).json({ 
        success: false,
        message: "Shop not found" 
      });
    }

    return res.status(200).json({
      success: true,
      message: "Shop updated successfully",
      data: shop
    });
  } catch (error) {
    console.error("Update Shop Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server Error" 
    });
  }
};

// ⭐ DELETE SHOP
export const deleteShop = async (req, res) => {
  try {
    const { id } = req.params;

    const shop = await Shop.findByIdAndDelete(id);

    if (!shop) {
      return res.status(404).json({ 
        success: false,
        message: "Shop not found" 
      });
    }

    return res.status(200).json({
      success: true,
      message: "Shop deleted successfully"
    });
  } catch (error) {
    console.error("Delete Shop Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server Error" 
    });
  }
};

// ⭐ SEARCH SHOPS BY LOCATION
export const searchShopsByLocation = async (req, res) => {
  try {
    const { city } = req.query;

    const query = city 
      ? { "location.city": { $regex: city, $options: "i" } }
      : {};

    const shops = await Shop.find(query)
      .populate("owner_id", "FirstName LastName")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: shops.length,
      data: shops
    });
  } catch (error) {
    console.error("Search Shops Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server Error" 
    });
  }
};
