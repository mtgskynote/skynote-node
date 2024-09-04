import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import RangeSlider from './RangeSlider';

/**
 * The RangeInput component provides a labeled input field with a range slider for selecting a numeric value.
 *
 * Props:
 * - label (string): The label text for the input field.
 * - min (number): The minimum value for the input and slider.
 * - max (number): The maximum value for the input and slider.
 * - initial (number): The initial value for the input and slider.
 * - onValueChange (function): Callback function to handle value changes.
 * - disabled (boolean): Indicates if the input and slider are disabled.
 *
 * The component:
 * - Uses useState to manage the current value.
 * - Uses useEffect to update the value when the initial prop changes.
 * - Handles value changes with input validation to ensure it stays within the min and max range.
 * - Modifies the input field's styling based on the disabled prop.
 * - Renders a label, a RangeSlider component, and a number input field.
 */
const RangeInput = ({ label, min, max, initial, onValueChange, disabled }) => {
  const [value, setValue] = useState(initial);

  // Modify styling if inputs are disabled
  const inputClass = disabled
    ? 'ml-3 shadow-sm appearance-none border rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-5/12 bg-gray-300 cursor-not-allowed'
    : 'ml-3 shadow-sm appearance-none border rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-5/12';

  // Updates the value state whenever the inputs change and passes the new value to the parent components
  const handleValueChange = (e) => {
    let newValue = e.target.value;

    if (newValue !== '' && (Number(newValue) < min || Number(newValue) > max)) {
      if (Number(newValue) < min) {
        newValue = min;
      } else if (Number(newValue) > max) {
        newValue = max;
      }
    }

    setValue(newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  // Update value when initial value changes
  useEffect(() => {
    setValue(initial);
  }, [initial]);

  return (
    <div className="flex items-center mb-2">
      <label htmlFor="value" className="mr-3 font-bold text-gray-500 w-3/12">
        {label}
      </label>
      <RangeSlider
        min={min}
        max={max}
        initial={value}
        onValueChange={handleValueChange}
        disabled={disabled}
        className="w-4/12"
      />
      <input
        className={inputClass}
        id="value"
        type="number"
        name="value"
        min={min}
        max={max}
        value={value}
        onChange={handleValueChange}
        disabled={disabled}
      />
    </div>
  );
};

RangeInput.propTypes = {
  label: PropTypes.string.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  initial: PropTypes.number.isRequired,
  onValueChange: PropTypes.func,
  disabled: PropTypes.bool,
};

export default RangeInput;
