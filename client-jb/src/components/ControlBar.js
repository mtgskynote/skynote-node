import React, { useState, useEffect } from "react";
import ModeToggle from "./ModeToggle";
import {
  PlayCircle as PlayIcon,
  PauseCircle as PauseIcon,
  RadioButtonChecked as RecordIcon,
  ImportExport as TransposeIcon,
  AccessTime as BpmIcon,
  VolumeUp as VolumeIcon,
  Hearing as ListenIcon,
  HearingDisabled as ListenPauseIcon,
  RestartAlt as ResetIcon,
  Equalizer as StatsIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import HoverPopover from "./HoverPopover";
import ControlBarPopover from "./ControlBarPopover";
import RangeInput from "./RangeInput";
import ControlBarStats from "./ControlBarStats";

const ControlBar = ({
  onTransposeChange,
  onBpmChange,
  onMidiVolumeChange,
  onMetronomeVolumeChange,
  onModeChange,
  onToggleListen,
  onTogglePlay,
  onReset,
  onRecord,
  handleViewAllRecordings,
  isListening,
  isPlaying,
  isRecording,
  isBpmDisabled,
  playbackMode,
  handleShowPopUpWindow,
  stats,
  practiceMode,
}) => {
  const [practiceModeOn, setPracticeModeOn] = useState(true);
  const [showStats, setShowStats] = useState(false);
  const [initialMidiVolume, setInitialMidiVolume] = useState(
    practiceModeOn ? 50 : 0
  );
  const [infoAnchorEl, setInfoAnchorEl] = useState(null);

  const initialTranspose = 0;
  const initialBpm = 100;
  const initialMetronomeVolume = 0;

  const allModeIcons = [
    {
      tooltip: "Transpose",
      icon: <TransposeIcon className="text-4xl" />,
      labels: ["Transpose"],
      mins: [-12],
      maxs: [12],
      initials: [initialTranspose],
      onChanges: [onTransposeChange],
      slidersDisabled: [true],
      showInPlaybackMode: false,
      showInInteractiveMode: true,
    },
    {
      tooltip: "Metronome",
      icon: <BpmIcon className="text-4xl" />,
      labels: playbackMode ? ["Volume"] : ["BPM", "Volume"],
      mins: playbackMode ? [0] : [30, 0],
      maxs: playbackMode ? [100] : [200, 100],
      initials: playbackMode
        ? [initialMetronomeVolume]
        : [initialBpm, initialMetronomeVolume],
      onChanges: playbackMode
        ? [onMetronomeVolumeChange]
        : [onBpmChange, onMetronomeVolumeChange],
      slidersDisabled: playbackMode ? [false] : [isBpmDisabled, false],
      showInPlaybackMode: true,
      showInInteractiveMode: true,
    },
    {
      tooltip: "MIDI Volume",
      icon: <VolumeIcon className="text-4xl" />,
      labels: ["Volume"],
      mins: [0],
      maxs: [100],
      initials: [initialMidiVolume],
      onChanges: [onMidiVolumeChange],
      slidersDisabled: practiceModeOn ? [false] : [true],
      showInPlaybackMode: false,
      showInInteractiveMode: true,
    },
    {
      tooltip: "Stats",
      icon: <StatsIcon className="text-4xl" />,
      showInPlaybackMode: true,
      showInInteractiveMode: false,
    },
  ];

  const practiceModeIcons = [
    {
      tooltip: "Reset",
      iconPlay: <ResetIcon className="text-4xl" />,
      iconPause: <ResetIcon className="text-4xl" />,
      toggle: onReset,
      showInPlaybackMode: true,
    },
    {
      tooltip: isListening ? "Stop Listening" : "Listen",
      iconPlay: <ListenIcon className="text-4xl" />,
      iconPause: <ListenPauseIcon className="text-4xl" />,
      toggle: onToggleListen,
      flag: isListening,
      showInPlaybackMode: false,
    },
    {
      tooltip: playbackMode
        ? isPlaying
          ? "Pause"
          : "Play"
        : isPlaying
        ? "Stop Practicing"
        : "Practice",
      iconPlay: <PlayIcon className="text-4xl" />,
      iconPause: <PauseIcon className="text-4xl" />,
      toggle: onTogglePlay,
      flag: isPlaying,
      showInPlaybackMode: true,
    },
  ];

  const recordModeIcons = [
    {
      tooltip: isRecording ? "Stop Recording" : "Record",
      icon: <RecordIcon className="text-4xl" />,
      toggle: onRecord,
    },
  ];

  // Sets the current mode state and passes this state up the parent components
  const handleModeChange = (newMode) => {
    setPracticeModeOn(newMode);
    onModeChange(newMode);
  };

  // Toggle the stats bar open and closed in playback mode
  const handleToggleStats = () => {
    setShowStats(!showStats);
  };

  const handleInfoPopoverOpen = (event) => {
    setInfoAnchorEl(event.currentTarget);
  };

  const handleInfoPopoverClose = () => {
    setInfoAnchorEl(null);
  };

  useEffect(() => {
    setInitialMidiVolume(practiceModeOn ? 50 : 0);
  }, [practiceModeOn]);

  useEffect(() => {
    setPracticeModeOn(practiceMode);
  }, [practiceMode]);

  console.log(Boolean(infoAnchorEl));

  return (
    <div
      className={`relative  w-1/2 ${
        playbackMode ? "lg:w-1/2" : "lg:w-3/5"
      } md:mx-8 md:w-full sm:w-5/6`}
    >
      <ControlBarStats show={showStats} stats={stats} />
      <div
        className={`px-4 py-3 bg-blue-400 ${
          showStats ? "rounded-t-none rounded-b-3xl" : "rounded-3xl"
        } shadow-md relative z-20 transition-all duration-300 ease-in-out`}
      >
        <div className="flex justify-between items-center h-full">
          {!playbackMode && (
            <div>
              <ModeToggle
                onModeChange={handleModeChange}
                practiceMode={practiceMode}
              />
            </div>
          )}

          {!playbackMode && (
            <div className="ml-6 h-auto w-0.5 self-stretch bg-white/20"></div>
          )}

          <div className="flex flex-grow justify-around">
            {practiceModeOn
              ? practiceModeIcons
                  .filter((modeIcon) =>
                    playbackMode ? modeIcon.showInPlaybackMode : true
                  )
                  .map((modeIcon, index) => (
                    <Tooltip title={modeIcon.tooltip} key={index}>
                      <IconButton
                        className="text-white"
                        onClick={modeIcon.toggle}
                      >
                        {modeIcon.flag ? modeIcon.iconPause : modeIcon.iconPlay}
                      </IconButton>
                    </Tooltip>
                  ))
              : recordModeIcons.map((modeIcon, index) => (
                  <Tooltip title={modeIcon.tooltip} key={index}>
                    <IconButton
                      className={`${
                        isRecording && modeIcon.tooltip === "Stop Recording"
                          ? "text-red-500"
                          : "text-white"
                      }`}
                      onClick={modeIcon.toggle}
                    >
                      {modeIcon.icon}
                    </IconButton>
                  </Tooltip>
                ))}
            {allModeIcons
              .filter((modeIcon) =>
                playbackMode
                  ? modeIcon.showInPlaybackMode
                  : modeIcon.showInInteractiveMode
              )
              .map((modeIcon, index) =>
                modeIcon.tooltip === "Transpose" ? (
                  <IconButton
                    key={index}
                    disabled
                    className="text-white opacity-50"
                  >
                    {modeIcon.icon}
                  </IconButton>
                ) : modeIcon.tooltip === "Stats" ? (
                  <IconButton
                    key={index}
                    className="text-white"
                    onClick={handleToggleStats}
                  >
                    {modeIcon.icon}
                  </IconButton>
                ) : (
                  <ControlBarPopover key={index}>
                    {/* Popover trigger */}
                    <Tooltip title={modeIcon.tooltip}>
                      <IconButton className="text-white">
                        {modeIcon.icon}
                      </IconButton>
                    </Tooltip>

                    {/* Popover content */}
                    <div>
                      {modeIcon.labels.map((label, index) => (
                        <RangeInput
                          key={index}
                          label={label}
                          min={modeIcon.mins[index]}
                          max={modeIcon.maxs[index]}
                          initial={modeIcon.initials[index]}
                          onValueChange={modeIcon.onChanges[index]}
                          disabled={modeIcon.slidersDisabled[index]}
                        />
                      ))}
                    </div>
                  </ControlBarPopover>
                )
              )}
          </div>

          <div className="mr-6 h-auto w-0.5 self-stretch bg-white/20"></div>

          <div className="flex justify-between items-center space-x-2">
            <div className="flex">
              <button
                onClick={handleViewAllRecordings}
                className="ml-auto hover:cursor-pointer transition ease-in-out delay-50 text-center text-gray-700 hover:text-gray-900 border-transparent focus:border-transparent focus:ring-0 focus:outline-none bg-slate-50 hover:bg-slate-100 font-extralight py-1 px-2 rounded-l-none outline-none rounded"
              >
                {playbackMode ? "Go back" : "View All Recordings"}
              </button>
              {playbackMode && (
                <button
                  onClick={handleShowPopUpWindow}
                  className="ml-auto hover:cursor-pointer transition ease-in-out delay-50 text-center text-white border-transparent focus:border-transparent focus:ring-0 focus:outline-none bg-red-500 hover:bg-red-600 hover:text-white font-extralight py-1 px-2 rounded-l-none outline-none rounded"
                >
                  Delete recording
                </button>
              )}
            </div>
            <div className="relative">
              <IconButton
                aria-label="more"
                aria-haspopup="true"
                onMouseEnter={handleInfoPopoverOpen}
                onMouseLeave={handleInfoPopoverClose}
                className="text-red-100 opacity-50 cursor-default"
              >
                <InfoIcon className="text-3xl" />
              </IconButton>
              {Boolean(infoAnchorEl) && (
                <HoverPopover
                  anchorEl={infoAnchorEl}
                  onClose={handleInfoPopoverClose}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlBar;
