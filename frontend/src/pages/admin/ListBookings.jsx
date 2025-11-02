import React, { useEffect, useState } from "react";
import { dummyBookingData } from "../../assets/assets";
import Title from "../../components/admin/Title";
import BlurCircle from "../../components/BlurCircle";
import LoadingSpinner from "../../components/LoadingSpinner";

const ListBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API delay
    setTimeout(() => {
      setBookings(dummyBookingData);
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
      <Title text1="List" text2="Bookings" />

      <div className="overflow-x-auto mt-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20">
        <table className="w-full text-sm text-left text-white">
          <thead className="bg-red-500/30 text-white uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4">User Name</th>
              <th className="px-6 py-4">Movie Name</th>
              <th className="px-6 py-4">Show Time</th>
              <th className="px-6 py-4 text-center">Seats</th>
              <th className="px-6 py-4 text-right">Amount</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking, index) => (
              <tr
                key={index}
                className="border-b border-white/10 hover:bg-white/20 transition-colors"
              >
                {/* User */}
                <td className="px-6 py-4 font-medium text-gray-100">
                  {booking.user?.name || "Unknown"}
                </td>

                {/* Movie */}
                <td className="px-6 py-4 font-medium text-gray-100 flex items-center gap-3">
                  <img
                    src={booking.show.movie.poster_path}
                    alt={booking.show.movie.title}
                    className="w-10 h-14 object-cover rounded-md shadow-sm"
                  />
                  {booking.show.movie.title}
                </td>

                {/* Show Time */}
                <td className="px-6 py-4 text-gray-300">
                  {new Date(booking.show.showDateTime).toLocaleString([], {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </td>

                {/* Seats */}
                <td className="px-6 py-4 text-center font-semibold text-blue-400">
                  {booking.bookedSeats.join(", ")}
                </td>

                {/* Amount */}
                <td className="px-6 py-4 text-right font-semibold text-green-400">
                  {currency}
                  {booking.amount.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <BlurCircle bottom="0" left="0" />
      <BlurCircle bottom="0" right="0" />
    </div>
  );
};

export default ListBookings;
