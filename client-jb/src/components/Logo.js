import React from 'react';
import PropTypes from 'prop-types';
import logo from '../assets/images/new_logo_2023.jpg';

const Logo = ({ height, width }) => {
  return (
    <img
      src={logo}
      className="logo"
      alt="skynote-logo"
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
