/**
 * Frontend utility functions for slot management
 */

/**
 * Convert 24-hour time to 12-hour format for display
 */
export const convertTo12Hour = (time24: string): string => {
  const [hoursStr, minutesStr] = time24.split(':');
  let hours = parseInt(hoursStr);
  const minutes = minutesStr;
  const period = hours >= 12 ? 'PM' : 'AM';
  
  if (hours === 0) {
    hours = 12;
  } else if (hours > 12) {
    hours -= 12;
  }
  
  return `${String(hours).padStart(2, '0')}:${minutes} ${period}`;
};

/**
 * Convert 12-hour time to 24-hour format
 */
export const convertTo24Hour = (time12: string): string => {
  const [time, period] = time12.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  
  if (period === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

/**
 * Check if consecutive slots are available for the service duration
 */
export const hasConsecutiveSlots = (
  slots: { time: string; isBooked: boolean }[],
  startTime: string,
  durationMinutes: number
): boolean => {
  const slotsNeeded = Math.ceil(durationMinutes / 15);
  const startIndex = slots.findIndex(slot => slot.time === startTime);
  
  if (startIndex === -1 || startIndex + slotsNeeded > slots.length) {
    return false;
  }
  
  for (let i = 0; i < slotsNeeded; i++) {
    if (slots[startIndex + i].isBooked) {
      return false;
    }
  }
  
  return true;
};

/**
 * Get available start slots based on service duration
 */
export const getAvailableStartSlots = (
  allSlots: { time: string; isBooked: boolean }[],
  durationMinutes: number
): { time: string; isBooked: boolean }[] => {
  const availableSlots = [];
  const slotsNeeded = Math.ceil(durationMinutes / 15);
  
  for (let i = 0; i <= allSlots.length - slotsNeeded; i++) {
    let allAvailable = true;
    
    for (let j = 0; j < slotsNeeded; j++) {
      if (allSlots[i + j].isBooked) {
        allAvailable = false;
        break;
      }
    }
    
    if (allAvailable) {
      availableSlots.push(allSlots[i]);
    }
  }
  
  return availableSlots;
};

/**
 * Calculate total duration of services
 */
export const calculateTotalDuration = (services: { duration: number }[]): number => {
  return services.reduce((sum, service) => sum + service.duration, 0);
};

/**
 * Get slot details for display
 */
export const getSlotDisplayInfo = (
  slot: { time: string; isBooked: boolean },
  selectedTime: string | null,
  durationMinutes: number
): {
  status: 'available' | 'selected' | 'booked';
  displayTime: string;
  statusText: string;
  colorClass: string;
  iconName: string;
} => {
  const isBooked = slot.isBooked;
  const isSelected = slot.time === selectedTime;
  
  let status: 'available' | 'selected' | 'booked';
  let statusText: string;
  let colorClass: string;
  let iconName: string;
  
  if (isBooked) {
    status = 'booked';
    statusText = 'BOOKED';
    colorClass = 'red';
    iconName = 'event-busy';
  } else if (isSelected) {
    status = 'selected';
    statusText = 'SELECTED';
    colorClass = 'primary';
    iconName = 'check-circle';
  } else {
    status = 'available';
    statusText = 'AVAILABLE';
    colorClass = 'green';
    iconName = 'access-time';
  }
  
  return {
    status,
    displayTime: convertTo12Hour(slot.time),
    statusText,
    colorClass,
    iconName
  };
};
