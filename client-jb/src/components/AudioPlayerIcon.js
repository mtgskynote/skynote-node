// AudioPlayerIcon.js
import React, { useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";

// Component for controlling audio playback with play/pause button.
const AudioPlayerIcon = ({ audio, isPlaying, onPlay }) => {
  const [audioPlayer, setAudioPlayer] = useState(null);

  // Initializez audio player
  useEffect(() => {
    const uint8Array = new Uint8Array(audio.data);
    const blob = new Blob([uint8Array], { type: "audio/*" });
    const audioUrl = URL.createObjectURL(blob);
    const newAudioPlayer = new Audio(audioUrl);
    setAudioPlayer(newAudioPlayer);

    // Cleanup
    return () => {
      newAudioPlayer.pause();
      URL.revokeObjectURL(audioUrl);
    };
  }, [audio]);

  // Runs whenever isPlaying or audioPlayer changes and plays or pauses the audio based on the isPlaying state.
  useEffect(() => {
    if (isPlaying) {
      audioPlayer?.play();
    } else {
      audioPlayer?.pause();
    }
  }, [isPlaying, audioPlayer]);

  // Toggles the audio playback state based on the isPlaying prop and notifies the parent component.
  const toggleAudio = () => {
    if (isPlaying && audioPlayer) {
      audioPlayer.pause();
      onPlay();
    } else {
      if (onPlay) {
        onPlay();
      }
    }
  };

  // Pauses the audio and resets playback to start when isPlaying is false.
  useEffect(() => {
    if (!isPlaying && audioPlayer) {
      audioPlayer.pause();
      audioPlayer.currentTime = 0;
    }
  }, [isPlaying, audioPlayer]);

  // Listens for 'stopAllAudio' event to stop and reset audio.
  useEffect(() => {
    const stopAudioHandler = () => {
      if (audioPlayer) {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
      }
    };

    window.addEventListener("stopAllAudio", stopAudioHandler);

    return () => {
      window.removeEventListener("stopAllAudio", stopAudioHandler);
    };
  }, [audioPlayer]);

  return (
    <IconButton
      onClick={(e) => {
        e.stopPropagation();
        toggleAudio();
      }}
      className={`hover:text-blue-500 ${isPlaying ? "text-blue-500" : ""}`}
    >
      {isPlaying ? <PauseCircleOutlineIcon /> : <PlayCircleOutlineIcon />}
    </IconButton>
  );
};

export default AudioPlayerIcon;
