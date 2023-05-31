import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import OpenSheetMusicDisplay from "./OpenSheetMusicDisplay";
import { useControlBar } from "./controlbar";
import { makeAudioStreamer } from "./audioStreamer.js";

const folderBasePath = "/musicXmlFiles";

const ProgressPlayFile = (props) => {
  const params = useParams();
  // console.log(`${folderBasePath}/${params.file}`);

  const cursorRef = React.useRef(null);
  const playbackRef = React.useRef(null);

  const [metroVol, setMetroVol] = React.useState(0.5);
  const [bpmChange, setBpm] = React.useState(null);

  const [zoom, setZoom] = useState(1.0);

  const controlbar = useControlBar(cursorRef);

  const [amplitude, setAmplitude] = useState(0);
  const [pitch, setPitch] = useState(null);

  // Define pitch callback function
  const handlePitchCallback = (pitchData) => {
    if (pitchData.confidence > 0.6) {
      // console.log(`pitch is ${pitchData.pitch}`);
      setPitch(pitchData.pitch);
    }
  };

  const audioStreamer = makeAudioStreamer(handlePitchCallback);

  useEffect(() => {
    //--------------------------------------------------------------------------------
    //  amplitude
    audioStreamer.init();

    const intervalId1 = setInterval(async () => {
      let a = audioStreamer.getAmplitude();
      // console.log(`amplitude is ${a}`);
      setAmplitude(a);
    }, 200);

    //--------------------------------------------------------------------------------

    // cursor show
    const cursorShowButton = document.getElementById("cursorShow");
    const handleCursorShowButtonClick = () => {
      cursorRef.current.show();
    };
    cursorShowButton.addEventListener("click", handleCursorShowButtonClick);

    // cursor hide
    const cursorHideButton = document.getElementById("cursorHide");
    const handleCursorHideButtonClick = () => {
      cursorRef.current.hide();
    };
    cursorHideButton.addEventListener("click", handleCursorHideButtonClick);

    // cursor beginning (reset)
    const beginningButton = document.getElementById("beginning");
    const handleBeginningButtonClick = () => {
      const playbackManager = playbackRef.current;
      const cursor = cursorRef.current;
      playbackManager.pause();
      playbackManager.setPlaybackStart(0);
      playbackManager.reset();
      cursor.reset();
    };

    beginningButton.addEventListener("click", handleBeginningButtonClick);

    // cursor backward
    const backwardButton = document.getElementById("backward");
    const handleBackwardButtonClick = () => {
      cursorRef.current.previous();
    };
    backwardButton.addEventListener("click", handleBackwardButtonClick);

    // cursor play
    // gets the playback manager and sets the start time to the current time
    // plays the music where the cursor is
    const playButton = document.getElementById("play");
    const handlePlayButtonClick = () => {
      const playbackManager = playbackRef.current;
      const cursor = cursorRef.current;
      const currentTime = cursor.Iterator.currentTimeStamp;
      playbackManager.setPlaybackStart(currentTime);
      playbackManager.play();
    };

    playButton.addEventListener("click", handlePlayButtonClick);

    // cursor pause
    // gets the playback manager and sets the start time to the current time, pauses the music where the cursor is
    // replays the music from where the cursor is paused.
    const pauseButton = document.getElementById("pause");
    const handlePauseButtonClick = () => {
      const playbackManager = playbackRef.current;
      const cursor = cursorRef.current;
      const currentTime = cursor.Iterator.currentTimeStamp;
      playbackManager.setPlaybackStart(currentTime);
      playbackManager.pause();
    };

    pauseButton.addEventListener("click", handlePauseButtonClick);

    //cursor forward
    const forwardButton = document.getElementById("forward");
    const handleForwardButtonClick = () => {
      cursorRef.current.next();
    };
    forwardButton.addEventListener("click", handleForwardButtonClick);

    //metronome
    const metronomeButton = document.getElementById("metronome");
    const handleMetronomeButtonClick = () => {
      const metronomeButton = document.getElementById("metronome");

      // to setup the slider relative to the button
      const rect = metronomeButton.getBoundingClientRect();

      // create volume slider
      const existingVolumeSlider = document.getElementById(
        "metronome-volume-slider"
      );
      if (existingVolumeSlider) {
        existingVolumeSlider.remove();
      }
      const volumeSlider = document.createElement("div");
      volumeSlider.id = "metronome-volume-slider";
      volumeSlider.className = "volume-slider";
      volumeSlider.innerHTML =
        '<input type="range" min="0" max="1" step="0.01" value="1" />';
      volumeSlider.style.position = "absolute";
      volumeSlider.style.top = rect.bottom + "px";
      volumeSlider.style.left = rect.left - 30 + "px";
      document.body.appendChild(volumeSlider);

      // slider input for metronome volume control
      const volumeSliderInput = volumeSlider.querySelector("input");
      volumeSliderInput.addEventListener("input", (event) => {
        setMetroVol(event.target.value);
      });

      // create bpm slider
      const existingBpmSlider = document.getElementById("metronome-bpm-slider");
      if (existingBpmSlider) {
        existingBpmSlider.remove();
      }
      const bpmSlider = document.createElement("div");
      bpmSlider.id = "metronome-bpm-slider";
      bpmSlider.className = "bpm-slider";
      bpmSlider.innerHTML =
        '<input type="range" min="60" max="240" step="1" value="120" />';
      // Create label for bpm slider
      const bpmLabel = document.createElement("label");
      bpmLabel.for = "bpm-slider";
      bpmLabel.innerHTML = "BPM";
      bpmLabel.style.display = "inline-block";
      bpmLabel.style.marginBottom = "5px";
      bpmSlider.appendChild(bpmLabel);

      bpmSlider.style.position = "absolute";
      bpmSlider.style.top = rect.bottom + "px";
      bpmSlider.style.left = rect.right + 40 + "px";

      document.body.appendChild(bpmSlider);

      // slider input for bpm control
      const bpmSliderInput = bpmSlider.querySelector("input");
      bpmSliderInput.addEventListener("input", (event) => {
        setBpm(event.target.value);
        console.log(event.target.value);
      });
    };

    metronomeButton.addEventListener("click", handleMetronomeButtonClick);

    // zoom in
    const zoomInButton = document.getElementById("zoomIn");
    const handleZoomInButtonClick = () => {
      setZoom(zoom + 0.25);
      // console.log("hello zoom1", zoom2);
    };

    zoomInButton.addEventListener("click", handleZoomInButtonClick);

    //zoom out
    const zoomOutButton = document.getElementById("zoomOut");
    const handleZoomOutButtonClick = () => {
      setZoom(zoom - 0.25);
      // console.log("hellooo zoom2", zoom2);
    };

    zoomOutButton.addEventListener("click", handleZoomOutButtonClick);

    // cursor Timbre Visualization
    const visualizeButton = document.getElementById("visualize");
    const handleVisualizeButtonClick = () => {
      window.location.href = "/TimbreVisualization";
    };
    visualizeButton.addEventListener("click", handleVisualizeButtonClick);

    return () => {
      clearInterval(intervalId1);

      visualizeButton.removeEventListener("click", handleVisualizeButtonClick);
      cursorShowButton.removeEventListener(
        "click",
        handleCursorShowButtonClick
      );
      cursorHideButton.removeEventListener(
        "click",
        handleCursorHideButtonClick
      );
      beginningButton.removeEventListener("click", handleBeginningButtonClick);
      backwardButton.removeEventListener("click", handleBackwardButtonClick);
      playButton.removeEventListener("click", handlePlayButtonClick);
      pauseButton.removeEventListener("click", handlePauseButtonClick);
      forwardButton.removeEventListener("click", handleForwardButtonClick);
      metronomeButton.removeEventListener("click", handleMetronomeButtonClick);
      zoomInButton.removeEventListener("click", handleZoomInButtonClick);
      zoomOutButton.removeEventListener("click", handleZoomOutButtonClick);
    };
  }, [zoom]);

  return (
    <div style={{ overflow: "scroll", height: "800px" }}>
      {controlbar}
      <OpenSheetMusicDisplay
        file={`${folderBasePath}/${params.file}`}
        autoResize={true}
        cursorRef={cursorRef}
        playbackRef={playbackRef}
        metroVol={metroVol}
        bpm={bpmChange}
        zoom={zoom}
        followCursor={true}
        amplitude={amplitude}
        pitch={pitch}
      />
    </div>
  );
};

export default ProgressPlayFile;
