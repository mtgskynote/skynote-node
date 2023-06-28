import React from "react";
import { Link } from "react-router-dom";
import { Col, Row, Card, Button } from "react-bootstrap";

import ViolinCard from "./violinImageCard";

import violinImg from "../assets/images/violin/violinDisplay.jpg";
import violinImg2 from "../assets/images/violin/violin1.jpeg";

import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeItem from "@mui/lab/TreeItem";

const levelOneData = {
  id: "root",
  name: "Level One",
  children: [
    {
      id: "1",
      name: "Basic Bowing I",
    },
    {
      id: "2",
      name: "Half Bows II",
    },
    {
      id: "3",
      name: "Little Pieces",
    },
    {
      id: "4",
      name: "2nd Finger",
      children: [
        {
          id: "5",
          name: "Xml File Path",
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
      id: "1",
      name: "Basic Bowing I",
    },
    {
      id: "2",
      name: "Half Bows II",
    },
    {
      id: "3",
      name: "Little Pieces",
    },
    {
      id: "4",
      name: "2nd Finger",
      children: [
        {
          id: "5",
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
      id: "1",
      name: "Basic Bowing I",
    },
    {
      id: "2",
      name: "Half Bows II",
    },
    {
      id: "3",
      name: "Little Pieces",
    },
    {
      id: "4",
      name: "2nd Finger",
      children: [
        {
          id: "5",
          name: "Xml File Path",
        },
      ],
    },
  ],
};

const AllLessons = () => {
  const renderTree = (nodes) => (
    <TreeItem
      key={nodes.id}
      nodeId={nodes.id}
      label={
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ marginRight: "10px", fontSize: 18 }}>{nodes.name}</div>
          <div
            style={{
              width: "50px",
              height: "50px",
              background: "transparent",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {nodes.name}
          </div>
        </div>
      }
      sx={{
        "& .MuiTreeItem-iconContainer": {
          position: "absolute",
          right: 1200,
        },
      }}
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
      <TreeView
        aria-label="rich object"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpanded={["root"]}
        defaultExpandIcon={<ChevronRightIcon />}
        sx={{
          height: 200,
          flexGrow: 1,
          maxWidth: 400,
          overflowY: "auto",
          margin: "2rem",
        }}
        style={{ fontSize: 30 }}
      >
        {renderTree(levelOneData)}
      </TreeView>
      <TreeView
        aria-label="rich object"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpanded={["root"]}
        defaultExpandIcon={<ChevronRightIcon />}
        sx={{
          height: 200,
          flexGrow: 1,
          maxWidth: 400,
          overflowY: "auto",
          margin: "2rem",
        }}
        style={{ fontSize: 30 }}
      >
        {renderTree(levelTwoData)}
      </TreeView>
      <TreeView
        aria-label="rich object"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpanded={["root"]}
        defaultExpandIcon={<ChevronRightIcon />}
        sx={{
          height: 200,
          flexGrow: 1,
          maxWidth: 400,
          overflowY: "auto",
          margin: "2rem",
        }}
        style={{ fontSize: 30 }}
      >
        {renderTree(levelThreeData)}
      </TreeView>

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
