import { Logo } from "../components"; // Named export
import { FaQuestionCircle, FaPeopleArrows, FaMusic } from 'react-icons/fa';
import main from "../assets/images/main.svg";
import Wrapper from "../assets/wrappers/LandingPage";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const workInfoData = [
  {
    image: <FaQuestionCircle/>,
    title: "Why use it?",
    text: "It empowers students with tools to detect and correct errors, build awareness of their technique, and allow them to practise more efficiently alone or in a class setting.",
  },
  {
    image: <FaPeopleArrows/>,
    title: "Who is it for?",
    text: "It is designed with a wide range of student levels in mind, from beginners to professional players.",
  },
  {
    image: <FaMusic/>,
    title: "Personalized Learning",
    text: "Personalized practice based on individual goals and achievements. A dynamic pedagogical system with multiple possible paths to enhance your music level and tailor your skills development.",
  },
];

const Landing = () => {
  return (
    <Wrapper>
      <nav>
        <Logo />
      </nav>
      {/*info*/}
      <div className="container page">
        <div className="info">
          <h1>
            Violin <span> Learning </span> App
          </h1>
          <p>
            It is an intelligent music learning app based on sound and motion
            real-time analysis, and artificial intelligence technology.
          </p>
          <Link to="/register" className="btn btn-hero">
            Login/Register
          </Link>
        </div>
        <img src={main} alt="look-ahead" className="img-main-img" />
      </div>

      <div className="work-section-wrapper">
      <div className="work-section-top">
        <p className="primary-subheading">SkyNote</p>
        <h1 className="primary-heading">SkyNote</h1>
        {/* <p className="primary-text">
          Lorem ipsum dolor sit amet consectetur. Non tincidunt magna non et
          elit. Dolor turpis molestie dui magnis facilisis at fringilla quam.
        </p> */}
      </div>
      <div className="work-section-bottom">
        {workInfoData.map((data) => (
          <div className="work-section-info" key={data.title}>
            {data.image}
            <div className="info-boxes-img-container">
            </div>
            <h2>{data.title}</h2>
            <p>{data.text}</p>
          </div>
        ))}
      </div>
    </div>
    </Wrapper>
  );
};

export default Landing;
