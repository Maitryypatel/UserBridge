import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Reset = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Step 1: Send OTP to email
  const sendOtp = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:4000/api/auth/send-reset-otp", { email });
      if (response.data.success) {
        toast.success("OTP sent to your email!");
        setStep(2);
      } else {
        toast.error(response.data.message || "Failed to send OTP.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Submit OTP and new password to reset the password
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:4000/api/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      if (response.data.success) {
        toast.success("Password has been reset successfully!");
        navigate("/login"); 
      } else {
        toast.error(response.data.message || "Failed to reset password.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>

        {step === 1 && (
          <div>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              onClick={sendOtp}
              className={`w-full text-white p-2 rounded-md ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
              placeholder="Enter New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button
              onClick={handlePasswordReset}
              className={`w-full text-white p-2 rounded-md ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reset;
