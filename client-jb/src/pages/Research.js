import Wrapper from "../assets/wrappers/LandingBackPages";
import pub1_img from "../assets/images/publications/pub1_img.png";
import pub2_img from "../assets/images/publications/pub2_img.png";
import pub3_img from "../assets/images/publications/pub3_img.jpeg";
import pub4_img from "../assets/images/publications/pub4_img.jpeg";
import pub5_img from "../assets/images/publications/pub5_img.jpeg";
import pub6_img from "../assets/images/publications/pub6_img.png";
import pub7_img from "../assets/images/publications/pub7_img.jpeg";
import pub8_img from "../assets/images/publications/pub8_img.png";
import pub9_img from "../assets/images/Violinist-2.jpg";


import pub9 from "../assets/papers/SkyNote_CSEDU2023.pdf"

import MusicTech from "../components/MusicTech.js";
import WhiteLogo from "../components/WhiteLogo";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const publications = [
  {
    publicationlink: "https://dl.acm.org/doi/pdf/10.1145/3125571.3125588",
    imagelink: pub1_img,
    text: "A multimodal corpus for technology-enhanced learning of violin playing",

  },
  {
    publicationlink: "https://dl.acm.org/doi/pdf/10.1145/3212721.3212886",
    imagelink: pub2_img,
    text: "Enhancing Music Learning with Smart Technologies",
  },
  {
    publicationlink:
      "https://www.frontiersin.org/articles/10.3389/fpsyg.2021.648479/full?utm_source=S-TWT&utm_medium=SNET&utm_campaign=ECO_FPSYG_XXXXXXXX_auto-dlvrit",
    imagelink: pub3_img,
    text: "Real-Time Sound and Motion Feedback for Violin Bow Technique Learning: A Controlled, Randomized Trial",
  },
  {
    publicationlink:
      "https://www.frontiersin.org/articles/10.3389/fpsyg.2019.00344/full",
    imagelink: pub4_img,
    text: "Bowing Gestures Classification in Violin Performance: A Machine Learning Approach",
  },
  {
    publicationlink:
      "https://www.frontiersin.org/articles/10.3389/fpsyg.2019.00334/full",
    imagelink: pub5_img,
    text: "Automatic Assessment of Tone Quality in Violin Music Performance",
  },
  {
    publicationlink:
      "http://compmus.ime.usp.br/sbcm/2017/papers/sbcm-2017-12.pdf",
    imagelink: pub6_img,
    text: "Technology Enhanced Learning of Expressive Music Performance",
  },
  {
    publicationlink:
      "https://www.frontiersin.org/articles/10.3389/fpsyg.2020.575971/full",
    imagelink: pub7_img,
    text: "Applying Deep Learning Techniques to Estimate Patterns of Musical Gesture",
  },
  {
    publicationlink: "https://dl.acm.org/doi/pdf/10.1145/3139513.3139525",
    imagelink: pub8_img,
    text: "Bowing Modeling for Violin Students Assistance",
  },
  {
    publicationlink: pub9,
    imagelink: pub9_img,
    text: "Ramirez, R. and Wyse, L. (2023) SkyNote: An AI-Enhanced Learning System for Violin, 15th International Conference on Computer Supported Education, (pg 58) Prague, Czech Republic April 21 - 23, 2023",
  }
];

const Research = () => {
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


            <div class="dropdown">
            <input type="checkbox" id="dropdown-toggle" class="dropdown-toggle"></input>
            <label class="dropbtn" for="dropdown-toggle">Menu</label>
            <div class="dropdown-content">
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
        <div className="addspace"></div>
        

     <div className="work-section-wrapper">
        <div className="work-section-top">
          <div className="addspace2"></div>
      </div> 
      
       </div> 
      <div className="work-section-top">
        <div className="violinipad-container">
           <div className="violinipad">
           <MusicTech/>
           </div>
           </div>
          <div className="violinipad-overlay">
            <h1>Research</h1>
            <h2>Discover whats current in Music Technology</h2>
          </div>
          </div>
      <div className="work-section-wrapper">
        <div className="addspace4"></div>
        <div className="work-section-bottom">
          {publications.map((data) => (  
            <div class="posts">
              <div class="card">
                <div>
                  <div class="centercontainer">
                    <img src={data.imagelink} class="img2" />
                  </div>
                  <div align="center">
                      <p>{data.text}</p>
                    </div>
                  <div>
                  <Link
                      // class="btn btn-outline-dark"
                      to={data.publicationlink}
                      target="_blank"
                    >
                     <div class="publicationbtn">
                      <p>Link</p>
                     </div> 
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div> 
          </Wrapper>
          );
      };
export default Research;
