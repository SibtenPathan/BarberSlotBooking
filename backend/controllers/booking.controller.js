import Barber from "../models/barber.model.js";
import Booking from "../models/booking.model.js";
import Service from "../models/service.model.js";
import {
  addMinutesToTime,
  convertTo24Hour,
  getSlotsToBook,
  hasConsecutiveSlots
} from "../utils/slotHelper.js";

// Create new booking
export const createBooking = async (req, res) => {
  try {
    const {
      user_id,
      shop_id,
      barber_id,
      services, // Array of service IDs
      date,
      slot_time,
      payment
    } = req.body;

    // Validate required fields
    if (!user_id || !shop_id || !barber_id || !services || !date || !slot_time) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // Find the barber and check slot availability
    const barber = await Barber.findById(barber_id);
    if (!barber) {
      return res.status(404).json({
        success: false,
        message: "Barber not found"
      });
    }

    // Get service details to calculate total duration
    const serviceDetails = await Service.find({ _id: { $in: services } });
    if (!serviceDetails || serviceDetails.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Services not found"
      });
    }

    // Calculate total duration
    const totalDuration = serviceDetails.reduce((sum, service) => sum + service.duration, 0);

    // Find the availability for the requested date
    const requestedDate = new Date(date);
    const dateAvailability = barber.availability.find(
      av => new Date(av.date).toDateString() === requestedDate.toDateString()
    );

    if (!dateAvailability) {
      return res.status(400).json({
        success: false,
        message: "No availability found for this date"
      });
    }

    // Convert slot_time to 24-hour format if needed
    let slotTime24h = slot_time;
    if (slot_time.includes('AM') || slot_time.includes('PM')) {
      slotTime24h = convertTo24Hour(slot_time);
    }

    // Check if barber has consecutive available slots for the total duration
    const hasAvailability = hasConsecutiveSlots(
      dateAvailability.slots,
      slotTime24h,
      totalDuration
    );

    if (!hasAvailability) {
      return res.status(400).json({
        success: false,
        message: `No consecutive slots available for ${totalDuration} minutes starting at ${slot_time}`
      });
    }

    // Calculate end time
    const slotEndTime = addMinutesToTime(slotTime24h, totalDuration);

    // Create a single booking with all services
    const booking = new Booking({
      user_id,
      shop_id,
      barber_id,
      services,
      date: requestedDate,
      slot_time: slotTime24h,
      slot_end_time: slotEndTime,
      total_duration: totalDuration,
      payment: payment || {
        method: "cash",
        amount: 0,
        status: "pending"
      }
    });

    await booking.save();

    // Mark all required consecutive slots as booked
    const slotsToBook = getSlotsToBook(dateAvailability.slots, slotTime24h, totalDuration);
    
    slotsToBook.forEach(slotTime => {
      const slot = dateAvailability.slots.find(s => s.time === slotTime);
      if (slot) {
        slot.isBooked = true;
        slot.bookingId = booking._id;
      }
    });

    await barber.save();

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking
    });
  } catch (error) {
    console.error("Create Booking Error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating booking",
      error: error.message
    });
  }
};

// Get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user_id", "FirstName LastName email phone")
      .populate("shop_id", "shopName location")
      .populate("barber_id")
      .populate("services")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching bookings",
      error: error.message
    });
  }
};

// Get bookings by user
export const getBookingsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const bookings = await Booking.find({ user_id: userId })
      .populate("shop_id", "shopName location")
      .populate("barber_id")
      .populate("services")
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user bookings",
      error: error.message
    });
  }
};

// Get booking by ID
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate("user_id", "FirstName LastName email phone")
      .populate("shop_id", "shopName location")
      .populate("barber_id")
      .populate("services");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching booking",
      error: error.message
    });
  }
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate("user_id", "FirstName LastName email phone")
      .populate("shop_id", "shopName location")
      .populate("barber_id")
      .populate("service_id");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking status updated",
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating booking",
      error: error.message
    });
  }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    // Update booking status
    booking.status = "cancelled";
    await booking.save();

    // Free up all slots used by this booking
    const barber = await Barber.findById(booking.barber_id);
    if (barber) {
      const dateAvailability = barber.availability.find(
        av => new Date(av.date).toDateString() === new Date(booking.date).toDateString()
      );

      if (dateAvailability) {
        // Get all slots that were booked for this booking
        const slotsToBook = getSlotsToBook(
          dateAvailability.slots,
          booking.slot_time,
          booking.total_duration
        );

        // Free up each slot
        slotsToBook.forEach(slotTime => {
          const slot = dateAvailability.slots.find(s => s.time === slotTime);
          if (slot && slot.bookingId && slot.bookingId.toString() === booking._id.toString()) {
            slot.isBooked = false;
            slot.bookingId = null;
          }
        });

        await barber.save();
      }
    }

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error cancelling booking",
      error: error.message
    });
  }
};
