import axios from "axios";
import Movie from "../models/Movie.js";
import Show from "../models/Show.js"; 

//  API: Get "Now Playing" movies from TMDB
export const getNowPlayingMovies = async (req, res) => {
  try {
    const { data } = await axios.get(
      "https://api.themoviedb.org/3/movie/now_playing",
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`, 
        },
      }
    );

    res.status(200).json({
      success: true,
      movies: data.results,
    });
  } catch (error) {
    console.error("Error fetching now playing movies:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// API: Add a new show to database
export const addShow = async (req, res) => {
  try {
    const { movieId, showsInput, showPrice } = req.body;

    if (!movieId || !showsInput || !showPrice) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields (movieId, showsInput, showPrice)",
      });
    }

    let movie = await Movie.findById(movieId);

    //  If movie not in DB, fetch details and add it
    if (!movie) {
      const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
          headers: {
            Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
          },
        }),
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
          headers: {
            Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
          },
        }),
      ]);

      const movieApiData = movieDetailsResponse.data;
      const movieCreditsData = movieCreditsResponse.data;

      const movieDetails = {
        _id: movieId,
        title: movieApiData.title,
        overview: movieApiData.overview,
        poster_path: movieApiData.poster_path,
        backdrop_path: movieApiData.backdrop_path,
        release_date: movieApiData.release_date,
        genres: movieApiData.genres,
        casts: movieCreditsData.cast, // corrected from casts → cast
        original_language: movieApiData.original_language,
        tagline: movieApiData.tagline || "",
        vote_average: movieApiData.vote_average,
      };

      movie = await Movie.create(movieDetails); // add movie to DB
    }

    // Prepare shows for insertion
    const showsToCreate = [];
    showsInput.forEach((show) => {
      const showDate = show.date;
      show.time.forEach((time) => {
        const dateTimeString = `${showDate}T${time}`;
        showsToCreate.push({
          movie: movieId,
          showDateTime: new Date(dateTimeString),
          showPrice,
          occupiedSeats: {},
        });
      });
    });

    //  Insert shows
    if (showsToCreate.length > 0) {
      await Show.insertMany(showsToCreate);
    }

    res.status(200).json({
      success: true,
      message: "Show added successfully",
    });
  } catch (error) {
    console.error("Error adding show:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//  API: Get all upcoming shows
export const getShows = async (req, res) => {
  try {
    const shows = await Show.find({
      showDateTime: { $gte: new Date() }, // only future or current shows
    })
      .populate("movie")
      .sort({ showDateTime: 1 });

    res.status(200).json({
      success: true,
      shows,
    });
  } catch (error) {
    console.error("Error getting shows:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//  API: Get a single show by ID
export const getSingleShow = async (req, res) => {
  try {
    const { movieId } = req.params;

    if (!movieId) {
      return res.status(400).json({
        success: false,
        message: "Movie ID is required",
      });
    }

    const shows = await Show.find({ movie: movieId })
      .populate("movie")
      .sort({ showDateTime: 1 });

    if (shows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No shows found for this movie",
      });
    }

    res.status(200).json({
      success: true,
      shows,
    });
  } catch (error) {
    console.error("Error getting shows for movie:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
