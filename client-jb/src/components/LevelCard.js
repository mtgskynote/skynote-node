import React from 'react';
import SubLevelCard from './SubLevelCard';

const LevelCard = ({ levelName, levelNumber, levelLessons }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center mb-10">
      {/* Level Heading */}
      <div className="w-2/3 flex items-center">
        <span className="font-bold text-xl text-black">
          {`Level ${levelNumber}: ${levelName}`}
        </span>
        {/* Invisible content to push text to the left */}
        <div className="flex-grow"></div>
      </div>
      {/* Line Separator */}
      <div className="w-2/3 h-px bg-gray-200"></div>

      {/* SubLevelCards */}
      <div className="w-2/3 flex flex-wrap justify-center mt-4">
        {Object.keys(levelLessons).map((skill, index) => (
          <SubLevelCard
            key={index}
            subLevelName={skill}
            levelNumber={levelNumber}
            category={levelName}
            timeRecorded="4h 15min"
            subLevelLessons={levelLessons[skill]}
          />
        ))}
      </div>
    </div>
  );
};

export default LevelCard;
