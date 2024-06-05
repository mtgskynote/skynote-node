import React, { useState, useRef, useEffect } from "react";
import RangeSlider from "./RangeSlider";

const ControlBarPopover = ({
  children,
  label,
  min,
  max,
  initial,
  onValueChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(initial);
  const popoverRef = useRef(null);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleValueChange = (e) => {
    setValue(e.target.value);
    if (onValueChange) {
      onValueChange(e.target.value);
    }
  };

  const handleClickOutside = (event) => {
    if (popoverRef.current && !popoverRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={popoverRef}>
      <div>
        <div
          onClick={handleClick}
          className="appearance-none bg-transparent border-none"
        >
          {children}
        </div>
      </div>

      <div
        className={`origin-top absolute bottom-full left-1/2 transform translate-x-[-50%] ${
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"
        } transition ease-in-out duration-200 mt-2 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5`}
      >
        <div
          className="p-3"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div className="flex items-center">
            <label htmlFor="value" className="mr-3 font-bold text-gray-500">
              {label}
            </label>
            <RangeSlider
              min={min}
              max={max}
              initial={value}
              onValueChange={handleValueChange}
              className="w-1/2"
            />
            <input
              className="ml-3 shadow-sm appearance-none border rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-1/2"
              id="value"
              type="number"
              name="value"
              min={min}
              max={max}
              value={value}
              onChange={handleValueChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlBarPopover;
