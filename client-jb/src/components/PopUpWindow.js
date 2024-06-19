import React, { useState, useEffect } from "react";

const PopUpWindow = ({ children, isOpen }) => {
  const [isVisible, setIsVisible] = useState(isOpen);
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    let timeout;
    if (isOpen) {
      setShouldRender(true);
      timeout = setTimeout(() => setIsVisible(true), 10); // Small delay before setting isVisible to true
    } else {
      setIsVisible(false);
      timeout = setTimeout(() => setShouldRender(false), 100); // Match this duration with the transition duration
    }
    return () => clearTimeout(timeout);
  }, [isOpen]);

  return (
    shouldRender && (
      <div
        className={`z-30 fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 transition-opacity duration-100 ease-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className={`bg-white p-6 rounded-lg shadow-lg transform transition-transform duration-100 ${
            isVisible ? "scale-100" : "scale-90"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    )
  );
};

export default PopUpWindow;
