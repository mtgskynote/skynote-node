import { useEffect, useState } from "react";
import Wrapper from "../assets/wrappers/controlBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {Button, Icon} from "@material-ui/core"
import {
  faEye,
  faEyeSlash,
  faUndoAlt,
  faBackward,
  faPlay,
  faPause,
  faForward,
  faRecordVinyl,
  faVolumeHigh,
  faGauge,
  faMagnifyingGlassPlus,
  faMagnifyingGlassMinus,
  faBoltLightning,
  faGear,
} from "@fortawesome/free-solid-svg-icons";


const useControlBar = (cursorRef) => {
  const titles = [
    // "cursorShow",
    // "cursorHide",
    "beginning",
    // "backward",
    "play",
    // "pause",
    // "forward",
    "record",
    "volume",
    "metronome",
    "zoomIn",
    "zoomOut",
    "visualize",
    "settings",
  ];
  const icons = [
    // faEye,
    // faEyeSlash,
    faUndoAlt,
    // faBackward,
    faPlay,
    // faPause,
    // faForward,
    faRecordVinyl,
    faVolumeHigh,
    faGauge,
    faMagnifyingGlassPlus,
    faMagnifyingGlassMinus,
    faBoltLightning,
    faGear,
  ];

  const [isPlayingOn, setIsPlaying] = useState(true);
  const handlePlayPause = () => {
    setIsPlaying(!isPlayingOn);
    // Add logic to handle the play/pause action here
  };

  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const handleSettings = () => {
    // Toggle the visibility of the settings panel
    setIsSettingsVisible(!isSettingsVisible);
  };

  const handleVolumeChange = (event) => {
    // Handle volume slider change
    const volumeValue = event.target.value;
    // Update the volume state or perform any other necessary actions
  };

  const handleBPMChange = (event) => {
    // Handle BPM slider change
    const bpmValue = event.target.value;
    // Update the BPM state or perform any other necessary actions
  };

  const handleZoomChange = (event) => {
    // Handle zoom slider change
    const zoomValue = event.target.value;
    // Update the zoom state or perform any other necessary actions
  };
  
  const controlbar = (
    <Wrapper>
    <div 
      style={{
        backgroundColor: "lightblue",
        justifyContent: "center",
        bottom: 20,
        position: "fixed",
        left: "50%", // Adjust the horizontal position as needed
        transform: "translateX(-50%)", // To horizontally center the bar
        width: "fit-content",
        borderRadius: "15px",
      }}
    >
      {titles.map((title, i) => {
        return (
          <Button
            key={title}
            style={{
              color: "blue",
              margin: ".3rem .2rem",
              borderRadius: "20px",
              color: title === "record" ? "red" : undefined,
              fontSize: "1.2rem",
            }}
            title={title}
            id={title}
          > 
           <div>
            {(icons[i] == faPlay) ? (
                <FontAwesomeIcon icon={isPlayingOn ? faPlay : faPause} onClick={handlePlayPause}  />
            ) : (icons[i] === faGear) ? (
              <div>
              <FontAwesomeIcon icon={faGear} onClick={handleSettings} />
              {isSettingsVisible && (
                <div>
                  {/* Volume Slider */}
                  <input type="range" min="0" max="100" defaultValue="50" onChange={handleVolumeChange} />
                  {/* BPM Slider */}
                  <input type="range" min="50" max="200" defaultValue="120" onChange={handleBPMChange} />
                  {/* Zoom Slider */}
                  <input type="range" min="1" max="5" defaultValue="1" step="0.1" onChange={handleZoomChange} />
                </div>
              )}
            </div>
          ) : (
                <FontAwesomeIcon icon={icons[i]} /> 
            )}
          </div>
          </Button>
        );
      })}
    </div>
    </Wrapper>
  );

  return controlbar;
};

export { useControlBar };
