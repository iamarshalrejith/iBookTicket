import express from "express";
import { 
  getUserBookings, 
  addFavourite, 
  updateFavourite, 
  getFavorites 
} from "../controllers/userController.js";


const userRouter = express.Router();


// Get all bookings of a user
userRouter.get("/bookings", getUserBookings);

// Add a movie to favorites
userRouter.post("/favorites/add", addFavourite);

// Toggle or update favorites
userRouter.put("/favorites/update", updateFavourite);

//  Get all favorite movies
userRouter.get("/favorites",  getFavorites);

export default userRouter;
