//import { Logo } from "../components"; // Named export

import {
  FaQuestionCircle,
  FaPeopleArrows,
  FaMusic,
  FaUserCircle,
  FaLinkedinIn,
  FaClone,
} from "react-icons/fa";
import main from "../assets/images/main.svg";
import skynote_demo from "../assets/videos/SNDemo-3.mp4";
import BackgroundImage from "../components/BackgroundImage";
import WhiteLogo from "../components/WhiteLogo";
import Wrapper from "../assets/wrappers/LandingPage";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Violinist from "../components/Violinist";
import Violinist2 from "../components/Violinist-2";
import Violinist3 from "../components/Violinist-3";

{ /* const workInfoData = [
  {
    image: <FaQuestionCircle />,
    title: "What is it?",
    text: "It is an intelligent music learning app based on sound and motion real-time analysis, and artificial intelligence technology.",
  },
  {
    image: <FaQuestionCircle />,
    title: "Why use it?",
    text: "It empowers students with tools to detect and correct errors, build awareness of their technique, and allow them to practise more efficiently alone or in a class setting.",
  },
  {
    image: <FaPeopleArrows />,
    title: "Who is it for?",
    text: "It is designed with a wide range of student levels in mind, from beginners to professional players.",
  },
  {
    image: <FaMusic />,
    title: "Catalogue",
    text: "Catalogue of exercises and pieces from beginner to advanced levels. Reference database of multimodal recordings of experts performing the pieces in the catalogue.",
  },
  {
    image: <FaUserCircle />,
    title: "Personalized Learning",
    text: "Personalized practice based on individual goals and achievements. A dynamic pedagogical system with multiple possible paths to enhance your music level and tailor your skills development.",
  },
  {
    image: <FaClone />,
    title: "Multimodal Approach",
    text: "AI-based multimodal analysis and real-time feedback about sound quality, intonation, pitch, timing, dynamics, gestures and expression.",
  },
]; */}

{/* const videoInfoData = [
  {
    videolink:
      "https://appskynote.com/skynote-media/videos/Skynote1-SoundQuality.mp4#t=15",
    title: "Sound quality",
    text: "In instruments such as the violin, clarinet and trumpet, good sound production is one of the first skills to acquire. SkyNote allows you to improve it using Artificial Intelligence and Audio Analysis",
  },
  {
    videolink:
      "https://appskynote.com/skynote-media/videos/Skynote2-Pitch:TimingQuality.mp4#t=11",
    title: "Pitch/timing",
    text: "In music performance playing the correct note (i.e. pitch) at the correct time (i.e. rhythm) is of paramount importance. SkyNote provides pitch and timing accuracy visual feedback to music students.",
  },
  {
    videolink:
      "https://appskynote.com/skynote-media/videos/Skynote3-BowTechnique.mp4#t=7",
    title: "Posture",
    text: "Mastering an instrument technique is of paramount importance. SkyNote provides students with real-time feedback on their gestures using Artificial Intelligence and motion capture techniques.",
  },
  {
    videolink:
      "https://appskynote.com/skynote-media/videos/Skynote4-Gestures.mp4#t=25",
    title: "Bowing technique",
    text: "Using Artificial Intelligence and audio analysis, SkyNote provides real-time feedback about the accuracy of bow stroke techniques such as Detaché, Martelé, Spiccato, Ricochet, Sautillé, Staccato and Bariolage, among others.",
  },
]; */}

