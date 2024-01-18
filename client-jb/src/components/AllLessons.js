//----------------------------------------------------------------------------------------------

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeItem from "@mui/lab/TreeItem";
import OpenSheetMusicDisplayPreview from "./OpenSheetMusicDisplayPreview";
import XMLParser from "react-xml-parser";
import { useAppContext } from "../context/appContext";
import AllLessonsCSS from './AllLessons.module.css';
import { blue } from "@material-ui/core/colors";
const folderBasePath = "xmlScores/violin";

const getTitle = async (fileName) => {
  try {
    const response = await fetch(`${folderBasePath}/${fileName}.xml`);
    const xmlFileData = await response.text();
    const arr = Array.from(
      new XMLParser()
        .parseFromString(xmlFileData)
        .getElementsByTagName("movement-title")
    );
    if (arr.length > 0) {
      return arr[0].value;
    } else {
      return fileName;
    }
  } catch (err) {
    console.log(err.message);
    return fileName;
  }
};

const fetchAllTitles = async (files) => {
  const titles = {};
  for (let file of files) {
    titles[file.name] = await getTitle(file.name);
  }
  return titles;
};

const sxStyles = {
  flexGrow: 1,
  maxWidth: "80rem",
  overflowY: "auto",
  margin: "2rem",
  fontSize: 30,
};

const AllLessons = () => {
  const { getAllLevels, getAllSkills, getAllNames } = useAppContext();

  const [titles, setTitles] = useState({});
  const [selectedNodeActive, setSelectedNodeActive] = useState(false);
  const [selectedNodeInfo, setSelectedNodeInfo] = useState(null);
  const [fetchedData, setFetchedData] = useState({});

  const fetchAllData = async () => {
    try {
      const levels = await getAllLevels();
      const data = {};

      for (let level of levels) {
        const skills = await getAllSkills(level);
        data[level] = {};

        for (let skill of skills) {
          let result = await getAllNames(level, skill); //get all names, scoreIds, scoreLevels and scoreSkills
          let names = result.map((score) => score.scoreXmlName);
          let scoreIds = result.map((score) => score.scoreId);
          data[level][skill] = names.map((name, index) => ({
            name,
            path: `${folderBasePath}/${name}.xml`,
            route_path: `/all-lessons/${name}.xml`, // score names
            //route_path: `/all-lessons/${scoreIds[index]}`, // scoreIds
          }));
        }
      }
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchAllData().then((data) => {
      setFetchedData(data);
    });
  }, []); // This useEffect is only for fetching the data

  useEffect(() => {
    const allFiles = Object.values(fetchedData).flatMap((level) =>
      Object.values(level).flatMap((skill) => skill)
    );
    fetchAllTitles(allFiles).then(setTitles);
  }, [fetchedData]); // This useEffect is dependent on fetchedData

  const handleNodeMouseOver = (event, nodeId) => {
    if(nodeId!==undefined){
      const selectedData = getNodeDataById(fetchedData, nodeId);
      setSelectedNodeInfo(selectedData);
      setSelectedNodeActive(true);
      console.log("Im on ", nodeId, selectedData)
    }else{
      setSelectedNodeInfo(null);
      setSelectedNodeActive(false);
    }
    
  };
  const handleNodeMouseOut = (event) => {
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
/*
.osmdScore{
    position: fixed;
  top: 0;
  right: 0;
  margin: 10px;
  z-index: 999
  } */ 
  const renderTree = (level, skills) => (
    <div className={AllLessonsCSS.level}>
    <TreeItem key={level} nodeId={level} label={`Level ${level}`} >
      {Object.entries(skills).map(([skill, names]) => (
        <div className={AllLessonsCSS.skill}>
        <TreeItem key={skill} nodeId={skill} label={skill}>
          <div className={AllLessonsCSS.songlist}>
          {names.map((nameObj, index) => (
            <div className={AllLessonsCSS.song} >
            <TreeItem
              key={`${nameObj.name}-${index}`}
              nodeId={`${nameObj.name}-${index}`}
              label={
                <div 
                className={AllLessonsCSS.songelement} 
                onMouseOver={(e) => handleNodeMouseOver(e, `${nameObj.name}-${index}`)}
                onMouseOut={(e) => handleNodeMouseOut(e)}
                >
                    <Link to={nameObj.route_path} className={AllLessonsCSS.link}>
                      <span>{titles[nameObj.name] || nameObj.name}</span>
                    </Link>
                    
                </div>
              }
            /></div>
          ))
          }
          </div>
        </TreeItem></div>
      ))}
    </TreeItem>
    </div>
  );

  return (
    <div>
      <div className={AllLessonsCSS.title}>
        <h1>All Lessons</h1>
      </div>
      <Box >
        <TreeView
          aria-label="rich object"
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpanded={["root"]}
          defaultExpandIcon={<ChevronRightIcon />}
          
          className={AllLessonsCSS.completeTree}
        >
          {Object.entries(fetchedData).map(([level, skills]) =>
            renderTree(level, skills)
          )}
        </TreeView>
      </Box>
      {(selectedNodeActive &&
        <div className={AllLessonsCSS.osmdScore}>
          <OpenSheetMusicDisplayPreview file={selectedNodeInfo.path} />
        </div>           
      )}
    </div>
  );
};

export default AllLessons;
