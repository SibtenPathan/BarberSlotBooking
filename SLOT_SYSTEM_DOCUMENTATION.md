# Part-Time Barber Scheduling with 15-Minute Slots

## Overview
This implementation adds support for part-time barbers with custom working hours and 15-minute slot intervals. The system intelligently shows only available slots based on the total service duration.

## Key Features

### 1. **15-Minute Slot System**
- All time slots are now in 15-minute intervals
- Slots are stored in 24-hour format (HH:MM) for consistency
- Frontend displays times in 12-hour format for user convenience

### 2. **Working Hours Configuration**
Barbers can now have custom schedules:
- **Full-time**: Work all days with standard hours (e.g., Mon-Sat, 9am-6pm)
- **Part-time Morning**: Limited morning shifts (e.g., Mon-Fri, 9am-1pm)
- **Part-time Evening**: Evening shifts (e.g., Mon-Sat, 2pm-8pm)
- **Weekend Specialist**: Works only weekends (e.g., Fri-Sun, 10am-7pm)
- **Custom Daily Schedule**: Different hours for different days

### 3. **Smart Slot Availability**
- System checks if consecutive 15-minute slots are available
- Only shows slots where the entire service can be completed
- Example: If services total 45 minutes, system ensures 3 consecutive 15-min blocks are free

### 4. **Multi-Slot Booking**
- When a booking is made, all required consecutive slots are marked as booked
- Each booked slot references the booking ID for tracking
- Canceling a booking frees all associated slots

## Backend Changes

### Models

#### `barber.model.js`
```javascript
workingHours: {
  workingDays: [1, 2, 3, 4, 5, 6], // Days of week (0=Sunday, 6=Saturday)
  dailySchedule: [{
    dayOfWeek: Number,
    shifts: [{
      startTime: "09:00",  // 24-hour format
      endTime: "17:00"
    }]
  }],
  defaultStart: "09:00",
  defaultEnd: "18:00"
},
availability: [{
  date: Date,
  slots: [{
    time: "10:00",  // 24-hour format
    isBooked: Boolean,
    bookingId: ObjectId  // Reference to booking
  }]
}]
```

#### `booking.model.js`
```javascript
{
  slot_time: "10:30",        // Start time (24-hour)
  slot_end_time: "11:15",    // End time (24-hour)
  total_duration: 45,        // Total minutes
  // ... other fields
}
```

### Utilities

#### `backend/utils/slotHelper.js`
Core functions for slot management:
- `generate15MinuteSlots(startTime, endTime)` - Generate 15-min slots
- `hasConsecutiveSlots(slots, startTime, duration)` - Check availability
- `getAvailableStartSlots(allSlots, duration)` - Get valid start times
- `getSlotsToBook(allSlots, startTime, duration)` - Get slots to mark as booked
- `generateDaySlots(workingHours, date)` - Generate slots based on working hours
- `convertTo24Hour(time12h)` / `convertTo12Hour(time24h)` - Time format conversion

### Controllers

#### `booking.controller.js`
Updated to:
- Calculate total service duration
- Validate consecutive slot availability
- Book multiple consecutive slots
- Free all slots on cancellation

#### `barberAvailability.controller.js` (NEW)
Endpoints for managing barber availability:
- `PUT /api/barber-availability/:barberId/working-hours` - Update working hours
- `POST /api/barber-availability/:barberId/generate-availability` - Generate slots
- `GET /api/barber-availability/:barberId/available-slots` - Get available slots for duration
- `GET /api/barber-availability/:barberId/working-hours` - Get current working hours

### Routes

#### `barberAvailability.routes.js` (NEW)
```javascript
router.put("/:barberId/working-hours", updateWorkingHours);
router.post("/:barberId/generate-availability", generateAvailability);
router.get("/:barberId/available-slots", getAvailableSlots);
router.get("/:barberId/working-hours", getWorkingHours);
```

### Seed Data

#### `seedBarbersServices.js`
Updated to:
- Generate 15-minute slots instead of hourly
- Create barbers with different working hour templates
- Generate 30 days of availability
- Include variety of part-time and full-time schedules

## Frontend Changes

### Utilities

#### `app/utils/slotHelper.ts` (NEW)
Helper functions for the frontend:
- `convertTo12Hour(time24)` - Display formatted time
- `hasConsecutiveSlots(slots, startTime, duration)` - Check availability
- `getAvailableStartSlots(allSlots, duration)` - Filter valid start slots
- `calculateTotalDuration(services)` - Sum service durations
- `getSlotDisplayInfo(slot, selectedTime, duration)` - Get display properties

### Screens

