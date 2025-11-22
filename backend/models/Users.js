import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    phone: {
      type: String,
      required: true,
      unique: true
    },

    passwordHash: {
      type: String,
      required: true
    },

    profileImage: {
      type: String,
      default: null
    },

    // For connecting favorites in the app
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop"
      }
    ],

    // If the user has any active booking
    currentBooking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null
    },

    bookingHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking"
      }
    ],

    // Role system if needed later
    role: {
      type: String,
      enum: ["user", "admin", "barber"],
      default: "user"
    },

    // OTP verification fields (optional but useful)
    isVerified: {
      type: Boolean,
      default: false
    },

    otp: {
      code: String,
      expiresAt: Date
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
