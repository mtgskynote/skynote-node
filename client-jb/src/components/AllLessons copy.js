// import { React, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Box from "@mui/material/Box";
// import { Link } from "react-router-dom";
// import { Col, Row, Card, Button } from "react-bootstrap";
// import ViolinCard from "./violinImageCard";
// import violinImg from "../assets/images/violin/violinDisplay.jpg";
// import violinImg2 from "../assets/images/violin/violin1.jpeg";
// import TreeView from "@mui/lab/TreeView";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";
// import TreeItem from "@mui/lab/TreeItem";
// import OpenSheetMusicDisplayPreview from "./OpenSheetMusicDisplayPreview";
// import XMLParser from "react-xml-parser";
// import axios from "axios";

// // to include the requests within the appprovider context (so that it uses the localhost:8001 proxy)
// import { useAppContext } from "../context/appContext";

// const folderBasePath = "/musicXmlFiles";
// const folderBasePath2 = "/xmlScores";
// const levelOnefiles = [
//   "Row.xml",
//   "V_001_Cuerdas_Al_Aire_1_Suelta_A.xml",
//   // "74_Minuet_2.xml",
//   // "001_Cuerdas_Al_Aire_1_Suelta_A.xml",
//   // "2_Cuerdas_Al_Aire_1_(Suelta)_D.xml",
//   // "02_Cuerdas_Al_Aire_1_(Suelta)_D.xml",
//   // "3_Cuerdas_Al_Aire_1_(Suelta)_G.xml",
//   // "4_Cuerdas_Al_Aire_1_(Suelta)_E.xml",
//   // "5_Cuerdas_Al_Aire_2_(Suelta)_A.xml",
//   // "77_The_Happy_Farmer.xml",
// ];
// const levelTwofiles = [
//   "Row.xml",
//   // "006_Cuerdas_Al_Aire_2_(Suelta)_D.xml",
//   // "6_Cuerdas_Al_Aire_2_(Suelta)_D.xml",
//   // "007_Cuerdas_Al_Aire_2_(Suelta)_G.xml",
//   // "7_Cuerdas_Al_Aire_2_(Suelta)_G.xml",
//   // "008_Cuerdas_Al_Aire_2_(Suelta)_E.xml",
//   // "8_Cuerdas_Al_Aire_2_(Suelta)_E.xml",
//   // "009_Cuerdas_Al_Aire_3_(Suelta)_A.xml",
//   // "9_Cuerdas_Al_Aire_3_(Suelta)_A.xml",
//   // "010_Cuerdas_Al_Aire_3_(Suelta)_D.xml",
//   // "10_Cuerdas_Al_Aire_3_(Suelta)_D.xml",
// ];
// const levelThreefiles = [
//   "Row.xml",
//   // "011_Cuerdas_Al_Aire_3_(Suelta)_G.xml",
//   // "012_Cuerdas_Al_Aire_3_(Suelta)_E.xml",
//   // "013_Cuerdas_Al_Aire_4_(Suelta)_A.xml",
//   // "014_Cuerdas_Al_Aire_4_(Suelta)_D.xml",
//   // "015_Cuerdas_Al_Aire_4_(Suelta)_G.xml",
// ];
// const getTitle = async (fileName) => {
//   try {
//     const response = await fetch(`${folderBasePath}/${fileName}`);
//     const xmlFileData = await response.text();
//     const arr = Array.from(
//       new XMLParser()
//         .parseFromString(xmlFileData)
//         .getElementsByTagName("movement-title")
//     );
//     if (arr.length > 0) {
//       return arr[0].value;
//     } else {
//       return fileName;
//       // Use the filename as the title if "movement-title" element is not found.
//     }
//   } catch (err) {
//     console.log(err.message);
//     return fileName;
//   }
// };

// // const getAllSkills = async () => {
// //   try {
// //     const response = await axios.get("/api/v1/scores/names", { level: 2 });
// //     console.log(response.data);
// //   } catch (error) {
// //     console.error("Error fetching file names:", error);
// //   }
// // };

// const fetchAllTitles = async (files) => {
//   const titles = {};
//   for (let file of files) {
//     const encodedFileName = encodeURIComponent(file);
//     titles[file] = await getTitle(encodedFileName);
//     // console.log("fielname: ", titles[file]);
//   }
//   return titles;
// };

// const sxStyles = {
//   flexGrow: 1,
//   maxWidth: "80rem",
//   overflowY: "auto",
//   margin: "2rem",
//   fontSize: 30,
// };

// const levelOneData = {
//   id: "root",
//   name: "Level One",
//   children: [
//     {
//       id: "11",
//       name: "Basic Bowing I",
//       children: levelOnefiles.map((file, index) => ({
//         id: `110${index}`,
//         name: file,
//         path: `${folderBasePath}/${file}`,
//         route_path: `/all-lessons/${file}`,
//       })),
//     },
//   ],
// };

// const levelTwoData = {
//   id: "root",
//   name: "Level One",
//   children: [
//     {
//       id: "21",
//       name: "Basic Bowing I",
//       children: levelTwofiles.map((file, index) => ({
//         id: `210${index}`,
//         name: file,
//         path: `${folderBasePath}/${file}`,
//         route_path: `/all-lessons/${file}`,
//       })),
//     },
//   ],
// };

// const levelThreeData = {
//   id: "root",
//   name: "Level Three",
//   children: [
//     {
//       id: "31",
//       name: "Basic Bowing I",
//     },
//     {
//       id: "32",
//       name: "Half Bows II",
//     },
//     {
//       id: "33",
//       name: "Little Pieces",
//     },
//     {
//       id: "34",
//       name: "2nd Finger",
//       children: [
//         {
//           id: "35",
//           name: "Xml File Path",
//         },
//       ],
//     },
//   ],
// };

