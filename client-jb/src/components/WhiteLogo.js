import React from 'react';
import new_logo_2023 from '../assets/images/new_logo_2023.jpg';

/**
 * The WhiteLogo component displays a logo image with specified dimensions and styles
 * to fit against a white or light colored background.
 */
const WhiteLogo = () => {
  return (
    <img
      src={new_logo_2023}
      className="new_logo_2023"
      alt="new_logo_2023"
      style={{ width: '35%', height: '300%' }}
    />
  );
};

export default WhiteLogo;
