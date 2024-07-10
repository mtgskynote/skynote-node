import React, { useRef, useState, useEffect } from "react";
import { Button } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import violinPic from "../assets/images/violin/violin1.jpeg";
import stringPic from "../assets/images/violin/violin6.jpeg";
import bowPic from "../assets/images/violin/violinDisplay.jpg";
import moocPic from "../assets/images/violin/violin4.jpeg";
import piecePic from "../assets/images/violin/violin5.jpeg";
import StarRateRoundedIcon from "@mui/icons-material/StarRateRounded";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import LessonCard from "../components/LessonCard.js";

const SubLevelCard = ({
  index,
  subLevelName,
  levelNumber,
  category,
  timeRecorded,
  totalStars,
  subLevelLessons,
  isOpen,
  onCardClick,
  refreshData,
}) => {
  const containerRef = useRef(null);
  const [violinIcon, setViolinIcon] = useState(violinPic);

  const maxStars = subLevelLessons.length * 3;
  const levelCardWidth = 265;
  const expandedHeight = 285;
  const completed = totalStars === maxStars;

  // Set icon based on sublevel name
  useEffect(() => {
    const sublevelString = subLevelName.toLowerCase();
    if (sublevelString.includes("string")) {
      setViolinIcon(stringPic);
    } else if (sublevelString.includes("bow")) {
      setViolinIcon(bowPic);
    } else if (sublevelString.includes("mooc")) {
      setViolinIcon(moocPic);
    } else if (sublevelString.includes("piece")) {
      setViolinIcon(piecePic);
    } else {
      setViolinIcon(violinPic);
    }
  }, [subLevelName]);

  if (subLevelLessons.length === 0) {
    return null;
  }

  return (
    <div className="w-full" ref={containerRef}>
      <div
        className={`w-full shadow-sm rounded-lg mb-3 h-fixed transition-all duration-500 ease-in-out ${
          isOpen
            ? "bg-blue-400"
            : "bg-gray-100 hover:bg-slate-200 cursor-pointer"
        }`}
        style={{ height: isOpen ? `${expandedHeight}px` : "90px" }}
        onClick={() => {
          onCardClick(index);
        }}
      >
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center p-2">
            <div className="w-[80px] h-[80px] flex items-center justify-center mr-4">
              <img
                src={violinIcon}
                alt="Violin Icon"
                className="w-[64px] h-[64px] rounded-lg"
              />
            </div>
            <div>
              <div
                className={`text-lg font-bold ${
                  isOpen ? "text-white" : "text-black"
                }`}
              >
                {subLevelName}
              </div>
              <div
                className={`text-sm font-normal ${
                  isOpen ? "text-white" : "text-black"
                }`}
              >
                {category}
              </div>
            </div>
          </div>
          <div className="flex-grow"></div>
          <div className="grid grid-cols-3 gap-8 p-4 ml-5 items-center">
            <div className="flex items-center">
              {/*TO DO: need to decide what is shows as time if wanted (see ENG-64) */
              /* <div
                                className={`text-sm font-normal ${
                                    isOpen ? "text-white" : "text-black"
                                } flex items-center`}
                            >
                                <AccessTimeIcon className="mr-2" />
                                <span>{timeRecorded}</span>
                            </div> */}
            </div>
            <div className="flex items-center">
              <div
                className={`flex items-center text-sm font-normal ${
                  isOpen ? "text-white" : "text-black"
                }`}
              >
                {completed ? (
                  <StarRateRoundedIcon className="text-yellow-300 text-3xl mr-2" />
                ) : (
                  <StarBorderRoundedIcon className="text-yellow-300 text-3xl mr-2" />
                )}
                <span>{`${totalStars}/${maxStars}`}</span>
              </div>
            </div>
            <div className="items-center">
              <Button
                variant="contained"
                type="button"
                className={`bg-black text-white text-sm text-center p-2`}
                style={{ minWidth: "120px" }}
              >
                {isOpen ? "Hide Lessons" : "View Lessons"}
              </Button>
            </div>
          </div>
        </div>
        {isOpen && (
          <div className="w-full flex justify-start px-3 overflow-x-auto">
            <div className="flex space-x-4 items-start">
              {subLevelLessons.map((lesson, index) => {
                return (
                  <LessonCard
                    key={index}
                    title={lesson.title}
                    skill={lesson.skill}
                    level={levelNumber}
                    stars={lesson.stars}
                    isFavourite={lesson.favourite}
                    xml={lesson.route_path}
                    id={lesson.id}
                    renderViewRecordings={false}
                    width={`${levelCardWidth}px`}
                    backgroundColour={"bg-slate-50"}
                    hoverBackgroundColour={"hover:bg-slate-200"}
                    textColour={"text-black"}
                    refreshData={refreshData}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubLevelCard;
