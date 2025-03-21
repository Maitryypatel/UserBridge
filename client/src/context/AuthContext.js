import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();
const API_URL = process.env.REACT_APP_API_URL || "https://userbridge-2.onrender.com";

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Check Authentication Status
  const checkAuthStatus = useCallback(async () => {
    setLoading(true);
    try {
      console.log("🔍 Checking authentication...");
      const res = await axios.post(
        `${API_URL}/api/auth/is-auth`,
        {},
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("✅ Auth API Response:", res.status, res.data);

      if (res.data.success) {
        setIsAuthenticated(true);
        setUser(res.data.user);
      } else {
        console.warn("⚠️ Authentication failed:", res.data.message);
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error("❌ Auth check failed:", error?.response?.data?.message || "Network error.");
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // ✅ Login Function
  const login = useCallback(
    async (email, password) => {
      try {
        console.log("🔑 Attempting login...");
        const res = await axios.post(
          `${API_URL}/api/auth/login`,
          { email, password },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );

        console.log("✅ Login Response:", res.data);

        if (res.data.success) {
          setIsAuthenticated(true);
          setUser(res.data.user);
          navigate("/");
        }

        return res.data;
      } catch (error) {
        console.error("❌ Login failed:", error?.response?.data?.message || "Network error.");
        return {
          success: false,
          message: error?.response?.data?.message || "Login failed. Please try again.",
        };
      }
    },
    [navigate]
  );

  // ✅ Register Function
  const register = useCallback(
    async (name, email, password) => {
      try {
        console.log("📝 Attempting registration...");
        const res = await axios.post(
          `${API_URL}/api/auth/register`,
          { name, email, password },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );

        console.log("✅ Register Response:", res.data);

        if (res.data.success) {
          setIsAuthenticated(true);
          setUser(res.data.user);
          navigate("/");
        }

        return res.data;
      } catch (error) {
        console.error("❌ Registration failed:", error?.response?.data?.message || "Network error.");
        return {
          success: false,
          message: error?.response?.data?.message || "Registration failed. Please try again.",
        };
      }
    },
    [navigate]
  );

  // ✅ Logout Function
  const logout = useCallback(async () => {
    try {
      console.log("🚪 Logging out...");
      await axios.post(
        `${API_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );

      setIsAuthenticated(false);
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("❌ Logout failed:", error?.response?.data?.message || "Network error.");
    }
  }, [navigate]);

  // ✅ Update Profile Function
  const updateProfile = useCallback(
    async (updatedData) => {
      try {
        console.log("📝 Updating profile...");
        const res = await axios.put(
          `${API_URL}/api/user/update-profile`,
          updatedData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": updatedData instanceof FormData ? "multipart/form-data" : "application/json",
            },
          }
        );

        console.log("✅ Update Profile Response:", res.data);

        if (res.data.success) {
          setUser(res.data.user);
          return { success: true, message: "Profile updated successfully!" };
        } else {
          console.warn("⚠️ Profile update failed:", res.data.message);
          return { success: false, message: res.data.message || "Profile update failed." };
        }
      } catch (error) {
        console.error("❌ Profile update error:", error?.response?.data?.message || "Network error.");
        return {
          success: false,
          message: error?.response?.data?.message || "Profile update failed.",
        };
      }
    },
    []
  );

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        setUser,
        login,
        register,
        logout,
        updateProfile,
        loading,
        checkAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
