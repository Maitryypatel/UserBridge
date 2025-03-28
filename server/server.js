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

// CORS Middleware (Allows cookies and cross-origin requests)
app.use(
  cors({
    origin: [process.env.CLIENT_URL, "https://user-0tey.onrender.com"], // Add your frontend URL here
    credentials: true, // Allow credentials (cookies)
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-access-token"],
  })
);

// Middleware Order Fix
app.use(cookieParser()); // First, parse cookies
app.use(express.json()); // Parse JSON data
app.use(express.urlencoded({ extended: true })); // Parse form data

// Serve Static Files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Log incoming requests and cookies
app.use((req, res, next) => {
  console.log(` Incoming Request: ${req.method} ${req.url}`);
  console.log("Headers:", req.headers);
  console.log("Cookies:", req.cookies); // Debug cookies
  next();
});

// API Routes
app.get("/", (req, res) => res.send("API is working fine 🚀"));
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/faq", faqRouter);

// Check if JWT_SECRET is properly loaded
if (!process.env.JWT_SECRET) {
  console.error(" JWT_SECRET is missing in environment variables!");
} else {
  console.log("✅ JWT_SECRET is loaded.");
}

// Start Server
app.listen(port, () => console.log(` Server started on port ${port}`));