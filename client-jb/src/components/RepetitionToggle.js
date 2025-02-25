import React, { useEffect, useState } from 'react';
import Tooltip from '@mui/material/Tooltip';

const RepetitionToggle = ({
  onToggle,
  repetitionNumber,
  isToggled,
  isPlaying,
}) => {
  const [toggleClass, setToggleClass] = useState(
    `${
      isToggled || repetitionNumber === 2 ? 'translate-x-7' : '-translate-x-2'
    }`
  );

  useEffect(() => {
    setToggleClass(
      isToggled || repetitionNumber === 2 ? 'translate-x-7' : '-translate-x-2'
    );
  }, [isToggled, repetitionNumber]);

  return (
    <Tooltip title={`Toggle Repetition`}>
      <button
        className={`w-20 h-10 rounded-full flex items-center transition duration-300 focus:outline-none shadow border-none ${
          isPlaying ? 'bg-gray-400 cursor-not-allowed opacity-75' : 'bg-white'
        }`}
        onClick={onToggle}
        disabled={isPlaying}
      >
        <div
          className={`w-12 h-12 relative rounded-full transition duration-500 transform p-1 text-white flex items-center text-xl font-black justify-center ${
            isPlaying ? 'bg-gray-500' : 'bg-blue-300'
          } ${toggleClass}`}
        >
          {repetitionNumber}
        </div>
      </button>
    </Tooltip>
  );
};

export default RepetitionToggle;
