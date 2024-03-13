//----------------------------------------------------------------------------------------------

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
//import TreeView from "@mui/lab/TreeView";
import { TreeView } from '@mui/x-tree-view/TreeView';
// import TreeItem from "@mui/lab/TreeItem";
import { TreeItem } from '@mui/x-tree-view'
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import OpenSheetMusicDisplayPreview from "./OpenSheetMusicDisplayPreview";
import AllLessonsCSS from './AllLessons.module.css';



const AllLessons = () => {
  const [selectedNodeActive, setSelectedNodeActive] = useState(false);
  const [selectedNodeInfo, setSelectedNodeInfo] = useState(null);
  const [fetchedData, setFetchedData] = useState({});

  useEffect(() => {
    const data= JSON.parse(localStorage.getItem("scoreData"));
    const treeData = data.reduce((result, item) => {
      const { level, skill, _id, fname, title } = item;
      result[level] = result[level] || {};
      result[level][skill] = result[level][skill] || [];
      result[level][skill].push({ id: _id, 
                                  name: fname,
                                  title: title, 
                                  path: `/xmlScores/violin/${fname}.xml`,
                                  route_path: `/all-lessons/${fname}`,});
    
      return result;
    }, {});
    setFetchedData(treeData);

  }, []); // This useEffect is only for fetching the data


  const handleNodeMouseOver = (event, nodeId) => {
    if(nodeId!==undefined){
      const selectedData = getNodeDataById(fetchedData, nodeId);
      setSelectedNodeInfo(selectedData);
      setSelectedNodeActive(true);
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



  const renderTree = (level, skills) => (
    <div className={AllLessonsCSS.level}>
    <TreeItem key={level} nodeId={level} label={`Level ${level}`} >
      {Object.entries(skills).map(([skill, names]) => (
        <div className={AllLessonsCSS.skill}>
        <TreeItem key={`${level}-${skill}`} nodeId={skill} label={skill}>
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
                      <span>{nameObj.title || nameObj.name}</span>
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
        <div>
          <h2>All Lessons</h2>
        </div>
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
