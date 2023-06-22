import violinImg from "../assets/images/violin/violinDisplay.jpg";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const violinImgCard = () => {
  return (
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
              to="/levels/levelone"
              style={{ marginTop: "1.2rem" }}
            >
              Level One
            </Button>
          </div>
        </Card.Title>
      </Card.Body>
    </Card>
  );
};

export default violinImgCard;
