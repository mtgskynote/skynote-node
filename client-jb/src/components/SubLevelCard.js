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
    subLevelLessons,
    isOpen,
    onCardClick
}) => {
    const containerRef = useRef(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const [totalStars, setTotalStars] = useState(0);
    const [smallerTextSize, setSmallerTextSize] = useState(false);
    const [violinIcon, setViolinIcon] = useState(violinPic);

    const maxStars = subLevelLessons.length * 3;
    const levelCardWidth = containerWidth / 4 - 4 * 5; // margin between levelcards is mb-3
    const expandedHeight = levelCardWidth * (2 / 3) + 90 + 20;
    const centeredCards = subLevelLessons.length >= 4 && (subLevelLessons.length % 2 === 0);

    // Set text sizes based on the length of the card
    useEffect(() => {
        console.log(containerWidth)
        setSmallerTextSize(containerWidth < 650);
    }, [containerWidth]);

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

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth);
            }
        };

        const resizeObserver = new ResizeObserver(updateDimensions);

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        updateDimensions();

        return () => {
            if (containerRef.current) {
                resizeObserver.unobserve(containerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        let starCount = 0;
        subLevelLessons.forEach((lesson) => {
            starCount += lesson.stars;
        });

        setTotalStars(starCount);
    }, [subLevelLessons]);

    return (
        <div
            className="w-full"
            ref={containerRef}
            onClick={() => {
                onCardClick(index);
            }}
        >
            <div
                className={`w-full ${
                    isOpen ? "bg-blue-400" : "bg-gray-100 hover:bg-slate-200"
                } shadow-sm rounded-lg mb-3`}
                style={isOpen ? { height: expandedHeight } : { height: 90 }}
            >
                <div className={`w-full flex items-center justify-between`}>
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
                                className={`${smallerTextSize ? "text-base": "text-lg "}font-bold ${
                                    isOpen ? "text-white" : "text-black"
                                }`}
                            >
                                {subLevelName}
                            </div>
                            <div
                                className={`${smallerTextSize ? "text-xs": "text-sm"} font-normal ${
                                    isOpen ? "text-white" : "text-black"
                                }`}
                            >
                                {category}
                            </div>
                        </div>
                    </div>
                    <div className="flex-grow"></div>
                    <div className="flex items-center space-x-8 p-4 ml-5">
                        <div
                            className={`${smallerTextSize ? "text-xs": "text-sm"} font-normal ${
                                isOpen ? "text-white" : "text-black"
                            } flex items-center mr-auto`}
                        >
                            <AccessTimeIcon className="mr-2" />
                            <span>{timeRecorded}</span>
                        </div>
                        <div
                            className={`flex items-center ${smallerTextSize ? "text-xs": "text-sm"} font-normal ${
                                isOpen ? "text-white" : "text-black"
                            } mr-3`}
                        >
                            <StarBorderRoundedIcon className="text-yellow-300 text-3xl mr-2" />
                            <span className="mr-4">{`${totalStars}/${maxStars}`}</span>
                        </div>
                        <Button
                            variant="contained"
                            type="button"
                            className={`bg-black text-white ${smallerTextSize ? "text-xs": "text-sm"} text-center p-2`}
                        >
                            {isOpen ? "Hide Songs" : "View Songs"}
                        </Button>
                    </div>
                </div>
                {isOpen && (
                    <div className={`w-full flex ${centeredCards ? "justify-center px-4": "justify-start px-3"} overflow-x-auto`}>
                        <div className="flex space-x-4 items-start">
                            {subLevelLessons.map((lesson, index) => (
                                <LessonCard
                                    key={index}
                                    title={lesson.title}
                                    skill={lesson.skill}
                                    level={levelNumber}
                                    stars={lesson.stars}
                                    xml={lesson.route_path}
                                    id={lesson.id}
                                    renderViewRecordings={false}
                                    sizeX={`${levelCardWidth}px`}
                                    backgroundColour={"bg-slate-50"}
                                    hoverBackgroundColour={"hover:bg-slate-200"}
                                    textColour={"text-black"}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubLevelCard;
