import dotenv from "dotenv";
import mongoose from "mongoose";
import Shop from "./models/shop.model.js";
import User from "./models/user.model.js";

dotenv.config();

const sampleShops = [
  {
    shopName: "The Sharp Edge",
    description: "Professional barbershop with experienced stylists. Specializing in modern cuts and classic styles.",
    location: {
      address: "123 Main Street",
      city: "Mumbai",
      lat: 19.0760,
      long: 72.8777
    },
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA3D8F9l8FvDoV4B_05vH1bzsYgzHf8NphOgN_WQJSgNKJhTXlKSb_4yZlC-f9-Hu_TbeZMVtzFnHTEB9eUbhy_FZbXILi-mbTAbBOuyfTiYFxl3_YxWk33HiNtXDM5CFz9xdLZceohQ4bOEa4kHfClRCQPneiSqOYTIlQHgMb5U7ndDciNMPavL6c6m9ywauKylCt05V6ngZIZR-r7braB1NoDrdlJ2_YSTjYLTTc7sTn5c8JGFN4RgfqgCqhVVtczuktSETnojkGE"
    ],
    openTime: "09:00",
    closeTime: "21:00",
    closeDays: ["Sunday"],
    isVerified: true
  },
  {
    shopName: "Fade Masters",
    description: "Premium barbershop offering the latest trends in men's grooming and styling.",
    location: {
      address: "456 Park Avenue",
      city: "Mumbai",
      lat: 19.0896,
      long: 72.8656
    },
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBljOrH48zi8M1M8OqgLRXz0wbTu3nZVICxgKBYwuKlCR-nURKcEajs1zHVHThyNoS0QTXTLLZiZkzq_gR5Y06cT9zKDpryrl26YoTczQRT1i3o-II9Nm0wxslTINEwUMV_P-P7rxrrpU93YvEBnOaGiRsVFDK-G_PRVgA8TxwEbJDFsryJwRWGU-p1uICtgipFvJtXz5IXwKp0mpEmsyrpXQYJRFeGv8aE7D8BLZsirEVw7MjStYz3a_mwULzIPbxdYhSmckw2WGO"
    ],
    openTime: "10:00",
    closeTime: "22:00",
    closeDays: [],
    isVerified: true
  },
  {
    shopName: "Clipper Kings",
    description: "Traditional barbershop with a modern twist. Expert beard trims and haircuts.",
    location: {
      address: "789 Ocean Drive",
      city: "Mumbai",
      lat: 19.1136,
      long: 72.9083
    },
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuApeAMv0-4J1IxkppSN30YATT-by1cRFBX2Wuj78blPuLONgmHZM5Lppt1T0ruT0Z7BQVXra8MkHTeeGWPPsJhYgdwsfK_73ayOYqMO74hD33eIooZkx8P8E3jNz9Amx4AEjD_REivEAvyVhU4L9-w_tpu5kVPKsL_gSe_i0OFEe8YN6vEJUL-L0r-p8pHGWz1NDfXCj1hVE7z5PkzwesnZHxSDNFmGZTFCw_EZ_265jBKCceNpDlPcpKgjck09_vku5qjV_s_4BJEl"
    ],
    openTime: "08:00",
    closeTime: "20:00",
    closeDays: ["Monday"],
    isVerified: true
  },
  {
    shopName: "Style Studio",
    description: "Modern salon offering premium haircuts, styling, and grooming services.",
    location: {
      address: "321 Fashion Street",
      city: "Delhi",
      lat: 28.7041,
      long: 77.1025
    },
    images: [
      "https://via.placeholder.com/300x300?text=Style+Studio"
    ],
    openTime: "09:30",
    closeTime: "21:30",
    closeDays: [],
    isVerified: true
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    // Get the first user as owner (or create a dummy one)
    let owner = await User.findOne();
    
    if (!owner) {
      console.log("⚠️ No users found. Please create a user first through signup.");
      process.exit(1);
    }

    console.log(`Using user ${owner.email} as shop owner`);

    // Clear existing shops
    await Shop.deleteMany({});
    console.log("🗑️ Cleared existing shops");

    // Add owner_id to each shop
    const shopsWithOwner = sampleShops.map(shop => ({
      ...shop,
      owner_id: owner._id
    }));

    // Insert sample shops
    const insertedShops = await Shop.insertMany(shopsWithOwner);
    console.log(`✅ Inserted ${insertedShops.length} sample shops`);

    console.log("\n📋 Sample Shops:");
    insertedShops.forEach((shop, idx) => {
      console.log(`${idx + 1}. ${shop.shopName} - ${shop.location.city}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
