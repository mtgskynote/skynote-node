// AudioPlayerIcon.js
import React, { useState } from "react";
import { IconButton } from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";

const AudioPlayerIcon = ({ audio }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioPlayer, setAudioPlayer] = useState(null);

  const toggleAudio = () => {
    if (isPlaying) {
      audioPlayer.pause();
      setIsPlaying(false);
    } else {
      const uint8Array = new Uint8Array(audio.data);
      const blob = new Blob([uint8Array], { type: "audio/*" });
      const audioUrl = URL.createObjectURL(blob);

      const newAudioPlayer = new Audio(audioUrl);
      newAudioPlayer.play();
      setAudioPlayer(newAudioPlayer);
      setIsPlaying(true);
      newAudioPlayer.addEventListener("ended", () => {
        setIsPlaying(false);
      });
    }
  };

  return (
    <IconButton
      onClick={toggleAudio}
      className={`hover:text-blue-500 ${isPlaying ? "text-blue-500" : ""}`}
    >
      {isPlaying ? <PauseCircleOutlineIcon /> : <PlayCircleOutlineIcon />}
    </IconButton>
  );
};

export default AudioPlayerIcon;
