import React from 'react';
import PropTypes from 'prop-types';
import SubLevelCard from './SubLevelCard';

/**
 * The LevelCard component displays a card for a specific level, including its sub-levels and lessons.
 *
 * Props:
 * - levelName (string): The name of the level.
 * - levelNumber (number): The number of the level.
 * - levelLessons (object): An object containing arrays of lessons for each skill.
 * - refreshData (function): Callback to refresh data.
 * - subLevelIsOpen (boolean): Indicates if a sub-level is open.
 * - handleSubLevelClick (function): Callback to handle sub-level click events.
 * - openSubLevel (number): The index of the currently open sub-level.
 * - baseSubLevelIndex (number): The base index for sub-levels.
 *
 * The component:
 * - Counts the total stars for each sub-level using the countStars function.
 * - Maps over the levelLessons object to render SubLevelCard components for each skill.
 * - Passes various props to SubLevelCard, including calculated unique index, sub-level name, total stars, and lesson data.
 */
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
  baseSubLevelIndex: PropTypes.number.isRequired,
};

export default LevelCard;
