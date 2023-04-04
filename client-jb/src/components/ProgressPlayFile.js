import React from "react";
import { useParams } from "react-router-dom";
import OpenSheetMusicDisplay from "./OpenSheetMusicDisplay";
import { useControlBar } from "../purecomponents/controlbar";

const folderBasePath = "/musicXmlFiles";

const ProgressPlayFile = (props) => {
  const params = useParams();
  console.log(`${folderBasePath}/${params.file}`);

  const controlbar = useControlBar();

  return (
    <div>
      {controlbar}
      <OpenSheetMusicDisplay
        file={`${folderBasePath}/${params.file}`}
        autoResize={true}
      />
    </div>
  );
};

export default ProgressPlayFile;
