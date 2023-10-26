import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import OpenSheetMusicDisplay from "./OpenSheetMusicDisplay";
import { useControlBar } from "./controlbar";
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

  const controlbar = useControlBar();
  const [pitchValue, setPitchValue] = useState(null);
  const [pitch, setPitch] = useState([]);
  var pitchCount =0;

  const [startPitchTrack, setStartPitchTrack] = useState(false);
  const [showPitchTrack, setShowPitchTrack] = useState(false);

  const [isResetButtonPressed, setIsResetButtonPressed] = useState(false);

  const[repeatsIterator, setRepeatsIterator] = useState(false);

  const onResetDone = () => {
    setIsResetButtonPressed(false);
  };

  // Define pitch callback function
  const handlePitchCallback = (pitchData) => {
    pitchCount=pitchCount+1;
      if(pitchCount>0){
        //if (pitchData.confidence > 0.5) {
          setPitchValue(pitchData.pitch);
        //}else{
        //  setPitchValue(1);
        //}
        pitchCount=0;
      }
  };

  // Define recording stop when cursor finishes callback function
  const handleFinishedCursorCallback = (finishedCursor) => {
    if (finishedCursor){
      //Recording is unwanted
      audioStreamer.close()
      console.log("Recording stopped because cursor finished")
      //Deactivate Pitch tracking
      setStartPitchTrack(false);
      //Pause file and therefore, cursor
      const playbackManager = playbackRef.current;
      playbackManager.pause();
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
        startPitchTrack={startPitchTrack}
        showPitchTrack={showPitchTrack}
        recordVol={recordVol}
        isResetButtonPressed={isResetButtonPressed}
        repeatsIterator={repeatsIterator}
        onResetDone={onResetDone}
        cursorActivity={handleFinishedCursorCallback}
      />
       {showTimer ? (<CountdownTimer bpm={bpmChange}  onComplete={() => setFinishedTimer(true)} />):(null)}
      {controlbar}
    </div>
  );
};

export default ProgressPlayFile;
