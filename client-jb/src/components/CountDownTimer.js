import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * The CountDownTimer component displays a countdown timer in beats.
 *
 * Props:
 * - bpm (number): Beats per minute.
 * - mode (boolean): Determines the color and shadow of the countdown text.
 * - onCountDownFinished (function): Callback when the countdown finishes.
 *
 * State:
 * - countDownBeats (number): Current beat count of the countdown.
 *
 * The component:
 * - Calculates the time per beat based on bpm.
 * - Sets an interval to increment countDownBeats every beat.
 * - Calls onCountDownFinished when countDownBeats reaches 5 (there are only 4 beats in a countdown).
 */
const CountDownTimer = ({ bpm, mode, onCountDownFinished }) => {
  const [countDownBeats, setCountDownBeats] = useState(1);

  useEffect(() => {
    let new_bpm;

    if (bpm > 100) {
      new_bpm = bpm / 2;
    } else {
      new_bpm = bpm;
    }

    const timePerBeat = (1 / new_bpm) * 60 * 1000; // milliseconds per beat
    let countdownInterval;

    if (countDownBeats < 5) {
      countdownInterval = setInterval(() => {
        setCountDownBeats((prevCountDownBeats) => prevCountDownBeats + 1);
      }, timePerBeat);
    } else {
      setCountDownBeats('');
    }

    if (countDownBeats === 5) {
      clearInterval(countdownInterval);
      onCountDownFinished();
    }

    return () => {
      clearInterval(countdownInterval);
    };
  }, [bpm, countDownBeats, onCountDownFinished]);

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
