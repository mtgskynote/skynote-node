import React from 'react';
import PropTypes from 'prop-types';
import iphone_border from '../assets/images/iphone_border.png';

const IphoneBorder = ({ height, width }) => {
  return (
    <img
      src={iphone_border}
      className="iphone-border"
      altprop="iphone-border"
      height={height}
      width={width}
    />
  );
};

IphoneBorder.propTypes = {
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default IphoneBorder;
