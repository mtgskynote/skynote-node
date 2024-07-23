import React from 'react';
import PropTypes from 'prop-types';
import violinBKG from '../assets/images/violinBKG.jpeg';

const ViolinBKG = ({ height, width }) => {
  return (
    <img
      src={violinBKG}
      className="violinBKGgo"
      alt="violin-background"
      height={height}
      width={width}
    />
  );
};

ViolinBKG.propTypes = {
  height: PropTypes.string,
  width: PropTypes.string,
};

export default ViolinBKG;
