import React from "react";
import { Link } from "react-router-dom";
import { Col, Row, Card, Button } from "react-bootstrap";

import violinImgCard from "./violinImgCard";
import Logo from "./Logo";
import violinImageCard from "./violinImageCard";

import violinImg from "../assets/images/violin/violinDisplay.jpg";
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
            <Card style={{ width: "500px", margin: "1.2rem" }}>
              <Card.Img
                variant="top"
                src={violinImg}
                style={{
                  width: "100%",
                  height: "50%",
                  objectFit: "contain",
                }}
              />
              <Card.Body style={{ height: "100px" }}>
                <Card.Title>
                  <div className="center">
                    <Button
                      variant="primary"
                      as={Link}
                      to="/levels/levelone"
                      style={{ marginTop: "1.2rem" }}
                    >
                      Basic Bowing
                    </Button>
                  </div>
                </Card.Title>
                <Card.Text></Card.Text>
              </Card.Body>
            </Card>
            <violinImgCard />
            {/* <Logo width={175} height={75} /> */}
            <violinImageCard width={175} height={75} />
          </Col>
          <Col>
            <Card style={{ width: "500px", margin: "1.2rem" }}>
              <Card.Img
                variant="top"
                src={violinImg}
                style={{ width: "100%", height: "50%", objectFit: "contain" }}
              />
              <Card.Body style={{ height: "100px", marginBottom: "0" }}>
                <Card.Title>
                  <div className="center">
                    <Button
                      variant="primary"
                      as={Link}
                      to="/levels/leveltwo"
                      style={{ marginTop: "1.2rem" }}
                    >
                      Level Two
                    </Button>
                  </div>
                </Card.Title>
                <Card.Text></Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card style={{ width: "500px", margin: "1.2rem" }}>
              <Card.Img
                variant="top"
                src={violinImg}
                style={{ width: "100%", height: "50%", objectFit: "contain" }}
              />
              <Card.Body style={{ height: "100px", marginBottom: "0" }}>
                <Card.Title>
                  <div className="center">
                    <Button
                      variant="primary"
                      as={Link}
                      to="/levels/levelthree"
                      style={{ marginTop: "1.2rem" }}
                    >
                      Level Three
                    </Button>
                  </div>
                </Card.Title>
                <Card.Text></Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      <div className="center" style={{ marginTop: "2rem" }}>
        <h2>Level Two</h2>
      </div>
      <div className="center">
        <Row xs={1} md={3} className="g-4" style={{ marginTop: "2rem" }}>
          <Col>
            <Card style={{ width: "500px", margin: "1.2rem" }}>
              <Card.Img
                variant="top"
                src={violinImg}
                style={{
                  width: "100%",
                  height: "50%",
                  objectFit: "contain",
                }}
              />
              <Card.Body style={{ height: "100px" }}>
                <Card.Title>
                  <div className="center">
                    <Button
                      variant="primary"
                      as={Link}
                      to="/levels/levelone"
                      style={{ marginTop: "1.2rem" }}
                    >
                      Basic Bowing
                    </Button>
                  </div>
                </Card.Title>
                <Card.Text></Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card style={{ width: "500px", margin: "1.2rem" }}>
              <Card.Img
                variant="top"
                src={violinImg}
                style={{ width: "100%", height: "50%", objectFit: "contain" }}
              />
              <Card.Body style={{ height: "100px", marginBottom: "0" }}>
                <Card.Title>
                  <div className="center">
                    <Button
                      variant="primary"
                      as={Link}
                      to="/levels/leveltwo"
                      style={{ marginTop: "1.2rem" }}
                    >
                      Level Two
                    </Button>
                  </div>
                </Card.Title>
                <Card.Text></Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card style={{ width: "500px", margin: "1.2rem" }}>
              <Card.Img
                variant="top"
                src={violinImg}
                style={{ width: "100%", height: "50%", objectFit: "contain" }}
              />
              <Card.Body style={{ height: "100px", marginBottom: "0" }}>
                <Card.Title>
                  <div className="center">
                    <Button
                      variant="primary"
                      as={Link}
                      to="/levels/levelthree"
                      style={{ marginTop: "1.2rem" }}
                    >
                      Level Three
                    </Button>
                  </div>
                </Card.Title>
                <Card.Text></Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default AllLessons;
