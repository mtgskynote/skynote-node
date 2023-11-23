import React, { useState, useEffect } from 'react';

function CountdownTimer({ bpm, mode, onComplete }) {
  const [countDownBeats, setCountDownBeats] = useState(4); // Set the initial countdown time in beats

  const background=mode?'lightblue':"#A3CD8F";

  const countdownStyle = {
    display: 'flex',
    justifyContent: 'center', // Center horizontally
    backgroundColor: background,
    color: '#000000',
    opacity: "60%",
    fontSize: '15vh', // 15% of height of screen
    padding: '1vh', // 1% of height of screen
    alignItems: 'center',
    position: 'fixed',
    top: '34%', // Center vertically 50% - 15% fontsize - 1% padding = 34%
    left: 0,
    width: '100%', // Make it as wide as the screen
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
