import React from 'react'
import CircularProgress from '@mui/material/CircularProgress'

const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <CircularProgress size={80} />
    </div>
  )
}

export default LoadingScreen
