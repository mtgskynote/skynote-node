import React from 'react';
import PropTypes from 'prop-types';

/**
 * The FormRow component renders a labeled input field for forms.
 *
 * Props:
 * - type (string): The type of the input (e.g., 'text', 'password').
 * - name (string): The name attribute for the input.
 * - value (string|number): The current value of the input.
 * - handleChange (function): Callback function to handle input changes.
 * - labelText (string): Optional label text for the input. Defaults to the name prop if not provided.
 */
const FormRow = ({ type, name, value, handleChange, labelText }) => {
  return (
    <div className="form-row">
      <label htmlFor={name} className="form-label">
        {labelText || name}
      </label>

      <input
        type={type}
        value={value}
        name={name}
        onChange={handleChange}
        className="form-input"
      />
    </div>
  );
};

FormRow.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  handleChange: PropTypes.func.isRequired,
  labelText: PropTypes.string,
};

export default FormRow;
