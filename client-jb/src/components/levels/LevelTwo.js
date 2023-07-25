import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import XMLParser from "react-xml-parser";
import violinImg from "../../assets/images/violin/violinDisplay.jpg";

const files = [
  "6_Cuerdas_Al_Aire_2_(Suelta)_D.xml",
  "7_Cuerdas_Al_Aire_2_(Suelta)_G.xml",
  "8_Cuerdas_Al_Aire_2_(Suelta)_E.xml",
  "9_Cuerdas_Al_Aire_3_(Suelta)_A.xml",
  "10_Cuerdas_Al_Aire_3_(Suelta)_D.xml",
];

const folderBasePath = "/musicXmlFiles";

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

const LevelTwo = () => {
  const navigate = useNavigate();
  const navigateToFile = (filename) => {
    return navigate(`/all-lessons/${filename}`);
  };

  const [titles, setTitles] = React.useState([]);

  React.useEffect(() => {
    const fetchTitles = async () => {
      const titlePromises = files.map((name) => getTitle(name));
      const titles = await Promise.all(titlePromises);
      setTitles(titles);
    };
    fetchTitles();
  }, []);

  return (
    <Row xs={1} md={4} className="g-4">
      {files.map((name, index) => (
        <Col key={index}>
          <Card style={{ width: "300px" }}>
            <Card.Img
              variant="top"
              src={violinImg}
              style={{ width: "100%", height: "50%", objectFit: "contain" }}
            />
            <Card.Body>
              <Card.Title
                onClick={() => navigateToFile(name)}
                style={{ cursor: "pointer" }}
              >
                {titles[index] || name}
              </Card.Title>
              <Card.Text></Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default LevelTwo;
