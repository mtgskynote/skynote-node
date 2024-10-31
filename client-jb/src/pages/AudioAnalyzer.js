import React, { useState, useRef, useCallback, useEffect } from 'react';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import IconButton from '@mui/material/IconButton';
import WaveSurfer from 'wavesurfer.js';
import HighlightedAudioChart from '../components/HighlightedAudioChart';
import audioAnalyzerUtils from '../utils/audioAnalyzerUtils';
import AudioFeaturesGraph from '../components/AudioFeaturesGraph';

const { extractFeatures, detectVariableSections } = audioAnalyzerUtils;

const AudioAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [audioBuffer, setAudioBuffer] = useState(null);
  const [highlightedSections, setHighlightedSections] = useState(null);
  const [playingSection, setPlayingSection] = useState(null);
  const [features, setFeatures] = useState(null);
  const waveSurferRef = useRef(null);
  const waveformContainerRef = useRef(null);
  const audioContextRef = useRef(null);

  const getAudioBuffer = useCallback(async (audioFile) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
    }
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = (event) => {
        audioContextRef.current.decodeAudioData(
          event.target.result,
          (buffer) => {
            resolve(buffer);
          },
          reject
        );
      };
      reader.readAsArrayBuffer(audioFile);
    });
  }, []);

  const processAudioBuffer = async (buffer) => {
    try {
      const features = await extractFeatures(buffer);
      setFeatures(features);

      const sections = detectVariableSections(...Object.values(features));
      setAudioBuffer(buffer);
      setHighlightedSections(sections);
    } catch (error) {
      console.error('Error processing audio buffer:', error);
    }
  };

  const handleFileUpload = async (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile && uploadedFile.type.startsWith('audio/')) {
      setFile(uploadedFile);
      const buffer = await getAudioBuffer(uploadedFile);
      await processAudioBuffer(buffer);
    } else {
      alert('Please upload an audio file.');
    }
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    const uploadedFile = event.dataTransfer.files[0];
    if (uploadedFile && uploadedFile.type.startsWith('audio/')) {
      setFile(uploadedFile);
      const buffer = await getAudioBuffer(uploadedFile);
      await processAudioBuffer(buffer);
    } else {
      alert('Please upload an audio file.');
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const removeFile = () => {
    setFile(null);
    setPlayingSection(null);
    setAudioBuffer(null);
    setHighlightedSections(null);
    if (waveSurferRef.current) {
      waveSurferRef.current.destroy();
      waveSurferRef.current = null;
    }
  };

  const togglePlayPause = () => {
    if (waveSurferRef.current) {
      // Stop any highlighted section that's currently playing
      if (playingSection !== 'waveform' && playingSection !== null) {
        setPlayingSection(null);
      }
      waveSurferRef.current.playPause();
      setPlayingSection((prev) => (prev !== 'waveform' ? 'waveform' : null));
    }
  };

  React.useEffect(() => {
    if (file && waveformContainerRef.current) {
      if (waveSurferRef.current) {
        waveSurferRef.current.destroy();
      }

      waveSurferRef.current = WaveSurfer.create({
        container: waveformContainerRef.current,
        waveColor: '#60a5fa',
        progressColor: '#3b82f6',
        barWidth: 2,
        cursorColor: '#3b82f6',
        height: 80,
        responsive: true,
      });

      waveSurferRef.current.load(URL.createObjectURL(file));

      waveSurferRef.current.on('play', () => {
        setPlayingSection('waveform');
      });

      waveSurferRef.current.on('finish', () => {
        setPlayingSection(null);
      });
    }

    return () => {
      if (waveSurferRef.current) {
        waveSurferRef.current.destroy();
      }
    };
  }, [file]);

  useEffect(() => {
    console.log('features');
    console.log(features);
  }, [features]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      {/* Header */}
      <header className="w-full bg-blue-500 py-3 text-center">
        <h1 className="text-4xl text-white font-semibold tracking-widest">
          Audio Analyzer
        </h1>
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
        <div className="flex flex-col mt-8 w-1/2 p-4 bg-blue-100 rounded-lg border-2 border-blue-300 border-solid">
          <div className="flex items-center mb-1">
            <div className="text-sm font-semibold text-blue-500">
              {file.name}
            </div>
            {/* Remove File Button */}
            <button
              onClick={removeFile}
              className={`ml-auto hover:cursor-pointer transition ease-in-out delay-50 text-xs text-center text-white hover:text-white text-sm border-transparent focus:border-transparent focus:ring-0 focus:outline-none bg-red-500 hover:bg-red-400 py-1 px-2 rounded-l-none outline-none rounded`}
            >
              Remove File
            </button>
          </div>
          <div className="flex items-center">
            {/* Play/Pause Button */}
            <IconButton
              aria-label={playingSection === 'waveform' ? 'pause' : 'play'}
              onClick={togglePlayPause}
              className="mr-1"
            >
              {playingSection === 'waveform' ? (
                <PauseCircleIcon className="text-blue-500 text-3xl" />
              ) : (
                <PlayCircleIcon className="text-blue-500 text-3xl" />
              )}
            </IconButton>

            {/* Waveform Container */}
            <div className="flex-grow" ref={waveformContainerRef}></div>
          </div>
        </div>
      )}
      {audioBuffer && highlightedSections && (
        <div>
          <hr className="my-4 border-t-2 border-gray-400" />
          <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-300 border-solid relative">
            <HighlightedAudioChart
              audioData={audioBuffer.getChannelData(0)}
              sr={audioBuffer.sampleRate}
              highlightedSections={highlightedSections}
              audioBuffer={audioBuffer}
              audioContext={audioContextRef.current}
              playingSection={playingSection}
              setPlayingSection={setPlayingSection}
              waveSurferRef={waveSurferRef}
            />
          </div>
        </div>
      )}
      {audioBuffer && features && (
        <div className="flex flex-row space-x-6">
          <div className="my-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-300 border-solid relative">
            <AudioFeaturesGraph
              values={features.rms}
              sampleRate={features.sampleRate}
              hopSize={features.hopLength}
              color="#008000"
              title="Loudness"
            />
          </div>
          <div className="my-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-300 border-solid relative">
            <AudioFeaturesGraph
              values={features.pitches}
              sampleRate={features.sampleRate}
              hopSize={features.hopLength}
              maxY={800}
              color="#FFA500"
              title="Pitch"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioAnalyzer;
