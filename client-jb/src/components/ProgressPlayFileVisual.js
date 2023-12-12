import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import OpenSheetMusicDisplay from "./OpenSheetMusicDisplay";
import ControlBarVisual from "./ControlBarVisual.js";
import SimpleMessaje from "./AnyMessage.js"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEye, //visual mode
} from "@fortawesome/free-solid-svg-icons";
import Wrapper from "../assets/wrappers/ModeToggle";
import { Button} from "@material-ui/core";
import ModeInfoButton from "./ModeInfoButton.js";

const folderBasePath = "/xmlScores/violin";

const ProgressPlayFileVisual = (props) => {
  const params = useParams();

  //THIS IS FOR FILE LOADING, SHOULD BE DEALT WHEN DATABASE IS IMPLEMENTED
  const [audioBuffer, setAudioBuffer] = useState(null);
  const fileInputRef = useRef(null);
  /////////////////////////////////////////////////////////

  const cursorRef = useRef(null);
  const playbackRef = useRef(null);

  const [metroVol, setMetroVol] = useState(0);
  const [bpmChange, setBpm] = useState(100);

  const [recordVol, setRecordVol] = useState(0.5);
  const [recordInactive, setRecordInactive] = useState(true)

  const [zoom, setZoom] = useState(1.0);

  const [pitchValue, setPitchValue] = useState(null);
  const [confidenceValue, setConfidenceValue] = useState(null);
  const [pitch, setPitch] = useState([]);
  const [confidence, setConfidence] = useState([]);
  var pitchCount =0;

  const [startPitchTrack, setStartPitchTrack] = useState(false);
  const [showPitchTrack, setShowPitchTrack] = useState(false);

  const [isResetButtonPressed, setIsResetButtonPressed] = useState(false);
  const [repeatsIterator, setRepeatsIterator] = useState(false);
  const [showRepetitionMessage, setShowRepetitionMessage]=useState(false);
  const [repetitionMessage, setRepetitionMessage]=useState("No stored recordings yet");

  const [cursorFinished, setCursorFinished] = useState(false);

  const [visualMode, setVisualMode] = useState(true);
  const [json, setJson] = useState([]);

  const navigate = useNavigate();

  const onResetDone = () => {
    setIsResetButtonPressed(false);
  };

  // Define pitch callback function 
  const handlePitchCallback = (pitchData) => {
    pitchCount=pitchCount+1;
      if(pitchCount>0){
          setPitchValue(pitchData.pitch);
          setConfidenceValue(pitchData.confidence);
        pitchCount=0;
      }
  };

  // Define recording stop when cursor finishes callback function
  const handleFinishedCursorOSMDCallback = (OSMDfinishedCursor) => {
    if (OSMDfinishedCursor){//cursor has finished

      //Send info to ControlBar--> true cursor finished
      setCursorFinished(true);
      const playbackManager = playbackRef.current;
      playbackManager.pause();
      setStartPitchTrack(false);
      setRecordInactive(true) //Set to true, just like the initial state
    }
  };
  
  const handleFinishedCursorControlBarCallback = (controlBarFinishedCursor) => {
    if (controlBarFinishedCursor===false){//ControlBar already took cursor finishing actions 
      //Update value, ready for new cursor finishings--> false cursor finished
      setCursorFinished(false);
    }
  };
  // Define recording stop when cursor finishes callback function
  const handleReceiveRepetitionInfo = (showingRep, totalRep) => {
    if(totalRep===0){
      setRepetitionMessage("No recordings yet")
    }else{
      const message_aux="Seeing "+ (showingRep+1) + " of "+ (totalRep+1)
      setRepetitionMessage(message_aux)
    }
  };
  
  ////////////////////LOADING FILES TEMPORARY PATCH//////////////////////////////////////////////////
  //Since database stuff is not yet implemented, I wrote a few lines to get local files, just so we
  //can keep working on displaying and listening to said files
  //THIS CODE SHOULDN'T BE IN THE MAIN BRANCH IT'S TEMPORARY AND SHOULD BE DEALT WITH BEFORE ANY MERGE
  const handleFileSelect = (event) => {
    const fileInput = fileInputRef.current;
    const file = fileInput.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = function (importedFile) {
        if (file.name.endsWith('.wav')) {
          // Handle audio file
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          audioContext.decodeAudioData(importedFile.target.result, function (buffer) {
            setAudioBuffer(buffer);
          });
        } else if (file.name.endsWith('.json')) {
          // Handle JSON file
          const uint8Array = new Uint8Array(importedFile.target.result);
          const jsonString = new TextDecoder().decode(uint8Array);    
          const jsonContent = JSON.parse(jsonString);
          console.log('JSON Content:', jsonContent);
          console.log('BPM:', jsonContent.bpm);
          setJson(jsonContent);
          setBpm(jsonContent.bpm);
        }
      };

      reader.readAsArrayBuffer(file);
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  
  //Handles basically any change
  useEffect(() => {

    if(visualMode===true){ //Visual Mode
      // PLAY/STOP BUTTON -------------------------------------------------------------
      // gets the playback manager and sets the start time to the current time
      // plays the music where the cursor is
      const playButton = document.getElementById("play/stop");
      const handlePlayButtonClick = () => {
        const playbackManager = playbackRef.current;
        const cursor = cursorRef.current;
        //const currentTime = cursor.Iterator.currentTimeStamp;
        
        if (playbackManager.isPlaying) {
          playbackManager.pause();
          playbackManager.setPlaybackStart(0);
          playbackManager.reset();
          cursor.reset();
          setStartPitchTrack(false);
          setShowPitchTrack(false)
          setPitch([])
          setConfidence([])
          setRecordInactive(true) //Set to true, just like the initial state
        } else {
          playbackManager.play();
          
        }
      };
      playButton.addEventListener("click", handlePlayButtonClick);
      //--------------------------------------------------------------------------------

      // SETTINGS SLIDERS --------------------------------------------------------------
      const settingsSliders = document.getElementById("settings");

      const handleSettings = (event) => {
        //Check which setting slider has been clicked
        const sliderId = event.target.id;
        if (sliderId === "volume-slider") {
          setRecordVol(event.target.value);
        }else if(sliderId === "zoom-slider"){
          setZoom(event.target.value)
        }else if(sliderId==="metroVol-slider"){
          setMetroVol(event.target.value)
        }
      };
      settingsSliders.addEventListener("click", handleSettings);
      //--------------------------------------------------------------------------------

      // SWITCH BETWEEN REPETITION/RECORDING LAYERS ------------------------------------
      const repeatLayersButton = document.getElementById("switchRepetition");
      const handleRepeatLayersButtonClick = () => {
        //window.location.href = "/TimbreVisualization";
        setRepeatsIterator(!repeatsIterator);
      };
      const handleRepeatLayersMouseOver = () => {
        setShowRepetitionMessage(true);
      };
      const handleRepeatLayersMouseLeave = () => {
        setShowRepetitionMessage(false);
      };
      repeatLayersButton.addEventListener("click", handleRepeatLayersButtonClick);
      repeatLayersButton.addEventListener("mousemove", handleRepeatLayersMouseOver);
      repeatLayersButton.addEventListener("mouseout", handleRepeatLayersMouseLeave);
      //--------------------------------------------------------------------------------

    
      return () => {
        repeatLayersButton.removeEventListener("click", handleRepeatLayersButtonClick);
        repeatLayersButton.removeEventListener("mouseover", handleRepeatLayersMouseOver);
        repeatLayersButton.removeEventListener("mouseleave", handleRepeatLayersMouseLeave);
        playButton.removeEventListener("click", handlePlayButtonClick);
      }
    };
  }, [recordVol, zoom, recordInactive, pitchValue, repeatsIterator, visualMode, showRepetitionMessage, json]);

  return (
    
    <div>
      <input type="file" ref={fileInputRef} onChange={handleFileSelect} />
      {(showRepetitionMessage&&<SimpleMessaje message={repetitionMessage}/>)}

      <OpenSheetMusicDisplay
        file={`${folderBasePath}/${params.files}`}
        autoResize={true}
        cursorRef={cursorRef}
        playbackRef={playbackRef}
        metroVol={metroVol}
        bpm={bpmChange}
        zoom={zoom}
        followCursor={true}
        pitch={pitch}
        pitchConfidence={confidence}
        startPitchTrack={startPitchTrack}
        showPitchTrack={showPitchTrack}
        recordVol={recordVol}
        isResetButtonPressed={isResetButtonPressed}
        repeatsIterator={repeatsIterator}
        showRepeatsInfo={handleReceiveRepetitionInfo}
        onResetDone={onResetDone}
        cursorActivity={handleFinishedCursorOSMDCallback}
        mode={visualMode}
        visual={"yes"}
        visualJSON={json}
      />
      
      <ControlBarVisual cursorFinished={cursorFinished} cursorFinishedCallback={handleFinishedCursorControlBarCallback}/>

      <Wrapper>
      <div className="completeModeDiv">
        <div className="modeToggleDiv">
          <Button 
            key={"VisualMode"} 
            className="toggleBtn" 
            title={"VisualMode"} 
            id={"VisualMode"} 
            >
            <div>
              <FontAwesomeIcon
                  icon={faEye} //Visual button
                />
            </div>
          </Button>
        </div>
        <ModeInfoButton message={2}/> 

        </div>
    </Wrapper>
      
    </div>
  );
};

export default ProgressPlayFileVisual;