import React, { useState } from "react";
import { dummyTrailers } from "../assets/assets";
import ReactPlayer from "react-player";
import BlurCircle from "./BlurCircle";
import { PlayCircleIcon } from "lucide-react";

const TrailerSection = () => {
  const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleTrailerClick = (trailer) => {
    setCurrentTrailer(trailer);
    setIsPlaying(true);
  };

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden">
      <p className="text-gray-300 font-medium text-lg">Trailers</p>

      {/* Main Player */}
      <div className="relative mt-6 flex justify-center">
        <BlurCircle top="-100px" right="-100px" />

        <div className="w-full max-w-[960px] aspect-video rounded-lg overflow-hidden relative">
          <ReactPlayer
            url={currentTrailer.videoUrl}
            controls
            playing={isPlaying}
            width="100%"
            height="100%"
            className="react-player"
          />
        </div>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-8 mt-8 max-w-4xl mx-auto">
        {dummyTrailers.map((trailer, index) => (
          <div
            key={index}
            className={`relative cursor-pointer group rounded-lg overflow-hidden ${
              trailer.videoUrl === currentTrailer.videoUrl ? "ring-2 ring-red-500" : ""
            }`}
            onClick={() => handleTrailerClick(trailer)}
          >
            <img
              src={trailer.image}
              alt={`Trailer ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 brightness-75"
            />
            <PlayCircleIcon
              strokeWidth={1.6}
              className="absolute top-1/2 left-1/2 w-8 h-8 md:w-12 md:h-12 transform -translate-x-1/2 -translate-y-1/2 text-white opacity-90"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrailerSection;
