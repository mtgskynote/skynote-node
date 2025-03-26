import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import PropTypes from 'prop-types';

/**
 * Reusable IconButtonWithTooltip component.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {string} props.tooltip - The tooltip text.
 * @param {function} props.onClick - The click handler function.
 * @param {React.ReactNode} props.icon - The icon to display inside the button.
 * @param {string} [props.className] - Additional class names for the button.
 */
const IconButtonWithTooltip = ({ tooltip, onClick, icon, className }) => (
  <Tooltip title={tooltip}>
    <IconButton className={className} onClick={onClick}>
      {icon}
    </IconButton>
  </Tooltip>
);

IconButtonWithTooltip.propTypes = {
  tooltip: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default IconButtonWithTooltip;
