import {useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@material-ui/core";
import ModeInfoButton from "./ModeInfoButton.js";
import ModeToggleCSS from './ModeToggle.module.css';
//import { Dropdown } from "react-bootstrap";

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
    <div className={ModeToggleCSS.completeModeDiv}>
      <div className={ModeToggleCSS.modeToggleDiv}>
        <Button 
          key={"PracticeMode"} 
          className={ModeToggleCSS.toggleBtn}
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
          className={ModeToggleCSS.toggleBtn} 
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
  );

  return ModeToggle;
};

export default ModeToggle;
