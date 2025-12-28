/**
 * Utility functions for barber slot management
 * Handles 15-minute slot generation and availability checking
 */

/**
 * Generate 15-minute time slots between start and end time
 * @param {string} startTime - Start time in HH:MM format (e.g., "09:00")
 * @param {string} endTime - End time in HH:MM format (e.g., "18:00")
 * @returns {string[]} - Array of time slots in HH:MM format
 */
export const generate15MinuteSlots = (startTime, endTime) => {
  const slots = [];
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  let currentHour = startHour;
  let currentMin = startMin;
  
  while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
    const timeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
    slots.push(timeStr);
    
    // Add 15 minutes
    currentMin += 15;
    if (currentMin >= 60) {
      currentMin = 0;
      currentHour += 1;
    }
  }
  
  return slots;
};

/**
 * Convert time string to minutes since midnight
 * @param {string} time - Time in HH:MM format
 * @returns {number} - Minutes since midnight
 */
export const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Convert minutes since midnight to time string
 * @param {number} minutes - Minutes since midnight
 * @returns {string} - Time in HH:MM format
 */
export const minutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

/**
 * Add minutes to a time string
 * @param {string} time - Time in HH:MM format
 * @param {number} minutes - Minutes to add
 * @returns {string} - New time in HH:MM format
 */
export const addMinutesToTime = (time, minutes) => {
  const totalMinutes = timeToMinutes(time) + minutes;
  return minutesToTime(totalMinutes);
};

/**
 * Check if a barber has consecutive available slots for the required duration
 * @param {Array} slots - Array of slot objects with time and isBooked
 * @param {string} startTime - Desired start time in HH:MM format
 * @param {number} durationMinutes - Required duration in minutes
 * @returns {boolean} - True if consecutive slots are available
 */
export const hasConsecutiveSlots = (slots, startTime, durationMinutes) => {
  // Calculate how many 15-minute slots we need
  const slotsNeeded = Math.ceil(durationMinutes / 15);
  
  // Find the index of the start time
  const startIndex = slots.findIndex(slot => slot.time === startTime);
  
  if (startIndex === -1) {
    return false; // Start time not found
  }
  
  // Check if we have enough slots
  if (startIndex + slotsNeeded > slots.length) {
    return false; // Not enough slots remaining
  }
  
  // Check if all consecutive slots are available
  for (let i = 0; i < slotsNeeded; i++) {
    if (slots[startIndex + i].isBooked) {
      return false; // One of the required slots is booked
    }
  }
  
  return true;
};

/**
 * Get available start times for a booking based on service duration
 * @param {Array} allSlots - All slot objects for the day
 * @param {number} durationMinutes - Required service duration
 * @returns {Array} - Array of available start time slots
 */
export const getAvailableStartSlots = (allSlots, durationMinutes) => {
  const availableSlots = [];
  const slotsNeeded = Math.ceil(durationMinutes / 15);
  
  // Check each slot as a potential start time
  for (let i = 0; i <= allSlots.length - slotsNeeded; i++) {
    const startSlot = allSlots[i];
    
    // Check if this slot and all consecutive slots are available
    let allAvailable = true;
    for (let j = 0; j < slotsNeeded; j++) {
      if (allSlots[i + j].isBooked) {
        allAvailable = false;
        break;
      }
    }
    
    if (allAvailable) {
      availableSlots.push(startSlot);
    }
  }
  
  return availableSlots;
};

/**
 * Get slots that need to be marked as booked for a booking
 * @param {Array} allSlots - All slot objects for the day
 * @param {string} startTime - Start time in HH:MM format
 * @param {number} durationMinutes - Duration in minutes
 * @returns {Array} - Array of slot times that should be marked as booked
 */
export const getSlotsToBook = (allSlots, startTime, durationMinutes) => {
  const slotsNeeded = Math.ceil(durationMinutes / 15);
  const startIndex = allSlots.findIndex(slot => slot.time === startTime);
  
  if (startIndex === -1) {
    return [];
  }
  
  const slotsToBook = [];
  for (let i = 0; i < slotsNeeded; i++) {
    if (startIndex + i < allSlots.length) {
      slotsToBook.push(allSlots[startIndex + i].time);
    }
  }
  
  return slotsToBook;
};

/**
 * Generate availability for a barber based on working hours
 * @param {Object} workingHours - Barber's working hours configuration
 * @param {Date} date - Date to generate slots for
 * @returns {Array} - Array of slot objects
 */
export const generateDaySlots = (workingHours, date) => {
  const dayOfWeek = date.getDay();
  
  // Check if barber works on this day
  if (workingHours.workingDays && !workingHours.workingDays.includes(dayOfWeek)) {
    return []; // Barber doesn't work this day
  }
  
  // Find schedule for this day
  const daySchedule = workingHours.dailySchedule?.find(
    schedule => schedule.dayOfWeek === dayOfWeek
  );
  
  let slots = [];
  
  if (daySchedule && daySchedule.shifts && daySchedule.shifts.length > 0) {
    // Generate slots for each shift
    daySchedule.shifts.forEach(shift => {
      const shiftSlots = generate15MinuteSlots(shift.startTime, shift.endTime);
      slots.push(...shiftSlots);
    });
  } else {
    // Use default working hours
    const startTime = workingHours.defaultStart || "09:00";
    const endTime = workingHours.defaultEnd || "18:00";
    slots = generate15MinuteSlots(startTime, endTime);
  }
  
  // Convert to slot objects
  return slots.map(time => ({
    time,
    isBooked: false,
    bookingId: null
  }));
};

/**
 * Convert 12-hour format to 24-hour format
 * @param {string} time12h - Time in 12-hour format (e.g., "02:30 PM")
 * @returns {string} - Time in 24-hour format (e.g., "14:30")
 */
export const convertTo24Hour = (time12h) => {
  const [time, period] = time12h.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  
  if (period === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

/**
 * Convert 24-hour format to 12-hour format
 * @param {string} time24h - Time in 24-hour format (e.g., "14:30")
 * @returns {string} - Time in 12-hour format (e.g., "02:30 PM")
 */
export const convertTo12Hour = (time24h) => {
  let [hours, minutes] = time24h.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  
  if (hours === 0) {
    hours = 12;
  } else if (hours > 12) {
    hours -= 12;
  }
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;
};
