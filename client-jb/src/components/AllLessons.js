import { React, useState } from "react";
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
    },
    {
      id: "12",
      name: "Half Bows II",
    },
    {
      id: "13",
      name: "Little Pieces",
    },
    {
      id: "14",
      name: "Easy Rhymes",
      children: [
        {
          id: "15",
          name: "Row Row Row Your Boat",
          path: "/all-lessons/Row.xml",
        },
        {
          id: "16",
          name: "Twinkle Twinkle",
          path: "/all-lessons/Row.xml",
        },
      ],
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

  const renderTree = (nodes) => (
    <TreeItem
      key={nodes.id}
      nodeId={nodes.id}
      nodePath={nodes.path}
      // if nodeId exists then add a button that links to the path

      label={
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ marginRight: "10px", fontSize: 20 }}>{nodes.name}</div>
          {nodes.path ? (
            <Link to={nodes.path}>
              <Button variant="primary">
                {nodes.path.split("/").pop().split(".")[0]}
              </Button>
            </Link>
          ) : null}
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
        ? nodes.children.map((node) => renderTree(node))
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

      <div className="center" style={{ marginTop: "2rem" }}>
        <h2>Level Two</h2>
      </div>
      <div className="center">
        <Row xs={1} md={3} className="g-4" style={{ marginTop: "2rem" }}>
          <Col>
            <ViolinCard
              violinImg={violinImg2}
              subfolder="/levels/levelone"
              ButtonText="Advanced Bowing"
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

      <div className="center" style={{ marginTop: "2rem" }}>
        <h2>Level Three</h2>
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
