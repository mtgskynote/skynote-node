import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import { Col, Row, Card, Button } from "react-bootstrap";
import ViolinCard from "./violinImageCard";
import violinImg from "../assets/images/violin/violinDisplay.jpg";
import violinImg2 from "../assets/images/violin/violin1.jpeg";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeItem from "@mui/lab/TreeItem";
import OpenSheetMusicDisplayPreview from "./OpenSheetMusicDisplayPreview";
import XMLParser from "react-xml-parser";

const folderBasePath = "/musicXmlFiles";
const folderBasePath2 = "/musicXmlFiles/violin-musicXML";
const levelOnefiles = [
  "Row.xml",
  // "74_Minuet_2.xml",
  // "50_Tercer_dedo_Ejercicios_2.xml",x
  "11_Cuerdas_Al_Aire_3_(Suelta)_G.xml",
  "2_Cuerdas_Al_Aire_1_(Suelta)_D.xml",
  "3_Cuerdas_Al_Aire_1_(Suelta)_G.xml",
  "4_Cuerdas_Al_Aire_1_(Suelta)_E.xml",
  "5_Cuerdas_Al_Aire_2_(Suelta)_A.xml",
];
const levelTwofiles = [
  "6_Cuerdas_Al_Aire_2_(Suelta)_D.xml",
  "7_Cuerdas_Al_Aire_2_(Suelta)_G.xml",
  "8_Cuerdas_Al_Aire_2_(Suelta)_E.xml",
  "9_Cuerdas_Al_Aire_3_(Suelta)_A.xml",
  "10_Cuerdas_Al_Aire_3_(Suelta)_D.xml",
];
const levelThreefiles = [
  "11_Cuerdas_Al_Aire_3_(Suelta)_G.xml",
  "12_Cuerdas_Al_Aire_3_(Suelta)_E.xml",
  "13_Cuerdas_Al_Aire_4_(Suelta)_A.xml",
  "14_Cuerdas_Al_Aire_4_(Suelta)_D.xml",
  "15_Cuerdas_Al_Aire_4_(Suelta)_G.xml",
];
const getTitle = async (fileName) => {
  try {
    const response = await fetch(`${folderBasePath}/${fileName}`);
    const xmlFileData = await response.text();
    const arr = new XMLParser()
      .parseFromString(xmlFileData)
      .getElementsByTagName("movement-title");
    if (arr && arr.length > 0) {
      return arr[0].value;
    } else {
      return fileName; // write filename here (fileName) if want to display the file name. or a string like "No title"
    }
  } catch (err) {
    console.log(err.message);
    return fileName;
  }
};
const fetchAllTitles = async (files) => {
  const titles = {};
  for (let file of files) {
    titles[file] = await getTitle(file);
  }
  console.log(titles);
  return titles;
};

const sxStyles = {
  flexGrow: 1,
  maxWidth: "80rem",
  overflowY: "auto",
  margin: "2rem",
  fontSize: 30,
};

// const levelOneData = {
//   id: "root",
//   name: "Level One",
//   children: [
//     {
//       id: "11",
//       name: "Basic Bowing I",
//       children: [
//         {
//           id: "111",
//           name: "Cuerdas AI Aire 1 (Suelta) A",
//           path: "/all-lessons/Cuerdas_Al_Aire_1_(Suelta)_A.xml",
//         },
//         {
//           id: "112",
//           name: "Cuerdas AI Aire 1 (Suelta) D",
//           path: "/all-lessons/5_Cuerdas_Al_Aire_2_(Suelta)_A.xml",
//         },
//         {
//           id: "113",
//           name: "Cuerdas AI Aire 1 (Suelta) G",
//           path: "/all-lessons/Cuerdas_Al_Aire_1_(Suelta)_D.xml",
//         },
//         {
//           id: "114",
//           name: "Cuerdas AI Aire 1 (Suelta) E",
//           path: "/all-lessons/Cuerdas_Al_Aire_1_(Suelta)_E.xml",
//         },
//       ],
//     },
//     {
//       id: "12",
//       name: "Half Bows II",
//     },
//     {
//       id: "13",
//       name: "Little Pieces",
//     },
//     {
//       id: "14",
//       name: "2nd Finger",
//       children: [
//         {
//           id: "15",
//           name: "Row Row Row Your Boat",
//           path: "/all-lessons/Row.xml",
//         },
//         {
//           id: "16",
//           name: "Twinkle Twinkle",
//           path: "/all-lessons/Row.xml",
//         },
//       ],
//     },
//     {
//       id: "17",
//       name: "Half Bows I",
//     },
//     {
//       id: "18",
//       name: "2nd String Changing",
//     },
//     {
//       id: "19",
//       name: "1st Finger",
//     },
//     {
//       id: "20",
//       name: "2nd Finger Pieces",
//     },
//     {
//       id: "21",
//       name: "Basic Bowing II",
//     },
//     {
//       id: "22",
//       name: "3rd String Changing",
//     },
//     {
//       id: "23",
//       name: "1st Finger/Changing String",
//     },
//     {
//       id: "24",
//       name: "3rd Finger",
//     },
//   ],
// };

const levelOneData = {
  id: "root",
  name: "Level One",
  children: [
    {
      id: "11",
      name: "Basic Bowing I",
      children: levelOnefiles.map((file, index) => ({
        id: `110${index}`,
        name: file,
        path: `${folderBasePath}/${file}`,
        route_path: `/all-lessons/${file}`,
      })),
    },
  ],
};

