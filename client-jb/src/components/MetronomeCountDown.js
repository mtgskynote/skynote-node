import React, { useState, useEffect } from 'react';

function CountdownTimer({ bpm, onComplete }) {
  const [countDownBeats, setCountDownBeats] = useState(4); // Set the initial countdown time in beats

  const countdownStyle = {
    display: 'flex',
    backgroundColor: 'lightblue',
    color: 'darkblue',
    fontSize: '40px',
    padding: '10px',
    alignItems: 'center',  
  };
  

  useEffect(() => {

    console.log("original bpm: ", bpm)

    let new_bpm;

    if(bpm>100){
        new_bpm=bpm/2;
    }else{
        new_bpm=bpm;
    }

    console.log("new bpm: ", new_bpm)

    const timePerBeat = (1 / new_bpm) * 60 * 1000; // milliseconds per beat
    let countdownInterval;

    if (countDownBeats > 0) {
      countdownInterval = setInterval(() => {
        setCountDownBeats(prevCountDownBeats => prevCountDownBeats - 1);
      }, timePerBeat);
    }else{
        setCountDownBeats("")
    }

    if (countDownBeats === 0) {
        clearInterval(countdownInterval);
        onComplete(); // Llamar a la función onComplete cuando el contador llegue a cero
      }
  
      return () => {
        clearInterval(countdownInterval);
      };

  }, [bpm, countDownBeats]);

  return (
    <div className="countdown-timer">
      <div style={countdownStyle}>{countDownBeats}</div>
    </div>
  );
}

export default CountdownTimer;
