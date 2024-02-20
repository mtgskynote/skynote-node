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

    // Convert elapsed time in seconds to hours:minutes:seconds format
    const formatTime = () => {
      const hours = Math.floor(time / 3600);
      const minutes = Math.floor((time % 3600) / 60);
      const seconds = time % 60;
  
      // Pad numbers to ensure they are displayed with two digits
      const paddedHours = hours.toString().padStart(2, '0');
      const paddedMinutes = minutes.toString().padStart(2, '0');
      const paddedSeconds = seconds.toString().padStart(2, '0');
  
      return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
    };
  
    return (
      <div>
        <div>Time: {formatTime()}</div>
      </div>
    );
  //return <div>Timer: {time}</div>;
};

export default SessionTimerDisplay;
