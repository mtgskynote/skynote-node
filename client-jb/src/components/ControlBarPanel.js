import React from 'react';
import PropTypes from 'prop-types';

/**
 * The ControlBarPanel component displays a panel that can show or hide its content.
 *
 * Props:
 * - show (boolean): Determines whether to show the panel.
 * - children (node): The content to display inside the panel.
 *
 * The component:
 * - Uses Tailwind CSS classes for styling and transitions.
 * - Adjusts height and opacity based on the show prop.
 * - Positions the panel at the bottom of the screen with a high z-index.
 * - Displays children content and a horizontal rule when the panel is shown.
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
