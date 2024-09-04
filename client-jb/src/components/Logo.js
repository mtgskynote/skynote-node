import React from 'react';
import PropTypes from 'prop-types';
import logo from '../assets/images/new_logo_2023.jpg';

/**
 * The Logo component displays the Skynote logo with customizable dimensions.
 *
 * Props:
 * - height (string|number): The height of the logo.
 * - width (string|number): The width of the logo.
 */
const Logo = ({ height, width }) => {
  return (
    <img
      src={logo}
      className="logo"
      alt="Skynote logo"
      height={height}
      width={width}
    />
  );
};

Logo.propTypes = {
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Logo;
