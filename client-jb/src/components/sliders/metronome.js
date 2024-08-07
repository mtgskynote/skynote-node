import React from 'react';
import PropTypes from 'prop-types';

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

MetronomeSliders.propTypes = {
  metroVol: PropTypes.number.isRequired,
  bpmChange: PropTypes.number.isRequired,
  handleMetroVolChange: PropTypes.func.isRequired,
  handleBpmChange: PropTypes.func.isRequired,
};

export default MetronomeSliders;
