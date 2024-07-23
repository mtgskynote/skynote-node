import React from 'react';
import PropTypes from 'prop-types';
import AlertMui from '@mui/material/Alert';

const AlertNew = ({ severity, alertText }) => {
  return (
    <div className="mb-4">
      <AlertMui severity={severity}>{alertText}</AlertMui>
    </div>
  );
};

AlertNew.propTypes = {
  severity: PropTypes.oneOf(['error', 'warning', 'info', 'success']).isRequired,
  alertText: PropTypes.string.isRequired,
};

export default AlertNew;
