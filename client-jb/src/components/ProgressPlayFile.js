import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import OpenSheetMusicDisplay from "./OpenSheetMusicDisplay";
import { useControlBar } from "./controlbar";

const folderBasePath = "/musicXmlFiles";

const ProgressPlayFile = (props) => {
  const params = useParams();
  // console.log(`${folderBasePath}/${params.file}`);

  const cursorRef = React.useRef(null);
  const playbackRef = React.useRef(null);
  // const metroVolRef = React.useRef(0);
  const [metroVol, setMetroVol] = React.useState(0);

  const controlbar = useControlBar(cursorRef);

  useEffect(() => {
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

    // cursor beginning
    const beginningButton = document.getElementById("beginning");
    const handleBeginningButtonClick = () => {
      const playbackManager = playbackRef.current;
      const cursor = cursorRef.current;

      cursor.reset();
      playbackManager.pause();
      playbackManager.setPlaybackStart(0);
      playbackManager.reset();
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
      const existingVolumeSlider = document.getElementById(
        "metronome-volume-slider"
      );
      if (existingVolumeSlider) {
        existingVolumeSlider.remove();
        return;
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
      const sliderInput = volumeSlider.querySelector("input");
      sliderInput.addEventListener("input", (event) => {
        setMetroVol(event.target.value);
      });
    };

    metronomeButton.addEventListener("click", handleMetronomeButtonClick);

    //zoom in

    //zoom out

    // cursor Timbre Visualization
    const visualizeButton = document.getElementById("visualize");
    const handleVisualizeButtonClick = () => {
      window.location.href = "/TimbreVisualization";
    };
    visualizeButton.addEventListener("click", handleVisualizeButtonClick);

    return () => {
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
    };
  }, []);

  return (
    <div>
      {controlbar}
      <OpenSheetMusicDisplay
        file={`${folderBasePath}/${params.file}`}
        autoResize={true}
        cursorRef={cursorRef}
        playbackRef={playbackRef}
        metroVol={metroVol}
      />
    </div>
  );
};

export default ProgressPlayFile;
