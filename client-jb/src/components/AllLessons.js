import { React, useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
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

const levelOnefiles = [
  // "Row.xml",
  // "74_Minuet_2.xml",
  // "50_Tercer_dedo_Ejercicios_2.xml",
  "1_Cuerdas_Al_Aire_1_(Suelta)_A.xml",
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
      return "movement-title"; // write filename here (fileName) if want to display the file name.
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
      name: "Basic Bowing II",
      children: levelTwofiles.map((file, index) => ({
        id: `210${index}`,
        name: file,
        path: `${folderBasePath}/${file}`,
      })),
    },
  ],
};

const levelThreeData = {
  id: "root",
  name: "Level Three",
  children: [
    {
      id: "31",
      name: "Basic Bowing III",
      children: levelThreefiles.map((file, index) => ({
        id: `310${index}`,
        name: file,
        path: `${folderBasePath}/${file}`,
      })),
    },
  ],
};

const AllLessons = () => {
  const [titles, setTitles] = useState({});
  useEffect(() => {
    const allFiles = [...levelOnefiles, ...levelTwofiles, ...levelThreefiles];
    fetchAllTitles(allFiles).then(setTitles);
  }, []);
  // const [expanded, setExpanded] = useState([]);
  // const [selected, setSelected] = useState([]);

  // const handleToggle = (event, nodeIds) => {
  //   setExpanded(nodeIds);
  // };

  // const handleSelect = (event, nodeIds) => {
  //   setSelected(nodeIds);
  // };

  // const handleExpandClick = () => {
  //   setExpanded((oldExpanded) =>
  //     oldExpanded.length === 0 ? ["11", "12", "13", "14", "15", "16"] : []
  //   );
  // };

  // const renderTree = (nodes) => (
  //   <TreeItem
  //     key={nodes.id}
  //     nodeId={nodes.id}
  //     nodePath={nodes.path}
  //     label={
  //       <div
  //         style={{
  //           display: "flex",
  //           flexDirection: "column",
  //           alignItems: "flex-start",
  //         }}
  //       >
  //         <div style={{ marginRight: "10px", fontSize: 20 }}>{nodes.name}</div>
  //         {nodes.path ? (
  //           <div
  //             style={{
  //               display: "flex",
  //               flexDirection: "column",
  //               alignItems: "flex-start",
  //             }}
  //           >
  //             <div style={{ marginRight: "10px" }}>
  //               <Button variant="primary">
  //                 {nodes.path.split("/").pop().split(".")[0]}
  //               </Button>
  //             </div>
  //             <div style={{ marginRight: "10px" }}>
  //               <span>{titles[nodes.path.split("/").pop()]}</span>
  //             </div>
  //             <div
  //               style={{
  //                 marginTop: "20px",
  //                 maxWidth: "100px",
  //                 maxHeight: "100px",
  //               }}
  //             >
  //               <OpenSheetMusicDisplayPreview file={nodes.path} />
  //             </div>
  //           </div>
  //         ) : null}
  //       </div>
  //     }
  //   >
  //     {Array.isArray(nodes.children)
  //       ? nodes.children.map((node) =>
  //           node.children ? (
  //             renderTree(node)
  //           ) : (
  //             <TreeItem
  //               key={node.id}
  //               nodeId={node.id}
  //               label={
  //                 <div
  //                   style={{
  //                     display: "flex",
  //                     flexDirection: "column",
  //                     alignItems: "flex-start",
  //                   }}
  //                 >
  //                   <div style={{ marginRight: "10px" }}>
  //                     <Button variant="primary">
  //                       {node.path.split("/").pop().split(".")[0]}
  //                     </Button>
  //                   </div>
  //                   <div style={{ marginRight: "10px" }}>
  //                     <span>{titles[node.path.split("/").pop()]}</span>
  //                   </div>
  //                   <div
  //                     style={{
  //                       marginTop: "20px",
  //                       maxWidth: "200px",
  //                       maxHeight: "200px",
  //                     }}
  //                   >
  //                     <OpenSheetMusicDisplayPreview file={node.path} />
  //                   </div>
  //                 </div>
  //               }
  //             />
  //           )
  //         )
  //       : null}
  //   </TreeItem>
  // );

  const renderTree = (nodes) => (
    <TreeItem
      key={nodes.id}
      nodeId={nodes.id}
      nodePath={nodes.path}
      label={
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <div style={{ marginRight: "10px", fontSize: 20 }}>{nodes.name}</div>
          {nodes.path ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <div style={{ marginRight: "10px" }}>
                <Button variant="primary">
                  {nodes.path.split("/").pop().split(".")[0]}
                </Button>
              </div>
              <div style={{ marginRight: "10px" }}>
                <span>{titles[nodes.path.split("/").pop()]}</span>
              </div>
            </div>
          ) : null}
        </div>
      }
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) =>
            node.children ? (
              renderTree(node)
            ) : (
              <TreeItem
                key={node.id}
                nodeId={node.id}
                label={
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <div style={{ marginRight: "10px" }}>
                      <Button variant="primary">
                        {node.path.split("/").pop().split(".")[0]}
                      </Button>
                    </div>
                    <div style={{ marginRight: "10px" }}>
                      <span>{titles[node.path.split("/").pop()]}</span>
                    </div>
                  </div>
                }
              >
                <TreeItem
                  nodeId={`${node.id}-score`}
                  label={
                    <div
                      style={{
                        marginTop: "0px",
                        // maxWidth: "600px",
                        // maxHeight: "400px",
                      }}
                    >
                      <OpenSheetMusicDisplayPreview file={node.path} />
                    </div>
                  }
                />
              </TreeItem>
            )
          )
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
      {/* cards to display for levels::------------- */}
      {/* <div className="center" style={{ marginTop: "2rem" }}>
        <h2>Level One</h2>
      </div>
      <div className="center">
        <Row xs={1} md={3} className="g-4" style={{ marginTop: "2rem" }}>
          <Col>
            <ViolinCard
              violinImg={violinImg2}
              subfolder="/levels/levelone"
              ButtonText="Level One"
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
      </div> */}
    </>
  );
};

export default AllLessons;
