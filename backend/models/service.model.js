import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    // Service belongs to a shop
    shop_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      default: ""
    },

    price: {
      type: Number,
      required: true
    },

    duration: {
      type: Number, // in minutes
      required: true
    },

    image: {
      type: String,
      default: null
    },

    isActive: {
      type: Boolean,
      default: true
    },

    tags: [
      {
        type: String,
        trim: true
      }
    ],

    category: {
      type: String,
      default: "General",
      trim: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Service", serviceSchema);
