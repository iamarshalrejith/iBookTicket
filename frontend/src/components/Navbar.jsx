import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { MenuIcon, SearchIcon, TicketPlus, XIcon } from "lucide-react";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();
  const linkClasses = ({ isActive }) =>
    `px-3 py-1 rounded-full transition ${
      isActive ? "bg-gray-100 text-black" : ""
    }`;
  return (
    <div className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5">
      {" "}
      <NavLink className="max-md:flex-1" to="/">
        {" "}
        <img src={assets.logo} alt="logo" className="w-45 h-auto" />{" "}
      </NavLink>{" "}
      {/* Menu items */}{" "}
      <div
        className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium max-md:text-lg z-50 flex flex-col md:flex-row items-center max-md:justify-center gap-8 md:px-8 py-3 max-md:h-screen md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border border-gray-300/20 overflow-hidden transition-[width] duration-300 ${
          isOpen ? "max-md:w-full" : "max-md:w-0"
        }`}
      >
        {" "}
        <XIcon
          className="md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        />{" "}
        <NavLink
          to="/"
          className={linkClasses}
          onClick={() => setIsOpen(false)}
        >
          {" "}
          Home{" "}
        </NavLink>{" "}
        <NavLink
          to="/movies"
          className={linkClasses}
          onClick={() => setIsOpen(false)}
        >
          {" "}
          Movies{" "}
        </NavLink>{" "}
        <NavLink
          to="/theaters"
          className={linkClasses}
          onClick={() => setIsOpen(false)}
        >
          {" "}
          Theaters{" "}
        </NavLink>{" "}
        <NavLink
          to="/releases"
          className={linkClasses}
          onClick={() => setIsOpen(false)}
        >
          {" "}
          Releases{" "}
        </NavLink>{" "}
        <NavLink
          to="/favorite"
          className={linkClasses}
          onClick={() => setIsOpen(false)}
        >
          {" "}
          Favorites{" "}
        </NavLink>{" "}
      </div>{" "}
      {/* Login button and search icon */}{" "}
      <div className="flex items-center gap-8">
        {" "}
        <SearchIcon className="max-md:hidden w-6 h-6 cursor-pointer" />{" "}
        {!user ? (
          <button
            onClick={openSignIn}
            className="px-4 py-1 sm:px-2 bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
          >
            {" "}
            Login{" "}
          </button>
        ) : (
          <UserButton>
            {" "}
            <UserButton.MenuItems>
              {" "}
              <UserButton.Action
                label="My Bookings"
                labelIcon={<TicketPlus width={15} />}
                onClick={() => navigate("/my-bookings")}
              />{" "}
            </UserButton.MenuItems>{" "}
          </UserButton>
        )}{" "}
      </div>{" "}
      {/* Menu icon on smaller screens */}{" "}
      <MenuIcon
        className="max-md:ml-4 md:hidden w-8 h-8 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      />{" "}
    </div>
  );
};
export default Navbar;
