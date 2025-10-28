import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { dummyDateTimeData, dummyShowsData, dummyDashboardData } from "../assets/assets";
import LoadingSpinner from "../components/LoadingSpinner";
import { ClockIcon } from "lucide-react";
import isoTimeFormat from "../lib/isoTimeFormat";
import BlurCircle from "../components/BlurCircle";
import { toast } from "react-hot-toast";

const SeatLayout = () => {
  const { id, date } = useParams();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [show, setShow] = useState(null);

  const navigate = useNavigate();

  // Fetch show based on ID
  const getShow = async () => {
    const foundShow = dummyShowsData.find((show) => show._id === id);
    if (foundShow) {
      setShow({
        movie: foundShow,
        dateTime: dummyDateTimeData,
      });
    } else {
      toast.error("Show not found");
    }
  };

  useEffect(() => {
    getShow();
  }, [id]);

  // Get occupied seats if selected time exists
  const getOccupiedSeats = () => {
    if (!selectedTime) return [];
    const activeShow = dummyDashboardData.activeShows.find(
      (s) => s.movie._id === id && s.showDateTime === selectedTime.time
    );
    return activeShow ? Object.keys(activeShow.occupiedSeats) : [];
  };

  const occupiedSeats = getOccupiedSeats();

  // Handle seat click
  const toggleSeat = (seat) => {
    if (!selectedTime) {
      toast.error("Please select a time first");
      return;
    }
    if (occupiedSeats.includes(seat)) {
      toast.error("This seat is already booked");
      return;
    }
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  // Handle proceed
  const handleProceed = () => {
    if (!selectedTime) return toast.error("Please select a time first");
    if (selectedSeats.length === 0) return toast.error("Please select at least one seat");

    navigate("/my-bookings", {
      state: {
        show: show.movie,
        date,
        time: selectedTime.time,
        seats: selectedSeats,
      },
    });
  };

  return show ? (
    <div className="flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-10 md:pt-20 relative">
      {/* Available timings */}
      <div className="w-60 bg-primary/10 border border-primary/20 rounded-lg py-6 h-max md:sticky md:top-36">
        <p className="text-lg font-semibold px-6 mb-4">Available Timings</p>
        <div className="flex flex-col gap-2">
          {show.dateTime[date] ? (
            show.dateTime[date].map((item) => (
              <div
                key={item.time}
                onClick={() => {
                  setSelectedTime(item);
                  setSelectedSeats([]); // reset seats when time changes
                }}
                className={`flex items-center gap-2 px-6 py-2 rounded-r-md cursor-pointer transition 
                  ${
                    selectedTime?.time === item.time
                      ? "bg-primary text-white"
                      : "hover:bg-primary/10"
                  }
                `}
              >
                <ClockIcon className="w-4 h-4" />
                <p className="text-sm">{isoTimeFormat(item.time)}</p>
              </div>
            ))
          ) : (
            <p className="px-6 text-sm text-gray-500">No showtimes available</p>
          )}
        </div>
      </div>

      {/* Seat Layout */}
      <div className="flex-1 mt-10 md:mt-0 md:ml-10">
        <p className="text-lg font-semibold mb-4 mt-5">Select Your Seats</p>

        <div className="bg-primary/5 rounded-lg p-6 flex flex-col items-center">
          {/* Screen label */}
          <div className="mb-7 w-full text-center">
            <p className="text-xs mb-2 text-gray-500">Screen This Way</p>
            <div className="h-2 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
          </div>

          {/* Seat Grid */}
          <div className="grid grid-cols-10 gap-3">
            {[...Array(8)].map((_, row) =>
              [...Array(10)].map((_, col) => {
                const seatNumber = `${String.fromCharCode(65 + row)}${col + 1}`;
                const isSelected = selectedSeats.includes(seatNumber);
                const isBooked = occupiedSeats.includes(seatNumber);

                return (
                  <div
                    key={seatNumber}
                    onClick={() => !isBooked && toggleSeat(seatNumber)}
                    className={`w-8 h-8 flex items-center justify-center rounded cursor-pointer text-sm transition
                      ${
                        isBooked
                          ? "bg-gray-400 cursor-not-allowed text-white"
                          : isSelected
                          ? "bg-primary text-white"
                          : "bg-white hover:bg-primary/10 border border-gray-300"
                      }
                    `}
                  >
                    {seatNumber}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Selected seat info */}
        <div className="mt-6">
          <p className="text-sm">
            Selected Seats:{" "}
            {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
          </p>
          {selectedTime && (
            <p className="text-sm text-gray-500 mt-1">
              Time: {isoTimeFormat(selectedTime.time)}
            </p>
          )}
        </div>

        {/* Proceed Button */}
        <button
          onClick={handleProceed}
          className="mt-6 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/80 transition"
        >
          Proceed to Checkout
        </button>
      </div>

      {/* Background blur */}
      <BlurCircle top="-100px" left="-100px" />
      <BlurCircle top="-100px" right="-100px" />
    </div>
  ) : (
    <LoadingSpinner />
  );
};

export default SeatLayout;
