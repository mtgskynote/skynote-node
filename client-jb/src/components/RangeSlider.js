import React, { useState, useRef, useEffect } from "react";
import RangeSliderCSS from "./RangeSlider.module.css";

const RangeSlider = ({ min, max, initial, onValueChange }) => {
  const [value, setValue] = useState(initial);
  const sliderRef = useRef();

  const handleChange = (event) => {
    setValue(event.target.value);
    onValueChange(event);
  };

  useEffect(() => {
    setValue(initial);
  }, [initial]);

  // useEffect(() => {
  //   const slider = sliderRef.current;
  //   const tooltip = document.createElement("span");
  //   tooltip.classList.add(
  //     "absolute",
  //     "text-xs",
  //     "top-[-20px]",
  //     "transform",
  //     "-translate-x-1/2",
  //     "bg-green-500",
  //     "text-white",
  //     "rounded",
  //     "px-1",
  //     "opacity-50"
  //   );
  //   tooltip.id = "slider-tooltip";
  //   slider.parentNode.appendChild(tooltip);
  // }, []);

  // useEffect(() => {
  //   const slider = sliderRef.current;
  //   const tooltip = document.getElementById("slider-tooltip");
  //   const percent =
  //     ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
  //   tooltip.style.left = `calc(${percent}% - 5px)`;
  //   tooltip.textContent = slider.value;
  // }, [value, min, max]);

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
