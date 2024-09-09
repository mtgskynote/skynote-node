/* eslint-disable */
// TODO: Eslint is disabled because this file will be deleted

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { HotKeys } from 'react-hotkeys';
import OpenSheetMusicDisplay from './OpenSheetMusicDisplay';
import PopUpWindow from './PopUpWindow.js';
import LoadingScreen from './LoadingScreen.js';
import {
  getRecording,
  deleteRecording,
} from '../utils/studentRecordingMethods.js';
import ControlBar from './ControlBar.js';
import { getAudioContext } from '../context/audioContext';

const folderBasePath = '/xmlScores/violin';

let currentSource = null; // Must be global so that React redraws don't lose track of the source

const ProgressPlayFileVisual = () => {
  let audioContext = getAudioContext();
  const params = useParams();

  const [songFile, setSongFile] = useState(null);
  const pauseTimeRef = useRef(0);
  const startTimeRef = useRef(0);

  const cursorRef = useRef(null);
  const playbackRef = useRef(null);

  const [metronomeVolume, setMetronomeVolume] = useState(0);
  const [midiVolume, setMidiVolume] = useState(0);
  const [bpm, setBpm] = useState(100);
  const [zoom, setZoom] = useState(1.0);
  const [transpose, setTranspose] = useState(0);

  const [showDeleteRecordingPopUp, setShowDeleteRecordingPopUp] =
    useState(false);

  const [pitch, setPitch] = useState([]);
  const [confidence, setConfidence] = useState([]);

  const [startPitchTrack, setStartPitchTrack] = useState(false);
  const [showPitchTrack, setShowPitchTrack] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const [showStats, setShowStats] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [toggleStats, setToggleStats] = useState(false);
  const [toggleInfo, setToggleInfo] = useState(false);

  const [isResetButtonPressed, setIsResetButtonPressed] = useState(false);
  const [repeatsIterator, setRepeatsIterator] = useState(false);
  const [showRepetitionMessage, setShowRepetitionMessage] = useState(false);
  const [repetitionMessage, setRepetitionMessage] = useState(
    'No stored recordings yet'
  );

  const [cursorFinished, setCursorFinished] = useState(false);
  const [cursorJumped, setCursorJumped] = useState(false);
  const [recordingId, setRecordingId] = useState(null);

  const [json, setJson] = useState(null);
  const [metaData, setMetaData] = useState({
    name: null,
    stars: null,
    date: null,
  });

  const [isMac, setIsMac] = useState(false);
  const [loading, setLoading] = useState(true);

  // Hot keys map and handlers
  const keyMap = {
    TOGGLE_RESET: `${isMac ? 'command' : 'ctrl'}+shift+r`,
    TOGGLE_PLAY: `p`,
    TOGGLE_STATS: `s`,
    TOGGLE_INFO: `i`,
  };

  const handlers = {
    TOGGLE_RESET: (event) => {
      event.preventDefault();
      handleToggleReset();
    },
    TOGGLE_PLAY: (event) => {
      event.preventDefault();
      handleTogglePlay();
    },
    TOGGLE_STATS: (event) => {
      event.preventDefault();
      handleToggleStats();
    },
    TOGGLE_INFO: (event) => {
      event.preventDefault();
      handleToggleInfo();
    },
  };

  const location = useLocation();
  const navigate = useNavigate();
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  const newUrl = window.location.href;

  useEffect(() => {
    setRecordingId(location.state?.id);
  }, []);

  useEffect(() => {
    if (recordingId) {
      getRecording(recordingId).then((recordingJSON) => {
        // Get score info
        const scoreInfo = JSON.parse(localStorage.getItem('scoreData')).find(
          (item) => item.fname === params.files
        );

        // Set MetaData
        const recordingDate = new Date(recordingJSON.date);
        setMetaData({
          name: recordingJSON.recordingName,
          stars: recordingJSON.info.stars,
          date: recordingDate.toLocaleDateString('en-UK', options),
          skill: scoreInfo.skill,
          level: scoreInfo.level,
          score: scoreInfo.title,
          bpm: recordingJSON.info.bpm,
          transpose: recordingJSON.info.transpose
            ? recordingJSON.info.transpose
            : 0,
        });
        // Save json.info (recording data, pitch, colors...) to send to OSMD
        setJson(recordingJSON.info);
        // Save audio
        setTranspose(
          recordingJSON.info.transpose ? recordingJSON.info.transpose : 0
        );
        setBpm(recordingJSON.info.bpm);
        setSongFile(recordingJSON.audio);
        setLoading(false);
      });
    }
  }, [recordingId]);

  // Set reset flag as false when resetting is complete
  const onResetDone = () => {
    setIsResetButtonPressed(false);
  };

  // Define recording stop when cursor finishes callback function
  const handleFinishedCursorOSMDCallback = (OSMDfinishedCursor) => {
    if (OSMDfinishedCursor) {
      // Send info to back to parent component and reset all playing
      setCursorFinished(true);
      const playbackManager = playbackRef.current;
      playbackManager.pause();
      playbackManager.setPlaybackStart(0);
      setStartPitchTrack(false);
      setIsResetButtonPressed(true);
    }
  };

  // When cursor jumps (osmd detects it, we need to generate state)
  const handleJumpedCursorOSMDCallback = () => {
    setCursorJumped(!cursorJumped);
  };

  // Define recording stop when cursor finishes callback function
  const handleReceiveRepetitionInfo = (showingRep, totalRep) => {
    if (totalRep === 0) {
      setRepetitionMessage('No recordings yet');
    } else {
      const message_aux =
        'Seeing ' + (showingRep + 1) + ' of ' + (totalRep + 1);
      setRepetitionMessage(message_aux);
    }
  };

  // Play audio recording
  const playAudio = async () => {
    try {
      // Check if audioContext is suspended. If so, resume it.
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      // Transform data type and play
      const uint8Array = new Uint8Array(songFile.data);
      const arrayBuffer = uint8Array.buffer;
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      currentSource = audioContext.createBufferSource();
      currentSource.buffer = audioBuffer;
      currentSource.connect(audioContext.destination);
      currentSource.start(0, pauseTimeRef.current);
      startTimeRef.current = audioContext.currentTime - pauseTimeRef.current;
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  // Stop audio playback
  const stopAudio = () => {
    if (currentSource) {
      currentSource.stop();
      currentSource.disconnect(); // Clean up connections
      currentSource = null;

      pauseTimeRef.current = audioContext.currentTime - startTimeRef.current;
    }
  };

  // TODO: Add support for repetition sections
  const handleRepeatLayersButtonClick = () => {
    //window.location.href = "/TimbreVisualization";
    setRepeatsIterator(!repeatsIterator);
  };

  // Go back to previous page (usually the All Recordings page)
  const handleViewAllRecordings = () => {
    navigate(-1);
  };

  // Reset audio playback
  const resetAudio = (playbackManager) => {
    playbackManager.pause();
    playbackManager.reset();
    stopAudio();
    startTimeRef.current = 0;
    pauseTimeRef.current = 0;

    setStartPitchTrack(false);
    setShowPitchTrack(false);
    setPitch([]);
    setConfidence([]);
  };

  // Handle play button toggle to update UI in ControlBar
  const handleTogglePlay = () => {
    const playbackManager = playbackRef.current;
    if (playbackManager.isPlaying) {
      setIsPlaying(false);
      stopAudio(); // Stop recording audio
      playbackManager.pause(); // Stop OSMD
    } else {
      setIsPlaying(true);
      playAudio(); // Play recording audio
      playbackManager.play(); // Play OSMD
    }
  };

  const handleToggleReset = () => {
    const playbackManager = playbackRef.current;
    resetAudio(playbackManager);

    setIsPlaying(false);
    setIsResetButtonPressed(true);
  };

  // Handle opening the delete recording popup window
  const handleShowPopUpWindow = () => {
    setShowDeleteRecordingPopUp(true);
  };

  // Handle closing the delete recording popup window
  const handleHidePopUpWindow = () => {
    setShowDeleteRecordingPopUp(false);
  };

  // Handle deleting a recording from the database
  const handleDeleteRecording = () => {
    setShowDeleteRecordingPopUp(false);
    deleteRecording(recordingId)
      .then(() => {
        navigate(-1);
      })
      .catch((error) => {
        console.log(`Cannot delete recording from database: ${error}`);
      });
  };

  // Toggle stats panel in control bar (toggle in parent component for hot key support)
  const handleToggleStats = () => {
    setToggleStats(true);
  };

  // Toggle shortcuts panel in control bar (toggle in parent component for hot key support)
  const handleToggleInfo = () => {
    setToggleInfo(true);
  };

  // Detect if the OS is macOS
  const isMacOs = async () => {
    if (navigator.userAgentData) {
      const uaData = await navigator.userAgentData.getHighEntropyValues([
        'platform',
      ]);
      return uaData.platform === 'macOS';
    } else {
      return /mac/i.test(navigator.userAgent);
    }
  };

  // Ensure that stats panel is shown when triggered and shortcuts panel is hidden
  useEffect(() => {
    if (toggleStats) {
      if (showInfo) {
        setShowInfo(false);
      }
      setShowStats((prevShowStats) => !prevShowStats);
      setToggleStats(false);
    }
  }, [toggleStats, showInfo]);

  // Ensure that shortcuts panel is shown when triggered and stats panel is hidden
  useEffect(() => {
    if (toggleInfo) {
      if (showStats) {
        setShowStats(false);
      }
      setShowInfo((prevShowInfo) => !prevShowInfo);
      setToggleInfo(false);
    }
  }, [toggleInfo, showStats]);

  // Reset cursor to the beginning of the OSMD score when the cursor reaches the end
  useEffect(() => {
    if (cursorFinished) {
      setCursorFinished(false);
      setIsPlaying(false);

      // Reset start and pause times when playback is finished
      startTimeRef.current = 0;
      pauseTimeRef.current = 0;
    }
  });

  // Stop playing audio if the window is reloaded
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [newUrl]);

  // Effect to set isMac based on the detected OS
  useEffect(() => {
    const checkIsMacOs = async () => {
      const result = await isMacOs();
      setIsMac(result);
    };

    checkIsMacOs();
  }, []);

  return (
    <HotKeys keyMap={keyMap} handlers={handlers}>
      <div className="flex flex-col min-h-screen justify-between">
        <div className="relative">
          {loading ? (
            <LoadingScreen />
          ) : (
            <OpenSheetMusicDisplay
              file={`${folderBasePath}/${params.files}.xml`}
              autoResize={true}
              cursorRef={cursorRef}
              playbackRef={playbackRef}
              metroVol={metronomeVolume / 100}
              bpm={bpm}
              transpose={transpose}
              zoom={zoom}
              followCursor={true}
              pitch={pitch}
              pitchConfidence={confidence}
              startPitchTrack={startPitchTrack}
              showPitchTrack={showPitchTrack}
              recordVol={midiVolume}
              isResetButtonPressed={isResetButtonPressed}
              repeatsIterator={repeatsIterator}
              showRepeatsInfo={handleReceiveRepetitionInfo}
              onResetDone={onResetDone}
              cursorActivity={handleFinishedCursorOSMDCallback}
              cursorJumpsBack={handleJumpedCursorOSMDCallback}
              mode={true} // Passed as true to indicate that we are not in a type of record mode
              visual={'yes'}
              visualJSON={json}
            />
          )}

          <div className="absolute top-0 left-0 w-full h-full bg-transparent z-20 pointer-events-auto"></div>
        </div>

        <div className="flex justify-center mb-32">
          <ControlBar
            onTransposeChange={(newTranspose) => setTranspose(newTranspose)}
            onBpmChange={(newBpm) => setBpm(newBpm)}
            onMidiVolumeChange={(newVolume) => setMidiVolume(newVolume)}
            onMetronomeVolumeChange={(newMetronomeVolume) =>
              setMetronomeVolume(newMetronomeVolume)
            }
            onTogglePlay={handleTogglePlay}
            onReset={handleToggleReset}
            handleViewAllRecordings={handleViewAllRecordings}
            isPlaying={isPlaying}
            playbackMode={true}
            handleShowPopUpWindow={handleShowPopUpWindow}
            handleToggleStats={handleToggleStats}
            handleToggleInfo={handleToggleInfo}
            showInfo={showInfo}
            showStats={showStats}
            stats={metaData}
            practiceMode={true} // Passed as true because we do not have any recording features in playback
            isMac={isMac}
          />
        </div>

        <PopUpWindow isOpen={showDeleteRecordingPopUp}>
          <div>
            <p className="text-xl font-extrabold text-gray-800 mb-1">
              Are you sure you want to delete{' '}
              <span className="capitalize">{metaData.name}</span>?
            </p>
            <p className="text-gray-600 mb-4">
              This action is permanent and cannot be undone
            </p>
            <div className="flex justify-between space-x-2">
              <button
                onClick={handleHidePopUpWindow}
                className="bg-slate-50 border-solid border-slate-500 outline-none text-slate-500 px-4 py-2 rounded-lg hover:bg-slate-100 transition duration-300 ease-in-out w-full"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteRecording}
                className="bg-red-500 border-none outline-none text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300 ease-in-out w-full"
              >
                Delete
              </button>
            </div>
          </div>
        </PopUpWindow>
      </div>
    </HotKeys>
  );
};

export default ProgressPlayFileVisual;
