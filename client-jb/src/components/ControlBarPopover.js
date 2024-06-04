import React, { useState } from "react";
import RangeSlider from "./RangeSlider";

const ControlBarPopover = ({ children, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          onClick={handleClick}
          className="appearance-none bg-transparent border-none"
        >
          {children}
        </button>
      </div>

      {isOpen && (
        <div className="origin-bottom absolute bottom-full left-1/2 transform -translate-x-1/2 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div
            className="p-3 items-center"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {/* <h4 className="inline-block text-xl text-white bg-green-600 rounded px-1 mb-3">
              {content}
            </h4> */}
            <RangeSlider min="0" max="200" initial="100" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlBarPopover;
