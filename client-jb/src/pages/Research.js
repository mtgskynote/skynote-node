import ResearchCSS from './Research.module.css';
import pub1_img from '../assets/images/publications/pub1_img.png';
import pub2_img from '../assets/images/publications/pub2_img.png';
import pub3_img from '../assets/images/publications/pub3_img.jpeg';
import pub4_img from '../assets/images/publications/pub4_img.jpeg';
import pub5_img from '../assets/images/publications/pub5_img.jpeg';
import pub6_img from '../assets/images/publications/pub6_img.png';
import pub7_img from '../assets/images/publications/pub7_img.jpeg';
import pub8_img from '../assets/images/publications/pub8_img.png';
import pub9_img from '../assets/images/Violinist-2.jpg';

import pub9 from '../assets/papers/SkyNote_CSEDU2023.pdf';

import MusicTech from '../components/MusicTech.js';
import WhiteLogo from '../components/WhiteLogo';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const publications = [
  {
    publicationlink: 'https://dl.acm.org/doi/pdf/10.1145/3125571.3125588',
    imagelink: pub1_img,
    text: 'A multimodal corpus for technology-enhanced learning of violin playing',
  },
  {
    publicationlink: 'https://dl.acm.org/doi/pdf/10.1145/3212721.3212886',
    imagelink: pub2_img,
    text: 'Enhancing Music Learning with Smart Technologies',
  },
  {
    publicationlink:
      'https://www.frontiersin.org/articles/10.3389/fpsyg.2021.648479/full?utm_source=S-TWT&utm_medium=SNET&utm_campaign=ECO_FPSYG_XXXXXXXX_auto-dlvrit',
    imagelink: pub3_img,
    text: 'Real-Time Sound and Motion Feedback for Violin Bow Technique Learning: A Controlled, Randomized Trial',
  },
  {
    publicationlink:
      'https://www.frontiersin.org/articles/10.3389/fpsyg.2019.00344/full',
    imagelink: pub4_img,
    text: 'Bowing Gestures Classification in Violin Performance: A Machine Learning Approach',
  },
  {
    publicationlink:
      'https://www.frontiersin.org/articles/10.3389/fpsyg.2019.00334/full',
    imagelink: pub5_img,
    text: 'Automatic Assessment of Tone Quality in Violin Music Performance',
  },
  {
    publicationlink:
      'http://compmus.ime.usp.br/sbcm/2017/papers/sbcm-2017-12.pdf',
    imagelink: pub6_img,
    text: 'Technology Enhanced Learning of Expressive Music Performance',
  },
  {
    publicationlink:
      'https://www.frontiersin.org/articles/10.3389/fpsyg.2020.575971/full',
    imagelink: pub7_img,
    text: 'Applying Deep Learning Techniques to Estimate Patterns of Musical Gesture',
  },
  {
    publicationlink: 'https://dl.acm.org/doi/pdf/10.1145/3139513.3139525',
    imagelink: pub8_img,
    text: 'Bowing Modeling for Violin Students Assistance',
  },
  {
    publicationlink: pub9,
    imagelink: pub9_img,
    text: 'Ramirez, R. and Wyse, L. (2023) SkyNote: An AI-Enhanced Learning System for Violin, 15th International Conference on Computer Supported Education, (pg 58) Prague, Czech Republic April 21 - 23, 2023',
  },
];

