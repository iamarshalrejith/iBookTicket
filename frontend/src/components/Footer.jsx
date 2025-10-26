import React from 'react'
import { assets } from "../assets/assets"
import BlurCircle from './BlurCircle'

const Footer = () => {
  return (
    <footer className="w-full relative text-white">
      {/* Blur circles behind footer */}
      <BlurCircle bottom="-10%" right="-10%" />
      <BlurCircle top="-10%" left="-10%" />

      {/* Footer content */}
      <div className="relative max-w-7xl mx-auto px-6 py-16 flex flex-col items-center">
        <div className="flex items-center space-x-3 mb-6">
          <img
            alt="iBookShow Logo"
            className="h-11"
            src={assets.logo}
          />
        </div>
        <p className="text-center max-w-xl text-sm font-normal leading-relaxed drop-shadow-md">
          Book your favorite movies effortlessly with iBookShow. Explore showtimes, reserve your seats, and enjoy the ultimate cinematic experience.
        </p>
      </div>

      {/* Footer bottom */}
      <div className="border-t border-white/30 relative">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-sm font-normal drop-shadow-md">
          <a href="https://ibookshow.com" className="hover:underline">iBookShow</a> ©2025. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer
