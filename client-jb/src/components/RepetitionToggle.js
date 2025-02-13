import React from 'react';
import Tooltip from '@mui/material/Tooltip';

const RepetitionToggle = ({ onToggle, repetitionNumber, isToggled }) => {
  return (
    <Tooltip title={`Toggle Repetition`}>
      <button
        className="w-20 h-10 rounded-full bg-white flex items-center transition duration-300 focus:outline-none shadow border-none"
        onClick={onToggle}
      >
        <div
          className={`w-12 h-12 relative rounded-full transition duration-500 bg-blue-300 transform p-1 text-white flex items-center text-xl font-black justify-center ${
            !isToggled ? '-translate-x-2' : 'translate-x-7'
          }`}
        >
          {repetitionNumber}
        </div>
      </button>
    </Tooltip>
  );
};

export default RepetitionToggle;
