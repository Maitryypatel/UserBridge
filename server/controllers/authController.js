import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ success: false, message: "Missing Details" });
  }

  try {
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new userModel({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Sending welcome email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to User Management Portal",
      text: `Welcome to User Management Portal. Your account has been created with email ID: ${email}`,
    };

    await transporter.sendMail(mailOptions);

    return res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      message: "Email and password are required",
    });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true, message: "Login successful" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Send verification OTP to the user's email
export const sendVerifyOtp = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.isAccountVerified) {
      return res.json({ success: false, message: "Account Already Verified" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000)); // Generate 6-digit OTP

    user.VerifyOtp = otp;
    user.verifyOtpexpireAt = Date.now() + 24 * 60 * 60 * 1000; // Fix expiry time to 24 hours

    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      text: `Your OTP is ${otp}. Verify your account using this OTP.`,
    };

    await transporter.sendMail(mailOption);
    res.json({ success: true, message: "Verification OTP sent to Email" });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Verify email
export const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    return res.json({ success: false, message: "Missing Details" });
  }

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    console.log("Stored OTP:", user.VerifyOtp);  // Log the stored OTP
    console.log("Entered OTP:", otp);  // Log the entered OTP

    // Check if OTP is present and valid
    if (!user.VerifyOtp || String(user.VerifyOtp) !== String(otp)) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    // Check if OTP is expired
    if (user.verifyOtpexpireAt && user.verifyOtpexpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP Expired" });
    }

    // Successfully verified, update user status
    user.isAccountVerified = true;
    user.VerifyOtp = null; // Clear the OTP after successful verification
    user.verifyOtpexpireAt = null; // Clear the expiration time

    await user.save();
    return res.json({ success: true, message: "Email verified successfully" });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Check if user is authenticated
export const isAuthenticated = async (req, res) => {
  try {
    console.log("Cookies:", req.cookies); // 🟢 Check if token exists

    const token = req.cookies.token;
    if (!token) {
      console.log("❌ No token found in cookies!");
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔹 Decoded Token:", decoded); // 🟢 Check decoded user ID

    const user = await userModel.findById(decoded.id).select("-password");
    if (!user) {
      console.log("❌ User not found in DB!");
      return res.status(404).json({ success: false, message: "User not found" });
    }

    console.log("✅ Authenticated User:", user); // 🟢 User exists!

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("❌ Auth Error:", error.message);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};



// Send password reset OTP
export const sendResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({ success: false, message: "email is required" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000)); // Generate 6-digit OTP

    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; // 15 minutes expiry

    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password reset OTP",
      text: `Your OTP for resetting your password is ${otp}. Use this OTP to proceed with resetting your password.`,
    };

    await transporter.sendMail(mailOption);

    return res.json({ success: true, message: "OTP sent to your email" });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Reset user password
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.json({ success: false, message: "Email, OTP, and new password are required" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.resetOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP Expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;

    await user.save();

    return res.json({ success: true, message: "Password has been reset successfully" });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
