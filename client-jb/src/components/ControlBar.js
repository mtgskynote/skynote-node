import React, { useState } from "react";
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
} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ControlBarPopover from "./ControlBarPopover";
import RangeInput from "./RangeInput";

const initialTranspose = 0;
const initialBpm = 100;
const initialMidiVolume = 50;
const initialMetronomeVolume = 0;

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
  playbackMode,
}) => {
  const [practiceModeOn, setPracticeModeOn] = useState(true);

  const allModeIcons = [
    {
      tooltip: "Transpose",
      icon: <TransposeIcon className="text-4xl" />,
      labels: ["Transpose"],
      mins: [-12],
      maxs: [12],
      initials: [initialTranspose],
      onChanges: [onTransposeChange],
      showInPlaybackMode: false,
      showInInteractiveMode: true,
    },
    {
      tooltip: "BPM",
      icon: <BpmIcon className="text-4xl" />,
      labels: playbackMode ? ["Metro Vol"] : ["BPM", "Metro Vol"],
      mins: playbackMode ? [0] : [30, 0],
      maxs: playbackMode ? [100] : [200, 100],
      initials: playbackMode
        ? [initialMetronomeVolume]
        : [initialBpm, initialMetronomeVolume],
      onChanges: playbackMode
        ? [onMetronomeVolumeChange]
        : [onBpmChange, onMetronomeVolumeChange],
      showInPlaybackMode: true,
      showInInteractiveMode: true,
    },
    {
      tooltip: "Volume",
      icon: <VolumeIcon className="text-4xl" />,
      labels: ["Volume"],
      mins: [0],
      maxs: [100],
      initials: [initialMidiVolume],
      onChanges: [onMidiVolumeChange],
      showInPlaybackMode: false,
      showInInteractiveMode: true,
    },
    {
      tooltip: "Stats",
      icon: <StatsIcon className="text-4xl" />,
      labels: ["Stats"],
      mins: [0],
      maxs: [100],
      initials: [initialMetronomeVolume],
      onChanges: [onMetronomeVolumeChange],
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

  return (
    <div
      className={`px-4 py-3 bg-blue-400 rounded-3xl shadow-md w-1/2 ${
        playbackMode ? "lg:w-1/2" : "lg:w-3/5"
      } md:mx-8 md:w-full sm:w-5/6`}
    >
      <div className="flex justify-between items-center h-full">
        {!playbackMode && (
          <div>
            <ModeToggle onModeChange={(newMode) => handleModeChange(newMode)} />
          </div>
        )}

        {!playbackMode && (
          <div className="ml-6 h-full w-0.5 self-stretch bg-neutral-100 dark:bg-white/10"></div>
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
                    {modeIcon.tooltip === "Stats" ? (
                      <div>Hello!</div>
                    ) : (
                      modeIcon.labels.map((label, index) => (
                        <RangeInput
                          key={index}
                          label={label}
                          min={modeIcon.mins[index]}
                          max={modeIcon.maxs[index]}
                          initial={modeIcon.initials[index]}
                          onValueChange={modeIcon.onChanges[index]}
                        />
                      ))
                    )}
                  </div>
                </ControlBarPopover>
              )
            )}
        </div>

        <div className="mr-6 h-full w-0.5 self-stretch bg-neutral-100 dark:bg-white/10"></div>

        <div className="justify-between items-center space-x-2">
          <button
            onClick={handleViewAllRecordings}
            className="ml-auto hover:cursor-pointer transition ease-in-out delay-50 text-center text-gray-700 hover:text-gray-900 border-transparent focus:border-transparent focus:ring-0 focus:outline-none bg-slate-50 hover:bg-slate-100 font-extralight py-1 px-2 rounded-l-none outline-none rounded"
          >
            {playbackMode ? "Go back" : "View All Recordings"}
          </button>
          {playbackMode && (
            <button className="ml-auto hover:cursor-pointer transition ease-in-out delay-50 text-center text-white border-transparent focus:border-transparent focus:ring-0 focus:outline-none bg-red-500 hover:bg-red-600 hover:text-white font-extralight py-1 px-2 rounded-l-none outline-none rounded">
              Delete recording
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ControlBar;
