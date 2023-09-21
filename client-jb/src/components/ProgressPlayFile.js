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
  // console.log(`${folderBasePath}/${params.file}`);

  const cursorRef = React.useRef(null);
  const playbackRef = React.useRef(null);

  const [metroVol, setMetroVol] = React.useState(0);
  const [bpmChange, setBpm] = React.useState(100);

  const [recordVol, setRecordVol] = React.useState(0.5);
  
  const [showTimer, setShowTimer] = React.useState(false);
  const [finishedTimer, setFinishedTimer] = React.useState(false);

  const [zoom, setZoom] = useState(1.0);

  const controlbar = useControlBar(cursorRef);
  const [pitch, setPitch] = useState(null);

  const [startPitchTrack, setStartPitchTrack] = useState(false);
  const startPitchTrackRef = useRef(startPitchTrack);

  const [isResetButtonPressed, setIsResetButtonPressed] = useState(false);

  const onResetDone = () => {
    setIsResetButtonPressed(false);
  };

  // Define pitch callback function
  const handlePitchCallback = (pitchData) => {
    if (pitchData.confidence > 0.5) {
      setPitch(pitchData.pitch);
    }
  };

  // if (startPitchTrack) {
  //   // console.log("startPitchTrack", startPitchTrack);

  //   const audioStreamer = makeAudioStreamer(handlePitchCallback);
  //   audioStreamer.init();
  // }

  const audioStreamer = makeAudioStreamer(handlePitchCallback);
  
  useEffect(() => {
    if(finishedTimer){
      const playbackManager = playbackRef.current;
      playbackManager.play();
      setShowTimer(false)
    }
    setFinishedTimer(false)
  }, [finishedTimer]);

  useEffect(() => {
    console.log("use effect executed")
    //--------------------------------------------------------------------------------
    audioStreamer.init();
    //--------------------------------------------------------------------------------

    // record
    const recordButton = document.getElementById("record");
    const handleRecordButtonClick = () => {
      setRecordVol(0.0);
      setStartPitchTrack((prevStartPitchTrack) => {
        startPitchTrackRef.current = !prevStartPitchTrack;
        return !prevStartPitchTrack;
      });
      console.log("startPitchTrackRef.current", startPitchTrackRef.current);

      const playbackManager = playbackRef.current;
      const cursor = cursorRef.current;
      const currentTime = cursor.Iterator.currentTimeStamp;
      playbackManager.setPlaybackStart(currentTime);

      if (startPitchTrackRef.current) {
        console.log("blblblblbl", startPitchTrackRef.current);
        playbackManager.play();
      } else {
        playbackManager.pause();
      }

      console.log("recordVol in record", recordVol);
    };

    recordButton.addEventListener("click", handleRecordButtonClick);

    // cursor beginning (reset)
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
    };

    beginningButton.addEventListener("click", handleBeginningButtonClick);

    // cursor play
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
        setShowTimer(true)
      }
    };
    playButton.addEventListener("click", handlePlayButtonClick);

    //Settings sliders
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

    // cursor Timbre Visualization
    const visualizeButton = document.getElementById("visualize");
    const handleVisualizeButtonClick = () => {
      window.location.href = "/TimbreVisualization";
    };
    visualizeButton.addEventListener("click", handleVisualizeButtonClick);

    return () => {
      recordButton.removeEventListener("click", handleRecordButtonClick);
      visualizeButton.removeEventListener("click", handleVisualizeButtonClick);
      beginningButton.removeEventListener("click", handleBeginningButtonClick);
      playButton.removeEventListener("click", handlePlayButtonClick);
    };
  }, [recordVol, zoom]);

  return (
    <div style={{ overflow: "scroll", height: "750px" }}>
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
        recordVol={recordVol}
        isResetButtonPressed={isResetButtonPressed}
        onResetDone={onResetDone}
      />
       {showTimer ? (<CountdownTimer bpm={bpmChange}  onComplete={() => setFinishedTimer(true)} />):(null)}
      {controlbar}
    </div>
  );
};

export default ProgressPlayFile;
