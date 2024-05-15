import React from "react";
import ViolinSVG from "./ViolinSVG";

const LoadingScreen = ({ progress }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ViolinSVG progress={progress} />
    </div>
  );
};

export default LoadingScreen;
