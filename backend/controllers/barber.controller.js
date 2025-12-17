import Barber from "../models/barber.model.js";

// Get all barbers
export const getAllBarbers = async (req, res) => {
  try {
    const barbers = await Barber.find()
      .populate("user_id", "FirstName LastName email phone profileImage")
      .populate("shop_id", "shopName");
    
    res.status(200).json({
      success: true,
      data: barbers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching barbers",
      error: error.message
    });
  }
};

// Get barbers by shop
export const getBarbersByShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    
    const barbers = await Barber.find({ shop_id: shopId })
      .populate("user_id", "FirstName LastName email phone profileImage");
    
    res.status(200).json({
      success: true,
      data: barbers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching barbers for shop",
      error: error.message
    });
  }
};

// Get barber by ID
export const getBarberById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const barber = await Barber.findById(id)
      .populate("user_id", "FirstName LastName email phone profileImage")
      .populate("shop_id", "shopName");
    
    if (!barber) {
      return res.status(404).json({
        success: false,
        message: "Barber not found"
      });
    }
    
    res.status(200).json({
      success: true,
      data: barber
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching barber",
      error: error.message
    });
  }
};

// Create new barber
export const createBarber = async (req, res) => {
  try {
    const barber = new Barber(req.body);
    await barber.save();
    
    const populatedBarber = await Barber.findById(barber._id)
      .populate("user_id", "FirstName LastName email phone profileImage")
      .populate("shop_id", "shopName");
    
    res.status(201).json({
      success: true,
      data: populatedBarber
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating barber",
      error: error.message
    });
  }
};

// Update barber
export const updateBarber = async (req, res) => {
  try {
    const { id } = req.params;
    
    const barber = await Barber.findByIdAndUpdate(id, req.body, { new: true })
      .populate("user_id", "FirstName LastName email phone profileImage")
      .populate("shop_id", "shopName");
    
    if (!barber) {
      return res.status(404).json({
        success: false,
        message: "Barber not found"
      });
    }
    
    res.status(200).json({
      success: true,
      data: barber
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating barber",
      error: error.message
    });
  }
};

// Delete barber
export const deleteBarber = async (req, res) => {
  try {
    const { id } = req.params;
    
    const barber = await Barber.findByIdAndDelete(id);
    
    if (!barber) {
      return res.status(404).json({
        success: false,
        message: "Barber not found"
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Barber deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting barber",
      error: error.message
    });
  }
};
