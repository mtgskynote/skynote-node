import React, { useState } from "react";
import ModeToggleAlt from "./ModeToggleAlt";
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
} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ControlBarPopover from "./ControlBarPopover";

const initialTranspose = 0;
const initialBpm = 100;
const initialVolume = 50;

const ControlBarAlt = ({
  onTransposeChange,
  onBpmChange,
  onVolumeChange,
  onModeChange,
  onToggleListen,
  onTogglePlay,
  onReset,
  isListening,
  isPlaying,
}) => {
  const [practiceModeOn, setPracticeModeOn] = useState(true);

  const allModeIcons = [
    {
      tooltip: "Transpose",
      icon: <TransposeIcon className="text-4xl" />,
      min: -12,
      max: 12,
      initial: initialTranspose,
      handleValueChange: (newTranspose) => {
        onTransposeChange(newTranspose);
      },
    },
    {
      tooltip: "BPM",
      icon: <BpmIcon className="text-4xl" />,
      min: 30,
      max: 200,
      initial: initialBpm,
      handleValueChange: (newBpm) => {
        onBpmChange(newBpm);
      },
    },
    {
      tooltip: "Volume",
      icon: <VolumeIcon className="text-4xl" />,
      min: 0,
      max: 100,
      initial: initialVolume,
      handleValueChange: (newVolume) => {
        onVolumeChange(newVolume);
      },
    },
  ];

  const practiceModeIcons = [
    {
      tooltip: "Reset",
      iconPlay: <ResetIcon className="text-4xl" />,
      iconPause: <ResetIcon className="text-4xl" />,
      toggle: () => {
        onReset();
      },
    },
    {
      tooltip: isListening ? "Stop Listening" : "Listen",
      iconPlay: <ListenIcon className="text-4xl" />,
      iconPause: <ListenPauseIcon className="text-4xl" />,
      toggle: () => {
        onToggleListen();
      },
      flag: isListening,
    },
    {
      tooltip: isPlaying ? "Stop Practicing" : "Practice",
      iconPlay: <PlayIcon className="text-4xl" />,
      iconPause: <PauseIcon className="text-4xl" />,
      toggle: () => {
        onTogglePlay();
      },
      flag: isPlaying,
    },
  ];

  const recordModeIcons = [
    { tooltip: "Record", icon: <RecordIcon className="text-4xl" /> },
  ];

  const handleModeChange = (newMode) => {
    setPracticeModeOn(newMode);
    onModeChange(newMode);
  };

  return (
    <div className="px-4 py-3 bg-blue-400 rounded-3xl shadow-md w-1/2">
      <div className="flex justify-between items-center h-full">
        <div>
          <ModeToggleAlt
            onModeChange={(newMode) => handleModeChange(newMode)}
          />
        </div>

        <div className="ml-6 h-full w-0.5 self-stretch bg-neutral-100 dark:bg-white/10"></div>

        <div className="flex flex-grow justify-around">
          {practiceModeOn
            ? practiceModeIcons.map((modeIcon, index) => (
                <Tooltip title={modeIcon.tooltip} key={index}>
                  <IconButton className="text-white" onClick={modeIcon.toggle}>
                    {modeIcon.flag ? modeIcon.iconPause : modeIcon.iconPlay}
                  </IconButton>
                </Tooltip>
              ))
            : recordModeIcons.map((modeIcon, index) => (
                <Tooltip title={modeIcon.tooltip} key={index}>
                  <IconButton className="text-white">
                    {modeIcon.icon}
                  </IconButton>
                </Tooltip>
              ))}
          {allModeIcons.map((modeIcon, index) => (
            <ControlBarPopover
              key={index}
              label={modeIcon.tooltip}
              min={modeIcon.min}
              max={modeIcon.max}
              initial={modeIcon.initial}
              onValueChange={(newValue) => modeIcon.handleValueChange(newValue)}
            >
              <Tooltip title={modeIcon.tooltip}>
                <IconButton className="text-white">{modeIcon.icon}</IconButton>
              </Tooltip>
            </ControlBarPopover>
          ))}
        </div>

        <div className="mr-6 h-full w-0.5 self-stretch bg-neutral-100 dark:bg-white/10"></div>

        <div>
          <button className="ml-auto hover:cursor-pointer transition ease-in-out delay-50 text-center text-gray-700 border-transparent focus:border-transparent focus:ring-0 focus:outline-none bg-slate-50 hover:bg-red-600 hover:text-white font-extralight hover:font-bold py-1 px-2 rounded-l-none outline-none rounded">
            View All Recordings
          </button>
        </div>
      </div>
    </div>
  );
};

export default ControlBarAlt;
