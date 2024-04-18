import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@material-ui/core";
import { Dropdown } from "react-bootstrap";
import ControlBarCSS from "./ControlBar.module.css";

import {
  faUndoAlt,
  faPlay,
  faPause,
  faRecordVinyl,
  faBullseye,
  faVolumeHigh,
  faGauge,
  faMagnifyingGlassMinus,
  faWater,
  faGear,
} from "@fortawesome/free-solid-svg-icons";

const ControlBar = (props) => {
  //Volume, bpm and zoom variables
  const [volume, setVolume] = useState(0.5);
  const [bpm, setBPM] = useState(100);
  const [zoom, setZoom] = useState(1);
  const [metronomeVol, setMetronomeVol] = useState(0);

  useEffect(() => {
    if (props.cursorFinished) {
      //cursor finished -->same actions as in reset
      setIsPlaying(true);
      setRecordingOff(true);
      //Change cursorFinished state in parent component
      props.cursorFinishedCallback(false);
    }
  }, [props]);

  /*if (props.cursorFinished !== prevProps.cursorFinished) {
    //cursor finished the score --> reset button values
    setIsPlaying(true)
    setRecordingOff(true)
  }
  var prevProps=props; //save*/

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

  //Metronome Volume change
  const handleMetroVolChange = (event) => {
    // Handle MetroVol slider change
    setMetronomeVol(event.target.value);
    // Update the MetroVol state or perform any other necessary actions
  };

  //Reset change
  const handleResetChange = (event) => {
    // Handle reset button --> show play button, not pause
    setIsPlaying(true);
    setRecordingOff(true);
    // Update the zoom state or perform any other necessary actions
  };

  //RepeatLayers button
  const handleRepeatLayers = (event) => {
    // None
  };

  //Generate data to generate buttons
  const titles = [
    "reset",
    "play/pause",
    "record/stopRecording",
    "switchRepetition",
    "settings",
  ];
  const icons = [faUndoAlt, faPlay, faBullseye, faWater, faGear];
  const handlers = [
    handleResetChange,
    handlePlayPause,
    handleRecord,
    handleRepeatLayers,
    handleToggleSettings,
  ];

  const ControlBar = (
    <div className={ControlBarCSS.myDiv} title="playMode">
      {titles.map((title, i) => {
        return (
          <Button
            key={title}
            className={ControlBarCSS.controlBtn}
            title={title}
            id={title}
            onClick={() => handlers[i](title)}
          >
            <div>
              {icons[i] === faPlay ? (
                <FontAwesomeIcon
                  icon={isPlayingOn ? faPlay : faPause} //Alternate Pause/Play button
                />
              ) : icons[i] === faUndoAlt ? (
                <FontAwesomeIcon icon={icons[i]} />
              ) : icons[i] === faBullseye ? (
                <FontAwesomeIcon
                  icon={recordingOff ? faBullseye : faRecordVinyl} //Alternate NotRecoding/Recording button
                />
              ) : icons[i] === faGear ? (
                <div>
                  <Dropdown
                    show={isSettingsVisible}
                    onToggle={handleToggleSettings}
                    drop="up"
                  >
                    <Dropdown.Toggle
                      variant="secondary"
                      className={ControlBarCSS.dropDownTgl}
                      title="playMode"
                    >
                      <FontAwesomeIcon icon={faGear} />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <div>
                        {/* Volume Slider */}
                        <FontAwesomeIcon icon={faVolumeHigh} />
                        <label
                          htmlFor="volume-slider"
                          className={ControlBarCSS.sliderLabel}
                          title="audio-volume"
                        >
                          Volume
                        </label>
                        <input
                          id="volume-slider"
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={volume}
                          onChange={handleVolumeChange}
                          title="audio-volume"
                        />
                      </div>
                      <div>
                        {/* Metronome Volume Slider */}
                        <FontAwesomeIcon icon={faVolumeHigh} />
                        <label
                          htmlFor="metroVol-slider"
                          className={ControlBarCSS.sliderLabel}
                          title="metronome-volume"
                        >
                          Metronome
                        </label>
                        <input
                          id="metroVol-slider"
                          title="metronome-volume"
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={metronomeVol}
                          onChange={handleMetroVolChange}
                        />
                      </div>
                      <div>
                        {/* Zoom Slider */}
                        <FontAwesomeIcon icon={faMagnifyingGlassMinus} />
                        <label
                          htmlFor="zoom-slider"
                          className={ControlBarCSS.sliderLabel}
                          title="zoom-slider"
                        >
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
                          title="zoom-slider"
                        />
                      </div>
                      <div>
                        {/* BPM Slider */}
                        <FontAwesomeIcon icon={faGauge} />
                        <label
                          htmlFor="bpm-slider"
                          className={ControlBarCSS.sliderLabel}
                          title="change-bpm"
                        >
                          BPM ({bpm})
                        </label>
                        <input
                          id="bpm-slider"
                          type="range"
                          min="50"
                          max="200"
                          value={bpm}
                          onChange={handleBPMChange}
                          title="change-bpm"
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
  );

  return ControlBar;
};

export default ControlBar;
