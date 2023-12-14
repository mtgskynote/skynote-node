import {useEffect, useState } from "react";
import Wrapper from "../assets/wrappers/ControlBarVisual";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button} from "@material-ui/core";
import { Dropdown } from "react-bootstrap";

import {
  faPlay,
  faStop,
  faVolumeHigh,
  faMagnifyingGlassMinus,
  faWater,
  faGear,
  faGauge,
} from "@fortawesome/free-solid-svg-icons";

const ControlBarVisual = (props) => {
  //Volume and zoom variables
  const [volume, setVolume] = useState(0.5);
  const [zoom, setZoom] = useState(1);
  const [metronomeVol, setMetronomeVol] = useState(0);
  const [bpm, setBPM] = useState(100);

  useEffect(() => {

    if(props.cursorFinished){
      //cursor finished -->same actions as in reset
      setIsPlaying(true)
      //setRecordingOff(true)
      //Change cursorFinished state in parent component
      props.cursorFinishedCallback(false)
    }

    setBPM(props.bpmValue)
    
  }, [props]);


  //PLAY/STOP variable
  const [isPlayingOn, setIsPlaying] = useState(true);
  const handlePlayStop = () => {
    setIsPlaying(!isPlayingOn);
    // Add logic to handle the play/stop action here
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

  //BPM change
  const handleBPMChange = (event) => {
    // Handle BPM slider change
    setBPM(event.target.value);
    // Update the BPM state or perform any other necessary actions
  };


  //RepeatLayers button
  const handleRepeatLayers = (event) => {
    // None
  };

  //Generate data to generate buttons
  const titles = [
    "play/stop",
    "switchRepetition",
    "settings",
  ];
  const icons = [
    faPlay,
    faWater,
    faGear,
  ];
  const handlers = [
    handlePlayStop,
    handleRepeatLayers,
    handleToggleSettings
  ]

  const ControlBarVisual = (
    <Wrapper>
      <div className="myDiv">
        {titles.map((title, i) => {
          return (
            <Button key={title} className="controlBtn" title={title} id={title} onClick={() => handlers[i](title)}>
              <div>
                {icons[i] === faPlay ? (
                  <FontAwesomeIcon
                    icon={isPlayingOn ? faPlay : faStop} //Alternate Stop/Play button
                    
                  />
                ) : icons[i] === faGear ? ( //settings
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
                            disabled={true}
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

  return ControlBarVisual;
};

export default ControlBarVisual;
