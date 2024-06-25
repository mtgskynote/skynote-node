import React from "react";
import StarRating from "./StarRating";

const ControlBarStats = ({ show, stats }) => {
  return (
    <div
      className={`absolute rounded-3xl w-full bg-blue-400 p-4 shadow-sm transition-all duration-300 ease-in-out ${
        show ? "h-60 opacity-100" : "h-0 opacity-0"
      } overflow-hidden`}
      style={{
        bottom: "0", // Positioning relative to the bottom
        zIndex: 10,
      }}
    >
      {/* Your stats content here */}
      {show && (
        <div className="p-1">
          <div className="flex justify-between">
            <div>
              <p className="text-white font-bold text-2xl mb-0">{stats.name}</p>
              <p className="text-white opacity-75 mb-3">
                {stats.date} | {stats.bpm} BPM
              </p>
              <StarRating size="text-3xl" stars={stats.stars} />
            </div>
            <div>
              <p className="text-white font-bold text-xl mb-0 text-right">
                Level {stats.level}
              </p>
              <p className="text-white opacity-75">{stats.skill}</p>
            </div>
          </div>
          <hr className="h-0.5 border-t-0 bg-white dark:bg-white/10" />
        </div>
      )}
    </div>
  );
};

export default ControlBarStats;
