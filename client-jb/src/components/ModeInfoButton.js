import {useEffect, useState } from "react";
//import Wrapper from "../assets/wrappers/ModeToggle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button} from "@material-ui/core";
//import { Dropdown } from "react-bootstrap";
import ModeInfoButtonCSS from './ModeInfoButton.module.css';

import {
    faInfoCircle, //info circle
} from "@fortawesome/free-solid-svg-icons";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const ModeInfoButton = (props) => {

  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    
  }, [props]);

  const ModeInfoMessage = () => {

    if (props.message===1){
      return (
        <div className="mode-info-message">
          <h4>Guide</h4>
          <p>You can choose from two modes:</p>
    
          <div className="mode-description">
            <h5>Practice Mode</h5>
            <p>
              Practice Mode allows you to play as much as you want, but recordings won't be saved {/* Describe what Practice Mode consists of */}
            </p>
          </div>
    
          <div className="mode-description">
            <h5>Record Mode</h5>
            <p>
              Record Mode lets you record and save data, but you must play the whole piece {/* Describe what Record Mode consists of */}
            </p>
          </div>
        </div>
      );
    }else if(props.message===2){
      return (
        <div className={ModeInfoButtonCSS.container}>
          <div className={ModeInfoButtonCSS.message}>
            <p>Your recording...</p>
          </div>
            <div className={ModeInfoButtonCSS.recBox}>
              <div className={ModeInfoButtonCSS.recTitle}><h5 >{props.title}</h5></div>
              <div className={ModeInfoButtonCSS.starsGroup}>
                <FontAwesomeIcon icon={faStar} className={props.stars>=1 ? ModeInfoButtonCSS.completeStar : ModeInfoButtonCSS.incompleteStar}/>
                <FontAwesomeIcon icon={faStar} className={props.stars>=2 ? ModeInfoButtonCSS.completeStar : ModeInfoButtonCSS.incompleteStar}/>
                <FontAwesomeIcon icon={faStar} className={props.stars>=3 ? ModeInfoButtonCSS.completeStar : ModeInfoButtonCSS.incompleteStar}/>
              </div>
              <div className={ModeInfoButtonCSS.dateTime}>
                <i>{props.date}</i>
              </div>
            </div>
          <div className={ModeInfoButtonCSS.message}>
            <h4>Info</h4>
            <p>Click "play" to listen to your recording,  or iterate through the different repetitions</p>
          </div>
        </div>
          
        );
      }
    }
    

  const handleMouseOver = (event) => {
    // console.log("Show message")
    setShowMessage(true);
  };
  const handleMouseLeave = () => {
    // console.log("Hide message")
    setShowMessage(false);
    
  };

  const ModeInfoButton = (
    
    <div className="InfoModeComplete">
      <Button 
        key={"InfoMode"} 
        className="InfoMode" 
        title={"InfoMode"} 
        id={"InfoMode"} 
        onMouseOver={() => handleMouseOver("InfoMode")}
        onMouseLeave={handleMouseLeave}>
        <div>
          <FontAwesomeIcon
              icon={faInfoCircle} //Practice button
            />
        </div>
      </Button> 
      {showMessage && <div className={ModeInfoButtonCSS.body}>{ModeInfoMessage()}</div>} 
    </div>             
  );

  return ModeInfoButton;
};

export default ModeInfoButton;
