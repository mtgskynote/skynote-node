import React, { useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { FaMicrophone } from "react-icons/fa";
import { GiViolin } from "react-icons/gi";

const options = [
  { label: "Violin", icon: <GiViolin />, disabled: false },
  { label: "Voice", icon: <FaMicrophone />, disabled: true },
];

const InstrumentDropdown = ({}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[0]);

  const handleSelect = (option) => {
    if (!option.disabled) {
      setSelectedOption(option);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <div
        className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded cursor-pointer focus:outline-none focus:border-blue-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="mr-2">{selectedOption.icon}</span>
        <span className="mr-8">{selectedOption.label}</span>
        {isOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white text-gray-900 border border-gray-300 rounded shadow-lg">
          {options.map((option) => (
            <div
              key={option.value}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                selectedOption === option ? "bg-gray-200" : ""
              } ${option.disabled ? "text-gray-500 cursor-not-allowed" : ""}`}
              onClick={() => handleSelect(option)}
            >
              <span className="mr-2">{option.icon}</span>
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstrumentDropdown;
