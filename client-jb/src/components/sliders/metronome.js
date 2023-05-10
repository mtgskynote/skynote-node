import React from "react";

const MetronomeSliders = ({
  metroVol,
  bpmChange,
  handleMetroVolChange,
  handleBpmChange,
}) => {
  return (
    <div className="metronome-sliders">
      <div className="metronome-volume-slider">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={metroVol}
          onChange={handleMetroVolChange}
        />
        <span className="slider-text">Metronome Volume: {metroVol}</span>
      </div>
      <div className="metronome-bpm-slider">
        <input
          type="range"
          min="60"
          max="240"
          step="1"
          value={bpmChange}
          onChange={handleBpmChange}
        />
        <span className="slider-text">Metronome BPM: {bpmChange}</span>
      </div>
    </div>
  );
};

export default MetronomeSliders;
