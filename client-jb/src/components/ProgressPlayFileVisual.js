import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate,useLocation } from "react-router-dom";
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
import PopUpWindowDelete from "./PopUpWindowDelete.js";
import { getRecData, getRecording, putRecording, deleteRecording, patchViewPermissions } from "../utils/studentRecordingMethods.js";

const folderBasePath = "/xmlScores/violin";

const ProgressPlayFileVisual = (props) => {
  const params = useParams();

  //THIS IS FOR FILE LOADING, SHOULD BE DEALT WHEN DATABASE IS IMPLEMENTED
  const fileInputRef = useRef(null);
  /////////////////////////////////////////////////////////

  let audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const [songFile, setSongFile] = useState(null);
  
  const cursorRef = useRef(null);
  const playbackRef = useRef(null);

  const [metroVol, setMetroVol] = useState(0);
  const [bpmChange, setBpm] = useState(100);

  const [recordVol, setRecordVol] = useState(0.5);
  const [recordInactive, setRecordInactive] = useState(true)

  const [zoom, setZoom] = useState(1.0);
  const [showPopUpWindow, setShowPopUpWindow]= useState(false);

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
  const [cursorJumped, setCursorJumped] = useState(false);

  const [visualMode, setVisualMode] = useState(true);
  const [json, setJson] = useState([]);


  //const { getCurrentUser } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  // Access the passed variables from the location object
  const recordingJSON = location.state?.id;
  console.log("Id received issssss  ", recordingJSON) //Should be receiving json, not id


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
        // Transform data type and load content
        const uint8Array = new Uint8Array(importedFile.target.result);
        const jsonString = new TextDecoder().decode(uint8Array);    
        const jsonContent = JSON.parse(jsonString);
        console.log('JSON Content:', jsonContent);
        console.log('BPM:', jsonContent.info.bpm);
        // Save audio
        setSongFile(jsonContent.audio);
        //Save json.info (recording data, pitch, colors...) to send it to osmd
        setJson(jsonContent.info);
        //Set bpm
        setBpm(jsonContent.info.bpm);
        //The rest of the json info (studentID, user... not used for now)
        }
        reader.readAsArrayBuffer(file);
      };
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////////



  const onResetDone = () => {
    setIsResetButtonPressed(false);
  };

  // Define pitch callback function 
  const handleDeleteTasks = () => {

    //take care of things
    console.log("taking care of delete form progressplayfilevisual")
    setShowPopUpWindow(true);
  };

  const handleWindowPopUp =(answer)=> {

    if(answer==="1"){ //"yes"
      console.log("You choose option 1")
      setShowPopUpWindow(false)
      //Delete recording actions required FIXME

    }else{ //"no"
      console.log("You choose option 2")
      setShowPopUpWindow(false)
      //No other actions required
    }

  }

  // Define recording stop when cursor finishes callback function
  const handleFinishedCursorOSMDCallback = (OSMDfinishedCursor) => {
    if (OSMDfinishedCursor){//cursor has finished

      //Send info to ControlBar--> true cursor finished
      setCursorFinished(true);
      const playbackManager = playbackRef.current;
      playbackManager.pause();
      playbackManager.setPlaybackStart(0);
      setStartPitchTrack(false);
      setIsResetButtonPressed(true)
      setRecordInactive(true) //Set to true, just like the initial state
    }
  };

  // When cursor jumps (osmd detects it, we need to generate state)
  const handleJumpedCursorOSMDCallback = () => {
    setCursorJumped(!cursorJumped)
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
  
  const playAudio = async () => {
    try {
      // Transform data type and play
      var uint8Array = new Uint8Array(songFile.data);
      var arrayBuffer = uint8Array.buffer;
      const audioBuffer =await audioContext.decodeAudioData(arrayBuffer)
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };
  const stopAudio = () => {
    audioContext.close().then(() => {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    });;
  };

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
        if (playbackManager.isPlaying) {
          //Pause/stop audio of recording
          stopAudio();
          //Pause/stop osmd
          playbackManager.pause();
          //playbackManager.setPlaybackStart(0);
          playbackManager.reset();
          //cursor.reset();
          setStartPitchTrack(false);
          setShowPitchTrack(false)
          setPitch([])
          setConfidence([])
          setRecordInactive(true) //Set to true, just like the initial state
          setIsResetButtonPressed(true);
          
        } else {
          //Play audio of recording
          playAudio();
          //Play osmd
          setIsResetButtonPressed(true);
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

      // DELETE BUTTON -------------------------------------------------------------
      /*const deleteButton = document.getElementById("delete");
      const handleDeleteButtonClick = () => {
        console.log("delete was clicked, progressplayfilevisual")
        setDeletedWanted(true);
        //tell controlbar that delete tasks are being taken care of
        setDeleteHandledVisual(true);
        //setDeleteHandledVisual(false); FIXME, otherwise it wont work the next time
        //call function that does tasks for delete
        handleDeleteTasks();
      
      };
      deleteButton.addEventListener("click", handleDeleteButtonClick);*/
      //--------------------------------------------------------------------------------

    
      return () => {
        repeatLayersButton.removeEventListener("click", handleRepeatLayersButtonClick);
        repeatLayersButton.removeEventListener("mouseover", handleRepeatLayersMouseOver);
        repeatLayersButton.removeEventListener("mouseleave", handleRepeatLayersMouseLeave);
        playButton.removeEventListener("click", handlePlayButtonClick);
        //deleteButton.removeEventListener("click", handleDeleteButtonClick);
      }
    };
  }, [recordVol, zoom, recordInactive, pitchValue, repeatsIterator, visualMode, showRepetitionMessage, json, songFile, cursorFinished, cursorJumped]);

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
        cursorJumpsBack={handleJumpedCursorOSMDCallback}
        mode={visualMode}
        visual={"yes"}
        visualJSON={json}
      />
      
      <ControlBarVisual cursorFinished={cursorFinished} cursorFinishedCallback={handleFinishedCursorControlBarCallback} bpmValue={bpmChange} handleDelete={handleDeleteTasks}/>

      {(showPopUpWindow && <PopUpWindowDelete showWindow={showPopUpWindow} handlerBack={handleWindowPopUp}/>)}

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