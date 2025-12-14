import Service from "../models/service.model.js";

// Get all services
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find()
      .populate("shop_id", "shopName");
    
    res.status(200).json({
      success: true,
      data: services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching services",
      error: error.message
    });
  }
};

// Get services by shop
export const getServicesByShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    
    const services = await Service.find({ shop_id: shopId, isActive: true });
    
    res.status(200).json({
      success: true,
      data: services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching services for shop",
      error: error.message
    });
  }
};

// Get service by ID
export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const service = await Service.findById(id)
      .populate("shop_id", "shopName");
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found"
      });
    }
    
    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching service",
      error: error.message
    });
  }
};

// Create new service
export const createService = async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    
    const populatedService = await Service.findById(service._id)
      .populate("shop_id", "shopName");
    
    res.status(201).json({
      success: true,
      data: populatedService
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating service",
      error: error.message
    });
  }
};

// Update service
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    
    const service = await Service.findByIdAndUpdate(id, req.body, { new: true })
      .populate("shop_id", "shopName");
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found"
      });
    }
    
    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating service",
      error: error.message
    });
  }
};

// Delete service
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    
    const service = await Service.findByIdAndDelete(id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found"
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Service deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting service",
      error: error.message
    });
  }
};
