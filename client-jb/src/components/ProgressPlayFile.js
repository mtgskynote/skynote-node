import React from "react";
import { useParams } from "react-router-dom";
import OpenSheetMusicDisplay from "./OpenSheetMusicDisplay";

const folderBasePath = "/musicXmlFiles";

const ProgressPlayFile = (props) => {
  const params = useParams();
  console.log(`${folderBasePath}/${params.file}`);
  return (
    <div>
      <OpenSheetMusicDisplay
        file={`${folderBasePath}/${params.file}`}
        autoResize={true}
      />
    </div>
  );
};

export default ProgressPlayFile;
