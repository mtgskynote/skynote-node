import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import OpenSheetMusicDisplay from "./OpenSheetMusicDisplay";
import { useControlBar } from "../purecomponents/controlbar";

const folderBasePath = "/musicXmlFiles";

const ProgressPlayFile = (props) => {
  const params = useParams();
  console.log(`${folderBasePath}/${params.file}`);

  const cursorRef = React.useRef(null);
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
    };
    beginningButton.addEventListener("click", handleBeginningButtonClick);

    // cursor backward
    const backwardButton = document.getElementById("backward");
    const handleBackwardButtonClick = () => {
      cursorRef.current.previous();
    };
    backwardButton.addEventListener("click", handleBackwardButtonClick);

    // cursor play
    const playButton = document.getElementById("play");
    const handlePlayButtonClick = () => {
      cursorRef.current.hide(); //need to change this to play
    };
    playButton.addEventListener("click", handlePlayButtonClick);

    //cursor forward
    const forwardButton = document.getElementById("forward");
    const handleForwardButtonClick = () => {
      cursorRef.current.next();
    };
    forwardButton.addEventListener("click", handleForwardButtonClick);

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
      forwardButton.removeEventListener("click", handleForwardButtonClick);
    };
  }, []);

  return (
    <div>
      {controlbar}
      <OpenSheetMusicDisplay
        file={`${folderBasePath}/${params.file}`}
        autoResize={true}
        cursorRef={cursorRef}
      />
      {/* <button id="cursorShow">Show Cursor</button> */}
    </div>
  );
};

export default ProgressPlayFile;
