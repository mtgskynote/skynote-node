import React from 'react';
import { FaLinkedinIn } from 'react-icons/fa';
import waddellimg from '../../assets/images/team/GeorgeWaddell.jpeg';
import lonceimg from '../../assets/images/team/lonce_cnm_bust_sm2.jpg';
import rafaelimg from '../../assets/images/team/RafaelRamirez.png';
import OurTeamCSS from './OurTeam.module.css';
import WhiteLogo from '../../components/images/WhiteLogo';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
const OurTeam = () => {
  return (
    <div>
      <div className={OurTeamCSS.siteHeader}>
        <div className={OurTeamCSS.tabRowContainer}>
          <div className={OurTeamCSS.tabRow}>
            <div className={OurTeamCSS.tabLogin}>
              <Link to="/landing" className={OurTeamCSS.tabLink}>
                {' '}
                Home{' '}
              </Link>
            </div>
            <div className={OurTeamCSS.tabLogin}>
              <Link to="/demos" className={OurTeamCSS.tabLink}>
                {' '}
                Demos{' '}
              </Link>
            </div>
            <div className={OurTeamCSS.tabLogin}>
              <Link to="/ourteam" className={OurTeamCSS.tabLink}>
                {' '}
                Our Team{' '}
              </Link>
            </div>
            <div className={OurTeamCSS.tabLogin}>
              <Link to="/research" className={OurTeamCSS.tabLink}>
                {' '}
                Research{' '}
              </Link>
            </div>
            <div className={OurTeamCSS.tabLogin}>
              <Link
                to="https://docs.google.com/forms/d/e/1FAIpQLSdE6QIt2Xfno67jWjBi2SJOB1dImKhmvJYr9Mzi9Qbo1BGHuw/viewform"
                className={OurTeamCSS.tabLink}
              >
                {' '}
                Interest Form{' '}
              </Link>
            </div>
            <div className={OurTeamCSS.tabLogin}>
              <Link to="/register" className={OurTeamCSS.tabLink}>
                {' '}
                Login Register{' '}
              </Link>
            </div>
          </div>

          <div className={OurTeamCSS.dropdown}>
            <input
              type="checkbox"
              id="dropdown-toggle"
              className={OurTeamCSS.dropdownToggle}
            ></input>
            <label className={OurTeamCSS.dropbtn} htmlFor="dropdown-toggle">
              Menu
            </label>
            <div className={OurTeamCSS.dropdownContent}>
              <ul>
                <li>
                  <Link to="/landing" className={OurTeamCSS.tabLink}>
                    {' '}
                    Home{' '}
                  </Link>
                </li>
                <li>
                  <Link to="/demos" className={OurTeamCSS.tabLink}>
                    {' '}
                    Demos{' '}
                  </Link>
                </li>
                <li>
                  <Link to="/ourteam" className={OurTeamCSS.tabLink}>
                    {' '}
                    Our Team{' '}
                  </Link>
                </li>
                <li>
                  <Link to="/research" className={OurTeamCSS.tabLink}>
                    {' '}
                    Research{' '}
                  </Link>
                </li>
                <li>
                  <Link
                    to="https://docs.google.com/forms/d/e/1FAIpQLSdE6QIt2Xfno67jWjBi2SJOB1dImKhmvJYr9Mzi9Qbo1BGHuw/viewform"
                    className={OurTeamCSS.tabLink}
                  >
                    {' '}
                    Interest Form{' '}
                  </Link>
                </li>
                <li>
                  <Link to="/register" className={OurTeamCSS.tabLink}>
                    {' '}
                    Login Register{' '}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className={OurTeamCSS.logoContainer}>
          <WhiteLogo />
        </div>
        <div className={OurTeamCSS.skynoteContainer}>SkyNote</div>
      </div>
      <div className={OurTeamCSS.addspace1}></div>
      <div className={OurTeamCSS.workSectionTop}>
        <div className={OurTeamCSS.topPContainer}>
          <h1> Our Team</h1>
          <div>
            <br></br>
          </div>
          <h2>
            We are a team of researchers and developers, experts in music and
            machine learning
          </h2>
        </div>
      </div>
      <div className={OurTeamCSS.row}>
        <div className={OurTeamCSS.column}>
          <div className={OurTeamCSS.card}>
            <div className={OurTeamCSS.imgContainer}>
              <img src={lonceimg} alt="Write description here" />
            </div>
            <h3>Dr. Lonce Wyse</h3>
            <p>
              Lonce Wyse (Research Fellow, Music Technology Group, UPF) holds a
              PhD in Cognitive and Neural Systems (Boston University, 1994). He
              developed audio technology for research and industry in Singapore
              for 28 years, most recently as an Associate Professor of
              Communications at the National University of Singapore. Research
              topics include deep learning neural networks as interactive sound
              synthesis models, sound perception, real-time musical
              communication and notation, and audio technologies for music
              education.
            </p>
            <div className={OurTeamCSS.icons}>
              <a
                href="https://www.linkedin.com/in/lonce/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>

        <div className={OurTeamCSS.column}>
          <div className={OurTeamCSS.card}>
            <div className={OurTeamCSS.imgContainer}>
              <img src={rafaelimg} alt="Write description here" />
            </div>
            <h3>Dr. Rafael Ramirez</h3>
            <p>
              I obtained my BSc in Mathematics from UNAM, and my MSc in
              Artificial Intelligence and PhD in Computer Science from the
              University of Bristol, UK. I am currently a Professor and the
              Leader of the Head of the Music and Machine Learning Lab at the
              Universitat Pompeu Fabra, Barcelona. I am passionate about
              Artificial Intelligence and Music, and how they can help improving
              people&apos;s lives.
            </p>
            <div className={OurTeamCSS.icons}>
              <a
                href="https://www.linkedin.com/in/rafaelr2/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>

        <div className={OurTeamCSS.column}>
          <div className={OurTeamCSS.card}>
            <div className={OurTeamCSS.imgContainer}>
              <img src={waddellimg} alt="Write description here" />
            </div>
            <h3>Dr.George Waddell</h3>
            <p>
              Dr. George Waddell is Performance Research and Innovation Fellow
              and BMus Area Leader in Performance Science at the Royal College
              of Music. He is also a Module Leader and Honorary Research
              Associate in the Faculty of Medicine at Imperial College London.
              His research focusses on the evaluation of performance, including
              decision-making among judges and audiences and the development of
              evaluative skills, as well as how technology can be used to feed
              analytics data back to performers to enhance their practice.
            </p>
            <div className={OurTeamCSS.icons}>
              <a
                href="https://www.linkedin.com/in/drgeorgewaddell/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default OurTeam;