const levelTwoData = {
  id: "root",
  name: "Level Two",
  children: [
    {
      id: "21",
      name: "Basic Bowing I",
    },
    {
      id: "22",
      name: "Half Bows II",
    },
    {
      id: "23",
      name: "Little Pieces",
    },
    {
      id: "24",
      name: "2nd Finger",
      children: [
        {
          id: "25",
          name: "Xml File Path",
        },
      ],
    },
  ],
};

const levelThreeData = {
  id: "root",
  name: "Level Three",
  children: [
    {
      id: "31",
      name: "Basic Bowing I",
    },
    {
      id: "32",
      name: "Half Bows II",
    },
    {
      id: "33",
      name: "Little Pieces",
    },
    {
      id: "34",
      name: "2nd Finger",
      children: [
        {
          id: "35",
          name: "Xml File Path",
        },
      ],
    },
  ],
};

const AllLessons = () => {
  const [titles, setTitles] = useState({});
  const [selectedNode, setSelectedNode] = useState(null);
  useEffect(() => {
    const allFiles = [...levelOnefiles, ...levelTwofiles, ...levelThreefiles];
    fetchAllTitles(allFiles).then(setTitles);
  }, []);
  const handleNodeSelect = (event, nodeId) => {
    setSelectedNode(nodeId);
  };

  const renderTree = (nodes) => (
    <TreeItem
      key={nodes.id}
      nodeId={nodes.id}
      nodePath={nodes.path}
      // if nodeId exists then add a button that links to the path

      label={
        <div style={{ display: "flex", alignItems: "center" }}>
          {nodes.route_path ? (
            // onClick={handleNavigate(`${nodes.path}`)
            <Link to={nodes.path}>
              <div style={{ marginRight: "10px", fontSize: 20 }}>
                {nodes.name}
              </div>
            </Link>
          ) : (
            <div style={{ marginRight: "10px", fontSize: 20 }}>
              {nodes.name}
            </div>
          )}
          <div
            style={{
              width: "100px",
              height: "50px",
              background: "transparent",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          ></div>
        </div>
      }
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => (
            <TreeItem key={node.id} nodeId={node.id} label={node.name}>
              {node.children
                ? node.children.map((childNode) => (
                    <TreeItem
                      key={childNode.id}
                      nodeId={childNode.id}
                      label={
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                          }}
                        >
                          <div>
                            {childNode.route_path ? (
                              <Link to={childNode.route_path}>
                                {/* <div
                                  style={{ marginRight: "10px", fontSize: 20 }}
                                >
                                  {childNode.name}
                                </div> */}
                                <span>
                                  {titles[childNode.path.split("/").pop()]}
                                </span>
                              </Link>
                            ) : (
                              <div
                                style={{ marginRight: "10px", fontSize: 20 }}
                              >
                                {childNode.name}
                              </div>
                            )}
                          </div>
                          <div></div>

                          {selectedNode === childNode.id && (
                            <div style={{ flexShrink: 0, width: "50%" }}>
                              <OpenSheetMusicDisplayPreview
                                file={childNode.path}
                              />
                            </div>
                          )}
                        </div>
                      }
                    />
                  ))
                : null}
            </TreeItem>
          ))
        : null}
    </TreeItem>
  );

  return (
    <>
      <div>
        <h1 style={{ fontSize: 25, fontFamily: "cursive", margin: "2rem" }}>
          {" "}
          All Lessons
        </h1>
      </div>
      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        {/* <Box sx={{ mb: 1 }}>
          <Button onClick={handleExpandClick}>
            {expanded.length === 0 ? "Expand all" : "Collapse all"}
          </Button>
        </Box> */}
        <TreeView
          aria-label="rich object"
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpanded={["root"]}
          defaultExpandIcon={<ChevronRightIcon />}
          sx={sxStyles}
          style={{ fontSize: 30 }}
          onNodeSelect={handleNodeSelect}
          // expanded={expandedNodes}
          // onNodeToggle={handleNodeToggle}
        >
          {renderTree(levelOneData)}
        </TreeView>
        <TreeView
          aria-label="rich object"
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpanded={["root"]}
          defaultExpandIcon={<ChevronRightIcon />}
          sx={sxStyles}
          style={{ fontSize: 30 }}
        >
          {renderTree(levelTwoData)}
        </TreeView>
        <TreeView
          aria-label="rich object"
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpanded={["root"]}
          defaultExpandIcon={<ChevronRightIcon />}
          sx={sxStyles}
          style={{ fontSize: 30 }}
        >
          {renderTree(levelThreeData)}
        </TreeView>
      </Box>

      <div className="center" style={{ marginTop: "2rem" }}>
        <h2>Level One</h2>
      </div>
      <div className="center">
        <Row xs={1} md={3} className="g-4" style={{ marginTop: "2rem" }}>
          <Col>
            <ViolinCard
              violinImg={violinImg2}
              subfolder="/levels/levelone"
              ButtonText="Basic Bowing"
            />
          </Col>
          <Col>
            <ViolinCard
              violinImg={violinImg2}
              subfolder="/levels/leveltwo"
              ButtonText="Level Two"
            />
          </Col>
          <Col>
            <ViolinCard
              violinImg={violinImg2}
              subfolder="/levels/levelthree"
              ButtonText="Level Three"
            />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default AllLessons;
