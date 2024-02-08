import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

// Timer context
const TimerContext = createContext();
export const useTimer = () => useContext(TimerContext);

// SessionTimerProvider component
const SessionTimerProvider = ({ children }) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  

  // Timer control methods
  const startTimer = () => {
    if (!intervalRef.current) {
      setIsRunning(true); // Update running status
      const startTime = Date.now() - elapsedTime;
      intervalRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
    }
  };

  const pauseTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsRunning(false); // Update running status
    }
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setElapsedTime(0);
    setIsRunning(false); // Update running status
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  // Expose timer controls and elapsed time through context
  const value = {
    elapsedTime,
    isRunning,
    startTimer,
    pauseTimer,
    resetTimer,
  };

  return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>;
};

// SessionTimerDisplay component
const SessionTimerDisplay = () => {
  const { elapsedTime } = useTimer();
  
  // Formatting elapsed time into HH:MM:SS
  const formatTime = () => {
    let seconds = Math.floor(elapsedTime / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    seconds = seconds % 60;
    minutes = minutes % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return <div>{formatTime()}</div>;
};

export {SessionTimerProvider, SessionTimerDisplay };
