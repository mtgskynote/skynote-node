import skynote_demo from "../assets/videos/SNDemo-3.mp4";
import BackgroundImage from "../components/BackgroundImage";
import WhiteLogo from "../components/WhiteLogo";
import Wrapper from "../assets/wrappers/LandingPage";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Violinist from "../components/Violinist";
import Violinist2 from "../components/Violinist-2";
import Violinist3 from "../components/Violinist-3";

const Landing = () => {
  return (
    <Wrapper>
      <div className="site-header">
        <div className="tab-row-container">
          <div className="tab-row">
              <div className="tab-login"><Link to="/landing" className="tab-link"> Home </Link></div>
              <div className="tab-login"><Link to="/demos" className="tab-link"> Demos </Link></div>
              <div className="tab-login"><Link to="/ourteam" className="tab-link"> Our Team </Link></div>
              <div className="tab-login"><Link to="/research" className="tab-link"> Research </Link></div>
              <div className="tab-login"><Link to="https://docs.google.com/forms/d/e/1FAIpQLSdE6QIt2Xfno67jWjBi2SJOB1dImKhmvJYr9Mzi9Qbo1BGHuw/viewform" className="tab-link"> Interest Form </Link></div>
              <div className="tab-login"><Link to="/register" className="tab-link"> Login/Register </Link></div>
          </div>
        </div>
        <div className="logo-container"> 
          <WhiteLogo/>
        </div>
        <div className="skynote-container">
          SkyNote
        </div>
      </div>
      <div className="work-section-top">
        <div>
         <div className="background-image-container">
          <div className="background-image">
          <BackgroundImage />
        </div>
        </div> 
        <div className="background-image-overlay">
          <h2>
            Enhance Your Musical Abilities With SkyNote
          </h2>
          <p>
          An intelligent music learning app based on real-time sound and motion analysis, backed by artificial intelligence technology.
          </p>
          <div className="login-button">
            <Link to="/register" className="login-link">
              Sign Up
            </Link>
          </div>
          <div className="interest-link">
            <Link to="https://docs.google.com/forms/d/e/1FAIpQLSdE6QIt2Xfno67jWjBi2SJOB1dImKhmvJYr9Mzi9Qbo1BGHuw/viewform">Click here to stay updated on all things SkyNote</Link>
          </div>
        </div>
        <div className="iphone-container">
          <video autoPlay muted loop className="background-video">
            <source src={skynote_demo} type="video/mp4" />
          </video> 
          <div className="iphone-notch"></div>
        </div>
        </div>
      </div> 
      <div>
      <div className="image-container">
        <Violinist/>
      </div>
      <div className="text-container-1">
        <h2>
          Personalized Learning
        </h2>
        <p>
        With SkyNote, enhance your musical abilities with personalized goals and achievements. <br/>
        <br/>Our dynamic system has multiple learning paths that help to develop different skills.<br/>
        <br/>Using AI-based multimodal analysis, SkyNote gives students live feedback on sound quality, intonation, pitch, rhythm, dynamics, gestures, and expressions.
        </p>
      </div>
      </div>
      <div className="text-container-2">
          <h2>
            For Teachers and Students
          </h2>
          <p>
            SkyNote empowers students with tools to detect and correct errors, building awareness of their technique.<br/>
            <br/>Our app aims to eliminate the lack of feedback between lessons and independent rehearsal for students, allowing them to practice more efficiently alone or in a class setting.<br/>
            <br/>SkyNote has been designed with both teachers and students from a wide range of levels in mind, from begginers to professional players.<br/>
          </p>
        </div>
        <div className="image-container-2">
          <Violinist2/>
      </div>
      <div className="image-container-3">
        <Violinist3/>
      </div>
      <div>
        <div className="text-container-3">
          <h2>
            Catalogue
          </h2>
          <p>
            Enjoy our catalogue of exercises and pieces that focus on specific skills and vary in difficulty level.<br/>
            <br/>Also available to SkyNote users are recordings from experts performing the pieces in our catalogue.<br/>
            <br/>If you have a specific piece or exercise you would like to practice in SkyNote, you can also import pieces from MusicXML files in the app. <br/>
          </p>
        </div>
      </div>
      <div>
        <div className="bottom-container">
          <h2>Experience SkyNote today</h2>
          <div className="login-button-bottom">
            <Link to="/register" className="login-link-bottom">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Landing;