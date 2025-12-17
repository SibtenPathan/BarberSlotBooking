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

    // Availability with slots
    availability: [
      {
        date: {
          type: Date,
          required: true
        },
        slots: [
          {
            time: {
              type: String, // e.g. "10:00 AM"
              required: true
            },
            isBooked: {
              type: Boolean,
              default: false
            }
          }
        ]
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Barber", barberSchema);
