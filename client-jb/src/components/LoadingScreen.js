import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

/**
 * The LoadingScreen component displays a full-screen loading indicator.
 */
const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <CircularProgress size={80} />
    </div>
  );
};

export default LoadingScreen;
