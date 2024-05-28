import React, { useState } from "react";

const FormSelect = ({ name, handleChange, labelText, options }) => {
  const defaultInstrument = options.find((option) => option.default);
  console.log(defaultInstrument);
  return (
    <div className="form-row">
      <label htmlFor={name} className="form-label">
        {labelText || name}
      </label>

      <select
        name={name}
        onChange={handleChange}
        className="form-select"
        // defaultValue={defaultInstrument.value}
      >
        {options.map((option, index) => (
          <option key={index} name={name} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FormSelect;
