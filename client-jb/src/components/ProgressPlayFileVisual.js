import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import OpenSheetMusicDisplay from "./OpenSheetMusicDisplay";
import ControlBarVisual from "./ControlBarVisual.js";
import SimpleMessaje from "./AnyMessage.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye, //visual mode
} from "@fortawesome/free-solid-svg-icons";
import ModeToggleCSS from "./ModeToggle.module.css";
import { Button } from "@material-ui/core";
import ModeInfoButton from "./ModeInfoButton.js";
import PopUpWindowDelete from "./PopUpWindowDelete.js";
import {
  getRecording,
  deleteRecording,
} from "../utils/studentRecordingMethods.js";
import ListRecordingsCSS from "./ListRecordings.module.css";
import { getAudioContext, suspendAudioContext, resumeAudioContext } from '../context/audioContext';


const folderBasePath = "/xmlScores/violin";
let audioContext = getAudioContext(); 

let currentSource = null; // has to be global so that React redraws don't lose track of the source

const ProgressPlayFileVisual = (props) => {
  const params = useParams();

  const [songFile, setSongFile] = useState(null);

  const cursorRef = useRef(null);
  const playbackRef = useRef(null);

  const [metroVol, setMetroVol] = useState(0);
  const [bpmChange, setBpm] = useState(100);

  const [recordVol, setRecordVol] = useState(0);
  const [recordInactive, setRecordInactive] = useState(true);

  const [zoom, setZoom] = useState(1.0);
  const [showPopUpWindow, setShowPopUpWindow] = useState(false);

  const [pitch, setPitch] = useState([]);
  const [confidence, setConfidence] = useState([]);

  const [startPitchTrack, setStartPitchTrack] = useState(false);
  const [showPitchTrack, setShowPitchTrack] = useState(false);

  const [isResetButtonPressed, setIsResetButtonPressed] = useState(false);
  const [repeatsIterator, setRepeatsIterator] = useState(false);
  const [showRepetitionMessage, setShowRepetitionMessage] = useState(false);
  const [repetitionMessage, setRepetitionMessage] = useState(
    "No stored recordings yet"
  );

  const [cursorFinished, setCursorFinished] = useState(false);
  const [cursorJumped, setCursorJumped] = useState(false);

  const [visualMode, setVisualMode] = useState(true);
  const [json, setJson] = useState([]);
  const [metaData, setMetaData] = useState({
    name: null,
    stars: null,
    date: null,
  });

  //const { getCurrentUser } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  const newUrl = window.location.href;

  const recordingID = location.state?.id;

  useEffect(() => {
    getRecording(recordingID).then((recordingJSON) => {
      console.log(recordingJSON);
      // get score info
      const scoreInfo = JSON.parse(localStorage.getItem("scoreData")).find(
        (item) => item.fname === params.files
      );
      //Set metaData
      const recordingDate = new Date(recordingJSON.date);
      setMetaData({
        name: recordingJSON.recordingName,
        stars: recordingJSON.info.stars,
        date: recordingDate.toLocaleDateString("es-ES", options),
        skill: scoreInfo.skill,
        lesson: scoreInfo.lesson,
        score: scoreInfo.title,
      });
      //Save json.info (recording data, pitch, colors...) to send it to osmd
      setJson(recordingJSON.info);
      //Set bpm
      setBpm(recordingJSON.info.bpm);
      // Save audio
      setSongFile(recordingJSON.audio);
    });
  }, [recordingID]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const onResetDone = () => {
    setIsResetButtonPressed(false);
  };

  // Define pitch callback function
  const handleDeleteTasks = () => {
    //take care of things
    console.log("taking care of delete form progressplayfilevisual");
    setShowPopUpWindow(true);
  };

  const handleWindowPopUp = (answer) => {
    if (answer === "1") {
      //"yes"
      setShowPopUpWindow(false);
      deleteRecording(recordingID)
        .then(() => {
          navigate(-1);
        })
        .catch((error) => {
          console.log(`Cannot delete recording from database: ${error}`);
        });

      //Delete recording actions required FIXME
    } else {
      //"no"
      setShowPopUpWindow(false);
      //No other actions required
    }
  };

  // Define recording stop when cursor finishes callback function
  const handleFinishedCursorOSMDCallback = (OSMDfinishedCursor) => {
    if (OSMDfinishedCursor) {
      //cursor has finished

      //Send info to ControlBar--> true cursor finished
      setCursorFinished(true);
      const playbackManager = playbackRef.current;
      playbackManager.pause();
      playbackManager.setPlaybackStart(0);
      setStartPitchTrack(false);
      setIsResetButtonPressed(true);
      setRecordInactive(true); //Set to true, just like the initial state
    }
  };

  // When cursor jumps (osmd detects it, we need to generate state)
  const handleJumpedCursorOSMDCallback = () => {
    setCursorJumped(!cursorJumped);
  };

  const handleFinishedCursorControlBarCallback = (controlBarFinishedCursor) => {
    if (controlBarFinishedCursor === false) {
      //ControlBar already took cursor finishing actions
      //Update value, ready for new cursor finishings--> false cursor finished
      setCursorFinished(false);
    }
  };
  // Define recording stop when cursor finishes callback function
  const handleReceiveRepetitionInfo = (showingRep, totalRep) => {
    if (totalRep === 0) {
      setRepetitionMessage("No recordings yet");
    } else {
      const message_aux =
        "Seeing " + (showingRep + 1) + " of " + (totalRep + 1);
      setRepetitionMessage(message_aux);
    }
  };


  const playAudio = async () => {
    try {
      // Transform data type and play
      var uint8Array = new Uint8Array(songFile.data);
      var arrayBuffer = uint8Array.buffer;
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();
      currentSource = source; // keep track of the current source for stopping later
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  const stopAudio = async () => {
    // # IS THIS REALLY NECESSARY? # Why would you ever need to do this?
    // audioContext.close().then(() => {
    //   audioContext = new window.AudioContext();
    // });
    // # Let's do this instead (May 21, 2024) # 
    if (currentSource) {
      currentSource.stop();
      currentSource.disconnect(); // Clean up connections
      currentSource = null;
    }
  };

  //Handles basically any change
  useEffect(() => {
    if (visualMode === true) {
      //Visual Mode
      // PLAY/STOP BUTTON -------------------------------------------------------------
      // gets the playback manager and sets the start time to the current time
      // plays the music where the cursor is
      const playButton = document.getElementById("play/stop");
      const handlePlayButtonClick = () => {
        const playbackManager = playbackRef.current;
        //const cursor = cursorRef.current;
        if (playbackManager.isPlaying) {
          //Pause/stop audio of recording
          stopAudio();
          //Pause/stop osmd
          playbackManager.pause();
          //playbackManager.setPlaybackStart(0);
          playbackManager.reset();
          //cursor.reset(); //seems right, but a runtime error follows
          setStartPitchTrack(false);
          setShowPitchTrack(false);
          setPitch([]);
          setConfidence([]);
          setRecordInactive(true); //Set to true, just like the initial state
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
        } else if (sliderId === "zoom-slider") {
          setZoom(event.target.value);
        } else if (sliderId === "metroVol-slider") {
          setMetroVol(event.target.value);
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
      repeatLayersButton.addEventListener(
        "click",
        handleRepeatLayersButtonClick
      );
      repeatLayersButton.addEventListener(
        "mousemove",
        handleRepeatLayersMouseOver
      );
      repeatLayersButton.addEventListener(
        "mouseout",
        handleRepeatLayersMouseLeave
      );

      return () => {
        repeatLayersButton.removeEventListener(
          "click",
          handleRepeatLayersButtonClick
        );
        repeatLayersButton.removeEventListener(
          "mouseover",
          handleRepeatLayersMouseOver
        );
        repeatLayersButton.removeEventListener(
          "mouseleave",
          handleRepeatLayersMouseLeave
        );
        playButton.removeEventListener("click", handlePlayButtonClick);
        //deleteButton.removeEventListener("click", handleDeleteButtonClick);
      };
    }
  }, [
    recordVol,
    zoom,
    recordInactive,
    repeatsIterator,
    visualMode,
    showRepetitionMessage,
    json,
    songFile,
    cursorFinished,
    cursorJumped,
  ]);

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [newUrl]);

  return (
    <div>
      {showRepetitionMessage && <SimpleMessaje message={repetitionMessage} />}

      <OpenSheetMusicDisplay
        file={`${folderBasePath}/${params.files}.xml`}
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

      <ControlBarVisual
        cursorFinished={cursorFinished}
        cursorFinishedCallback={handleFinishedCursorControlBarCallback}
        bpmValue={bpmChange}
        handleDelete={handleDeleteTasks}
      />

      {showPopUpWindow && (
        <PopUpWindowDelete
          showWindow={showPopUpWindow}
          handlerBack={handleWindowPopUp}
        />
      )}

      <div className={ModeToggleCSS.completeModeDiv}>
        <div className={ModeToggleCSS.modeToggleDivVisual}>
          <Button key={"VisualMode"} title={"VisualMode"} id={"VisualMode"}>
            <div>
              <FontAwesomeIcon
                icon={faEye} //Visual button
              />
            </div>
          </Button>
        </div>
        <ModeInfoButton
          message={2}
          title={metaData.name}
          stars={metaData.stars}
          date={metaData.date}
          skill={metaData.skill}
          lesson={metaData.lesson}
          score={metaData.score}
        />
      </div>

      {/* Button to go back */}
      <button
        className={ListRecordingsCSS.back2Listbutton}
        onClick={handleGoBack}
      >
        BACK
      </button>
    </div>
  );
};

export default ProgressPlayFileVisual;
