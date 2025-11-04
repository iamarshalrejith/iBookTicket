import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import User from "../models/User.js";

// API: Check if user is admin (WITH DEBUG LOGS)
export const isAdmin = async (req, res) => {
  try {
    console.log("=== IS ADMIN CHECK ===");
    console.log("User ID:", req.user?.id);
    console.log("Email:", req.user?.emailAddresses?.[0]?.emailAddress);
    console.log("Private Metadata:", JSON.stringify(req.user?.privateMetadata, null, 2));
    console.log("Role from metadata:", req.user?.privateMetadata?.role);
    
    const isAdmin = req.user?.privateMetadata?.role === "admin";
    
    console.log("Is Admin Result:", isAdmin);
    console.log("=====================");
    
    res.json({ success: true, isAdmin });
  } catch (error) {
    console.error("Error checking admin:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DEBUG ENDPOINT - Add this temporarily
export const debugUser = async (req, res) => {
  try {
    console.log("=== DEBUG USER ENDPOINT ===");
    console.log("Full User Object:", JSON.stringify(req.user, null, 2));
    console.log("========================");
    
    res.json({
      success: true,
      debug: {
        userId: req.user?.id,
        email: req.user?.emailAddresses?.[0]?.emailAddress,
        privateMetadata: req.user?.privateMetadata,
        publicMetadata: req.user?.publicMetadata,
        unsafeMetadata: req.user?.unsafeMetadata,
      }
    });
  } catch (error) {
    console.error("Debug error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API : get all shows
export const getAllShows = async (req, res) => {
  try {
    const shows = await Show.find({})
      .populate("movie")
      .sort({ showDatetime: 1 });

    res.json({
      success: true,
      shows,
    });
  } catch (error) {
    console.error("Error fetching shows:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// API: Get dashboard data
export const getDashboardData = async (req, res) => {
  try {
    const bookings = await Booking.find({ isPaid: true });
    const activeShows = await Show.find({
      showDatetime: { $gte: new Date() },
    }).populate("movie");

    const totalUsers = await User.countDocuments();

    const dashboardData = {
      totalBookings: bookings.length,
      totalRevenue: bookings.reduce((acc, booking) => acc + booking.amount, 0),
      activeShows,
      totalUsers,
    };

    res.json({
      success: true,
      dashboardData,
    });
  } catch (error) {
    console.error("Error getting dashboard data:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// API: Get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate("user")
      .populate({
        path: "show",
        populate: {
          path: "movie",
        },
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};