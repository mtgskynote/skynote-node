import {useEffect, useState } from "react";
import Wrapper from "../assets/wrappers/ControlBarRecord";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button} from "@material-ui/core";
import { Dropdown } from "react-bootstrap";

import {
//  faUndoAlt,
  faPlay,
  faPause,
  faRecordVinyl,
  faBullseye,
  faVolumeHigh,
  faGauge,
  faMagnifyingGlassMinus,
//  faWater,
  faGear,
  faBookmark,
} from "@fortawesome/free-solid-svg-icons";

const ControlBarRecord = (props) => {
  //Volume, bpm and zoom variables
  const [volume, setVolume] = useState(0.5);
  const [bpm, setBPM] = useState(100);
  const [zoom, setZoom] = useState(1);
  const [metronomeVol, setMetronomeVol] = useState(0);

  useEffect(() => {

    if(props.cursorFinished){
      //cursor finished -->same actions as in reset
      setIsPlaying(true)
      setRecordingOff(true)
      //Change cursorFinished state in parent component
      props.cursorFinishedCallback(false)
    }
    
  }, [props]);

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

   //Saved recordings button
   const handleSaveRecordings = (event) => {
    // None
  };

  //Generate data to generate buttons
  const titles = [
    "play/pause",
    "record/stopRecording",
    "saved",
    "settings",
    ];
  const icons = [
    faPlay,
    faBullseye,
    faBookmark,
    faGear,
  ];
  const handlers = [
    handlePlayPause,
    handleRecord,
    handleSaveRecordings,
    handleToggleSettings,
  ]

  const ControlBarRecord = (
    <Wrapper>
      <div className="myDiv">
        {titles.map((title, i) => {
          return (
            <Button key={title} className="controlBtn" title={title} id={title} onClick={() => handlers[i](title)}>
              <div>
                {icons[i] === faPlay ? (
                  <FontAwesomeIcon
                    icon={isPlayingOn ? faPlay : faPause} //Alternate Pause/Play button
                    
                  />
                ) : icons[i] === faBullseye ? (
                  <FontAwesomeIcon
                    icon={recordingOff ? faBullseye:faRecordVinyl} //Alternate NotRecoding/Recording button
                    
                  />
                ): icons[i] === faGear ? ( //settings
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
                            disabled={!recordingOff}
                          />
                        </div>
                        <div>
                          {/* Metronome Volume Slider */}
                          <FontAwesomeIcon icon={faVolumeHigh} />
                          <label htmlFor="metroVol-slider" className="slider-label" title="metronome-volume">
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
                            disabled={!recordingOff}
                          />
                        </div>
                        <div>
                          {/* Zoom Slider */}
                          <FontAwesomeIcon icon={faMagnifyingGlassMinus} />
                          <label htmlFor="zoom-slider" className="slider-label" title="zoom-slider">
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
                            disabled={!recordingOff}
                          />
                        </div>
                        <div>
                          {/* BPM Slider */}
                          <FontAwesomeIcon icon={faGauge} />
                          <label htmlFor="bpm-slider" className="slider-label" title="change-bpm">
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
                            disabled={!recordingOff}
                          />
                        </div>
                        
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                ) : (
                  <FontAwesomeIcon icon={icons[i]} /> //else: saved recordings
                )}
              </div>
            </Button>
          );
        })}
      </div>
    </Wrapper>
  );

  return ControlBarRecord;
};

export default ControlBarRecord;