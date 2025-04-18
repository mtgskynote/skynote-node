import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@mui/material';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import { getAudioContext } from '../../context/audioContext';

/**
 * AudioPlayerIcon component to control audio playback with an icon.
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.audioId - The ID of the audio to be played.
 * @param {boolean} props.isPlaying - The play state of the audio.
 * @param {function} props.onPlay - Callback function to handle play action.
 * @param {function} props.onStop - Callback function to handle stop action.
 * @example
 * // Example usage:
 * // <AudioPlayerIcon
 * //   audioId="123"
 * //   isPlaying={true}
 * //   onPlay={() => console.log('Playing')}
 * //   onStop={() => console.log('Stopped')}
 * // />
 */
const AudioPlayerIcon = ({ audio, isPlaying, onPlay }) => {
  const [internalPlayState, setInternalPlayState] = useState(false);
  const currentSourceRef = useRef(null);

  let audioContext = getAudioContext();

  // Play audio using audioContext
  const playAudio = async () => {
    try {
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      if (audioContext && audio) {
        const uint8Array = new Uint8Array(audio.data);
        const arrayBuffer = uint8Array.buffer;
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        // Stop any currently playing audio
        if (currentSourceRef.current) {
          currentSourceRef.current.stop();
          currentSourceRef.current.disconnect();
        }

        // Create a new source and start from the beginning
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start(0); // Start from the beginning
        source.onended = () => {
          setInternalPlayState(false);
        };
        currentSourceRef.current = source;
        setInternalPlayState(true);
        if (onPlay) {
          onPlay();
        }
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  // Stop audio playback
  const stopAudio = () => {
    if (currentSourceRef.current) {
      currentSourceRef.current.stop();
      currentSourceRef.current.disconnect();
      currentSourceRef.current = null;
      setInternalPlayState(false);
    }
  };

  // Plays or stops audio based on the internal play state
  useEffect(() => {
    if (internalPlayState) {
      playAudio();
    } else {
      stopAudio();
    }
  }, [internalPlayState]);

  // Cleanup on unmount or context change
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [audioContext]);

  // Ensure the audio stops playing when navigating away from the page
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  // Updates internalPlayState based on the audio id passed from the parent component
  useEffect(() => {
    if (isPlaying) {
      setInternalPlayState(true);
    } else {
      setInternalPlayState(false);
    }
  }, [isPlaying]);

  // Handle click event to toggle play state
  const handleClick = (e) => {
    e.stopPropagation();
    if (internalPlayState) {
      setInternalPlayState(false);
    } else {
      setInternalPlayState(true);
    }
  };

  return (
    <IconButton
      onClick={handleClick}
      className={`hover:text-blue-500 ${
        internalPlayState ? 'text-blue-500' : ''
      }`}
    >
      {internalPlayState ? (
        <PauseCircleOutlineIcon />
      ) : (
        <PlayCircleOutlineIcon />
      )}
    </IconButton>
  );
};

AudioPlayerIcon.propTypes = {
  audio: PropTypes.shape({
    data: PropTypes.any.isRequired,
  }).isRequired,
  isPlaying: PropTypes.bool.isRequired,
  onPlay: PropTypes.func,
};

export default AudioPlayerIcon;
