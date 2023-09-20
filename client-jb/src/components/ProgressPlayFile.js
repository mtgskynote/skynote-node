import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import OpenSheetMusicDisplay from "./OpenSheetMusicDisplay";
import { useControlBar } from "./controlbar";
import { makeAudioStreamer } from "./audioStreamer.js";

const folderBasePath = "/xmlScores/violin";

const ProgressPlayFile = (props) => {
  const params = useParams();
  // console.log(`${folderBasePath}/${params.file}`);

  const cursorRef = React.useRef(null);
  const playbackRef = React.useRef(null);

  const [metroVol, setMetroVol] = React.useState(0.5);
  const [bpmChange, setBpm] = React.useState(null);

  const [recordVol, setRecordVol] = React.useState(0.0);

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
      //update icon
      const playButton = document.getElementById("play");
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
      setRecordVol(1.0);
      const playbackManager = playbackRef.current;
      const cursor = cursorRef.current;
      const currentTime = cursor.Iterator.currentTimeStamp;
      playbackManager.setPlaybackStart(currentTime);
      if (playbackManager.isPlaying) {
        playbackManager.pause();
      } else {
        playbackManager.play();
      }
    };
    playButton.addEventListener("click", handlePlayButtonClick);

    const volSlider = document.getElementById("settings");

    const handleVolSlider = (event) => {
      const sliderId = event.target.id;
      console.log("Slider ID:", event.target.value);
      setRecordVol(event.target.value);
    };
    volSlider.addEventListener("change", handleVolSlider);

    //metronome
    // const metronomeButton = document.getElementById("metronome");
    // const handleMetronomeButtonClick = () => {
    //   const metronomeButton = document.getElementById("metronome");

    //   // to setup the slider relative to the button
    //   const rect = metronomeButton.getBoundingClientRect();

    //   // create volume slider
    //   const existingVolumeSlider = document.getElementById(
    //     "metronome-volume-slider"
    //   );
    //   if (existingVolumeSlider) {
    //     existingVolumeSlider.remove();
    //   }
    //   const volumeSlider = document.createElement("div");
    //   volumeSlider.id = "metronome-volume-slider";
    //   volumeSlider.className = "volume-slider";
    //   volumeSlider.innerHTML =
    //     '<input type="range" min="0" max="1" step="0.01" value="1" />';
    //   volumeSlider.style.position = "absolute";
    //   volumeSlider.style.top = rect.bottom + "px";
    //   volumeSlider.style.left = rect.left - 30 + "px";
    //   document.body.appendChild(volumeSlider);

    //   // slider input for metronome volume control
    //   const volumeSliderInput = volumeSlider.querySelector("input");
    //   volumeSliderInput.addEventListener("input", (event) => {
    //     setMetroVol(event.target.value);
    //   });

    //   // create bpm slider
    //   const existingBpmSlider = document.getElementById("metronome-bpm-slider");
    //   if (existingBpmSlider) {
    //     existingBpmSlider.remove();
    //   }
    //   const bpmSlider = document.createElement("div");
    //   bpmSlider.id = "metronome-bpm-slider";
    //   bpmSlider.className = "bpm-slider";
    //   bpmSlider.innerHTML =
    //     '<input type="range" min="60" max="240" step="1" value="120" />';
    //   // Create label for bpm slider
    //   const bpmLabel = document.createElement("label");
    //   bpmLabel.for = "bpm-slider";
    //   bpmLabel.innerHTML = "BPM";
    //   bpmLabel.style.display = "inline-block";
    //   bpmLabel.style.marginBottom = "5px";
    //   bpmSlider.appendChild(bpmLabel);

    //   bpmSlider.style.position = "absolute";
    //   bpmSlider.style.top = rect.bottom + "px";
    //   bpmSlider.style.left = rect.right + 40 + "px";

    //   document.body.appendChild(bpmSlider);

    //   // slider input for bpm control
    //   const bpmSliderInput = bpmSlider.querySelector("input");
    //   bpmSliderInput.addEventListener("input", (event) => {
    //     setBpm(event.target.value);
    //     console.log(event.target.value);
    //   });
    // };

    // metronomeButton.addEventListener("click", handleMetronomeButtonClick);

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
      // metronomeButton.removeEventListener("click", handleMetronomeButtonClick);
      // zoomInButton.removeEventListener("click", handleZoomInButtonClick);
      // zoomOutButton.removeEventListener("click", handleZoomOutButtonClick);
    };
  }, [zoom, recordVol]);

  useEffect(() => {
    console.log("recordVol changed to", recordVol);
  }, [recordVol]);

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
        onRecord={setRecordVol}
        isResetButtonPressed={isResetButtonPressed}
        onResetDone={onResetDone}
      />
      {controlbar}
    </div>
  );
};

export default ProgressPlayFile;
