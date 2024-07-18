import React, { useState, useEffect, useRef } from 'react'
import { IconButton } from '@mui/material'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline'
import { getAudioContext } from '../context/audioContext'

const AudioPlayerIcon = ({ audio, isPlaying, onPlay }) => {
  const [internalPlayState, setInternalPlayState] = useState(false)
  const currentSourceRef = useRef(null)

  let audioContext = getAudioContext()

  // Play audio using audioContext
  const playAudio = async () => {
    try {
      if (audioContext.state === 'suspended') {
        await audioContext.resume()
      }

      if (audioContext && audio) {
        const uint8Array = new Uint8Array(audio.data)
        const arrayBuffer = uint8Array.buffer
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

        // Stop any currently playing audio
        if (currentSourceRef.current) {
          currentSourceRef.current.stop()
          currentSourceRef.current.disconnect()
        }

        // Create a new source and start from the beginning
        const source = audioContext.createBufferSource()
        source.buffer = audioBuffer
        source.connect(audioContext.destination)
        source.start(0) // Start from the beginning
        source.onended = () => {
          setInternalPlayState(false)
        }
        currentSourceRef.current = source
        setInternalPlayState(true)
        if (onPlay) {
          onPlay()
        }
      }
    } catch (error) {
      console.error('Error playing audio:', error)
    }
  }

  // Stop audio playback
  const stopAudio = () => {
    if (currentSourceRef.current) {
      currentSourceRef.current.stop()
      currentSourceRef.current.disconnect()
      currentSourceRef.current = null
      setInternalPlayState(false)
    }
  }

  // Plays or stops audio based on the internal play state
  useEffect(() => {
    if (internalPlayState) {
      playAudio()
    } else {
      stopAudio()
    }
  }, [internalPlayState])

  // Cleanup on unmount or context change
  useEffect(() => {
    return () => {
      stopAudio()
    }
  }, [audioContext])

  // Ensure the audio stops playing when navigating away from the page
  useEffect(() => {
    return () => {
      stopAudio()
    }
  }, [])

  // Updates internalPlayState based on the audio id passed from the parent component
  useEffect(() => {
    if (isPlaying) {
      setInternalPlayState(true)
    } else {
      setInternalPlayState(false)
    }
  }, [isPlaying])

  // Handle click event to toggle play state
  const handleClick = (e) => {
    e.stopPropagation()
    if (internalPlayState) {
      setInternalPlayState(false)
    } else {
      setInternalPlayState(true)
    }
  }

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
  )
}

export default AudioPlayerIcon
