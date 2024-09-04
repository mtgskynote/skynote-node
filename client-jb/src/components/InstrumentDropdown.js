import React, { useState, useEffect, useRef } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { FaMicrophone } from 'react-icons/fa';
import { GiViolin } from 'react-icons/gi';
import { useAppContext } from '../context/appContext';

/**
 * The InstrumentDropdown component provides a dropdown menu for selecting an instrument.
 *
 * State:
 * - isOpen (boolean): Controls the visibility of the dropdown menu.
 * - selectedInstrument (object): The currently selected instrument.
 *
 * The component:
 * - Initializes with a list of instruments, each with a name, icon, and disabled status.
 * - Toggles the dropdown menu visibility when the button is clicked.
 * - Updates the selected instrument and saves it to local storage when an instrument is selected.
 * - Closes the dropdown menu when a click is detected outside of it.
 * - Retrieves the saved instrument from local storage on initial render and sets it as the selected instrument.
 */
const InstrumentDropdown = () => {
  const instruments = [
    { name: 'violin', icon: <GiViolin />, disabled: false },
    { name: 'voice', icon: <FaMicrophone />, disabled: true },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState(instruments[0]);
  const dropdownRef = useRef(null);

  const { setInstrumentLocalStorage, getInstrumentLocalStorage } =
    useAppContext();

  // Handle the selection of an instrument from the dropdown
  const handleSelect = (instrument) => {
    if (!instrument.disabled) {
      setSelectedInstrument(instrument);
      setInstrumentLocalStorage(instrument.name);
      setIsOpen(false);
    }
  };

  // Handle when a click is made outside the dropdown
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  // Add and clean up the event listener for clicks outside the dropdown
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // useEffect hook to retrieve the saved instrument from local storage and set it as the selected instrument
  useEffect(() => {
    let savedInstrument = getInstrumentLocalStorage();
    if (savedInstrument === 'undefined' || !savedInstrument) {
      savedInstrument = instruments[0].name;
      setInstrumentLocalStorage(savedInstrument);
    }
    setSelectedInstrument(
      instruments.find((instrument) => instrument.name === savedInstrument)
    );
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Button Section */}
      <div
        className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded cursor-pointer focus:outline-none focus:border-blue-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="mr-2">{selectedInstrument.icon}</span>
        <span className="mr-8 capitalize">{selectedInstrument.name}</span>
        {isOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
      </div>

      {/* Dropdown Section */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white text-gray-900 border border-gray-300 rounded shadow-lg overflow-hidden transition-all ease-in-out duration-200">
          {instruments.map((instrument, index) => (
            <div
              key={index}
              className={`px-4 py-2 ${
                selectedInstrument === instrument ? 'bg-gray-200' : ''
              } ${
                instrument.disabled
                  ? 'text-gray-500 cursor-not-allowed'
                  : 'hover:bg-gray-100 cursor-pointer'
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
