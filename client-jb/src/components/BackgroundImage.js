import React from 'react';
import background_image from '../assets/images/violin/violin7.png';

const BackgroundImage = ({ height, width, imgClassName }) => {
  return (
    <img
      src={background_image}
      className={imgClassName}
      alt="Not found :("
      height={height}
      width={width}
    />
  );
};

export default BackgroundImage;
