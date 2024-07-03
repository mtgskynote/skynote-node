import React, { useState, useEffect } from "react";
import LevelCard from "../components/LevelCard";
import { useAppContext } from "../context/appContext";
import { getUserFavourites } from "../utils/usersMethods.js";
import { getAllRecData } from "../utils/studentRecordingMethods.js";
import LoadingScreen from "../components/LoadingScreen.js";

const Lessons = () => {
    const [lessonList, setLessonList] = useState({});
    const [localScoreData, setLocalScoreData] = useState(null);
    const [userData, setUserData] = useState(null);
    const { getCurrentUser } = useAppContext();
    const [recordingList, setRecordingList] = useState(null);
    const [favourites, setFavourites] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState("All Lessons");
    const [isLoading, setIsLoading] = useState(true);

    const filters = [
        "All Lessons",
        "Least Practised",
        "Almost perfect!",
        "My Favourites",
        "Imported Scores",
    ];

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("scoreData"));
        setLocalScoreData(data);
        if (data === null) {
            console.log("No scores data found in local storage");
            return;
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const currentUser = await getCurrentUser();
                setUserData(currentUser);
                const recordings = await getAllRecData(currentUser.id);
                setRecordingList(recordings);
                const favs = await getUserFavourites(currentUser.id);
                setFavourites(favs);
            } catch (error) {
                console.log("Error fetching data: ", error);
            }
        };

        if (!userData || !recordingList || !favourites) {
            fetchData();
        }
    }, [getCurrentUser, userData, recordingList, favourites]);

    useEffect(() => {
        if (localScoreData && recordingList && favourites) {
            const lessonData = localScoreData.reduce((result, item) => {
                const { level, skill, _id, fname, title } = item;

                const levelNameMapping = {
                    1: "Getting Started",
                    2: "Building Your Repertoire",
                };
                const mappedLevel = levelNameMapping[level] || level;

                result[mappedLevel] = result[mappedLevel] || {};
                result[mappedLevel][skill] = result[mappedLevel][skill] || [];

                const isFavourite = favourites.some((fav) => String(fav.songId) === String(_id));

                const lesson = {
                    id: _id,
                    name: fname,
                    title: title,
                    path: `/xmlScores/violin/${fname}.xml`,
                    route_path: `/all-lessons/${fname}`,
                    skill,
                    level: mappedLevel,
                    stars: calculateStars(_id),
                    favourite: isFavourite,
                };

                result[mappedLevel][skill].push(lesson);

                return result;
            }, {});

            setLessonList(lessonData);
            setIsLoading(false);
        }
    }, [localScoreData, recordingList, favourites]);

    const calculateStars = (lessonId) => {
        if (!recordingList) return 0;

        const lessonRecordings = recordingList.filter(
            (recording) => recording.scoreID === lessonId
        );

        if (lessonRecordings.length > 0) {
            return Math.max(
                ...lessonRecordings.map((recording) => recording.recordingStars)
            );
        } else {
            return 0;
        }
    };

    const handleFilterClick = (filter) => {
        setSelectedFilter(filter);
    };

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <div>
            <div className="mx-auto flex justify-center items-center space-x-4 mb-6 mt-6">
                {filters.map((filter, index) => (
                    <span
                        key={index}
                        className={`cursor-pointer font-normal text-sm ${selectedFilter === filter ? 'text-blue-500' : 'text-black opacity-30 hover:text-black hover:opacity-100'}`}
                        onClick={() => handleFilterClick(filter)}
                    >
                        {filter}
                    </span>
                ))}
            </div>
            {Object.keys(lessonList).map((level, index) => (
                <LevelCard
                    key={index}
                    levelNumber={index + 1}
                    levelName={level}
                    levelLessons={lessonList[level]}
                    filter={selectedFilter}
                />
            ))}
        </div>
    );
};

export default Lessons;
