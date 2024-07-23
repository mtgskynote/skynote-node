import React from 'react'
import PropTypes from 'prop-types';
import background_image from '../assets/images/violin/violin7.png'

const BackgroundImage = ({ height, width, imgClassName }) => {
  return (
    <img
      src={background_image}
      className={imgClassName}
      alt="Not found :("
      height={height}
      width={width}
    />
  )
}

BackgroundImage.propTypes = {
  height: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  imgClassName: PropTypes.string,
};

export default BackgroundImage
