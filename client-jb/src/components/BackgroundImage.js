import React from 'react';
import PropTypes from 'prop-types';
import background_image from '../assets/images/violin/violin7.png';

/**
 * The BackgroundImage component displays an image with customizable properties.
 *
 * Props:
 * - height (string|number): The height of the image.
 * - width (string|number): The width of the image.
 * - imgClassName (string): CSS class names for styling the image.
 * - alt (string): Alternative text for the image. Defaults to 'No description available'.
 */
const BackgroundImage = ({ height, width, imgClassName, alt }) => {
  return (
    <img
      src={background_image}
      className={imgClassName}
      alt={alt || 'No description available'}
      height={height}
      width={width}
    />
  );
};

BackgroundImage.propTypes = {
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  imgClassName: PropTypes.string,
};

export default BackgroundImage;
