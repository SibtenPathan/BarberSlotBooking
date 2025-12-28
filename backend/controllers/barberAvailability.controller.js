import Barber from "../models/barber.model.js";
import { generateDaySlots, getAvailableStartSlots } from "../utils/slotHelper.js";

/**
 * Update barber working hours
 * This allows admin to set part-time or full-time schedules
 */
export const updateWorkingHours = async (req, res) => {
  try {
    const { barberId } = req.params;
    const { workingDays, dailySchedule, defaultStart, defaultEnd } = req.body;

    const barber = await Barber.findById(barberId);
    if (!barber) {
      return res.status(404).json({
        success: false,
        message: "Barber not found"
      });
    }

    // Update working hours
    barber.workingHours = {
      workingDays: workingDays || barber.workingHours?.workingDays || [1, 2, 3, 4, 5, 6], // Mon-Sat
      dailySchedule: dailySchedule || barber.workingHours?.dailySchedule || [],
      defaultStart: defaultStart || barber.workingHours?.defaultStart || "09:00",
      defaultEnd: defaultEnd || barber.workingHours?.defaultEnd || "18:00"
    };

    await barber.save();

    res.status(200).json({
      success: true,
      message: "Working hours updated successfully",
      data: barber.workingHours
    });
  } catch (error) {
    console.error("Update Working Hours Error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating working hours",
      error: error.message
    });
  }
};

/**
 * Generate availability slots for a barber for the next N days
 * based on their working hours
 */
export const generateAvailability = async (req, res) => {
  try {
    const { barberId } = req.params;
    const { days = 30 } = req.body; // Generate for next 30 days by default

    const barber = await Barber.findById(barberId);
    if (!barber) {
      return res.status(404).json({
        success: false,
        message: "Barber not found"
      });
    }

    // Clear existing future availability
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    barber.availability = barber.availability.filter(av => {
      const avDate = new Date(av.date);
      avDate.setHours(0, 0, 0, 0);
      return avDate < today; // Keep past dates for historical data
    });

    // Generate availability for next N days
    const newAvailability = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      date.setHours(0, 0, 0, 0);

      // Generate slots based on working hours
      const slots = generateDaySlots(barber.workingHours || {}, date);

      if (slots.length > 0) {
        newAvailability.push({
          date,
          slots
        });
      }
    }

    barber.availability.push(...newAvailability);
    await barber.save();

    res.status(200).json({
      success: true,
      message: `Availability generated for ${days} days`,
      data: {
        daysGenerated: days,
        slotsCreated: newAvailability.reduce((sum, av) => sum + av.slots.length, 0)
      }
    });
  } catch (error) {
    console.error("Generate Availability Error:", error);
    res.status(500).json({
      success: false,
      message: "Error generating availability",
      error: error.message
    });
  }
};

/**
 * Get available slots for a specific barber, date, and service duration
 * Only returns slots where consecutive availability exists for the full duration
 */
export const getAvailableSlots = async (req, res) => {
  try {
    const { barberId } = req.params;
    const { date, serviceDuration } = req.query;

    if (!date || !serviceDuration) {
      return res.status(400).json({
        success: false,
        message: "Date and service duration are required"
      });
    }

    const barber = await Barber.findById(barberId);
    if (!barber) {
      return res.status(404).json({
        success: false,
        message: "Barber not found"
      });
    }

    const requestedDate = new Date(date);
    const dateAvailability = barber.availability.find(
      av => new Date(av.date).toDateString() === requestedDate.toDateString()
    );

    if (!dateAvailability) {
      return res.status(200).json({
        success: true,
        data: {
          availableSlots: [],
          message: "No availability for this date"
        }
      });
    }

    // Get slots that can accommodate the service duration
    const availableSlots = getAvailableStartSlots(
      dateAvailability.slots,
      parseInt(serviceDuration)
    );

    res.status(200).json({
      success: true,
      data: {
        date: requestedDate,
        serviceDuration: parseInt(serviceDuration),
        totalSlots: dateAvailability.slots.length,
        bookedSlots: dateAvailability.slots.filter(s => s.isBooked).length,
        availableStartSlots: availableSlots.length,
        slots: availableSlots
      }
    });
  } catch (error) {
    console.error("Get Available Slots Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching available slots",
      error: error.message
    });
  }
};

/**
 * Get barber's working hours configuration
 */
export const getWorkingHours = async (req, res) => {
  try {
    const { barberId } = req.params;

    const barber = await Barber.findById(barberId);
    if (!barber) {
      return res.status(404).json({
        success: false,
        message: "Barber not found"
      });
    }

    res.status(200).json({
      success: true,
      data: barber.workingHours || {
        workingDays: [1, 2, 3, 4, 5, 6],
        dailySchedule: [],
        defaultStart: "09:00",
        defaultEnd: "18:00"
      }
    });
  } catch (error) {
    console.error("Get Working Hours Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching working hours",
      error: error.message
    });
  }
};
