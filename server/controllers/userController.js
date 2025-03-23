import mongoose from "mongoose";
import userModel from "../models/userModel.js";

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    console.log("🔍 Checking authentication data:", req.user);

    // Ensure user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "User not authenticated. Please log in again." });
    }

    const userId = req.user.id;
    const { name, jobRole } = req.body;

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
    if (name) user.name = name;
    if (jobRole) user.jobRole = jobRole;
    if (profilePicture) user.profilePicture = profilePicture;

    await user.save();

    // Return updated user data (excluding sensitive fields like password)
    const updatedUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      jobRole: user.jobRole,
    };

    res.status(200).json({ success: true, message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("❌ Error updating user profile:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get all users (for admin or listing)
export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({}).select("-password"); // Exclude passwords
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};