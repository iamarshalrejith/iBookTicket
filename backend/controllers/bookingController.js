import Show from "../models/Show.js";
import Booking from "../models/Booking.js";

//  Function to check availability of selected seats for a show
const checkSeatsAvailability = async (showId, selectedSeats) => {
  try {
    const showData = await Show.findById(showId);
    if (!showData) return false;

    const occupiedSeats = showData.occupiedSeats || {};
    const isAnySeatTaken = selectedSeats.some((seat) => occupiedSeats[seat]);
    return !isAnySeatTaken;
  } catch (error) {
    console.error("Seat check error:", error.message);
    return false;
  }
};

// API: Create a new booking
export const createBooking = async (req, res) => {
  try {
    // Extract data
    const { userId } = req.auth(); // assumes auth middleware attaches user info
    const { showId, selectedSeats } = req.body;

    if (!showId || !selectedSeats || selectedSeats.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Show ID and selected seats are required",
      });
    }

    //  Check seat availability
    const isAvailable = await checkSeatsAvailability(showId, selectedSeats);
    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message: "One or more selected seats are already booked",
      });
    }

    //  Get show details
    const showData = await Show.findById(showId).populate("movie");
    if (!showData) {
      return res.status(404).json({
        success: false,
        message: "Show not found",
      });
    }

    //  Calculate total amount
    const amount = showData.showPrice * selectedSeats.length;

    // Create booking record
    const booking = await Booking.create({
      user: userId,
      show: showId,
      amount,
      bookedSeats: selectedSeats,
    });

    selectedSeats.map((seat) => {
      showData.occupiedSeats[seat] = userId;
    });
    showData.markModified("occupiedSeats");
    await showData.save();

    // Stripe Gateway init

    //  Return success response
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Error creating booking:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOccupiedSeats = async (req, res) => {
  try {
    const { showId } = req.params;
    const showData = await Show.findById(showId);

    const occupiedSeats = Object.keys(showData.occupiedSeats);
    res.json({
      success: true,
      message: error.message,
    });
  } catch (error) {
    console.error("Error getting occupiedSeats:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
