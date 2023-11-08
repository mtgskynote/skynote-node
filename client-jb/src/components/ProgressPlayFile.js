import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import OpenSheetMusicDisplay from "./OpenSheetMusicDisplay";
import ControlBar from "./ControlBar.js";
import { makeAudioStreamer } from "./audioStreamer.js";
import CountdownTimer from "./MetronomeCountDown.js";
import { log } from "@tensorflow/tfjs";

const folderBasePath = "/xmlScores/violin";

const ProgressPlayFile = (props) => {
  const params = useParams();

  const cursorRef = React.useRef(null);
  const playbackRef = React.useRef(null);

  const [metroVol, setMetroVol] = useState(0);
  const [bpmChange, setBpm] = useState(100);

  const [recordVol, setRecordVol] = useState(0.5);
  const[recordActive, setRecordActive] = useState(true)
  
  const [showTimer, setShowTimer] = useState(false);
  const [finishedTimer, setFinishedTimer] = useState(false);

  const [zoom, setZoom] = useState(1.0);

  const [pitchValue, setPitchValue] = useState(null);
  const [confidenceValue, setConfidenceValue] = useState(null);
  const [pitch, setPitch] = useState([]);
  const [confidence, setConfidence] = useState([]);
  var pitchCount =0;

  const [startPitchTrack, setStartPitchTrack] = useState(false);
  const [showPitchTrack, setShowPitchTrack] = useState(false);

  const [isResetButtonPressed, setIsResetButtonPressed] = useState(false);

  const[repeatsIterator, setRepeatsIterator] = useState(false);

  const[cursorFinished, setCursorFinished] = useState(false);

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

      //"Reset" funcionalities
      //No recording
      audioStreamer.close()
      console.log("Recording stopped because cursor finished")
      const playbackManager = playbackRef.current;
      //const cursor = cursorRef.current;
      playbackManager.pause();
      playbackManager.setPlaybackStart(0);
      //playbackManager.reset();
      //cursor.reset();
      setStartPitchTrack(false);
      setRecordActive(true) //Set to true, just like the initial state
    }
  };
  const handleFinishedCursorControlBarCallback = (controlBarFinishedCursor) => {
    if (controlBarFinishedCursor===false){//ControlBar already took cursor finishing actions
      
      //Update value, ready for new cursor finishings--> false cursor finished
      setCursorFinished(false);
      console.log("cursor finished work done")
    }
  };

  var audioStreamer = makeAudioStreamer(handlePitchCallback);
  
  //When countdown timer (previous to start recording) finishes
  useEffect(() => {
    if(finishedTimer){

      console.log("TIMER IS FINISHED")
      const playbackManager = playbackRef.current;
      playbackManager.play()
      
      //Once countdown is finished, activate Pitch tracking
      setPitch([])
      setConfidence([])
      setStartPitchTrack(true);
      setShowPitchTrack(true);
      //And play file, make cursor start
      playbackManager.play();
      //Timer work is done, false until next call
      setShowTimer(false)
    }
    //Finished timer duties done, false until next call
    setFinishedTimer(false)
  }, [finishedTimer]);

  //Most important, handles basically any change
  useEffect(() => {

    //--------------------------------------------------------------------------------
    //audioStreamer.init();
    //--------------------------------------------------------------------------------

    // RECORD BUTTON -----------------------------------------------------------------
    const recordButton = document.getElementById("record");
    const handleRecordButtonClick = () => {

      //Toggle recording state (FIXME does not work the first time, so recordActive is started with true value)
      setRecordActive(!recordActive)

      if (recordActive) { //Recoding is wanted
        audioStreamer.init()
        //setShowPitchTrack(true)
        console.log("Recording started")
        setShowTimer(true) //initialize process of countdown, which will then lead to recording
      } else { //Recording is unwanted
        audioStreamer.close()
        console.log("Recording stopped")
        //Deactivate Pitch tracking
        setStartPitchTrack(false);
        //Pause file and therefore, cursor
        const playbackManager = playbackRef.current;
        playbackManager.pause();
      }
    };

    recordButton.addEventListener("click", handleRecordButtonClick);
    //--------------------------------------------------------------------------------

    // RESET BUTTON ------------------------------------------------------------------
    const beginningButton = document.getElementById("beginning");
    const handleBeginningButtonClick = () => {
      audioStreamer.close()
      setIsResetButtonPressed(true);
      const playbackManager = playbackRef.current;
      const cursor = cursorRef.current;
      //Reset
      playbackManager.pause();
      playbackManager.setPlaybackStart(0);
      playbackManager.reset();
      cursor.reset();
      setStartPitchTrack(false);
      setShowPitchTrack(false)
      setPitch([])
      setConfidence([])
      setRecordActive(true) //Set to true, just like the initial state
    };

    beginningButton.addEventListener("click", handleBeginningButtonClick);
    //--------------------------------------------------------------------------------

    // PLAY/PAUSE BUTTON -------------------------------------------------------------
    // gets the playback manager and sets the start time to the current time
    // plays the music where the cursor is
    const playButton = document.getElementById("play");
    const handlePlayButtonClick = () => {
      const playbackManager = playbackRef.current;
      const cursor = cursorRef.current;
      const currentTime = cursor.Iterator.currentTimeStamp;
      
      if (playbackManager.isPlaying) {
        playbackManager.pause();
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
      }else if(sliderId==="bpm-slider"){
        setBpm(event.target.value)
      }else if(sliderId==="metroVol-slider"){
        setMetroVol(event.target.value)
      }
    };
    settingsSliders.addEventListener("click", handleSettings);
    //--------------------------------------------------------------------------------

    // TIMBRE VISUALIZATION ----------------------------------------------------------
    const repeatLayersButton = document.getElementById("repeatLayers");
    const handleRepeatLayersButtonClick = () => {
      //window.location.href = "/TimbreVisualization";
      setRepeatsIterator(!repeatsIterator);
    };
    repeatLayersButton.addEventListener("click", handleRepeatLayersButtonClick);
    //--------------------------------------------------------------------------------


    //Add new pitch value to pitch array
    if(pitchValue){
      setPitch([...pitch,pitchValue])
      setConfidence([...confidence,confidenceValue])
    }


    return () => {
      recordButton.removeEventListener("click", handleRecordButtonClick);
      repeatLayersButton.removeEventListener("click", handleRepeatLayersButtonClick);
      beginningButton.removeEventListener("click", handleBeginningButtonClick);
      playButton.removeEventListener("click", handlePlayButtonClick);
    };
  }, [recordVol, zoom, recordActive, pitchValue, repeatsIterator]);

  return (
    
    <div>
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
        onResetDone={onResetDone}
        cursorActivity={handleFinishedCursorOSMDCallback}
      />
      {showTimer ? (<CountdownTimer bpm={bpmChange}  onComplete={() => setFinishedTimer(true)} />):(null)}
      <ControlBar 
        cursorFinished={cursorFinished} cursorFinishedCallback={handleFinishedCursorControlBarCallback}
      />
    </div>
  );
};

export default ProgressPlayFile;
