import React, { useState, useRef, useEffect } from 'react';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import WaveSurfer from 'wavesurfer.js';
import HighlightedAudioChart from '../components/HighlightedAudioChart';
import audioAnalyzerUtils from '../utils/audioAnalyzerUtils';

const { extractFeatures } = audioAnalyzerUtils;

const AudioAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [audioBuffer, setAudioBuffer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const waveSurferRef = useRef(null);
  const waveformContainerRef = useRef(null);

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile && uploadedFile.type.startsWith('audio/')) {
      setFile(uploadedFile);
      getAudioBuffer(uploadedFile);
    } else {
      alert('Please upload an audio file.');
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const uploadedFile = event.dataTransfer.files[0];
    if (uploadedFile && uploadedFile.type.startsWith('audio/')) {
      setFile(uploadedFile);
      getAudioBuffer(uploadedFile);
    } else {
      alert('Please upload an audio file.');
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const getAudioBuffer = (audioFile) => {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const reader = new FileReader();
    reader.onload = (event) => {
      audioContext.decodeAudioData(event.target.result, (buffer) => {
        setAudioBuffer(buffer);
      });
    };
    reader.readAsArrayBuffer(audioFile);
  };

  const removeFile = () => {
    setFile(null);
    setIsPlaying(false);
    setAudioBuffer(null);
    if (waveSurferRef.current) {
      waveSurferRef.current.destroy();
      waveSurferRef.current = null;
    }
  };

  const togglePlayPause = () => {
    if (waveSurferRef.current) {
      waveSurferRef.current.playPause();
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    if (file && waveformContainerRef.current) {
      if (waveSurferRef.current) {
        waveSurferRef.current.destroy();
      }

      waveSurferRef.current = WaveSurfer.create({
        container: waveformContainerRef.current,
        waveColor: '#A8DBA8',
        progressColor: '#3B8686',
        barWidth: 2,
        cursorColor: '#3B8686',
        height: 80,
        responsive: true,
      });

      waveSurferRef.current.load(URL.createObjectURL(file));

      waveSurferRef.current.on('finish', () => {
        setIsPlaying(false);
      });
    }

    return () => {
      if (waveSurferRef.current) {
        waveSurferRef.current.destroy();
      }
    };
  }, [file]);

  useEffect(() => {
    if (audioBuffer) {
      extractFeatures(audioBuffer)
        .then((features) => {
          console.log(features);
        })
        .catch((error) => {
          console.error('Error extracting features:', error);
        });
    }
  }, [audioBuffer]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      {/* Header */}
      <header className="w-full bg-blue-500 py-4 text-center">
        <h1 className="text-4xl text-white font-bold">Audio Analyzer</h1>
      </header>

      {/* File Upload Area */}
      {!file ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="mt-8 p-8 border-2 border-dashed border-blue-300 bg-blue-100 text-center rounded-lg w-3/4 max-w-lg cursor-default"
        >
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
            id="fileInput"
          />
          <label htmlFor="fileInput" className="block text-gray-600">
            <div className="flex flex-col items-center">
              <UploadFileIcon className="text-gray-600 sm:text-2xl md:text-2xl lg:text-3xl xl:text-3xl mb-1" />
              <p>
                Drag and drop file here or{' '}
                <span className="text-blue-500 underline font-bold cursor-pointer">
                  upload file
                </span>
              </p>
            </div>
          </label>
        </div>
      ) : (
        <div className="flex flex-col mt-8 w-3/4 max-w-lg p-4 bg-blue-100 rounded-lg border border-blue-300">
          <div className="flex items-center justify-center mb-1">
            <div className="text-sm text-gray-700">{file.name}</div>{' '}
            {/* Remove File Button */}
            <Tooltip title="Remove File" arrow placement="top">
              <IconButton aria-label="remove file" onClick={removeFile}>
                <CancelIcon className="text-gray-500 hover:text-red-500 text-lg" />
              </IconButton>
            </Tooltip>
          </div>
          <div className="flex items-center">
            {/* Play/Pause Button */}
            <Tooltip title={isPlaying ? 'Pause' : 'Play'} arrow>
              <IconButton
                aria-label={isPlaying ? 'pause' : 'play'}
                onClick={togglePlayPause}
                className="mr-1"
              >
                {isPlaying ? (
                  <PauseCircleIcon className="text-green-800 text-3xl" />
                ) : (
                  <PlayCircleIcon className="text-green-800 text-3xl" />
                )}
              </IconButton>
            </Tooltip>

            {/* Waveform Container */}
            <div className="flex-grow" ref={waveformContainerRef}></div>
          </div>
        </div>
      )}
      {/* {audioBuffer && <HighlightedAudioChart audioBuffer={audioBuffer} />} */}
    </div>
  );
};

export default AudioAnalyzer;
