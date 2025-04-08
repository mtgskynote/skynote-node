import React from 'react';
import PropTypes from 'prop-types';

/**
 * ControlBarPanel component to display a collapsible control bar panel.
 * @component
 * @param {Object} props - The component props.
 * @param {boolean} props.show - Determines whether the panel is visible or hidden.
 * @param {React.ReactNode} props.children - The content to be displayed inside the panel.
 * @example
 * // Example usage:
 * // <ControlBarPanel show={true}>
 * //   <p>Control bar content goes here</p>
 * // </ControlBarPanel>
 */
const ControlBarPanel = ({ show, children }) => {
  return (
    <div
      className={`absolute rounded-3xl w-full bg-blue-400 p-4 shadow-sm transition-all duration-300 ease-in-out ${
        show ? 'h-60 opacity-100' : 'h-0 opacity-0'
      } overflow-hidden`}
      style={{
        bottom: '0',
        zIndex: 10,
      }}
    >
      {show && (
        <div className="p-1">
          {children}
          <hr className="h-0.5 border-t-0 bg-white dark:bg-white/10" />
        </div>
      )}
    </div>
  );
};

ControlBarPanel.propTypes = {
  show: PropTypes.bool.isRequired,
  children: PropTypes.node,
};

export default ControlBarPanel;
