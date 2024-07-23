import React, { useState, useEffect } from 'react';
import RangeSlider from './RangeSlider';

const RangeInput = ({ label, min, max, initial, onValueChange, disabled }) => {
  const [value, setValue] = useState(initial);

  // Modify styling if inputs are disabled
  const inputClass = disabled
    ? 'ml-3 shadow-sm appearance-none border rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-5/12 bg-gray-300 cursor-not-allowed'
    : 'ml-3 shadow-sm appearance-none border rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-5/12';

  // Updates the value state whenever the inputs change and passes the new value to the parent components
  const handleValueChange = (e) => {
    setValue(e.target.value);
    if (onValueChange) {
      onValueChange(e.target.value);
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

export default RangeInput;
