import Booking from "../models/Booking.js";
import Movie from "../models/Movie.js"; 
import { clerkClient } from "@clerk/express"; 


// API: Get user bookings
export const getUserBookings = async (req, res) => {
  try {
    const user = req.auth().userId;

    if (!user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user found in request." });
    }

    const bookings = await Booking.find({ user })
      .populate({
        path: "show",
        populate: { path: "movie" },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user bookings.",
      error: error.message,
    });
  }
};


// API: Add a favorite movie
export const addFavourite = async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.auth().userId;

    const user = await clerkClient.users.getUser(userId);
    const favorites = user.privateMetadata.favorites || [];

    if (!favorites.includes(movieId)) {
      favorites.push(movieId);
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: { favorites },
      });
    }

    return res.json({
      success: true,
      message: "Favorite movie added successfully",
      favorites,
    });
  } catch (error) {
    console.error("Error adding favourite movie:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add favorite movie.",
      error: error.message,
    });
  }
};


// API: Update favorites (toggle/remove)
export const updateFavourite = async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.auth().userId;

    const user = await clerkClient.users.getUser(userId);
    let favorites = user.privateMetadata.favorites || [];

    if (favorites.includes(movieId)) {
      favorites = favorites.filter((id) => id !== movieId); // Remove if already added
    } else {
      favorites.push(movieId); // Add if not present
    }

    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: { favorites },
    });

    return res.json({
      success: true,
      message: "Favorite movies updated successfully",
      favorites,
    });
  } catch (error) {
    console.error("Error updating favourite movies:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update favorite movies.",
      error: error.message,
    });
  }
};


// API: Get all favorite movies
export const getFavorites = async (req, res) => {
  try {
    const userId = req.auth().userId;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: No user found." });
    }

    const user = await clerkClient.users.getUser(userId);
    const favorites = user.privateMetadata.favorites || [];

    // fetch full movie details from DB
    const favoriteMovies = await Movie.find({ _id: { $in: favorites } });

    return res.status(200).json({
      success: true,
      count: favoriteMovies.length,
      data: favoriteMovies,
    });
  } catch (error) {
    console.error("Error fetching favorite movies:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch favorite movies.",
      error: error.message,
    });
  }
};
