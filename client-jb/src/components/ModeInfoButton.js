import {useEffect, useState } from "react";
import Wrapper from "../assets/wrappers/ModeToggle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button} from "@material-ui/core";
import { Dropdown } from "react-bootstrap";

import {
    faInfoCircle, //info circle
} from "@fortawesome/free-solid-svg-icons";

const ModeInfoButton = (props) => {

  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    
  }, [props]);

  const ModeInfoMessage = () => {
    return (
      <div className="mode-info-message">
        <h4>Guide</h4>
        <p>You can choose from two modes:</p>
  
        <div className="mode-description">
          <h5>Practice Mode</h5>
          <p>
            Practice Mode allows you to... {/* Describe what Practice Mode consists of */}
          </p>
        </div>
  
        <div className="mode-description">
          <h5>Record Mode</h5>
          <p>
            Record Mode lets you... {/* Describe what Record Mode consists of */}
          </p>
        </div>
      </div>
    );
  };

  const handleMouseOver = (event) => {
    console.log("Show message")
    setShowMessage(true);
  };
  const handleMouseLeave = () => {
    console.log("Hide message")
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
      {showMessage && <div className="message">{ModeInfoMessage()}</div>} 
    </div>             
  );

  return ModeInfoButton;
};

export default ModeInfoButton;