import React from 'react';
import PropTypes from 'prop-types';
import violinBKG from '../assets/images/violinBKG.jpeg';

const ViolinBackgroundImage = ({ height, width }) => {
  return (
    <img
      src={violinBKG}
      className="violinBKGgo"
      alt="Violin background"
      height={height}
      width={width}
    />
  );
};

ViolinBKG.propTypes = {
  height: PropTypes.string,
  width: PropTypes.string,
};

export default ViolinBackgroundImage;
