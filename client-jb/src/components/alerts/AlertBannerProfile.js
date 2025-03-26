import React from 'react';
import PropTypes from 'prop-types';
import AlertMui from '@mui/material/Alert';

const AlertBannerProfile = ({ severity, alertText }) => {
  return (
    <div className="mb-4">
      <AlertMui severity={severity}>{alertText}</AlertMui>
    </div>
  );
};

AlertBannerProfile.propTypes = {
  severity: PropTypes.oneOf(['error', 'warning', 'info', 'success']).isRequired,
  alertText: PropTypes.string.isRequired,
};

export default AlertBannerProfile;
