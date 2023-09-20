import { useEffect, useState } from "react";
import Wrapper from "../assets/wrappers/controlBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Icon } from "@material-ui/core";
import { Dropdown } from "react-bootstrap";

import {
  faEye,
  faEyeSlash,
  faUndoAlt,
  faBackward,
  faPlay,
  faPause,
  faForward,
  faRecordVinyl,
  faBullseye,
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
    // "volume",
    // "metronome",
    // "zoomIn",
    // "zoomOut",
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
    faBullseye,
    // faVolumeHigh,
    // faGauge,
    // faMagnifyingGlassPlus,
    // faMagnifyingGlassMinus,
    faBoltLightning,
    faGear,
  ];

  //Volume, bpm and zoom variables
  const [volume, setVolume] = useState(50);
  const [bpm, setBPM] = useState(120);
  const [zoom, setZoom] = useState(1);

  //PLAY/PAUSE variable
  const [isPlayingOn, setIsPlaying] = useState(true);
  const handlePlayPause = () => {
    setIsPlaying(!isPlayingOn);
    // Add logic to handle the play/pause action here
  };

  
  //record variable
  const [recordingOff, setRecordingOff] = useState(true);
  const handleRecord = () => {
    setRecordingOff(!recordingOff);
    // Add logic to handle the play/pause action here
  };

  //Settings-visible variable
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const handleToggleSettings = () => {
    // Toggle the visibility of the settings panel
    setIsSettingsVisible(!isSettingsVisible);
  };

  //Volume change
  const handleVolumeChange = (event) => {
    // Handle volume slider change
    setVolume(event.target.value);
    // Update the volume state or perform any other necessary actions
  };

  //BPM change
  const handleBPMChange = (event) => {
    // Handle BPM slider change
    setBPM(event.target.value);
    // Update the BPM state or perform any other necessary actions
  };

  //Zoom change
  const handleZoomChange = (event) => {
    // Handle zoom slider change
    setZoom(event.target.value);
    // Update the zoom state or perform any other necessary actions
  };

  //Reset change
  const handleResetChange = (event) => {
    // Handle reset button --> show play button, not pause
    setIsPlaying(true)
    // Update the zoom state or perform any other necessary actions
  };

  const controlbar = (
    <Wrapper>
      <div className="myDiv">
        {titles.map((title, i) => {
          return (
            <Button key={title} className="controlBtn" title={title} id={title}>
              <div>
                {icons[i] == faPlay ? (
                  <FontAwesomeIcon
                    icon={isPlayingOn ? faPlay : faPause} //Alternate Pause/Play button
                    onClick={handlePlayPause}
                  />
                ) : icons[i] == faUndoAlt ? ( 
                  <FontAwesomeIcon
                    icon={icons[i]}
                    onClick={handleResetChange} //When reset --> play button
                  />
                ) : icons[i] == faBullseye ? (
                  <FontAwesomeIcon
                    icon={recordingOff ? faBullseye:faRecordVinyl} //Alternate NotRecoding/Recording button
                    onClick={handleRecord}
                  />
                ): icons[i] === faGear ? (
                  <div>
                    <Dropdown
                      show={isSettingsVisible}
                      onToggle={handleToggleSettings}
                      drop="up"
                    >
                      <Dropdown.Toggle
                        variant="secondary"
                        className="dropDownTgl"
                      >
                        <FontAwesomeIcon icon={faGear} />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <div>
                          {/* Volume Slider */}
                          <FontAwesomeIcon icon={faVolumeHigh} />
                          <label
                            htmlFor="volume-slider"
                            className="slider-label"
                          >
                            Volume
                          </label>
                          <input
                            id="volume-slider"
                            type="range"
                            min="0"
                            max="100"
                            value={volume}
                            onChange={handleVolumeChange}
                          />
                        </div>
                        <div>
                          {/* Zoom Slider */}
                          <FontAwesomeIcon icon={faMagnifyingGlassMinus} />
                          <label htmlFor="zoom-slider" className="slider-label">
                            Zoom
                          </label>
                          <input
                            id="zoom-slider"
                            type="range"
                            min="1"
                            max="2"
                            step="0.1"
                            value={zoom}
                            onChange={handleZoomChange}
                          />
                        </div>
                        <div>
                          {/* BPM Slider */}
                          <FontAwesomeIcon icon={faGauge} />
                          <label htmlFor="bpm-slider" className="slider-label">
                            BPM
                          </label>
                          <input
                            id="bpm-slider"
                            type="range"
                            min="50"
                            max="200"
                            value={bpm}
                            onChange={handleBPMChange}
                          />
                        </div>
                      </Dropdown.Menu>
                    </Dropdown>
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
