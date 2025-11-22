import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    FirstName: {
      type: String,
      required: false,
      trim: true
    },

    LastName: {
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
