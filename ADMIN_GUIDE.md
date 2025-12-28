# Admin Guide: Managing Barber Working Hours

## Setting Up Part-Time Barbers

This guide shows how administrators can configure barber working hours using the API.

## API Endpoints

Base URL: `http://10.107.204.168:5000/api/barber-availability`

## 1. View Current Working Hours

```http
GET /api/barber-availability/:barberId/working-hours
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "workingDays": [1, 2, 3, 4, 5, 6],
    "dailySchedule": [],
    "defaultStart": "09:00",
    "defaultEnd": "18:00"
  }
}
```

## 2. Update Working Hours

### Example 1: Part-Time Morning Barber (Mon-Fri, 9am-1pm)

```http
PUT /api/barber-availability/:barberId/working-hours
Content-Type: application/json

{
  "workingDays": [1, 2, 3, 4, 5],
  "dailySchedule": [
    {
      "dayOfWeek": 1,
      "shifts": [{ "startTime": "09:00", "endTime": "13:00" }]
    },
    {
      "dayOfWeek": 2,
      "shifts": [{ "startTime": "09:00", "endTime": "13:00" }]
    },
    {
      "dayOfWeek": 3,
      "shifts": [{ "startTime": "09:00", "endTime": "13:00" }]
    },
    {
      "dayOfWeek": 4,
      "shifts": [{ "startTime": "09:00", "endTime": "13:00" }]
    },
    {
      "dayOfWeek": 5,
      "shifts": [{ "startTime": "09:00", "endTime": "13:00" }]
    }
  ],
  "defaultStart": "09:00",
  "defaultEnd": "13:00"
}
```

### Example 2: Part-Time Evening Barber (Mon-Sat, 2pm-8pm)

```http
PUT /api/barber-availability/:barberId/working-hours
Content-Type: application/json

{
  "workingDays": [1, 2, 3, 4, 5, 6],
  "dailySchedule": [
    {
      "dayOfWeek": 1,
      "shifts": [{ "startTime": "14:00", "endTime": "20:00" }]
    },
    {
      "dayOfWeek": 2,
      "shifts": [{ "startTime": "14:00", "endTime": "20:00" }]
    },
    {
      "dayOfWeek": 3,
      "shifts": [{ "startTime": "14:00", "endTime": "20:00" }]
    },
    {
      "dayOfWeek": 4,
      "shifts": [{ "startTime": "14:00", "endTime": "20:00" }]
    },
    {
      "dayOfWeek": 5,
      "shifts": [{ "startTime": "14:00", "endTime": "20:00" }]
    },
    {
      "dayOfWeek": 6,
      "shifts": [{ "startTime": "14:00", "endTime": "20:00" }]
    }
  ],
  "defaultStart": "14:00",
  "defaultEnd": "20:00"
}
```

### Example 3: Weekend Specialist (Fri-Sun, 10am-7pm)

```http
PUT /api/barber-availability/:barberId/working-hours
Content-Type: application/json

{
  "workingDays": [5, 6, 0],
  "dailySchedule": [
    {
      "dayOfWeek": 5,
      "shifts": [{ "startTime": "10:00", "endTime": "19:00" }]
    },
    {
      "dayOfWeek": 6,
      "shifts": [{ "startTime": "10:00", "endTime": "19:00" }]
    },
    {
      "dayOfWeek": 0,
      "shifts": [{ "startTime": "10:00", "endTime": "19:00" }]
    }
  ],
  "defaultStart": "10:00",
  "defaultEnd": "19:00"
}
```

### Example 4: Split Shift (Morning & Evening)

```http
PUT /api/barber-availability/:barberId/working-hours
Content-Type: application/json

{
  "workingDays": [1, 2, 3, 4, 5],
  "dailySchedule": [
    {
      "dayOfWeek": 1,
      "shifts": [
        { "startTime": "09:00", "endTime": "12:00" },
        { "startTime": "17:00", "endTime": "20:00" }
      ]
    },
    {
      "dayOfWeek": 2,
      "shifts": [
        { "startTime": "09:00", "endTime": "12:00" },
        { "startTime": "17:00", "endTime": "20:00" }
      ]
    }
  ],
  "defaultStart": "09:00",
  "defaultEnd": "20:00"
}
```

### Example 5: Full-Time Regular Hours

