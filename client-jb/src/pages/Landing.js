import skynote_demo from "../assets/videos/SNDemo-3.mp4";
import BackgroundImage from "../components/BackgroundImage";
import WhiteLogo from "../components/WhiteLogo";
import LandingCSS from './Landing.module.css';
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Violinist from "../components/Violinist";
import Violinist2 from "../components/Violinist-2";
import Violinist3 from "../components/Violinist-3";

import cimg1 from "../assets/images/CREDIT_accio.jpg";
import cimg2 from "../assets/images/Logo_Tecniospring_INDUSTRY_transparent.png";
import cimg3 from "../assets/images/EU_emblem_and_funding_declaration_EN.PNG";



const Landing = () => {


  return (
    <div>
      <div className={LandingCSS.siteHeader}>
        <div className={LandingCSS.tabRowContainer}>
          <div className={LandingCSS.tabRow}>
              <div className={LandingCSS.tabLogin}><Link to="/landing" className={LandingCSS.tabLink}> Home </Link></div>
              <div className={LandingCSS.tabLogin}><Link to="/demos" className={LandingCSS.tabLink}> Demos </Link></div>
              <div className={LandingCSS.tabLogin}><Link to="/ourteam" className={LandingCSS.tabLink}> Our Team </Link></div>
              <div className={LandingCSS.tabLogin}><Link to="/research" className={LandingCSS.tabLink}> Research </Link></div>
              <div className={LandingCSS.tabLogin}><Link to="https://docs.google.com/forms/d/e/1FAIpQLSdE6QIt2Xfno67jWjBi2SJOB1dImKhmvJYr9Mzi9Qbo1BGHuw/viewform" className={LandingCSS.tabLink}> Interest Form </Link></div>
              <div className={LandingCSS.tabLogin}><Link to="/register" className={LandingCSS.tabLink}> Login Register </Link></div>
          </div>


          <div className={LandingCSS.dropdown}>
            <input type="checkbox" id="dropdown-toggle" className={LandingCSS.dropdownToggle}></input>
            <label className={LandingCSS.dropbtn} htmlFor="dropdown-toggle">Menu</label>
            <div className={LandingCSS.dropdownContent}>
              <ul>
                <li><Link to="/landing" className={LandingCSS.tabLink}> Home </Link></li>
                <li><Link to="/demos" className={LandingCSS.tabLink}> Demos </Link></li>
                <li><Link to="/ourteam" className={LandingCSS.tabLink}> Our Team </Link></li>
                <li><Link to="/research" className={LandingCSS.tabLink}> Research </Link></li>
                <li><Link to="https://docs.google.com/forms/d/e/1FAIpQLSdE6QIt2Xfno67jWjBi2SJOB1dImKhmvJYr9Mzi9Qbo1BGHuw/viewform" className={LandingCSS.tabLink}> Interest Form </Link></li>
                <li><Link to="/register" className={LandingCSS.tabLink}> Login Register </Link></li>
              </ul>
            </div>
          </div>  

        </div>

        <div className={LandingCSS.logoContainer}> 
          <WhiteLogo/>
        </div>
        <div className={LandingCSS.skynoteContainer}>
          SkyNote
        </div>
      </div>
   

      <div className={LandingCSS.workSectionTop}>
        <div>
         <div className={LandingCSS.backgroundImageContainer}>
          <div className={LandingCSS.backgroundImage}>
              <BackgroundImage imgClassName={LandingCSS.backgroundImage}/>
          
            <div className={LandingCSS.backgroundImageOverlay}>
              <h2>
                Enhance Your Musical Abilities With SkyNote
              </h2>
              <p>
                An intelligent music learning app based on real-time sound and motion analysis, backed by artificial intelligence technology.
              </p>
              <div id= "overlay-signup-button" className={LandingCSS.loginButton}>
                <Link to="/register" className="login-link">
                  Sign Up
                </Link>
              </div>
              <div className={LandingCSS.interestLink}>
                <Link to="https://docs.google.com/forms/d/e/1FAIpQLSdE6QIt2Xfno67jWjBi2SJOB1dImKhmvJYr9Mzi9Qbo1BGHuw/viewform">Stay updated on SkyNote</Link>
              </div>
            </div>
          </div> 
        </div>

        </div>
        
        <div className={LandingCSS.iphoneContainer}>
          <video autoPlay muted loop className={LandingCSS.backgroundVideo}>
            <source src={skynote_demo} type="video/mp4" />
          </video> 
          <div className={LandingCSS.iphoneNotch}></div>
        </div>

      </div> 





      <div className={LandingCSS.gridContainer}>
        <div className={LandingCSS.gridItem}>
            <div className={LandingCSS.gridTextContainer}>
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

        <div className={LandingCSS.gridItem}>
        <Violinist/>

        </div>

        </div>
        <div className={LandingCSS.gridContainer}>

        <div className={LandingCSS.gridItem}>
          <Violinist2/>
        </div>
        <div className={LandingCSS.gridItem}>

            <div className={LandingCSS.gridTextContainer}>
              <h2>
                For Teachers and Students
              </h2>
              <p>
                SkyNote empowers students with tools to detect and correct errors, building awareness of their technique.<br/>
                <br/>Our app aims to eliminate the lack of feedback between lessons and independent rehearsal for students, allowing them to practice more efficiently alone or in a class setting.<br/>
                <br/>SkyNote has been designed with both teachers and students from a wide range of levels in mind, from begginers to professional players.<br/>
              </p>
            </div>

        </div>


        </div>
        <div className={LandingCSS.gridContainer}>



        <div className={LandingCSS.gridItem}>


            <div className={LandingCSS.gridTextContainer}>
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
        <div className={LandingCSS.gridItem}>
          <Violinist3/>
        </div>
      </div>


      <div>
        <div className={LandingCSS.bottomContainer}>
          <h2>Experience SkyNote today</h2>
          <div>
          <div className={LandingCSS.loginButtonBottom}>
            <Link to="/register" className={LandingCSS.loginLinkBottom}>
              Sign Up
            </Link>
          </div>
          </div>
        </div>
        <div className={LandingCSS.creditscontainer}>
        <img className={LandingCSS.creditsimg} src={cimg1} alt="img 1"/>
        <img className={LandingCSS.creditsimgtio} src={cimg2} alt="img 2"/>
        <img className={LandingCSS.creditsimgeu} src={cimg3} alt="img 3"/>
        </div>
      </div>
    </div>
  );
};

export default Landing;