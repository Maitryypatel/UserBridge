import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import faqRouter from "./routes/faqRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

// Connect to MongoDB
connectDB();

// Create "uploads" directory if it doesn't exist
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// CORS Middleware (Must be first)
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE"], 
    allowedHeaders: ["Content-Type", "Authorization"], 
  })
);

// Middleware Order Fix
app.use(cookieParser()); // Use this first
app.use(express.json()); // Parses JSON data
app.use(express.urlencoded({ extended: true })); // Parses form data

// Serve Static Files Correctly
app.use("/uploads", express.static(path.resolve("uploads")));

// Routes
app.get("/", (req, res) => res.send("API is working fine "));
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/faq", faqRouter);

// Start Server
app.listen(port, () => console.log(` Server started on) port ${port}`));
