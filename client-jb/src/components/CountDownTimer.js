import React, { useState, useEffect } from 'react';
import { getAudioContext, resumeAudioContext } from '../context/audioContext';
import PropTypes from 'prop-types';

const CountDownTimer = ({ bpm, mode, onCountDownFinished }) => {
  const [countDownBeats, setCountDownBeats] = useState(1);
  const audioContext = getAudioContext();
  resumeAudioContext();

  const playMetronomeClick = () => {
    const osc = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1000, audioContext.currentTime); // Click sound frequency
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);

    osc.connect(gainNode);
    gainNode.connect(audioContext.destination);

    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + 0.1); // Short click duration
  };

  useEffect(() => {
    let new_bpm = bpm > 100 ? bpm / 2 : bpm;
    const timePerBeat = (1 / new_bpm) * 60 * 1000; // milliseconds per beat

    let count = 1;
    setCountDownBeats(count);
    playMetronomeClick(); // Play immediately for the first beat

    const countdownInterval = setInterval(() => {
      if (count >= 4) {
        clearInterval(countdownInterval);
        setCountDownBeats('');
        onCountDownFinished();
      } else {
        count += 1;
        setCountDownBeats(count);
        playMetronomeClick(); // Play sound at the exact moment UI updates
      }
    }, timePerBeat);

    return () => clearInterval(countdownInterval);
  }, [bpm, onCountDownFinished]);

  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center z-50">
      <div
        key={countDownBeats}
        className={`${
          mode
            ? 'text-green-500 shadow-green-600'
            : 'text-red-500 shadow-red-600'
        } text-9xl text-shadow transition-all duration-500 ease-in-out`}
      >
        {countDownBeats}
      </div>
    </div>
  );
};

CountDownTimer.propTypes = {
  bpm: PropTypes.number.isRequired,
  mode: PropTypes.bool.isRequired,
  onCountDownFinished: PropTypes.func.isRequired,
};

export default CountDownTimer;
