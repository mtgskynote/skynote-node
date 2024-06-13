import React, { useState, useEffect } from "react";
import { Button } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import violinIcon from '../assets/images/lesson_icons/violin1.png';
import StarRateRoundedIcon from "@mui/icons-material/StarRateRounded";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import LessonCard from "../components/LessonCard.js";

const SubLevelCard = ({ subLevelName, levelNumber, category, timeRecorded, subLevelLessons }) => {
    const [viewSongs, setViewSongs] = useState(false);

    // If all stars are collected, show filled stars, else show empty stars
    
  return (
    <div className="w-full">
        {/* Container for everything */}
        <div className="w-full">
            {/* sublevel card container  */}
            <div className="w-full h-[90px] flex items-center justify-between rounded-lg shadow-sm bg-gray-100 mb-3">
                {/* Left Section */}
                <div className="flex items-center p-2">
                    <div className="w-[80px] h-[80px] flex items-center justify-center mr-4">
                    <img src={violinIcon} alt="Violin Icon" className="w-[64px] h-[64px] rounded-lg" />
                    </div>
                    <div>
                    <div className="text-md font-bold text-black">{subLevelName}</div>
                    <div className="text-xs font-normal text-black">{category}</div>
                    </div>
                </div>

                {/* Middle Section (Placeholder) */}
                <div className="flex-grow"></div>

                {/* Right Section */}
                <div className="flex items-center space-x-6 p-4 ml-auto">
                    <div className="text-xs font-normal text-black flex items-center mr-auto">
                        <AccessTimeIcon className="mr-1" />
                        <span>{timeRecorded}</span>
                    </div>
                    <div className="flex items-center text-xs font-normal text-black mr-3">
                        <StarBorderRoundedIcon className="text-yellow-300 text-3xl mr-2" />
                        <span className="mr-2">{"5/12"}</span>
                    </div>
                    <Button
                        variant="contained"
                        type="button"
                        className="bg-black text-white text-xs text-center p-2"
                        onClick={() => {
                        setViewSongs(!viewSongs);
                        }}
                    >
                        {viewSongs ? "Hide Songs" : "View Songs"}
                    </Button>
                </div>
            </div>
        </div>
        {/* Display Lesson Cards if viewSongs is true */}
        {viewSongs && (
            <div className="w-full flex flex-wrap justify-center mt-4 space-x-4">
                {subLevelLessons.map((lesson, index) => (
                    <LessonCard
                    key={index}
                    title={lesson.title}
                    skill={lesson.skill}
                    level={levelNumber}
                    stars={lesson.stars}
                    xml={lesson.path}
                    id={lesson.id}
                    />
                ))}
            </div>
        )}
        </div>
  );
};

export default SubLevelCard;
