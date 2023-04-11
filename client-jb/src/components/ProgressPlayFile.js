// progressplayfile.js

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

  const handleCursorButtonClick = () => {
    cursorRef.current.show();
  };

  useEffect(() => {
    const visualizeButton = document.getElementById("visualize");
    visualizeButton.addEventListener("click", () => {
      window.location.href = "/TimbreVisualization";
    });
    const cursorNextButton = document.getElementById("cursorShow");
    cursorNextButton.addEventListener("click", handleCursorButtonClick);

    return () => {
      visualizeButton.removeEventListener("click", () => {
        window.location.href = "/TimbreVisualization";
      });
      cursorNextButton.removeEventListener("click", handleCursorButtonClick);
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
    </div>
  );
};

export default ProgressPlayFile;
