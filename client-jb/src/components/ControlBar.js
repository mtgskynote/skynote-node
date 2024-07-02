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
import ControlBarPopover from "./ControlBarPopover";
import RangeInput from "./RangeInput";
import ControlBarPanel from "./ControlBarPanel";
import StarRating from "./StarRating";

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
  handleToggleStats,
  handleToggleInfo,
  showStats,
  showInfo,
  stats,
  practiceMode,
  isMac,
}) => {
  const [practiceModeOn, setPracticeModeOn] = useState(true);
  const [initialMidiVolume, setInitialMidiVolume] = useState(
    practiceModeOn ? 50 : 0
  );

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
      toggle: handleToggleStats,
      showInPlaybackMode: true,
      showInInteractiveMode: false,
    },
    {
      tooltip: "Shortcuts",
      icon: <InfoIcon className="text-4xl" />,
      toggle: handleToggleInfo,
      showInPlaybackMode: true,
      showInInteractiveMode: true,
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

  // Handle resetting MIDI volume based on mode
  useEffect(() => {
    setInitialMidiVolume(practiceModeOn ? 50 : 0);
  }, [practiceModeOn]);

  // Ensure that component practice mode state variable reflects parent component's state
  useEffect(() => {
    setPracticeModeOn(practiceMode);
  }, [practiceMode]);

  return (
    <div
      className={`relative  w-1/2 ${
        playbackMode ? "lg:w-1/2" : "lg:w-3/5"
      } md:mx-8 md:w-full sm:w-5/6`}
    >
      {playbackMode && (
        <ControlBarPanel show={showStats} stats={stats}>
          <div className="flex justify-between">
            <div>
              <p className="text-white font-bold text-2xl mb-0">{stats.name}</p>
              <p className="text-white opacity-75 mb-3">
                {stats.date} | {stats.bpm} BPM
              </p>
              <StarRating size="text-3xl" stars={stats.stars} />
            </div>
            <div>
              <p className="text-white font-bold text-xl mb-0 text-right">
                Level {stats.level}
              </p>
              <p className="text-white opacity-75">{stats.skill}</p>
            </div>
          </div>
        </ControlBarPanel>
      )}
      <ControlBarPanel show={showInfo} stats={stats}>
        <div className={`${practiceModeOn ? "pb-2" : "pb-8"}`}>
          <p className="font-bold text-white text-2xl mb-3">Shortcuts</p>
          <div className="flex justify-between space-x-4">
            <div>
              {!playbackMode && practiceMode && (
                <div>
                  <span className="text-white font-bold">
                    {isMac ? "Command" : "Ctrl"} + Shift + R:{" "}
                  </span>
                  <span className="text-white opacity-75">Reset</span>
                </div>
              )}
              <div>
                <span className="text-white font-bold">
                  {playbackMode
                    ? `${isMac ? "Command" : "Ctrl"} + Shift + S: `
                    : `${isMac ? "Command" : "Ctrl"} + M: `}
                </span>
                <span className="text-white opacity-75">
                  {playbackMode ? "Toggle Stats" : "Switch Modes"}
                </span>
              </div>
            </div>
            <div>
              {!playbackMode && practiceModeOn && (
                <div>
                  <span className="text-white font-bold">
                    {isMac ? "Command" : "Ctrl"} + L:{" "}
                  </span>
                  <span className="text-white opacity-75">Toggle Listen</span>
                </div>
              )}
              {practiceModeOn && (
                <div>
                  <span className="text-white font-bold">
                    {isMac ? "Command" : "Ctrl"} + P:{" "}
                  </span>
                  <span className="text-white opacity-75">
                    {playbackMode ? "Toggle Playback" : "Toggle Practice"}
                  </span>
                </div>
              )}
              {!playbackMode && !practiceModeOn && (
                <div>
                  <span className="text-white font-bold">
                    {isMac ? "Command" : "Ctrl"} + R:{" "}
                  </span>
                  <span className="text-white opacity-75">Toggle Record</span>
                </div>
              )}
            </div>
            <div>
              <div>
                <span className="text-white font-bold">
                  {isMac ? "Command" : "Ctrl"} + Shift + I:{" "}
                </span>
                <span className="text-white opacity-75">View Shortcuts</span>
              </div>
            </div>
          </div>
        </div>
      </ControlBarPanel>
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
                ) : modeIcon.tooltip === "Stats" ||
                  modeIcon.tooltip === "Shortcuts" ? (
                  <Tooltip title={modeIcon.tooltip} key={index}>
                    <IconButton
                      className="text-white"
                      onClick={modeIcon.toggle}
                    >
                      {modeIcon.icon}
                    </IconButton>
                  </Tooltip>
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
        </div>
      </div>
    </div>
  );
};

export default ControlBar;
