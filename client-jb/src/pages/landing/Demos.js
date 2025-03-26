import React from 'react';
import ViolinIpad from '../../components/images/ViolinIpad.js';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import DemosCSS from './Demos.module.css';
import WhiteLogo from '../../components/images/WhiteLogo.js';

const Demos = () => {
  return (
    <div>
      <div className={DemosCSS.siteHeader}>
        <div className={DemosCSS.tabRowContainer}>
          <div className={DemosCSS.tabRow}>
            <div className={DemosCSS.tabLogin}>
              <Link to="/landing" className={DemosCSS.tabLink}>
                {' '}
                Home{' '}
              </Link>
            </div>
            <div className={DemosCSS.tabLogin}>
              <Link to="/demos" className={DemosCSS.tabLink}>
                {' '}
                Demos{' '}
              </Link>
            </div>
            <div className={DemosCSS.tabLogin}>
              <Link to="/ourteam" className={DemosCSS.tabLink}>
                {' '}
                Our Team{' '}
              </Link>
            </div>
            <div className={DemosCSS.tabLogin}>
              <Link to="/research" className={DemosCSS.tabLink}>
                {' '}
                Research{' '}
              </Link>
            </div>
            <div className={DemosCSS.tabLogin}>
              <Link
                to="https://docs.google.com/forms/d/e/1FAIpQLSdE6QIt2Xfno67jWjBi2SJOB1dImKhmvJYr9Mzi9Qbo1BGHuw/viewform"
                className={DemosCSS.tabLink}
              >
                {' '}
                Interest Form{' '}
              </Link>
            </div>
            <div className={DemosCSS.tabLogin}>
              <Link to="/register" className={DemosCSS.tabLink}>
                {' '}
                Login Register{' '}
              </Link>
            </div>
          </div>

          <div className={DemosCSS.dropdown}>
            <input
              type="checkbox"
              id="dropdow-toggle"
              className={DemosCSS.dropdownToggle}
            ></input>
            <label className={DemosCSS.dropbtn} htmlFor="dropdow-toggle">
              Menu
            </label>
            <div className={DemosCSS.dropdownContent}>
              <ul>
                <li>
                  <Link to="/landing" className={DemosCSS.tabLink}>
                    {' '}
                    Home{' '}
                  </Link>
                </li>
                <li>
                  <Link to="/demos" className={DemosCSS.tabLink}>
                    {' '}
                    Demos{' '}
                  </Link>
                </li>
                <li>
                  <Link to="/ourteam" className={DemosCSS.tabLink}>
                    {' '}
                    Our Team{' '}
                  </Link>
                </li>
                <li>
                  <Link to="/research" className={DemosCSS.tabLink}>
                    {' '}
                    Research{' '}
                  </Link>
                </li>
                <li>
                  <Link
                    to="https://docs.google.com/forms/d/e/1FAIpQLSdE6QIt2Xfno67jWjBi2SJOB1dImKhmvJYr9Mzi9Qbo1BGHuw/viewform"
                    className={DemosCSS.tabLink}
                  >
                    {' '}
                    Interest Form{' '}
                  </Link>
                </li>
                <li>
                  <Link to="/register" className={DemosCSS.tabLink}>
                    {' '}
                    Login Register{' '}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className={DemosCSS.logoContainer}>
          <WhiteLogo />
        </div>
        <div className={DemosCSS.skynoteContainer}>SkyNote</div>
      </div>
      <div className={DemosCSS.addspace1}></div>{' '}
      {/* Just horizontal white space  */}
      <div className={DemosCSS.workSectionTop}>
        <div>
          <div className={DemosCSS.violinipadContainer}>
            <div className={DemosCSS.violinipad}>
              <ViolinIpad />
            </div>
          </div>
          <div className={DemosCSS.violinipadOverlay}>
            <h1>What We Provide</h1>
          </div>

          <div>
            <br></br>
          </div>
        </div>
      </div>
      <div className={DemosCSS.aboutApp}>
        <div className={DemosCSS.addspace5}></div>{' '}
        {/* Just horizontal white space  */}
        <h2>
          The SkyNote app provides multiple levels of excercises, ranging from
          beginner to well rehearsed, and it aims to aid in the process of
          learning to play the violin.{' '}
        </h2>
      </div>
      <div className={DemosCSS.addspace1}></div>{' '}
      {/* Just horizontal white space  */}
      {/* grid-container (row) 1 */}
      <div className={DemosCSS.gridContainer}>
        <div className={DemosCSS.gridItem}>
          {/* <div className="info-container-left"> */}
          <video controls>
            <source src="https://appskynote.com/skynote-media/videos/Skynote1-SoundQuality.mp4#t=15" />
          </video>
          {/* </div> */}
        </div>
        <div className={DemosCSS.gridItem}>
          <div className={DemosCSS.gridTextContainerRight}>
            <h2>Sound Quality</h2>
            <p>
              In music, quality sound production is one of the first skills you
              acquire. With the help of AI and Audio Analysis, SkyNote helps to
              improve sound quality.
            </p>
          </div>
        </div>
      </div>{' '}
      {/* grid-container 1*/}
      {/* grid-container (row) 2 */}
      <div className={DemosCSS.gridContainer}>
        <div className={DemosCSS.gridItem}>
          <div className={DemosCSS.gridTextContainerLeft}>
            <h2>Pitch and Rhythm</h2>
            <p>
              Playing the right note at the right time is important. SkyNote
              provides pitch and rhythm accuracy with visual feedback.
            </p>
          </div>
        </div>
        <div className={DemosCSS.gridItem}>
          {/* <div className="info-container-right"> */}
          <video controls>
            <source src="https://appskynote.com/skynote-media/videos/Skynote2-Pitch:TimingQuality.mp4#t=11" />
          </video>
          {/* </div> */}
        </div>
      </div>{' '}
      {/* grid-container 2 */}
      {/* grid-container (row) 3 */}
      <div className={DemosCSS.gridContainer}>
        <div className={DemosCSS.gridItem}>
          {/* <div className="info-container-left"> */}
          <video controls>
            <source src="https://appskynote.com/skynote-media/videos/Skynote3-BowTechnique.mp4#t=7" />
          </video>
          {/* </div> */}
        </div>
        <div className={DemosCSS.gridItem}>
          <div className={DemosCSS.gridTextContainerRight}>
            <h2>Posture</h2>
            <p>
              {' '}
              SkyNote gives students real-time feedback on their gestures using
              AI and motion capture techniques.{' '}
            </p>
          </div>
        </div>
      </div>{' '}
      {/* grid-container 3*/}
      {/* grid-container (row) 4 */}
      <div className={DemosCSS.gridContainer}>
        <div className={DemosCSS.gridItem}>
          <div className={DemosCSS.gridTextContainerLeft}>
            <h2>Bowing Technique</h2>
            <p>
              Using AI And audio analysis, SkyNote produces feedback about your
              accuracy of bow stroke techniques.
            </p>
          </div>
        </div>
        <div className={DemosCSS.gridItem}>
          {/* <div className="info-container-right"> */}
          <video controls>
            <source src="https://appskynote.com/skynote-media/videos/Skynote4-Gestures.mp4#t=25" />
          </video>
          {/* </div> */}
        </div>
      </div>{' '}
      {/* grid-container 4 */}
    </div>
  );
};

export default Demos;