// const AllLessons = () => {
//   const { getAllLevels, getAllSkills, getAllNames } = useAppContext();

//   const [titles, setTitles] = useState({});
//   const [selectedNode, setSelectedNode] = useState(null);

//   useEffect(() => {
//     // getAllSkills();
//     getAllNames(1, "1st Finger");
//     const allFiles = [...levelOnefiles, ...levelTwofiles, ...levelThreefiles];
//     fetchAllTitles(allFiles).then(setTitles);
//   }, []);
//   const handleNodeSelect = (event, nodeId) => {
//     setSelectedNode(nodeId);
//   };
//   // console.log("titles ajskdfjaskldjflaksdjflk", titles);

//   const renderTree = (nodes) => (
//     <TreeItem
//       key={nodes.id}
//       nodeId={nodes.id}
//       nodePath={nodes.path}
//       // if nodeId exists then add a button that links to the path

//       label={
//         <div style={{ display: "flex", alignItems: "center" }}>
//           {nodes.route_path ? (
//             // onClick={handleNavigate(`${nodes.path}`)
//             <Link to={nodes.path}>
//               <div style={{ marginRight: "10px", fontSize: 20 }}>
//                 {nodes.name}
//               </div>
//             </Link>
//           ) : (
//             <div style={{ marginRight: "10px", fontSize: 20 }}>
//               {nodes.name}
//             </div>
//           )}
//           <div
//             style={{
//               width: "100px",
//               height: "50px",
//               background: "transparent",
//               color: "white",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           ></div>
//         </div>
//       }
//     >
//       {Array.isArray(nodes.children)
//         ? nodes.children.map((node) => (
//             <TreeItem key={node.id} nodeId={node.id} label={node.name}>
//               {node.children
//                 ? node.children.map((childNode) => (
//                     <TreeItem
//                       key={childNode.id}
//                       nodeId={childNode.id}
//                       label={
//                         <div
//                           style={{
//                             display: "flex",
//                             justifyContent: "space-between",
//                             width: "100%",
//                           }}
//                         >
//                           <div>
//                             {childNode.route_path ? (
//                               <Link to={childNode.route_path}>
//                                 {/* <div
//                                   style={{ marginRight: "10px", fontSize: 20 }}
//                                 >
//                                   {childNode.name}
//                                 </div> */}
//                                 <span>
//                                   {titles[childNode.path.split("/").pop()]}
//                                 </span>
//                               </Link>
//                             ) : (
//                               <div
//                                 style={{ marginRight: "10px", fontSize: 20 }}
//                               >
//                                 {childNode.name}
//                               </div>
//                             )}
//                           </div>
//                           <div></div>

//                           {selectedNode === childNode.id && (
//                             <div style={{ flexShrink: 1, width: "60%" }}>
//                               <OpenSheetMusicDisplayPreview
//                                 file={childNode.path}
//                               />
//                               {console.log(
//                                 "Rendering file with path:",
//                                 childNode.path
//                               )}
//                             </div>
//                           )}
//                         </div>
//                       }
//                     />
//                   ))
//                 : null}
//             </TreeItem>
//           ))
//         : null}
//     </TreeItem>
//   );

//   return (
//     <>
//       <div>
//         <h1 style={{ fontSize: 25, fontFamily: "cursive", margin: "2rem" }}>
//           {" "}
//           All Lessons
//         </h1>
//       </div>
//       <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
//         {/* <Box sx={{ mb: 1 }}>
//           <Button onClick={handleExpandClick}>
//             {expanded.length === 0 ? "Expand all" : "Collapse all"}
//           </Button>
//         </Box> */}
//         <TreeView
//           aria-label="rich object"
//           defaultCollapseIcon={<ExpandMoreIcon />}
//           defaultExpanded={["root"]}
//           defaultExpandIcon={<ChevronRightIcon />}
//           sx={sxStyles}
//           style={{ fontSize: 30 }}
//           onNodeSelect={handleNodeSelect}
//           // expanded={expandedNodes}
//           // onNodeToggle={handleNodeToggle}
//         >
//           {renderTree(levelOneData)}
//         </TreeView>
//         <TreeView
//           aria-label="rich object"
//           defaultCollapseIcon={<ExpandMoreIcon />}
//           defaultExpanded={["root"]}
//           defaultExpandIcon={<ChevronRightIcon />}
//           sx={sxStyles}
//           style={{ fontSize: 30 }}
//           onNodeSelect={handleNodeSelect}
//         >
//           {renderTree(levelTwoData)}
//         </TreeView>
//         <TreeView
//           aria-label="rich object"
//           defaultCollapseIcon={<ExpandMoreIcon />}
//           defaultExpanded={["root"]}
//           defaultExpandIcon={<ChevronRightIcon />}
//           sx={sxStyles}
//           style={{ fontSize: 30 }}
//           onNodeSelect={handleNodeSelect}
//         >
//           {renderTree(levelThreeData)}
//         </TreeView>
//       </Box>
//     </>
//   );
// };

// export default AllLessons;

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

const folderBasePath = "xmlScores";

const getTitle = async (fileName) => {
  try {
    const response = await fetch(`${folderBasePath}/${fileName}`);
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

    const allFiles = Object.values(fetchedData).flatMap((level) =>
      Object.values(level).flatMap((skill) => skill)
    );
    fetchAllTitles(allFiles).then(setTitles);
  }, []);

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
                    <Link to={route_path}>
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
