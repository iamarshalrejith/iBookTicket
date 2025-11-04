import { clerkClient } from "@clerk/express";

export const protectAdmin = async (req, res, next) => {
  try {
    // Check auth middleware
    if (!req.auth || typeof req.auth !== "function") {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { userId } = req.auth();
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Fetch user data
    const user = await clerkClient.users.getUser(userId);

    // Check role
    if (user?.privateMetadata?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    next(); //  Allow access
  } catch (error) {
    console.error("Admin auth error:", error.message);
    return res.status(403).json({
      success: false,
      message: "Not authorized",
    });
  }
};
