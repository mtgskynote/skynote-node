import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import XMLParser from "react-xml-parser";

const files = [
  "Row.xml",
  "74_Minuet_2.xml",
  "50_Tercer_dedo_Ejercicios_2.xml",
  "1_Cuerdas_Al_Aire_1_(Suelta)_A.xml",
  "2_Cuerdas_Al_Aire_1_(Suelta)_D.xml",
  "3_Cuerdas_Al_Aire_1_(Suelta)_G.xml",
  "4_Cuerdas_Al_Aire_1_(Suelta)_E.xml",
  "5_Cuerdas_Al_Aire_2_(Suelta)_A.xml",
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

const LevelOne = () => {
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
              src={require("../../assets/images/violinDisplay.jpg")}
              style={{ width: "100%", height: "50%", objectFit: "contain" }}
            />
            <Card.Body>
              <Card.Title
                onClick={() => navigateToFile(name)}
                style={{ cursor: "pointer" }}
              >
                {titles[index] || name}
              </Card.Title>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default LevelOne;
