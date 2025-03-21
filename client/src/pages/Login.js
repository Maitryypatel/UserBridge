import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        //"http://localhost:4000/api/auth/login"
        "https://userbridge-2.onrender.com/api/auth/login",

        { email, password },
        { withCredentials: true }
      );

      if (response.data.success) {
        await login(email, password);
        toast.success("Login successful!");
        navigate("/");
      } else {
        toast.error(response.data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Email:</label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password:</label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full text-white p-2 rounded-md ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </p>
        <p className="mt-4 text-center">
          Forgot password?{" "}
          <Link to="/reset-password" className="text-blue-500 hover:underline">
            Reset it here
          </Link>
        </p>
      </div>
    </div>
  );
}
