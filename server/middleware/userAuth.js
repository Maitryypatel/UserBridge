import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  try {
    console.log("🔍 Checking user authentication...");
    console.log(" Headers:", req.headers);
    console.log(" Cookies:", req.cookies);

    // Extract token from cookies or Authorization header
    let token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      console.warn("❌ No token found! User not authorized.");
      return res.status(401).json({ success: false, message: "Not Authorized. Please login again." });
    }

    console.log("✅ Received Token:", token);

    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET is missing in environment variables!");
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }

    try {
      // Verify token
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ Decoded Token:", decodedToken);

      if (!decodedToken?.id) {
        console.warn("❌ Invalid token - No user ID found!");
        return res.status(401).json({ success: false, message: "Invalid Token. Please login again." });
      }

      // Attach user data to request
      req.user = decodedToken;
      console.log("✅ User Authenticated:", req.user);

      next(); // Proceed to next middleware
    } catch (error) {
      console.error("❌ Token Verification Error:", error.message);

      // Handle specific JWT errors
      let errorMessage = "Invalid Token. Please login again.";
      if (error.name === "TokenExpiredError") {
        errorMessage = "Session Expired. Please login again.";
      } else if (error.name === "JsonWebTokenError") {
        errorMessage = "Invalid Token. Please login again.";
      }

      return res.status(401).json({ success: false, message: errorMessage });
    }
  } catch (error) {
    console.error("❌ Authentication Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export default userAuth;