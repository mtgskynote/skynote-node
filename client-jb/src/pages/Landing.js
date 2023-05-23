import { Logo } from "../components"; // Named export
import { FaQuestionCircle, FaPeopleArrows, FaMusic , FaUserCircle, FaLinkedinIn, FaClone} from 'react-icons/fa';
import main from "../assets/images/main.svg";
import waddellimg from "../assets/images/team/GeorgeWaddell.jpeg";
import lonceimg from "../assets/images/team/lonce_cnm_bust_sm2.jpg";
import rafaelimg from "../assets/images/team/RafaelRamirez.png";
import pub1_img from "../assets/images/publications/pub1_img.png";
import pub2_img from "../assets/images/publications/pub2_img.png";
import pub3_img from "../assets/images/publications/pub3_img.jpeg";
import pub4_img from "../assets/images/publications/pub4_img.jpeg";
import pub5_img from "../assets/images/publications/pub5_img.jpeg";
import pub6_img from "../assets/images/publications/pub6_img.png";
import pub7_img from "../assets/images/publications/pub7_img.jpeg";
import pub8_img from "../assets/images/publications/pub8_img.png";
import Wrapper from "../assets/wrappers/LandingPage";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const workInfoData = [
  {
    image: <FaQuestionCircle/>,
    title: "What is it?",
    text: "It is an intelligent music learning app based on sound and motion real-time analysis, and artificial intelligence technology.",
  },
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
    title: "Catalogue",
    text: "Catalogue of exercises and pieces from beginner to advanced levels. Reference database of multimodal recordings of experts performing the pieces in the catalogue.",
  },
  {
    image: <FaUserCircle/>,
    title: "Personalized Learning",
    text: "Personalized practice based on individual goals and achievements. A dynamic pedagogical system with multiple possible paths to enhance your music level and tailor your skills development.",
  },
  {
    image: <FaClone/>,
    title: "Multimodal Approach",
    text: "AI-based multimodal analysis and real-time feedback about sound quality, intonation, pitch, timing, dynamics, gestures and expression.",
  },
];

const videoInfoData = [
  {
    videolink: "https://appskynote.com/skynote-media/videos/Skynote1-SoundQuality.mp4#t=15",
    title: "Sound quality",
    text: "In instruments such as the violin, clarinet and trumpet, good sound production is one of the first skills to acquire. SkyNote allows you to improve it using Artificial Intelligence and Audio Analysis" 
  },
  {
    videolink: "https://appskynote.com/skynote-media/videos/Skynote2-Pitch:TimingQuality.mp4#t=11",
    title: "Pitch/timing",
    text: "In music performance playing the correct note (i.e. pitch) at the correct time (i.e. rhythm) is of paramount importance. SkyNote provides pitch and timing accuracy visual feedback to music students." 
  },
  {
    videolink: "https://appskynote.com/skynote-media/videos/Skynote3-BowTechnique.mp4#t=7",
    title: "Posture",
    text: "Mastering an instrument technique is of paramount importance. SkyNote provides students with real-time feedback on their gestures using Artificial Intelligence and motion capture techniques." 
   },
   {
    videolink: "https://appskynote.com/skynote-media/videos/Skynote4-Gestures.mp4#t=25",
    title: "Bowing technique",
    text: "Using Artificial Intelligence and audio analysis, SkyNote provides real-time feedback about the accuracy of bow stroke techniques such as Detaché, Martelé, Spiccato, Ricochet, Sautillé, Staccato and Bariolage, among others." 
   }
   
];

