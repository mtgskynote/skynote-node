import React, { useState } from 'react';
import SubLevelCard from "./SubLevelCard";

const LevelCard = ({ levelName, levelNumber, levelLessons, filter}) => {
    const [openCardIndex, setOpenCardIndex] = useState(null);

    const handleCardClick = (index) => {
        if (openCardIndex === index) {
            setOpenCardIndex(null); // Clicking on the same open sublevel card closes it
        } else {
            setOpenCardIndex(index); // Clicking on a different sublevel card opens it
        }
    };

    const countStars = (subLevelLessons) => {
        let starCount = 0;
        subLevelLessons.forEach((lesson) => {
            starCount += lesson.stars;
        });
        return starCount;
    };

    return (
        <div className="w-full flex flex-col items-center justify-center mb-10">
            {/* Level Heading */}
            <div className="w-4/5 flex items-center">
                <span className="font-bold text-xl text-black">
                    {`Level ${levelNumber}: ${levelName}`}
                </span>
                {/* Invisible content to push text to the left */}
                <div className="flex-grow"></div>
            </div>
            {/* Line Separator */}
            <div className="w-4/5 h-px bg-gray-200"></div>

            {/* SubLevelCards */}
            <div className="w-4/5 flex flex-wrap justify-center mt-4">
                {Object.keys(levelLessons).map((skill, index) => (
                    levelLessons[skill] && ( <SubLevelCard
                        index={index}
                        key={index}
                        subLevelName={skill}
                        levelNumber={levelNumber}
                        category={levelName}
                        timeRecorded="4h 15min"
                        totalStars={countStars(levelLessons[skill])}
                        subLevelLessons={levelLessons[skill]}
                        isOpen={openCardIndex === index}
                        onCardClick={handleCardClick}
                        filter={filter}
                    /> )
                ))}
            </div>
        </div>
    );
};

export default LevelCard;
