import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-400 text-sm">Loading...</p>
    </div>
  );
};

export default LoadingSpinner;
