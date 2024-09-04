import React from 'react';
import PropTypes from 'prop-types';
import AlertMui from '@mui/material/Alert';

/**
 * The AlertWithProps component displays an alert message with a specified severity.
 *
 * Props:
 * - severity (string): The severity level of the alert. Must be one of 'error', 'warning', 'info', or 'success'.
 * - alertText (string): The text message to display in the alert.
 */
const AlertWithProps = ({ severity, alertText }) => {
  return (
    <div className="mb-4">
      <AlertMui severity={severity}>{alertText}</AlertMui>
    </div>
  );
};

AlertWithProps.propTypes = {
  severity: PropTypes.oneOf(['error', 'warning', 'info', 'success']).isRequired,
  alertText: PropTypes.string.isRequired,
};

export default AlertWithProps;