{/* const publications = [
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
]; */}

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
        {/* <div className="background-video-container">
          <video autoPlay muted loop className="background-video">
            <source src={skynote_demo} type="video/mp4" />
          </video>  */}
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
    
        {/* <div className="logo-container"> 
          <WhiteLogo/>
      </div>
        {/* <div className="tab-row-container">
        <div className="tab-row">
          <Link className="tab-link"> Our Team </Link> 
          <Link className="tab-link"> Research </Link>
          <Link className="tab-link"> Interest Form </Link>
          <div className="tab-login"><Link to="/register" className="tab-link"> Login/Register </Link></div>
        </div>
</div> */}
        {/* <div className="tag-line-top">
          <h1>
            Intelligent |<span> Responsive | </span> Personalized
          </h1>
          </div>
          <div className="top-p-container">
          <p>
            SkyNote uses real-time audio and motion analysis alongside artifical intelligence technology to provide live feedback on sound quality, intonation, rhythm, gestures, and expressions all in one app.
          </p>
          </div>
          {/* <Link to="/register" className="btn btn-hero">
            Login/Register
  </Link> 
      </div> 
</div>
{/*}
      <div className="work-section-wrapper">
        <div className="work-section-top">
          <div className="app-info-container">
            <div className="info-container-right">
              <h2> Sound Quality</h2>
              <p>
              In music, quality sound production is one of the first skills you acquire. With the help of AI and Audio Analysis, SkyNote helps to improve sound quality.
              </p>
            </div>
            <div className="info-container-left">
              <video controls>
                <source src="https://appskynote.com/skynote-media/videos/Skynote1-SoundQuality.mp4#t=15" />
              </video>
            </div>
          </div>
          </div> 
      </div>
    

      <div className="work-section-wrapper">
        <div className="work-section-top">
          <div className="app-info-container">
          <div className="info-container-right">
              <video controls>
                <source src="https://appskynote.com/skynote-media/videos/Skynote2-Pitch:TimingQuality.mp4#t=11" />
              </video>
            </div>
            <div className="info-container-left">
              <h2>Pitch and Rhythm</h2>
              <p>Playing the right note at the right time is important. SkyNote provides pitch and rhythm accuracy with visual feedback.</p>
            </div>
          </div>
          </div> 
      </div>

      <div className="work-section-wrapper">
        <div className="work-section-top">
          <div className="app-info-container">
            <div className="info-container-right-posture">
              <h2> Posture </h2>
              <p> SkyNote gives students real-time feedback on their gestures using AI and motion capture techniques. </p>
            </div>
            <div className="info-container-left">
              <video controls>
                <source src="https://appskynote.com/skynote-media/videos/Skynote3-BowTechnique.mp4#t=7" />
              </video>
            </div>
          </div>
          </div> 
      </div>

      <div className="work-section-wrapper">
        <div className="work-section-top">
          <div className="app-info-container">
          <div className="info-container-right">
              <video controls>
                <source src="https://appskynote.com/skynote-media/videos/Skynote4-Gestures.mp4#t=25"/>
              </video>
            </div>
            <div className="info-container-left">
              <h2>Bowing Technique</h2>
              <p>Using AI And audio analysis, SkyNote produces feedback about your accuracy of bow stroke techniques.</p>
            </div>
          </div>
          </div> 
      </div>
          {/* <h1 className="primary-heading">SkyNote</h1>
        <div className="work-section-bottom">
          {workInfoData.map((data) => (
            <div className="work-section-info">
              {data.image}
              <h2>{data.title}</h2>
              <p>{data.text}</p>
            </div>
          ))}
        </div> */}

     {/* <div className="work-section-wrapper">
        <div className="work-section-top">
          <h1 className="primary-heading">Artificial Intelligence</h1>
          <div></div>
          <br></br>
          <h2 className="primary-subheading">
            Sound quality, posture, intonation, pitch, rhythm and expression in
            music performance
          </h2>
      </div> 
        <div className="work-section-bottom">
          {videoInfoData.map((data) => (
            <div class="column">
              <div class="card">
                <div>
                  <h3>{data.title}</h3>
                  <div
                    class="ratio ratio-1x1"
                    style={{
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <video controls>
                      <source src={data.videolink} />
                    </video>
                  </div>
                  <p>{data.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
       </div> */}
{/*}
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
                    <img src={data.imagelink} class="img2" />
                  </div>
                  <p>{data.text}</p>
                  <div class="publicationbtn">
                    <button
                      class="btn btn-outline-dark"
                      href={data.publicationlink}
                      target="_blank"
                      a
                    >
                      Publication
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
          </div> */}
      {/*
      <div className="work-section-top">
        <h1> Our Team</h1>
        <div>
          <br></br>
        </div>
        <h2 className="primary-subheading">
          We are a team of researchers and developers experts in music and
          machine learning
        </h2>
        </div> */}
    {/*  <div class="row">
        <div class="column">
          <div class="card">
            <div className="img-container">
              <img src={lonceimg} />
            </div>
            <h3>Dr. Lonce Wyse</h3>
            <p>
              PhD Cognitive & Neural Systems Deep Learning and Audio, Music
              Technology Group(UPF)
            </p>
            <div class="icons">
              <a href="https://www.linkedin.com/in/lonce/" target="_blank">
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div> */}

        {/* <div class="column">
          <div class="card">
            <div className="img-container">
              <img src={rafaelimg} />
            </div>
            <h3>Dr. Rafael Ramirez</h3>
            <p>
              PhD in Computer Science, Head of the Music and Machine Learning
              Lab (UPF)
            </p>
            <div class="icons">
              <a href="https://www.linkedin.com/in/rafaelr2/" target="_blank">
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>

        <div class="column">
          <div class="card">
            <div className="img-container">
              <img src={waddellimg} />
            </div>
            <h3>Dr.George Waddell</h3>
            <p>
              PhD Music Performance Research Associate, Royal College of Music
            </p>
            <div class="icons">
              <a
                href="https://www.linkedin.com/in/drgeorgewaddell/"
                target="_blank"
              >
                <FaLinkedinIn />
              </a>
          </div> 
          </div> 
          </div> 
      </div> */}

    </Wrapper>
  );
};

export default Landing;

/*
<div className="addspace">
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSdE6QIt2Xfno67jWjBi2SJOB1dImKhmvJYr9Mzi9Qbo1BGHuw/viewform"
            class="btn-link"
          >
            Fill this form to show your interest in SkyNote and receive an email
            about updates!
          </a>
        </div> */ 

        