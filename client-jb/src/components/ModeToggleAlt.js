import React, { useState } from "react";
import ModeIcon from "@mui/icons-material/Mode";
import MicIcon from "@mui/icons-material/Mic";

const ModeToggleAlt = ({ onModeChange }) => {
  const [practiceModeOn, setPracticeModeOn] = useState(true);

  const toggleMode = () => {
    const newMode = !practiceModeOn;
    setPracticeModeOn(newMode);
    onModeChange(newMode);
  };

  return (
    <button
      className="w-20 h-10 rounded-full bg-white flex items-center transition duration-300 focus:outline-none shadow border-none"
      onClick={toggleMode}
    >
      <div
        className={`w-12 h-12 relative rounded-full transition duration-500 transform p-1 text-white flex items-center justify-center ${
          practiceModeOn
            ? "bg-green-500 -translate-x-2"
            : "bg-red-500 translate-x-7"
        }`}
      >
        {practiceModeOn ? <ModeIcon /> : <MicIcon />}
      </div>
    </button>
  );
};

export default ModeToggleAlt;
