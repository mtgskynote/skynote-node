import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import RangeSliderCSS from './RangeSlider.module.css';

/**
 * The RangeSlider component provides a range input slider for selecting a numeric value within a specified range.
 *
 * Props:
 * - min (number): The minimum value for the slider.
 * - max (number): The maximum value for the slider.
 * - initial (string|number): The initial value for the slider.
 * - onValueChange (function): Callback function to handle value changes.
 * - disabled (boolean): Indicates if the slider is disabled.
 *
 * The component:
 * - Uses useState to manage the current value of the slider.
 * - Uses useRef to reference the slider input element.
 * - Uses useEffect to update the slider value when the initial prop changes.
 * - Handles value changes by updating the state and calling the onValueChange callback.
 */
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
