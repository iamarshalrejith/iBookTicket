import React, { useEffect, useState } from "react";
import { dummyDashboardData } from "../../assets/assets";
import Title from "../../components/admin/Title";
import BlurCircle from "../../components/BlurCircle";
import LoadingSpinner from "../../components/LoadingSpinner";

const ListShows = () => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API delay
    setTimeout(() => {
      setShows(dummyDashboardData.activeShows);
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="relative p-6 min-h-screen">
      <BlurCircle top="0" left="0" />
      <BlurCircle top="0" right="0" />
      <Title text1="List" text2="Shows" />

      <div className="overflow-x-auto mt-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20">
        <table className="w-full text-sm text-left text-white">
          <thead className="bg-red-500/30 text-white uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4">Movie Name</th>
              <th className="px-6 py-4">Show Time</th>
              <th className="px-6 py-4 text-center">Total Bookings</th>
              <th className="px-6 py-4 text-right">Earnings</th>
            </tr>
          </thead>
          <tbody>
            {shows.map((show) => {
              const totalBookings = Object.keys(
                show.occupiedSeats || {}
              ).length;
              const earnings = totalBookings * show.showPrice;

              return (
                <tr
                  key={show._id}
                  className="border-b border-white/10 hover:bg-white/20 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-100 flex items-center gap-3">
                    <img
                      src={show.movie.poster_path}
                      alt={show.movie.title}
                      className="w-10 h-14 object-cover rounded-md shadow-sm"
                    />
                    {show.movie.title}
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {new Date(show.showDateTime).toLocaleString([], {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="px-6 py-4 text-center font-semibold text-blue-400">
                    {totalBookings}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-green-400">
                    {currency}
                    {earnings.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <BlurCircle bottom="0" left="0" />
      <BlurCircle bottom="0" right="0" />
    </div>
  );
};

export default ListShows;
