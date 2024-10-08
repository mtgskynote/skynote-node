import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import RangeSliderCSS from './RangeSlider.module.css';

const RangeSlider = ({ min, max, initial, onValueChange, disabled }) => {
  const [value, setValue] = useState(initial);
  const sliderRef = useRef();

  // Updates the value state whenever the inputs change and passes the new value to the parent components
  const handleChange = (event) => {
    setValue(event.target.value);
    onValueChange(event);
  };

  useEffect(() => {
    setValue(initial);
  }, [initial]);

  const sliderClass = disabled
    ? `${RangeSliderCSS.slider} ${RangeSliderCSS.sliderDisabled}`
    : RangeSliderCSS.slider;

  return (
    <div className="w-full relative">
      <input
        ref={sliderRef}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
        className={sliderClass}
        disabled={disabled}
      />
    </div>
  );
};

RangeSlider.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  initial: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.number.isRequired,
  ]).isRequired,
  onValueChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default RangeSlider;
