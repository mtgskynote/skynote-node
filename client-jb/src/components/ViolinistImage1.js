import React from 'react';
import Violinist_1 from '../assets/images/Violinist.jpg';

/**
 * The ViolinistImage component displays an image of a violinist.
 */
const ViolinistImage = () => {
  return (
    <div className="Violinist">
      <img
        src={Violinist_1}
        alt="Young girl sitting down in front of an iPad and bowing a violin."
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default ViolinistImage;
