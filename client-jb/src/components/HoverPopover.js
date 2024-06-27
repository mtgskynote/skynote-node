import React from "react";

const HoverPopover = ({ anchorEl, onClose }) => {
  //   if (!anchorEl) return null; // Return null if anchorEl is null

  const anchorRect = anchorEl.getBoundingClientRect();
  const anchorTop = anchorRect.top + window.scrollY;
  const popoverStyle = {
    top: anchorTop - anchorRect.height - 10 + "px",
    left: anchorRect.left + "px",
  };

  return (
    <div
      className="absolute z-10 bg-white shadow-lg p-4 rounded-lg border border-gray-200"
      //   style={popoverStyle}
      onMouseEnter={() => {}}
      onMouseLeave={onClose}
    >
      <p className="text-sm text-gray-800">Popover content</p>
    </div>
  );
};

export default HoverPopover;
