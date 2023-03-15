import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import XMLParser from "react-xml-parser";

const files = [
  "6. Cuerdas_Al_Aire_2_(Suelta)_D.xml",
  "7. Cuerdas_Al_Aire_2_(Suelta)_G.xml",
  "8. Cuerdas_Al_Aire_2_(Suelta)_E.xml",
  "9. Cuerdas_Al_Aire_3_(Suelta)_A.xml",
  "10. Cuerdas_Al_Aire_3_(Suelta)_D.xml",
];

const folderBasePath = "/musicXmlFiles";

const getTitle = (fileName) => {
  return new Promise((resolve, rej) => {
    fetch(`${folderBasePath}/${fileName}`)
      .then((response) => response.text())
      .then((xmlFileData) => {
        let arr = new XMLParser()
          .parseFromString(xmlFileData)
          .getElementsByTagName("movement-title");
        if (arr && arr.length > 0) {
          resolve(arr[0].value);
        } else {
          resolve("movement-title"); // write filename here (fileName) if want to display the file name.
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  });
};

const LevelTwo = () => {
  const navigate = useNavigate();
  const navigateToFile = (filename) => {
    return navigate(`/progress/${filename}`);
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
          <Card style={{ width: "500px" }}>
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
              <Card.Text></Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default LevelTwo;
