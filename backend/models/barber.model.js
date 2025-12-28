import mongoose from "mongoose";

const barberSchema = new mongoose.Schema(
  {
    // Barber is also a User
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    // Shop where barber works
    shop_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true
    },

    experience: {
      type: Number, // in years
      required: true
    },

    specialization: [
      {
        type: String,
        trim: true
      }
    ],

    profile_image: {
      type: String,
      default: null
    },

    // Working hours configuration (for part-time/full-time barbers)
    workingHours: {
      // Days of week the barber works (0 = Sunday, 6 = Saturday)
      workingDays: [{
        type: Number,
        min: 0,
        max: 6
      }],
      // Working time ranges for each day
      dailySchedule: [{
        dayOfWeek: {
          type: Number, // 0-6
          required: true
        },
        shifts: [{
          startTime: {
            type: String, // e.g. "09:00"
            required: true
          },
          endTime: {
            type: String, // e.g. "17:00"
            required: true
          }
        }]
      }],
      // Default working hours if no specific day schedule
      defaultStart: {
        type: String,
        default: "09:00"
      },
      defaultEnd: {
        type: String,
        default: "18:00"
      }
    },

    // Availability with 15-minute slots
    availability: [
      {
        date: {
          type: Date,
          required: true
        },
        slots: [
          {
            time: {
              type: String, // e.g. "10:00" (24-hour format)
              required: true
            },
            isBooked: {
              type: Boolean,
              default: false
            },
            // Reference to booking that occupies this slot
            bookingId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Booking",
              default: null
            }
          }
        ]
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Barber", barberSchema);
