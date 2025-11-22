import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
// import authRoutes from "./routes/auth.routes.js";

dotenv.config();
const app = express();

app.use(express.json());

// DB Connect
connectDB();

// Routes
// app.use("/api/auth", authRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