const publications = [
  {
    publicationlink: "https://dl.acm.org/doi/pdf/10.1145/3125571.3125588",
    imagelink: pub1_img,
    text: "A multimodal corpus for technology-enhanced learning of violin playing" 
  },
  {
    publicationlink: "https://dl.acm.org/doi/pdf/10.1145/3212721.3212886",
    imagelink: pub2_img,
    text: "Enhancing Music Learning with Smart Technologies" 
  },
  {
    publicationlink: "https://www.frontiersin.org/articles/10.3389/fpsyg.2021.648479/full?utm_source=S-TWT&utm_medium=SNET&utm_campaign=ECO_FPSYG_XXXXXXXX_auto-dlvrit",
    imagelink: pub3_img,
    text: "Real-Time Sound and Motion Feedback for Violin Bow Technique Learning: A Controlled, Randomized Trial" 
  },
  {
    publicationlink: "https://www.frontiersin.org/articles/10.3389/fpsyg.2019.00344/full",
    imagelink:  pub4_img,
    text: "Bowing Gestures Classification in Violin Performance: A Machine Learning Approach" 
  },
  {
    publicationlink: "https://www.frontiersin.org/articles/10.3389/fpsyg.2019.00334/full",
    imagelink: pub5_img,
    text: "Automatic Assessment of Tone Quality in Violin Music Performance" 
  }, 
  {
    publicationlink: "http://compmus.ime.usp.br/sbcm/2017/papers/sbcm-2017-12.pdf",
    imagelink:  pub6_img,
    text: "Technology Enhanced Learning of Expressive Music Performance" 
  },
  {
    publicationlink: "https://www.frontiersin.org/articles/10.3389/fpsyg.2020.575971/full",
    imagelink: pub7_img,
    text: "Applying Deep Learning Techniques to Estimate Patterns of Musical Gesture" 
  },
  {
    publicationlink: "https://dl.acm.org/doi/pdf/10.1145/3139513.3139525",
    imagelink: pub8_img,
    text: "Bowing Modeling for Violin Students Assistance" 
  }
];

const Landing = () => {
  return (
    <Wrapper>
     
      <div className="container page">
        <div className="info">
        <Logo />
          <h1>
            Instrument <span> Learning </span> App
          </h1>
          <p>
          Sound quality, intonation, rhythm, gestures and expression feedback in one app.
          </p>
          <Link to="/register" className="btn btn-hero">
            Login/Register
          </Link>
        </div>
       
        {/* <img src={main} alt="look-ahead" className="img-main-img" /> */}
      </div>

      <div className="work-section-wrapper">
        <div className="work-section-top">
          <h1 className="primary-heading">SkyNote</h1>
        </div>
        <div className="work-section-bottom">
          {workInfoData.map((data) => (
            <div className="work-section-info">
              {data.image}
              <h2>{data.title}</h2>
              <p>{data.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="work-section-wrapper">
        <div className="work-section-top">
          <h1 className="primary-heading">Artificial Intelligence</h1>
          <div></div>
          <br></br>
          <h2 className="primary-subheading">Sound quality, posture, intonation, pitch, rhythm and expression in music performance</h2>
        </div>
        <div className="work-section-bottom">
          {videoInfoData.map((data) => (
            <div class="column">
            <div class="card">
            <div>
            <h3>{data.title}</h3>
              <div class="ratio ratio-1x1" style={{
        position: 'relative',
        overflow: 'hidden',
      }}>
                <iframe src={data.videolink} title="YouTube video"  autoplay="0" allowfullscreen ></iframe>
              </div>
              <p>{data.text}</p>
            </div>
            </div>
         </div>
          ))}
        </div>
      </div>

      <div className="work-section-wrapper">
        <div className="work-section-top">
          <h1 className="primary-heading">Research</h1>
          <div></div>
          <br></br>
          <h2 className="primary-subheading">Selected Papers</h2>
        </div>
        <div className="work-section-bottom">
          {publications.map((data) => (
            <div class="column">
            <div class="card">
            <div>
            <div>
                <img  src={data.imagelink} class ="img2"/>
              </div>
              <p>{data.text}</p>
              <div class="publicationbtn" >
              <button class="btn btn-outline-dark" href={data.publicationlink}  target="_blank" a>Publication</button>
              </div>
            </div>
            </div>
         </div>
          ))}
        </div>
      </div>

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
