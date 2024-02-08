// component to display the preview of scores using opensheetmusicdisplay.
// Made it a separate component so that it can be reused in other components, and not mess up with the main OSMD component.
// which is used to display the full score, with the cursor, etc.

import React, { useEffect, useRef } from "react";
import { OpenSheetMusicDisplay as OSMD } from "opensheetmusicdisplay";

const OpenSheetMusicDisplayPreview = ({ file }) => {
  //create a reference to the OSMD instance
  const osmdRef = useRef(null);
  useEffect(() => {
    //define the options for the OSMD instance
    const options = {
      autoResize: true,
      drawTitle: false,
      drawingParameters: "compacttight",
      drawFromMeasureNumber: 0,
      drawUpToMeasureNumber: 4,
    };

    // Create a new instance of OpenSheetMusicDisplay for the preview
    osmdRef.current = new OSMD("osmd-container", options);

    // Load the musicXML file and render the first 4 bars
    osmdRef.current.load(file).then(() => {
      osmdRef.current.render();

      // Hide the cursor after the OpenSheetMusicDisplay instance is fully loaded
      osmdRef.current.cursor.hide();
      osmdRef.current.SheetMaximumWidth = 100;
      //   osmdRef.current.zoom = 1.0;
    });
  }, [file]);

  // const containerStyle = {
  //   maxWidth: "50%", // Adjust the percentage to the desired width
  //   maxHeight: "50%", // This will maintain the aspect ratio and shrink the height accordingly
  //   // You can also add other styles here if needed
  //   flexshrink: 1,
  // };

  // return <div id="osmd-container" style={containerStyle} />;
  return <div id="osmd-container" />;
};

export default OpenSheetMusicDisplayPreview;
