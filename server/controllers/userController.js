import mongoose from "mongoose";
import userModel from "../models/userModel.js";

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    console.log("🔍 Checking authentication data:", req.user);

    // Ensure user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const userId = req.user.id; 
    const { jobRole } = req.body;

    // Check uploaded file
    const profilePicture = req.file ? req.file.filename : null;
    console.log("📸 Uploaded Profile Picture:", profilePicture);

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid User ID" });
    }

    // Find user in the database
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update the user profile fields
    if (jobRole) user.jobRole = jobRole;
    if (profilePicture) user.profilePicture = profilePicture;

    await user.save();

    res.status(200).json({ success: true, message: "Profile updated successfully", user });
  } catch (error) {
    console.error("❌ Error updating user profile:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get all users (for admin or listing)
export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error(" Error fetching users:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
