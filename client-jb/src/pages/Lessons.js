import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeItem } from "@mui/x-tree-view";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import OpenSheetMusicDisplayPreview from "../components/OpenSheetMusicDisplayPreview.js";
import LevelCard from '../components/LevelCard';

let mousepos = { x: 0, y: 0 };

const Lessons = () => {
    const [selectedNodeActive, setSelectedNodeActive] = useState(false);
    const [selectedNodeInfo, setSelectedNodeInfo] = useState(null);
    const [fetchedData, setFetchedData] = useState({});

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("scoreData"));
        if (data === null) {
          console.log("No scores data found in local storage");
          return;
        }
      
        const lessonData = data.reduce((result, item) => {
          const { level, skill, _id, fname, title } = item;
      
          // Define a mapping object to translate level names if needed
          const levelNameMapping = {
            '1': 'Getting Started',
            '2': 'Building Your Repetoire',
            // Add more mappings as needed
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
          });
      
          return result;
        }, {});
      
        setFetchedData(lessonData);
      }, []);

    const handleNodeMouseOver = (event, nodeId) => {
        if (nodeId !== undefined) {
            const selectedData = getNodeDataById(fetchedData, nodeId);

            setSelectedNodeInfo(selectedData);
            setSelectedNodeActive(true);
            console.log(`Node mouse over ${nodeId}`)
        } else {
            setSelectedNodeInfo(null);
            setSelectedNodeActive(false);
        }
    };
    const handleNodeMouseOut = (event) => {
        if (mousepos.x === event.clientX && mousepos.y === event.clientY) {
            return;
        }
        mousepos.x = event.clientX;
        mousepos.y = event.clientY;
        console.log("Node mouse out")
        setSelectedNodeInfo(null);
        setSelectedNodeActive(false);
    };

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
                <span className="font-normal text-sm text-black opacity-30">Least Practised</span>
                <span className="font-normal text-sm text-black opacity-30">Almost perfect!</span>
                <span className="font-normal text-sm text-black opacity-30">My Favourites</span>
            </div>

            {/* Level Card */}
            {/* <LevelCard levelName="LEVEL 1: Getting Started" /> */}
            {Object.keys(fetchedData).map((level, index) => (
                <LevelCard key={index} levelNumber={index + 1} levelName={level} levelLessons={fetchedData[level]} />
            ))}
        </div>
    );
}


export default Lessons;