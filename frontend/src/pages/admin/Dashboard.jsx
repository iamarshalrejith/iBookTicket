import React, { useEffect, useState } from "react";
import {
  ChartLineIcon,
  TicketIcon,
  CircleDollarSignIcon,
  UsersIcon,
} from "lucide-react";
import { dummyDashboardData } from "../../assets/assets";
import LoadingSpinner from "../../components/LoadingSpinner";
import BlurCircle from "../../components/BlurCircle";
import Title from "../../components/admin/Title";

const Dashboard = () => {
  const currency = import.meta.env.VITE_CURRENCY;

  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeShows: [],
    totalUser: 0,
  });

  const [loading, setLoading] = useState(true);

  const dashboardCards = [
    {
      title: "Total Bookings",
      value: dashboardData.totalBookings || "0",
      icon: ChartLineIcon,
    },
    {
      title: "Active Shows",
      value: dashboardData.activeShows.length || "0",
      icon: TicketIcon,
    },
    {
      title: "Total Revenue",
      value: `${currency}${dashboardData.totalRevenue || "0"}`,
      icon: CircleDollarSignIcon,
    },
    {
      title: "Total Users",
      value: dashboardData.totalUser || "0",
      icon: UsersIcon,
    },
  ];

  const fetchDashboardData = async () => {
    // You can replace this with a real API call later
    setDashboardData(dummyDashboardData);
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return !loading ? (
    <>
      <Title text1="Admin" text2="Dashboard" />
      <div className="relative flex flex-wrap gap mt-6">
        <BlurCircle top="-100px" left="0" />
        <div className="flex flex-wrap gap-4 w-full">
          {dashboardCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="flex items-center justify-between bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 flex-1 min-w-[220px] text-white shadow-lg hover:bg-white/20 transition"
              >
                <div>
                  <h3 className="text-sm text-gray-200">{card.title}</h3>
                  <p className="text-2xl font-semibold mt-2">{card.value}</p>
                </div>
                <div className="p-3 bg-white/10 rounded-full">
                  <Icon size={28} />
                </div>
              </div>
            );
          })}
        </div>
        <BlurCircle right="0" top="100" />
      </div>

      {/* ---------------- Active Shows Section ---------------- */}
      <p className="mt-10 text-lg font-medium text-white">Active Shows</p>

      {/* ---------------- Movies Section ---------------- */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {dashboardData.activeShows.map((show) => (
          <div
            key={show._id}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden shadow-lg hover:bg-white/20 transition"
          >
            <img
              src={show.movie.poster_path}
              alt={show.movie.title}
              className="w-full h-60 object-cover"
            />
            <div className="p-4 text-white">
              <h3 className="text-lg font-semibold truncate">
                {show.movie.title}
              </h3>
              <p className="text-sm text-gray-300 mt-1">
                {new Date(show.showDateTime).toLocaleDateString()} •{" "}
                {new Date(show.showDateTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-md mt-3 font-medium">
                Price:{" "}
                <span className="text-green-400">
                  {currency}
                  {show.showPrice}
                </span>
              </p>
            </div>
          </div>
        ))}
         <BlurCircle left="100px" />
        <BlurCircle right="100px" />
      </div>
    </>
  ) : (
    <LoadingSpinner />
  );
};

export default Dashboard;
