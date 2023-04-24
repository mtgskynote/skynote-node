import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import OpenSheetMusicDisplay from "./OpenSheetMusicDisplay";
import { useControlBar } from "./controlbar";

const folderBasePath = "/musicXmlFiles";

const ProgressPlayFile = (props) => {
  const params = useParams();
  console.log(`${folderBasePath}/${params.file}`);

  const cursorRef = React.useRef(null);
  const playbackRef = React.useRef(null);
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
      cursorRef.current.reset();
      playbackRef.current.reset();
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

    //zoom in

    //zoom out

    // cursor Timbre Visualization
    const visualizeButton = document.getElementById("visualize");
    const handleVisualizeButtonClick = () => {
      window.location.href = "/TimbreVisualization";
    };
    visualizeButton.addEventListener("click", handleVisualizeButtonClick);

    const handleBeforeUnload = () => {
      const playbackManager = playbackRef.current;
      if (playbackManager) {
        playbackManager.pause();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

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
      window.removeEventListener("beforeunload", handleBeforeUnload);
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
      />
    </div>
  );
};

export default ProgressPlayFile;
