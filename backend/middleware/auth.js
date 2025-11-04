import { clerkClient } from "@clerk/express";

export const protectAdmin = async (req, res, next) => {
  try {
    // Ensure auth function exists
    if (!req.auth || typeof req.auth !== "function") {
      console.log("No auth function found");
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    // Get userId from auth
    const { userId } = req.auth();
    if (!userId) {
      console.log("No userId found in req.auth()");
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    console.log("UserId from Clerk:", userId);

    // Fetch user from Clerk
    const user = await clerkClient.users.getUser(userId);

    console.log("User fetched successfully:", user.emailAddresses?.[0]?.emailAddress);

    // Attach user to request
    req.user = user;

    // Check admin role
    const userRole = user?.privateMetadata?.role;
    const isAdmin = userRole === "admin";

    if (!isAdmin) {
      console.log("Access denied: User is not admin");
      return res.status(403).json({ 
        success: false, 
        message: "Not authorized - Admin access required" 
      });
    }

    // Admin access granted
    next();
  } catch (error) {
    console.error("Admin auth error:", error.message);
    return res.status(403).json({ success: false, message: "Not authorized" });
  }
};
