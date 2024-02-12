import React, { useState, useEffect } from 'react';
import { timer } from './SessionTimer';

const SessionTimerDisplay = () => {
  const [time, setTime] = useState(timer.elapsedTime);

  useEffect(() => {
    const update = (newTime) => {
      setTime(newTime);
    };

    timer.subscribe(update);

    // Cleanup on component unmount
    return () => timer.unsubscribe(update);
  }, []);

  return <div>Timer: {time}</div>;
};

export default SessionTimerDisplay;
