import React, { useState } from "react";
import ModeToggleAlt from "./ModeToggleAlt";
import {
  PlayCircle as PlayIcon,
  PauseCircle as PauseIcon,
  RadioButtonChecked as RecordIcon,
  ImportExport as TransposeIcon,
  AccessTime as BpmIcon,
  VolumeUp as VolumeIcon,
  Hearing as HearingIcon,
} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

const ControlBarAlt = () => {
  const [practiceModeOn, setPracticeModeOn] = useState(true);
  const allModeIcons = [
    { tooltip: "Transpose", icon: <TransposeIcon className="text-4xl" /> },
    { tooltip: "BPM", icon: <BpmIcon className="text-4xl" /> },
    { tooltip: "Volume", icon: <VolumeIcon className="text-4xl" /> },
  ];
  const practiceModeIcons = [
    { tooltip: "Listen", icon: <HearingIcon className="text-4xl" /> },
    { tooltip: "Practice", icon: <PlayIcon className="text-4xl" /> },
  ];
  const recordModeIcons = [
    { tooltip: "Record", icon: <RecordIcon className="text-4xl" /> },
  ];

  return (
    <div className="px-4 py-3 bg-blue-400 rounded-3xl shadow-md w-1/2">
      <div className="flex justify-between items-center h-full">
        <div>
          <ModeToggleAlt
            onModeChange={(newMode) => setPracticeModeOn(newMode)}
          />
        </div>

        <div className="ml-6 h-full w-0.5 self-stretch bg-neutral-100 dark:bg-white/10"></div>

        <div className="flex flex-grow justify-around">
          {practiceModeOn
            ? practiceModeIcons.map((modeIcon, index) => (
                <Tooltip title={modeIcon.tooltip} key={index}>
                  <IconButton className="text-white">
                    {modeIcon.icon}
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
            <Tooltip title={modeIcon.tooltip} key={index}>
              <IconButton className="text-white">{modeIcon.icon}</IconButton>
            </Tooltip>
          ))}
        </div>

        <div className="mr-6 h-full w-0.5 self-stretch bg-neutral-100 dark:bg-white/10"></div>

        <div>
          <button className="ml-auto hover:cursor-pointer transition ease-in-out delay-50 text-center text-gray-800 border-transparent focus:border-transparent focus:ring-0 focus:outline-none bg-slate-50 hover:bg-red-600 hover:text-white font-extralight hover:font-bold py-1 px-2 rounded-l-none outline-none rounded">
            View All Recordings
          </button>
        </div>
      </div>
    </div>
  );
};

export default ControlBarAlt;
