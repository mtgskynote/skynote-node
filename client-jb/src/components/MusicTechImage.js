import React from 'react';
import musictech from '../assets/images/musictech.jpg';

/**
 * The MusicTech component displays an image related to music technology,
 * which is used on the page Research.js.
 */
const MusicTech = () => {
  return (
    <img
      src={musictech}
      alt="music-tech"
      style={{ width: '100vw', height: '600px' }}
    />
  );
};

export default MusicTech;