#### `BookingScreen.tsx`
Enhanced to:
- Calculate total service duration
- Show only slots that can accommodate full service
- Display 15-minute interval slots in 3-column grid
- Show informative messages about slot availability
- Provide visual feedback for slot status

**Slot Display Logic:**
- **Can Start Here** (Green): Enough consecutive slots available
- **Selected** (Yellow/Primary): User's current selection
- **Insufficient Time** (Gray): Not enough consecutive slots

## API Usage Examples

### 1. Update Barber Working Hours (Admin)
```javascript
PUT /api/barber-availability/:barberId/working-hours
{
  "workingDays": [1, 2, 3, 4, 5],  // Mon-Fri
  "dailySchedule": [
    {
      "dayOfWeek": 1,
      "shifts": [
        { "startTime": "09:00", "endTime": "13:00" }
      ]
    }
  ],
  "defaultStart": "09:00",
  "defaultEnd": "13:00"
}
```

### 2. Generate Availability Slots
```javascript
POST /api/barber-availability/:barberId/generate-availability
{
  "days": 30  // Generate for next 30 days
}
```

### 3. Get Available Slots for Service
```javascript
GET /api/barber-availability/:barberId/available-slots?date=2025-12-20&serviceDuration=45

Response:
{
  "success": true,
  "data": {
    "date": "2025-12-20",
    "serviceDuration": 45,
    "totalSlots": 36,
    "bookedSlots": 12,
    "availableStartSlots": 15,
    "slots": [
      { "time": "09:00", "isBooked": false },
      { "time": "10:30", "isBooked": false },
      // ... more available start times
    ]
  }
}
```

### 4. Create Booking (Automatic Multi-Slot)
```javascript
POST /api/bookings
{
  "user_id": "...",
  "shop_id": "...",
  "barber_id": "...",
  "services": ["serviceId1", "serviceId2"],  // Total: 45 mins
  "date": "2025-12-20",
  "slot_time": "10:30",  // Start time
  "payment": {
    "method": "cash",
    "amount": 45,
    "status": "pending"
  }
}

// System automatically:
// - Calculates total duration (45 mins)
// - Checks 3 consecutive slots (10:30, 10:45, 11:00)
// - Books all 3 slots if available
// - Sets slot_end_time to "11:15"
```

## Testing the Implementation

### 1. Reseed the Database
```bash
cd backend
node seedBarbersServices.js
```

This will create:
- Barbers with different working schedules
- 30 days of 15-minute slots
- Services with varying durations

### 2. Test Scenarios

**Scenario 1: Short Service (20 mins)**
- Select a 20-minute service
- System shows slots needing 2 consecutive 15-min blocks
- More availability throughout the day

**Scenario 2: Long Service (90 mins)**
- Select multiple services totaling 90 minutes
- System shows only slots with 6 consecutive 15-min blocks
- Fewer available options

**Scenario 3: Part-Time Barber**
- Select a morning-only barber
- No slots available after 1 PM
- Different availability per day

**Scenario 4: Booking Completion**
- Book a 45-minute service at 10:30
- Slots 10:30, 10:45, 11:00 all marked as booked
- Other users cannot book conflicting times

### 3. Verify the Changes
```bash
# Start the backend server
cd backend
npm start

# In the app, navigate to:
# 1. Select a shop
# 2. Choose services with different durations
# 3. Select a barber
# 4. Observe available slots change based on total service time
# 5. Create a booking
# 6. Verify multiple slots are marked as booked
```

## Admin Features (Future Enhancement)

To add an admin interface for managing barber working hours:

1. Create admin routes with authentication
2. Build a UI to:
   - Set working days
   - Define shift times per day
   - Preview generated slots
   - Bulk update multiple barbers

Example admin UI components:
- Day selector (checkboxes for Mon-Sun)
- Time pickers for shift start/end
- Preview calendar showing generated slots
- Save/Cancel actions

## Benefits

1. **Flexibility**: Support both full-time and part-time barbers
2. **Accuracy**: 15-minute slots provide precise booking
3. **Efficiency**: Only show truly available slots
4. **User Experience**: Clear visual feedback on availability
5. **Business Logic**: Prevents overbooking and conflicts
6. **Scalability**: Easy to add more working hour templates

## Migration Notes

If you have existing bookings:
1. Existing slots in 12-hour format will be converted to 24-hour
2. Old single-slot bookings will work but won't have multi-slot benefits
3. Consider running a migration script to:
   - Convert existing time formats
   - Calculate slot_end_time for existing bookings
   - Add bookingId references to booked slots

## Conclusion

This implementation provides a robust foundation for managing barber schedules with:
- Flexible working hours
- Fine-grained 15-minute slots
- Intelligent availability checking
- Seamless multi-slot booking

The system is ready for production use and can be extended with admin interfaces for complete schedule management.
