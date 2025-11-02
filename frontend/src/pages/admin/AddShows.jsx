import React, { useState, useEffect } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import BlurCircle from "../../components/BlurCircle";
import Title from "../../components/admin/Title";
import { dummyShowsData, dummyDashboardData } from "../../assets/assets";
import { kConverter } from "../../lib/kConverter";

const AddShows = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [dateTimeInput, setDateTimeInput] = useState("");
  const [showPrice, setShowPrice] = useState("");
  const [activeShows, setActiveShows] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState([]);

  useEffect(() => {
    setNowPlayingMovies(dummyShowsData);
    setActiveShows(dummyDashboardData.activeShows);
  }, []);

  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
    setDateTimeInput("");
    setShowPrice("");
    setSelectedTimes([]);
  };

  const handleDateTimeChange = (e) => setDateTimeInput(e.target.value);
  const handlePriceChange = (e) => setShowPrice(e.target.value);

  const handleAddTime = () => {
    if (!dateTimeInput) {
      alert("Select a date & time first!");
      return;
    }
    if (selectedTimes.includes(dateTimeInput)) {
      alert("This time is already added!");
      return;
    }
    setSelectedTimes((prev) => [...prev, dateTimeInput]);
    setDateTimeInput("");
  };

  const handleRemoveTime = (time) => {
    setSelectedTimes((prev) => prev.filter((t) => t !== time));
  };

  const handleAddShow = () => {
    if (!selectedMovie || selectedTimes.length === 0 || !showPrice) {
      alert("Please select movie, date/time(s) and set a price!");
      return;
    }

    const newShows = selectedTimes.map((time) => ({
      _id: Math.random().toString(36).substring(2, 9),
      movie: selectedMovie,
      showDateTime: time,
      showPrice: Number(showPrice),
      occupiedSeats: {},
    }));

    setActiveShows((prev) => [...prev, ...newShows]);
    alert(`Show(s) for "${selectedMovie.title}" added successfully!`);
    setSelectedMovie(null);
    setDateTimeInput("");
    setShowPrice("");
    setSelectedTimes([]);
  };

  if (nowPlayingMovies.length === 0) return <LoadingSpinner />;

  return (
    <div className="add-shows-container">
      <Title text1="Add" text2="Shows" />

      {/* ---------------- Movies Cards ---------------- */}
      <p className="mt-4 mb-2 text-white font-medium">Now Playing Movies</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {nowPlayingMovies.map((movie) => (
          <div
            key={movie.id}
            onClick={() => handleMovieSelect(movie)}
            className={`cursor-pointer bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden shadow-lg transition hover:bg-white/20 ${
              selectedMovie?.id === movie.id ? "border-blue-400" : ""
            }`}
          >
            <img
              src={movie.poster_path}
              alt={movie.title}
              className="w-full h-52 object-cover"
            />
            <div className="p-3 text-white text-center">
              <h3 className="text-base font-semibold truncate">{movie.title}</h3>
              <div className="flex justify-center items-center gap-2 mt-1 text-xs text-yellow-400">
                <span>⭐ {movie.vote_average.toFixed(1)}</span>
                <span>({kConverter(movie.vote_count)})</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ---------------- Add Show Form ---------------- */}
      {selectedMovie && (
        <div className="show-form mt-8 backdrop-blur-3xl p-6 rounded-xl border border-white/20 w-full max-w-lg">
          <h3 className="text-xl font-semibold text-white mb-4">
            Add Show for: {selectedMovie.title}
          </h3>

          {/* Existing Shows */}
          <div className="mb-4">
            <h4 className="text-primary font-medium mb-2">Existing Shows:</h4>
            <ul className="text-gray-300">
              {activeShows
                .filter((show) => show.movie.id === selectedMovie.id)
                .sort(
                  (a, b) => new Date(a.showDateTime) - new Date(b.showDateTime)
                )
                .map((show) => (
                  <li key={show._id}>
                    {new Date(show.showDateTime).toLocaleString()} - {currency}
                    {show.showPrice}
                  </li>
                ))}
              {activeShows.filter((show) => show.movie.id === selectedMovie.id)
                .length === 0 && <li>No shows yet.</li>}
            </ul>
          </div>

          {/* Date & Time Input */}
          <label className="block mb-3 text-white font-medium">
            Date & Time:
            <input
              type="datetime-local"
              value={dateTimeInput}
              onChange={handleDateTimeChange}
              className="ml-2 px-3 py-2 rounded-2xl bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:bg-white/30 focus:border-blue-400 focus:outline-none transition"
            />
            <button
              onClick={handleAddTime}
              type="button"
              className="ml-2 px-3 py-2 bg-primary hover:bg-primary-dull text-white rounded-2xl transition"
            >
              Add Time
            </button>
          </label>

          {/* Selected Times */}
          {selectedTimes.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-white mb-1">Selected Dates & Times:</p>
              <div className="flex flex-wrap gap-2">
                {selectedTimes.map((time) => (
                  <div
                    key={time}
                    className="px-3 py-1 bg-white/20 text-white rounded-full flex items-center gap-2 text-xs border border-white/30"
                  >
                    {new Date(time).toLocaleDateString()}{" "}
                    {new Date(time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    <button
                      onClick={() => handleRemoveTime(time)}
                      className="text-red-400 font-bold hover:text-red-500"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Price Input */}
          <label className="block mb-4 text-white font-medium">
            Price ({currency}):
            <input
              type="number"
              value={showPrice}
              onChange={handlePriceChange}
              className="ml-2 px-3 py-2 rounded-2xl bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:bg-white/30 focus:border-blue-400 focus:outline-none transition"
            />
          </label>

          <button
            onClick={handleAddShow}
            className="bg-red-500/30 hover:bg-primary/20 text-white font-semibold py-2 px-4 rounded cursor-pointer"
          >
            Add Show
          </button>
        </div>
      )}

      <BlurCircle left="50px" top="50px" />
      <BlurCircle right="50px" top="200px" />
    </div>
  );
};

export default AddShows;
