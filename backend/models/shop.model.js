import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
  {
    // Owner of the shop (User)
    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    shopName: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      default: ""
    },

    // Location info
    location: {
      address: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      lat: {
        type: Number,
        required: true
      },
      long: {
        type: Number,
        required: true
      }
    },

    // Shop images
    images: [
      {
        type: String
      }
    ],

    // Barbers working in this shop (Users)
    barbers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    isVerified: {
      type: Boolean,
      default: false
    },

    openTime: {
      type: String, // e.g. "09:00"
      required: true
    },

    closeTime: {
      type: String, // e.g. "21:00"
      required: true
    },

    closeDays: [
      {
        type: String // e.g. ["Sunday"]
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Shop", shopSchema);
