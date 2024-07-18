import React, { useState, useEffect } from 'react'

const CountDownTimer = ({ bpm, mode, onCountDownFinished }) => {
  const [countDownBeats, setCountDownBeats] = useState(1) // Set the initial countdown time in beats

  useEffect(() => {
    console.log('original bpm: ', bpm)

    let new_bpm

    if (bpm > 100) {
      new_bpm = bpm / 2
    } else {
      new_bpm = bpm
    }

    console.log('new bpm: ', new_bpm)

    const timePerBeat = (1 / new_bpm) * 60 * 1000 // milliseconds per beat
    let countdownInterval

    if (countDownBeats < 5) {
      countdownInterval = setInterval(() => {
        setCountDownBeats((prevCountDownBeats) => prevCountDownBeats + 1)
      }, timePerBeat)
    } else {
      setCountDownBeats('')
    }

    if (countDownBeats === 5) {
      clearInterval(countdownInterval)
      onCountDownFinished()
    }

    return () => {
      clearInterval(countdownInterval)
    }
  }, [bpm, countDownBeats, onCountDownFinished])

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
  )
}

export default CountDownTimer
