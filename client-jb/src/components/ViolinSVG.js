import React from "react";

const ViolinSVG = ({ progress }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className="w-32 h-32"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <path
        d="M10,50 C30,30 70,30 90,50 C70,70 30,70 10,50 Z"
        strokeDasharray="200"
        strokeDashoffset={200 - 200 * progress}
        style={{ transition: "stroke-dashoffset 0.5s ease" }}
      />
    </svg>
  );
};

export default ViolinSVG;
