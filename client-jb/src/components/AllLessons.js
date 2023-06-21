import React from "react";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Button } from "react-bootstrap";

const AllLessons = () => {
  return (
    <>
      <div className="center" style={{ marginTop: "2rem" }}>
        <h2>Progress</h2>
      </div>
      <div className="center">
        <Row xs={1} md={3} className="g-4" style={{ marginTop: "2rem" }}>
          <Col>
            <Card style={{ width: "500px" }}>
              <Card.Img
                variant="top"
                src={require("../assets/images/violinDisplay.jpg")}
                style={{ width: "100%", height: "50%", objectFit: "contain" }}
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
                      Level One
                    </Button>
                  </div>
                </Card.Title>
                <Card.Text></Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card style={{ width: "500px" }}>
              <Card.Img
                variant="top"
                src={require("../assets/images/violinDisplay.jpg")}
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
            <Card style={{ width: "500px" }}>
              <Card.Img
                variant="top"
                src={require("../assets/images/violinDisplay.jpg")}
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
