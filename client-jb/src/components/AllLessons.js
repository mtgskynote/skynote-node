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
  console.log("titles  fklk  dfsasdfasd", titles);
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
  const [selectedNode, setSelectedNode] = useState(null);
  const [fetchedData, setFetchedData] = useState({});

  const fetchAllData = async () => {
    try {
      const levels = await getAllLevels();
      const data = {};

      for (let level of levels) {
        const skills = await getAllSkills(level);
        data[level] = {};

        for (let skill of skills) {
          let names = await getAllNames(level, skill);
          data[level][skill] = names.map((name) => ({
            name,
            path: `${folderBasePath}/${name}.xml`,
            route_path: `/all-lessons/${name}.xml`,
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

  const handleNodeSelect = (event, nodeId) => {
    const selectedData = getNodeDataById(fetchedData, nodeId);
    setSelectedNode(selectedData);
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

  const renderTree = (level, skills) => (
    <TreeItem key={level} nodeId={level} label={`Level ${level}`}>
      {Object.entries(skills).map(([skill, names]) => (
        <TreeItem key={skill} nodeId={skill} label={skill}>
          {names.map((nameObj, index) => (
            <TreeItem
              key={`${nameObj.name}-${index}`}
              nodeId={`${nameObj.name}-${index}`}
              label={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <div>
                    <Link to={nameObj.route_path}>
                      <span>{titles[nameObj.name] || nameObj.name}</span>
                    </Link>
                  </div>
                  {selectedNode &&
                    selectedNode.id === `${nameObj.name}-${index}` && (
                      <div style={{ flexShrink: 1, width: "60%" }}>
                        {console.log("Rendering file with path:", nameObj.path)}
                        <OpenSheetMusicDisplayPreview file={nameObj.path} />
                      </div>
                    )}
                </div>
              }
            />
          ))}
        </TreeItem>
      ))}
    </TreeItem>
  );

  return (
    <>
      <div>
        <h1 style={{ fontSize: 25, fontFamily: "cursive", margin: "2rem" }}>
          All Lessons
        </h1>
      </div>
      <Box sx={sxStyles}>
        <TreeView
          aria-label="rich object"
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpanded={["root"]}
          defaultExpandIcon={<ChevronRightIcon />}
          onNodeSelect={handleNodeSelect}
        >
          {Object.entries(fetchedData).map(([level, skills]) =>
            renderTree(level, skills)
          )}
        </TreeView>
      </Box>
    </>
  );
};

export default AllLessons;
