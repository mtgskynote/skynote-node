import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeItem } from "@mui/x-tree-view";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import OpenSheetMusicDisplayPreview from "../components/OpenSheetMusicDisplayPreview.js";
import LevelCard from "../components/LevelCard";
import { useAppContext } from "../context/appContext";
import { getAllRecData } from "../utils/studentRecordingMethods.js";

let mousepos = { x: 0, y: 0 };

const Lessons = () => {
//   const [selectedNodeActive, setSelectedNodeActive] = useState(false);
//   const [selectedNodeInfo, setSelectedNodeInfo] = useState(null);
  const [lessonList, setLessonList] = useState({});
  const [localScoreData, setLocalScoreData] = useState(null);
  const [userData, setUserData] = useState(null);
  const { getCurrentUser } = useAppContext();
  const [recordingList, setRecordingList] = useState(null);

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
            console.log(`getCurentUser() error: ${error}`);
          });
      }

      if (userData !== null && recordingList === null) {
        getAllRecData(userData.id)
          .then((result) => {
            setRecordingList(result);
          })
          .catch((error) => {
            console.log(`Cannot get recordings from database: ${error}`);
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
          stars: calculateStars(_id) // Assign the stars based on recording data
        });

        return result;
      }, {});

      setLessonList(lessonData);
    }
  }, [localScoreData, recordingList]);

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

//   const handleNodeMouseOver = (event, nodeId) => {
//     if (nodeId !== undefined) {
//       const selectedData = getNodeDataById(lessonList, nodeId);

//       setSelectedNodeInfo(selectedData);
//       setSelectedNodeActive(true);
//       console.log(`Node mouse over ${nodeId}`);
//     } else {
//       setSelectedNodeInfo(null);
//       setSelectedNodeActive(false);
//     }
//   };

//   const handleNodeMouseOut = (event) => {
//     if (mousepos.x === event.clientX && mousepos.y === event.clientY) {
//       return;
//     }
//     mousepos.x = event.clientX;
//     mousepos.y = event.clientY;
//     console.log("Node mouse out");
//     setSelectedNodeInfo(null);
//     setSelectedNodeActive(false);
//   };

  const getNodeDataById = (data, nodeId) => {
    for (let level in data) {
      for (let skill in data[level]) {
        for (let [index, nameObj] of data[level][skill].entries()) {
          if (`${nameObj.name}-${index}` === nodeId) {
            return {
              id: nodeId,
              path: nameObj.path,
              route_path: nameObj.route_path,
            };
          }
        }
      }
    }
    return null;
  };

  return (
    <div>
      {/* Top Section */}
      <div className="mx-auto flex justify-center items-center space-x-4 mb-6 mt-6">
        <span className="font-normal text-sm text-black">All Lessons</span>
        <span className="font-normal text-sm text-black opacity-30">
          Least Practised
        </span>
        <span className="font-normal text-sm text-black opacity-30">
          Almost perfect!
        </span>
        <span className="font-normal text-sm text-black opacity-30">
          My Favourites
        </span>
      </div>

      {/* Level Card */}
      {Object.keys(lessonList).map((level, index) => (
        <LevelCard
          key={index}
          levelNumber={index + 1}
          levelName={level}
          levelLessons={lessonList[level]}
        />
      ))}
    </div>
  );
};

export default Lessons;
