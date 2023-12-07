import {useEffect, useState } from "react";
import Wrapper from "../assets/wrappers/ModeToggle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button} from "@material-ui/core";
import ModeInfoButton from "./ModeInfoButton.js";
import { Dropdown } from "react-bootstrap";

import {
    faGamepad, //practice mode
    faPen, //record mode
} from "@fortawesome/free-solid-svg-icons";

const ModeToggle = (props) => {
  //Volume, bpm and zoom variables
  const [practiceMode, setPracticeMode] = useState(true);
  const [recordMode, setRecordMode] = useState(false);

  useEffect(() => {
    
  }, [props]);

  //record mode button
  const handleRecordMode = () => {
    console.log("Recording mode")
    setPracticeMode(false);
    setRecordMode(true);  
  };

  //practice mode button
  const handlePracticeMode = (event) => {
    console.log("Practice mode")
    setPracticeMode(true);
    setRecordMode(false);
    
  };

  const icons = [
    faGamepad,
    faPen,
  ];
  const handlers = [
    handlePracticeMode,
    handleRecordMode, 
  ]

  const ModeToggle = (
    <Wrapper>
      <div className="completeModeDiv">
        <div className="modeToggleDiv">
          <Button 
            key={"PracticeMode"} 
            className="toggleBtn" 
            title={practiceMode?"PracticeModeON":"PracticeModeOFF"} 
            id={"PracticeMode"} 
            onClick={() => handlers[0]("PracticeMode") }
            >
            <div>
              <FontAwesomeIcon
                  icon={icons[0]} //Practice button
                />
            </div>
          </Button>

          <Button 
            key={"RecordMode"} 
            className="toggleBtn" 
            title={recordMode?"RecordModeON":"RecordModeOFF"} 
            id={"RecordMode"} 
            onClick={() => handlers[1]("RecordMode")}
            >
            <div>
              <FontAwesomeIcon
                  icon={icons[1]} //Recording button
                />
            </div>
          </Button>
        </div>
        <ModeInfoButton message={1}/>
        </div>
    </Wrapper>
  );

  return ModeToggle;
};

export default ModeToggle;
