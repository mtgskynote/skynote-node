import React, { useState, useEffect, useRef } from "react";

const CountDownTimer = ({ bpm, mode, onCountDownFinished, start }) => {
  const [countDownBeats, setCountDownBeats] = useState(0); // Set the initial countdown time in beats
  const intervalRef = useRef(null);

  useEffect(() => {
    if (start) {
      console.log("original bpm: ", bpm);

      let new_bpm = bpm > 100 ? bpm / 2 : bpm;
      console.log("new bpm: ", new_bpm);

      const timePerBeat = (1 / new_bpm) * 60 * 1000; // milliseconds per beat

      // Immediately start the countdown
      setCountDownBeats(1);

      intervalRef.current = setInterval(() => {
        setCountDownBeats((prevCountDownBeats) => {
          if (prevCountDownBeats < 4) {
            return prevCountDownBeats + 1;
          } else {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            onCountDownFinished(); // Ensure this is called only once when the countdown finishes
            return prevCountDownBeats;
          }
        });
      }, timePerBeat);

      // Ensure the first beat is shown without delay
      setTimeout(() => {
        setCountDownBeats(1);
      }, 0);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [bpm, start, onCountDownFinished]);

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center z-50 ${
        !start ? "hidden" : ""
      }`}
    >
      <div
        key={countDownBeats}
        className={`${
          mode
            ? "text-green-500 shadow-green-600"
            : "text-red-500 shadow-red-600"
        } text-9xl text-shadow transition-all duration-500 ease-in-out`}
      >
        {countDownBeats > 0 && countDownBeats}
      </div>
    </div>
  );
};

export default CountDownTimer;
