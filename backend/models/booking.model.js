import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    // Who booked
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // Shop where booking is made
    shop_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true
    },

    // Assigned barber
    barber_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Barber",
      required: true
    },

    // Selected services (can be multiple)
    services: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true
    }],

    // Booking date
    date: {
      type: Date,
      required: true
    },

    // Slot time
    slot_time: {
      type: String, // e.g. "10:30 AM"
      required: true
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending"
    },

    // Payment details
    payment: {
      method: {
        type: String,
        enum: ["cash", "upi", "card", "online"],
        required: true
      },
      amount: {
        type: Number,
        required: true
      },
      status: {
        type: String,
        enum: ["pending", "paid", "refunded"],
        default: "pending"
      }
    }
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
