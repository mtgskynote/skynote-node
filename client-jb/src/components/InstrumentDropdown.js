import React, { useState, useEffect, useRef } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { FaMicrophone } from "react-icons/fa";
import { GiViolin } from "react-icons/gi";
import { useAppContext } from "../context/appContext";

const instruments = [
  { name: "violin", icon: <GiViolin />, disabled: false },
  { name: "voice", icon: <FaMicrophone />, disabled: true },
];

const InstrumentDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState(instruments[0]);
  const dropdownRef = useRef(null);

  const { setInstrumentLocalStorage, getInstrumentLocalStorage } =
    useAppContext();

  const handleSelect = (instrument) => {
    if (!instrument.disabled) {
      setSelectedInstrument(instrument);
      setInstrumentLocalStorage(instrument.name);
      setIsOpen(false);
    }
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const savedInstrument = getInstrumentLocalStorage();
    if (savedInstrument) {
      setSelectedInstrument(
        instruments.find((instrument) => instrument.name === savedInstrument)
      );
    }
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded cursor-pointer focus:outline-none focus:border-blue-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="mr-2">{selectedInstrument.icon}</span>
        <span className="mr-8 capitalize">{selectedInstrument.name}</span>
        {isOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white text-gray-900 border border-gray-300 rounded shadow-lg">
          {instruments.map((instrument, index) => (
            <div
              key={index}
              className={`px-4 py-2 ${
                selectedInstrument === instrument ? "bg-gray-200" : ""
              } ${
                instrument.disabled
                  ? "text-gray-500 cursor-not-allowed"
                  : "hover:bg-gray-100 cursor-pointer"
              }`}
              onClick={() => handleSelect(instrument)}
            >
              <span className="mr-2">{instrument.icon}</span>
              <span className="capitalize">{instrument.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstrumentDropdown;
