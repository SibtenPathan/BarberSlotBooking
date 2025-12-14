import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import barberRoutes from "./routes/barber.routes.js";
import serviceRoutes from "./routes/service.routes.js";
import shopRoutes from "./routes/shop.routes.js";

dotenv.config();
const app = express();

app.use(express.json());

// DB Connect
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/shops", shopRoutes);
app.use("/api/barbers", barberRoutes);
app.use("/api/services", serviceRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));