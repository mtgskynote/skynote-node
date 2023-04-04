import React from "react";
import { useParams } from "react-router-dom";
import OpenSheetMusicDisplay from "./OpenSheetMusicDisplay";
// import { makeControlBar } from "../purecomponents/controlbar";

const folderBasePath = "/musicXmlFiles";

const ProgressPlayFile = (props) => {
  const params = useParams();
  // const controlBar = makeControlBar();
  console.log(`${folderBasePath}/${params.file}`);
  return (
    <div>
      {/* render control bar */}
      {/* {controlBar} */}
      <OpenSheetMusicDisplay
        file={`${folderBasePath}/${params.file}`}
        autoResize={true}
      />
    </div>
  );
};

export default ProgressPlayFile;
