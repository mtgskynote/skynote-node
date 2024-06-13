import React, { useState, useRef, useEffect } from "react";
import RangeSliderCSS from "./RangeSlider.module.css";

const RangeSlider = ({ min, max, initial, onValueChange }) => {
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

  return (
    <div className="w-full relative">
      <input
        ref={sliderRef}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
        className={RangeSliderCSS.slider}
      />
    </div>
  );
};

export default RangeSlider;
