import React from "react";
import { Link } from "react-router-dom";
import { Col, Row, Card, Button } from "react-bootstrap";

import ViolinCard from "./violinImageCard";

import violinImg from "../assets/images/violin/violinDisplay.jpg";
import violinImg2 from "../assets/images/violin/violin1.jpeg";

const AllLessons = () => {
  return (
    <>
      <div>
        <h1> All Lessons</h1>
      </div>
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
