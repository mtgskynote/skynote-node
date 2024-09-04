import React from 'react';
import PropTypes from 'prop-types';
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';

/**
 * The StarRating component displays a star rating with filled and empty stars.
 *
 * Props:
 * - stars (number): The number of filled stars to display.
 * - size (string): The size of the star icons. Defaults to 'text-4xl' if not provided.
 */
const StarRating = ({ stars, size }) => {
  const renderStars = () => {
    const filledStars = [];
    const emptyStars = [];

    for (let i = 0; i < stars; i++) {
      filledStars.push(
        <StarRateRoundedIcon
          key={i}
          className={`text-yellow-300 ${size ? size : 'text-4xl'}`}
        />
      );
    }

    for (let i = stars; i < 3; i++) {
      emptyStars.push(
        <StarBorderRoundedIcon
          key={i}
          className={`text-yellow-300 ${size ? size : 'text-4xl'}`}
        />
      );
    }

    return (
      <>
        {filledStars}
        {emptyStars}
      </>
    );
  };

  return <div className="flex items-center">{renderStars()}</div>;
};

StarRating.propTypes = {
  stars: PropTypes.number,
  size: PropTypes.string,
};

export default StarRating;