```http
PUT /api/barber-availability/:barberId/working-hours
Content-Type: application/json

{
  "workingDays": [1, 2, 3, 4, 5, 6],
  "dailySchedule": [],
  "defaultStart": "09:00",
  "defaultEnd": "18:00"
}
```

## 3. Regenerate Availability Slots

After updating working hours, regenerate the availability slots:

```http
POST /api/barber-availability/:barberId/generate-availability
Content-Type: application/json

{
  "days": 30
}
```

**Response:**
```json
{
  "success": true,
  "message": "Availability generated for 30 days",
  "data": {
    "daysGenerated": 30,
    "slotsCreated": 432
  }
}
```

## 4. Check Available Slots for Specific Date

```http
GET /api/barber-availability/:barberId/available-slots?date=2025-12-20&serviceDuration=45
```

**Response:**
```json
{
  "success": true,
  "data": {
    "date": "2025-12-20T00:00:00.000Z",
    "serviceDuration": 45,
    "totalSlots": 16,
    "bookedSlots": 4,
    "availableStartSlots": 8,
    "slots": [
      { "time": "09:00", "isBooked": false },
      { "time": "09:15", "isBooked": false },
      { "time": "09:30", "isBooked": false }
    ]
  }
}
```

## Day of Week Reference

```
0 = Sunday
1 = Monday
2 = Tuesday
3 = Wednesday
4 = Thursday
5 = Friday
6 = Saturday
```

## Time Format

- **Use 24-hour format**: "09:00", "14:30", "20:00"
- Times must be in HH:MM format
- System uses 15-minute intervals

## Complete Workflow

1. **Create/Update Barber Working Hours**
   ```
   PUT /api/barber-availability/:barberId/working-hours
   ```

2. **Generate Availability Slots**
   ```
   POST /api/barber-availability/:barberId/generate-availability
   ```

3. **Verify the Schedule**
   ```
   GET /api/barber-availability/:barberId/working-hours
   GET /api/barber-availability/:barberId/available-slots
   ```

## Using Postman or curl

### curl Example:

```bash
# Get working hours
curl http://10.107.204.168:5000/api/barber-availability/BARBER_ID/working-hours

# Update working hours
curl -X PUT http://10.107.204.168:5000/api/barber-availability/BARBER_ID/working-hours \
  -H "Content-Type: application/json" \
  -d '{
    "workingDays": [1,2,3,4,5],
    "dailySchedule": [
      {"dayOfWeek": 1, "shifts": [{"startTime": "09:00", "endTime": "17:00"}]}
    ]
  }'

# Generate availability
curl -X POST http://10.107.204.168:5000/api/barber-availability/BARBER_ID/generate-availability \
  -H "Content-Type: application/json" \
  -d '{"days": 30}'
```

## Best Practices

1. **Always regenerate slots** after updating working hours
2. **Set default times** as fallback for days without specific schedules
3. **Use consistent time zones** (system uses UTC internally)
4. **Test availability** before going live with new schedules
5. **Communicate changes** to customers about barber availability

## Common Scenarios

### Scenario 1: Barber Goes Part-Time
1. Update `workingDays` to remove certain days
2. Update `dailySchedule` for remaining days
3. Regenerate availability
4. Existing bookings remain, future slots adjusted

### Scenario 2: Extended Hours for Busy Season
1. Update `defaultEnd` to later time
2. Or add evening shifts to `dailySchedule`
3. Regenerate availability
4. New slots become available

### Scenario 3: Adding Break Times
Current implementation doesn't support breaks, but can be simulated:
```json
{
  "dailySchedule": [
    {
      "dayOfWeek": 1,
      "shifts": [
        { "startTime": "09:00", "endTime": "12:00" },
        { "startTime": "13:00", "endTime": "18:00" }
      ]
    }
  ]
}
```

## Troubleshooting

**Issue**: Slots not showing up after update
- **Solution**: Make sure to call generate-availability endpoint

**Issue**: Old bookings conflicting with new hours
- **Solution**: System preserves existing bookings, new schedule applies to future dates

**Issue**: Wrong time zone displayed
- **Solution**: Backend uses 24-hour UTC, frontend converts for display

## Future Admin UI Features

When building an admin interface, consider:
- Visual calendar editor for working hours
- Drag-and-drop shift scheduling
- Bulk updates for multiple barbers
- Preview of generated slots before saving
- Analytics on booking patterns
- Automatic optimal schedule suggestions
