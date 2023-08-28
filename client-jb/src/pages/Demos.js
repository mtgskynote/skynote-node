  import ViolinIpad from "../components/violinipad.js";
  import Wrapper from "../assets/wrappers/LandingBackPages";
  import { Link } from "react-router-dom";
  import "bootstrap/dist/css/bootstrap.min.css";
  import WhiteLogo from "../components/WhiteLogo";
  
  const Demos = () => {
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

        <div className="addspace1"></div> {/* Just horizontal white space  */}

        <div className="work-section-top">
          <div>
            <div className="violinipad-container">
              <div className="violinipad">
                <ViolinIpad/>
              </div>
            </div>
            <div className="violinipad-overlay">
              <h1>What We Provide</h1>
            </div>
      
          <div>
            <br></br>
          </div>
          </div>
        </div>

        <div className="about-app">
          <div className="addspace5"></div> {/* Just horizontal white space  */}
          <h2>The SkyNote app provides multiple levels of excercises, ranging from beginner to well rehearsed, and it aims to aid in the process of learning to play the violin. </h2>
        </div>

        <div className="addspace1"></div> {/* Just horizontal white space  */}


        {/* grid-container (row) 1 */}
        <div class="grid-container">
          <div class="grid-item">
            {/* <div className="info-container-left"> */}
              <video controls>
                <source src="https://appskynote.com/skynote-media/videos/Skynote1-SoundQuality.mp4#t=15" />
              </video>
            {/* </div> */}
          </div>
          <div class="grid-item">
            <div className="grid-text-container-right">
              <h2>Sound Quality</h2>
              <p>
                In music, quality sound production is one of the first skills you acquire. With the help of AI and Audio Analysis, SkyNote helps to improve sound quality.
              </p>
            </div>
          </div>
        </div>  {/* grid-container 1*/}

        {/* grid-container (row) 2 */}
        <div class="grid-container">
          <div class="grid-item">
            <div className="grid-text-container-left">
                <h2>Pitch and Rhythm</h2>
                <p>Playing the right note at the right time is important. SkyNote provides pitch and rhythm accuracy with visual feedback.</p>
              </div>
          </div>
          <div class="grid-item">
            {/* <div className="info-container-right"> */}
              <video controls>
                  <source src="https://appskynote.com/skynote-media/videos/Skynote2-Pitch:TimingQuality.mp4#t=11" />
              </video>
            {/* </div> */}
          </div>
        </div>  {/* grid-container 2 */}
          
      
  
        {/* grid-container (row) 3 */}
        <div class="grid-container">
          <div class="grid-item">
            {/* <div className="info-container-left"> */}
                <video controls>
                  <source src="https://appskynote.com/skynote-media/videos/Skynote3-BowTechnique.mp4#t=7" />
                </video>
              {/* </div> */}
            </div>
            <div class="grid-item">
              <div className="grid-text-container-right">
                <h2>Posture</h2>
                <p> SkyNote gives students real-time feedback on their gestures using AI and motion capture techniques. </p>
              </div>
            </div>
        </div>  {/* grid-container 3*/}

  
        {/* grid-container (row) 4 */}
        <div class="grid-container">
          <div class="grid-item">
            <div className="grid-text-container-left">
                <h2>Bowing Technique</h2>
                <p>Using AI And audio analysis, SkyNote produces feedback about your accuracy of bow stroke techniques.</p>
              </div>
          </div>
          <div class="grid-item">
            {/* <div className="info-container-right"> */}
              <video controls>
                  <source src="https://appskynote.com/skynote-media/videos/Skynote4-Gestures.mp4#t=25"/>
              </video>
            {/* </div> */}
          </div>
        </div>  {/* grid-container 4 */}
  
  
      </Wrapper>
    );
  };
  
  export default Demos;