import React from 'react';
import PropTypes from 'prop-types';
import SubLevelCard from './SubLevelCard';

const LevelCard = ({
  levelName,
  levelNumber,
  levelLessons,
  refreshData,
  subLevelIsOpen,
  handleSubLevelClick,
  openSubLevel,
  baseSubLevelIndex,
}) => {
  const countStars = (subLevelLessons) => {
    let starCount = 0;
    subLevelLessons.forEach((lesson) => {
      starCount += lesson.stars;
    });
    return starCount;
  };

  // Check if all arrays within levelLessons are empty
  const isEmpty = Object.keys(levelLessons).every(
    (skill) => levelLessons[skill].length === 0
  );

  if (isEmpty) {
    return null;
  }

  return (
    <div className="w-full flex flex-col items-center justify-center mb-10">
      {/* Level Heading */}
      <div className="w-4/5 flex items-center">
        <span className="font-bold text-xl text-black">
          {`Level ${levelNumber}: ${levelName}`}
        </span>
        <div className="flex-grow"></div>
      </div>
      {/* Line Separator */}
      <div className="w-4/5 h-px bg-gray-200"></div>

      {/* SubLevelCards */}
      <div className="w-4/5 flex flex-wrap justify-center mt-4">
        {Object.keys(levelLessons).map(
          (skill, index) =>
            levelLessons[skill] && (
              <SubLevelCard
                index={baseSubLevelIndex + index} // Calculate unique index
                key={index}
                subLevelName={skill}
                levelNumber={levelNumber}
                category={levelName}
                timeRecorded="4h 15min"
                totalStars={countStars(levelLessons[skill])}
                subLevelLessons={levelLessons[skill]}
                isOpen={
                  openSubLevel === baseSubLevelIndex + index && subLevelIsOpen
                }
                onCardClick={handleSubLevelClick}
                refreshData={refreshData}
              />
            )
        )}
      </div>
    </div>
  );
};

LevelCard.propTypes = {
  levelName: PropTypes.string.isRequired,
  levelNumber: PropTypes.number.isRequired,
  levelLessons: PropTypes.objectOf(PropTypes.array).isRequired,
  refreshData: PropTypes.func.isRequired,
  subLevelIsOpen: PropTypes.bool.isRequired,
  handleSubLevelClick: PropTypes.func.isRequired,
  openSubLevel: PropTypes.number,
  baseSubLevelIndex: PropTypes.number,
};

export default LevelCard;
