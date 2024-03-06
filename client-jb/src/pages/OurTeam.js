import {
    FaLinkedinIn,
  } from "react-icons/fa";
  import waddellimg from "../assets/images/team/GeorgeWaddell.jpeg";
  import lonceimg from "../assets/images/team/lonce_cnm_bust_sm2.jpg";
  import rafaelimg from "../assets/images/team/RafaelRamirez.png";
import Wrapper from "../assets/wrappers/LandingBackPages";
import WhiteLogo from "../components/WhiteLogo";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
const OurTeam = () => {
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
              <div className="tab-login"><Link to="/register" className="tab-link"> Login Register </Link></div>
            </div>


          <div className="dropdown">
            <input type="checkbox" id="dropdown-toggle" className="dropdown-toggle"></input>
            <label className="dropbtn" htmlFor="dropdown-toggle">Menu</label>
            <div className="dropdown-content">
              <ul>
                <li><Link to="/landing" className="tab-link"> Home </Link></li>
                <li><Link to="/demos" className="tab-link"> Demos </Link></li>
                <li><Link to="/ourteam" className="tab-link"> Our Team </Link></li>
                <li><Link to="/research" className="tab-link"> Research </Link></li>
                <li><Link to="https://docs.google.com/forms/d/e/1FAIpQLSdE6QIt2Xfno67jWjBi2SJOB1dImKhmvJYr9Mzi9Qbo1BGHuw/viewform" className="tab-link"> Interest Form </Link></li>
                <li><Link to="/register" className="tab-link"> Login Register </Link></li>
              </ul>
            </div>
          </div> 


          </div>
            <div className="logo-container"> 
              <WhiteLogo/>
            </div>
            <div className="skynote-container">
              SkyNote
            </div>
        </div>
        <div className="addspace1"></div>
         <div className="work-section-top">
         <div className="top-p-container">
        <h1> Our Team</h1>
        <div>
          <br></br>
        </div>
        <h2 className="primary-subheading">
          We are a team of researchers and developers, 
          experts in music and machine learning
        </h2>
        </div>
        </div>
        <div className="row">
                <div className="column">
                <div className="card">
                    <div className="img-container">
                    <img src={lonceimg} />
                    </div>
                    <h3>Dr. Lonce Wyse</h3>
                    <p>
                    Lonce Wyse (Research Fellow, Music Technology Group, UPF) holds a PhD in
                    Cognitive and Neural Systems (Boston University, 1994). He developed
                    audio technology for research and industry in Singapore for 28 years,
                    most recently as an Associate Professor of Communications at the 
                    National University of Singapore. Research topics include  deep learning neural
                    networks as interactive  sound synthesis models, sound perception,
                    real-time musical  communication and notation, and audio technologies
                    for music education.
                    </p>
                    <div className="icons">
                    <a href="https://www.linkedin.com/in/lonce/" target="_blank">
                        <FaLinkedinIn />
                    </a>
                    </div>
                </div>
                </div> 

                <div className="column">
                <div className="card">
                    <div className="img-container">
                    <img src={rafaelimg} />
                    </div>
                    <h3>Dr. Rafael Ramirez</h3>
                    <p>
                    I obtained my BSc in Mathematics from UNAM, and my MSc in Artificial
                    Intelligence and PhD in Computer Science from the University of Bristol,
                    UK. I am currently a Professor and the Leader of the Head of the Music
                    and Machine Learning Lab at the Universitat Pompeu Fabra, Barcelona. I
                    am passionate about Artificial Intelligence and Music, and how they can
                    help improving people's lives.
                    </p>
                    <div className="icons">
                    <a href="https://www.linkedin.com/in/rafaelr2/" target="_blank">
                        <FaLinkedinIn />
                    </a>
                    </div>
                </div>
                </div>

                <div className="column">
                <div className="card">
                    <div className="img-container">
                    <img src={waddellimg} />
                    </div>
                    <h3>Dr.George Waddell</h3>
                    <p>
                    Dr. George Waddell is Performance Research and Innovation Fellow and BMus Area Leader in Performance Science at the Royal College of Music. He is also a Module Leader and Honorary Research Associate in the Faculty of Medicine at Imperial College London. His research focusses on the evaluation of performance, including decision-making among judges and audiences and the development of evaluative skills, as well as how technology can be used to feed analytics data back to performers to enhance their practice.
                    </p>
                    <div className="icons">
                    <a
                        href="https://www.linkedin.com/in/drgeorgewaddell/"
                        target="_blank">
                        <FaLinkedinIn />
                    </a>
                </div> 
                </div> 
                </div> 
            </div> 
    </Wrapper>
    );
};
export default OurTeam;