const Research = () => {
  return (
    <div>
      <div className={ResearchCSS.siteHeader}>
        <div className={ResearchCSS.tabRowContainer}>
          <div className={ResearchCSS.tabRow}>
            <div className={ResearchCSS.tabLogin}>
              <Link to="/landing" className={ResearchCSS.tabLink}>
                {' '}
                Home{' '}
              </Link>
            </div>
            <div className={ResearchCSS.tabLogin}>
              <Link to="/demos" className={ResearchCSS.tabLink}>
                {' '}
                Demos{' '}
              </Link>
            </div>
            <div className={ResearchCSS.tabLogin}>
              <Link to="/ourteam" className={ResearchCSS.tabLink}>
                {' '}
                Our Team{' '}
              </Link>
            </div>
            <div className={ResearchCSS.tabLogin}>
              <Link to="/research" className={ResearchCSS.tabLink}>
                {' '}
                Research{' '}
              </Link>
            </div>
            <div className={ResearchCSS.tabLogin}>
              <Link
                to="https://docs.google.com/forms/d/e/1FAIpQLSdE6QIt2Xfno67jWjBi2SJOB1dImKhmvJYr9Mzi9Qbo1BGHuw/viewform"
                className={ResearchCSS.tabLink}
              >
                {' '}
                Interest Form{' '}
              </Link>
            </div>
            <div className={ResearchCSS.tabLogin}>
              <Link to="/register" className={ResearchCSS.tabLink}>
                {' '}
                Login Register{' '}
              </Link>
            </div>
          </div>

          <div className={ResearchCSS.dropdown}>
            <input
              type="checkbox"
              id="dropdown-toggle"
              className={ResearchCSS.dropdownToggle}
            ></input>
            <label className={ResearchCSS.dropbtn} htmlFor="dropdown-toggle">
              Menu
            </label>
            <div className={ResearchCSS.dropdownContent}>
              <ul>
                <li>
                  <Link to="/landing" className={ResearchCSS.tabLink}>
                    {' '}
                    Home{' '}
                  </Link>
                </li>
                <li>
                  <Link to="/demos" className={ResearchCSS.tabLink}>
                    {' '}
                    Demos{' '}
                  </Link>
                </li>
                <li>
                  <Link to="/ourteam" className={ResearchCSS.tabLink}>
                    {' '}
                    Our Team{' '}
                  </Link>
                </li>
                <li>
                  <Link to="/research" className={ResearchCSS.tabLink}>
                    {' '}
                    Research{' '}
                  </Link>
                </li>
                <li>
                  <Link
                    to="https://docs.google.com/forms/d/e/1FAIpQLSdE6QIt2Xfno67jWjBi2SJOB1dImKhmvJYr9Mzi9Qbo1BGHuw/viewform"
                    className={ResearchCSS.tabLink}
                  >
                    {' '}
                    Interest Form{' '}
                  </Link>
                </li>
                <li>
                  <Link to="/register" className={ResearchCSS.tabLink}>
                    {' '}
                    Login Register{' '}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className={ResearchCSS.logoContainer}>
          <WhiteLogo />
        </div>
        <div className={ResearchCSS.skynoteContainer}>SkyNote</div>
      </div>
      <div className={ResearchCSS.addspace}></div>

      <div className={ResearchCSS.workSectionWrapper}>
        <div className={ResearchCSS.workSectionTop}>
          <div className={ResearchCSS.addspace2}></div>
        </div>
      </div>
      <div className={ResearchCSS.workSectionTop}>
        <div className={ResearchCSS.violinipadContainer}>
          <div className={ResearchCSS.violinipad}>
            <MusicTech />
          </div>
        </div>
        <div className={ResearchCSS.violinipadOverlay}>
          <h1>Research</h1>
          <h2>Discover whats current in Music Technology</h2>
        </div>
      </div>
      <div className={ResearchCSS.workSectionWrapper}>
        <div className={ResearchCSS.addspace4}></div>
        <div className={ResearchCSS.workSectionBottom}>
          {publications.map((data, index) => (
            <div className={ResearchCSS.posts} key={index}>
              <div className={ResearchCSS.card}>
                <div>
                  <div className={ResearchCSS.centercontainer}>
                    <img
                      src={data.imagelink}
                      alt="Write description here"
                      className={ResearchCSS.img2}
                    />
                  </div>
                  <div align="center">
                    <p>{data.text}</p>
                  </div>
                  <div>
                    <Link
                      // className="btn btn-outline-dark"
                      to={data.publicationlink}
                      target="_blank"
                    >
                      <div className={ResearchCSS.publicationbtn}>
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
    </div>
  );
};
export default Research;
