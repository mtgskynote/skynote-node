import React from 'react';
import AlertMui from '@mui/material/Alert';

const AlertNew = ({ severity, alertText }) => {
  return (
    <div className="mb-4">
      <AlertMui severity={severity}>{alertText}</AlertMui>
    </div>
  );
};

export default AlertNew;
