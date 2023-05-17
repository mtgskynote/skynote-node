import { Logo } from "../components"; // Named export
import { FaQuestionCircle, FaPeopleArrows, FaMusic , FaTwitter, FaLinkedinIn, FaGithub} from 'react-icons/fa';
import main from "../assets/images/main.svg";
import waddellimg from "../assets/images/team/GeorgeWaddell.jpeg";
import lonceimg from "../assets/images/team/lonce_cnm_bust_sm2.jpg";
import rafaelimg from "../assets/images/team/RafaelRamirez.png";
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

const videoInfoData = [
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
          <h1 className="primary-heading">SkyNote</h1>
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

      <div className="work-section-wrapper">
        <div className="work-section-top">
          <h1 className="primary-heading">Artificial Intelligence</h1>
          <div><br></br></div>
          <h2 className="primary-subheading">Sound quality, posture, intonation, pitch, rhythm and expression in music performance</h2>
        </div>
        <div className="work-section-bottom">
          {videoInfoData.map((data) => (
            <div className="work-section-info" key={data.title}>
              
              <div className="info-boxes-img-container">
              </div>
              <div class="ratio ratio-1x1">
                <iframe src="https://appskynote.com/skynote-media/videos/Skynote1-SoundQuality.mp4#t=15" title="YouTube video" allowfullscreen></iframe>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* meet the team with three tiles */}
    
      {/* <div className="work-section-top">
        <div className="primary-heading">
            <h1 class="heading">
              Meet the <span> Team </span>
            </h1>
            <div className="profile"></div>
        </div>
      </div> */}

      <div className="work-section-top">
        <h1> Our Team</h1>
        <div><br></br></div>
        <h2 className="primary-subheading">We are a team of researchers and developers experts in music and machine learning</h2>
      </div>
      <div class="row">
        <div class="column">
          <div class="card">
              <div className="img-container">
                <img src={lonceimg}/>
              </div>
              <h3>Dr. Lonce Wyse</h3>
              <p>PhD Cognitive & Neural Systems Deep Learning and Audio, Music Technology Group(UPF)</p>
              <div class="icons">
                <a href="https://www.linkedin.com/in/lonce/" target="_blank"><FaLinkedinIn/></a>
              </div>
          </div>
        </div>
        <div class="column">
          <div class="card">
              <div className="img-container">
                <img src={rafaelimg}/>
              </div>
              <h3>Dr. Rafael Ramirez</h3>
              <p>PhD in Computer Science, Head of the Music and Machine Learning Lab (UPF)</p>
              <div class="icons">
                <a href="https://www.linkedin.com/in/rafaelr2/" target="_blank"><FaLinkedinIn/></a>
              </div>
          </div>
        </div>
        <div class="column">
          <div class="card">
              <div className="img-container">
                <img src={waddellimg}/>
              </div>
              <h3>Dr.George Waddell</h3>
              <p>PhD Music Performance Research Associate, Royal College of Music</p>
              <div class="icons">
                <a href="https://www.linkedin.com/in/drgeorgewaddell/" target="_blank"><FaLinkedinIn/></a>
              </div>
          </div>
        </div>
      </div>  

    </Wrapper>
  );
};

export default Landing;
