import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const ControlBarPopover = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);

  // Toggles the control bar popover visibility (open or closed)
  const handleTogglePopover = () => {
    setIsOpen(!isOpen);
  };

  // Handles closing the control bar popover when a user clicks outside the popover
  const handleClickOutside = (event) => {
    if (popoverRef.current && !popoverRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  // Adds and removes a mousedown event listener for closing the popover when clicking outside of it
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const childrenArray = React.Children.toArray(children);
  const trigger = childrenArray[0];
  const content = childrenArray.slice(1);

  return (
    <div className="relative inline-block text-left" ref={popoverRef}>
      {/* Popover trigger - Set in parent component */}
      <div>
        <div
          onClick={handleTogglePopover}
          className="appearance-none bg-transparent border-none"
        >
          {trigger}
        </div>
      </div>

      {/* Popover content - Set in parent component */}
      <div
        className={`origin-top absolute bottom-full left-1/2 transform translate-x-[-50%] ${
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
        } transition ease-in-out duration-200 mt-2 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5`}
      >
        <div
          className="p-3"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          {content}
        </div>
      </div>
    </div>
  );
};

ControlBarPopover.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ControlBarPopover;
