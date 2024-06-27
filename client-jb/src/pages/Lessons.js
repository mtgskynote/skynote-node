import React, { useState, useEffect } from "react";
import LevelCard from "../components/LevelCard";
import { useAppContext } from "../context/appContext";
import { getAllRecData } from "../utils/studentRecordingMethods.js";
import LoadingScreen from "../components/LoadingScreen.js";

const Lessons = () => {
    const [lessonList, setLessonList] = useState({});
    const [lessonsData, setLessonsData] = useState([]);
    const [localScoreData, setLocalScoreData] = useState(null);
    const [userData, setUserData] = useState(null);
    const { getCurrentUser } = useAppContext();
    const [recordingList, setRecordingList] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState("All Lessons");
    const [isLoading, setIsLoading] = useState(true);

    const filters = [
        "All Lessons",
        // "Least Practised",
        // "Almost perfect!",
        // "My Favourites",
        // "Imported Scores",
    ];

    // get all data
    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("scoreData"));
        setLocalScoreData(data);
        if (data === null) {
            console.log("No scores data found in local storage");
            return;
        }
    }, []);

    // get all existing recordings
    useEffect(() => {
        const fetchRecordingData = () => {
            if (userData === null) {
                getCurrentUser()
                    .then((result) => {
                        setUserData(result);
                    })
                    .catch((error) => {
                        console.log(`getCurrentUser() error: ${error}`);
                    });
            }

            if (userData !== null && recordingList === null) {
                getAllRecData(userData.id)
                    .then((result) => {
                        setRecordingList(result);
                    })
                    .catch((error) => {
                        console.log(
                            `Cannot get recordings from database: ${error}`
                        );
                    });
            }
        };

        fetchRecordingData();
    }, [userData, getCurrentUser, recordingList, localScoreData]);

    // get lesson data -- set stars based on recording data
    useEffect(() => {
        if (localScoreData !== null && recordingList !== null) {
            const lessonData = localScoreData.reduce((result, item) => {
                const { level, skill, _id, fname, title } = item;

                // Define a mapping object to translate level names if needed
                const levelNameMapping = {
                    1: "Getting Started",
                    2: "Building Your Repetoire",
                    // Add more level mappings as needed
                };

                // Check if the level name needs to be translated
                const mappedLevel = levelNameMapping[level] || level;

                result[mappedLevel] = result[mappedLevel] || {};
                result[mappedLevel][skill] = result[mappedLevel][skill] || [];
                result[mappedLevel][skill].push({
                    id: _id,
                    name: fname,
                    title: title,
                    path: `/xmlScores/violin/${fname}.xml`,
                    route_path: `/all-lessons/${fname}`,
                    skill,
                    level: mappedLevel, // Assign the mapped level name
                    stars: calculateStars(_id), // Assign the stars based on recording data
                });

                return result;
            }, {});

            setLessonList(lessonData);
            setLessonsData(lessonData)
        }
    }, [localScoreData, recordingList]);

    useEffect(() => {
        if (userData && lessonList && recordingList !== null) {
          setIsLoading(false);
        }
      }, [userData, lessonList, recordingList]);

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
            {/* Top Section */}
            <div className="mx-auto flex justify-center items-center space-x-4 mb-6 mt-6">
                {filters.map((filter, index) => (
                    <span
                        key={index}
                        //style={{ cursor: 'pointer' }}
                        className={`cursor-pointer font-normal text-sm ${selectedFilter === filter ? 'text-blue-500' : 'text-black opacity-30 hover:text-black hover:opacity-100'}`}
                        onClick={() => handleFilterClick(filter)}
                    >
                        {filter}
                    </span>
                ))}
            </div>

            {/* Level Card */}
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
