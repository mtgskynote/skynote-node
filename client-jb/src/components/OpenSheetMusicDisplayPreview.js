import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { OpenSheetMusicDisplay as OSMD } from 'opensheetmusicdisplay';

const OpenSheetMusicDisplayPreview = ({ file }) => {
  // Create a reference to the OSMD instance
  const osmdRef = useRef(null);
  useEffect(() => {
    // Define the options for the OSMD instance
    const options = {
      autoResize: true,
      drawTitle: false,
      drawingParameters: 'compacttight',
      drawFromMeasureNumber: 0,
      drawUpToMeasureNumber: 4,
    };

    // Create a new instance of OpenSheetMusicDisplay for the preview
    osmdRef.current = new OSMD('osmd-container', options);

    // Load the musicXML file and render the first 4 bars
    osmdRef.current.load(file).then(() => {
      osmdRef.current.render();

      // Hide the cursor after the OpenSheetMusicDisplay instance is fully loaded
      osmdRef.current.cursor.hide();
      osmdRef.current.SheetMaximumWidth = 100;
    });
  }, [file]);

  return <div id="osmd-container" />;
};

OpenSheetMusicDisplayPreview.propTypes = {
  file: PropTypes.string.isRequired,
};

export default OpenSheetMusicDisplayPreview;
