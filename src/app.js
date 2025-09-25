import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import taskRoutes from "./routes/taskRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import logger from "./middleware/logger.js";
import corsMiddleware from "./middleware/cors.js"; 
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(corsMiddleware);
app.use(logger);
console.log("JWT_SECRET =", process.env.JWT_SECRET);
// Routes
app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);

// Error handler
app.use(errorHandler);

export default app;
