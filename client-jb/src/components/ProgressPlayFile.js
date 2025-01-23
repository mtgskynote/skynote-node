/* eslint-disable */
// TODO: Eslint is disabled because this file is still in development

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { HotKeys } from 'react-hotkeys';
import { useParams, useNavigate } from 'react-router-dom';
import OpenSheetMusicDisplay from './OpenSheetMusicDisplay';
import ControlBar from './ControlBar.js';
import { makeAudioStreamer } from './audioStreamer.js';
import CountDownTimer from './CountDownTimer.js';
import Queue from '../utils/QueueWithMaxLength';
import PopUpWindow from './PopUpWindow.js';
import XMLParser from 'react-xml-parser';
import { putRecording } from '../utils/studentRecordingMethods.js';
import { updateRecordingsPastWeek } from '../utils/usersMethods.js';
import { Buffer } from 'buffer';
import { useAppContext } from '../context/appContext';
import {
  startMicrophone,
  stopMicrophone,
  isMicrophoneActive,
} from '../context/audioContext';
import LoadingScreen from './LoadingScreen.js';
// @ts-ignore
window.Buffer = Buffer;

const folderBasePath = '/xmlScores/violin';

const ProgressPlayFile = () => {
  const { getCurrentUser } = useAppContext();
  const [userData, setUserData] = useState(null);
  const params = useParams();
  const [xmlFile, setXmlFile] = useState(null);

  // OSMD playback and cursor references
  const cursorRef = useRef(null);
  const playbackRef = useRef(null);

  // Score title needed to retrieve data from the API
  const [scoreTitle, setScoreTitle] = useState(null);

  // Flags to determine if recording and downloading are available actions
  const [canRecord, setCanRecord] = useState(true);
  const [canDownload, setCanDownload] = useState(false);
  const [audioReady, setAudioReady] = useState(false);

  // File name of recording that will be saved in the DB
  const [fileName, setFileName] = useState('');

  //Parameters that will be sent to OSMD
  const [metronomeVolume, setMetronomeVolume] = useState(0);
  const [bpm, setBpm] = useState(100); // BPM always set to 100 cause the scores don't have BPMs
  const [isBpmDeactivated, setIsBpmDeactivated] = useState(false);
  const [midiVolume, setMidiVolume] = useState(50);
  const [zoom, setZoom] = useState(1.0);
  const [transpose, setTranspose] = useState(0);

  // Flags to control icon displays in the control bar
  const [isListening, setIsListening] = useState(false); // IMPORTANT NOTE: This does not mean the app is listening to the user's microphone. It means the app is playing the audio for the user to listen to (rather than play along with).
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // Toggles recording on and off when OSMD recording starts and stops
  const [recordInactive, setRecordInactive] = useState(true);

  // Metronome timer countdown before recording starts
  const [showCountDownTimer, setShowCountDownTimer] = useState(false);
  const [countDownFinished, setCountDownFinished] = useState(false);

  // MEYDA features
  const [pitchValue, setPitchValue] = useState(null);
  const [confidenceValue, setConfidenceValue] = useState(null);
  const [pitch, setPitch] = useState([]);
  const [confidence, setConfidence] = useState([]);
  let pitchCount = 0;
  const [dynamicValue, setDynamicValue] = useState(null);
  const [dynStability, setDynStability] = useState([]);

  const [startPitchTrack, setStartPitchTrack] = useState(false);
  const [showPitchTrack, setShowPitchTrack] = useState(false);

  const [isResetButtonPressed, setIsResetButtonPressed] = useState(false);
  const [repeatsIterator, setRepeatsIterator] = useState(false);
  const [showRepetitionMessage, setShowRepetitionMessage] = useState(false);
  const [repetitionMessage, setRepetitionMessage] = useState(
    'No stored recordings yet'
  );

  const [cursorFinished, setCursorFinished] = useState(false);
  const [showSaveRecordingPopUp, setShowSaveRecordingPopUp] = useState(false);
  const [jsonToDownload, setJsonToDownload] = useState();

  const [practiceMode, setPracticeMode] = useState(true);
  const [isSwitchingMode, setIsSwitchingMode] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isMac, setIsMac] = useState(false);

  // Refs for hotkey events
  const showSaveRecordingPopUpRef = useRef(showSaveRecordingPopUp);
  const practiceModeRef = useRef(practiceMode);
  const showCountDownTimerRef = useRef(showCountDownTimer);
  const audioStreamerRef = useRef(null);

  // Hot keys map and handlers
  const keyMap = {
    TOGGLE_LISTEN: `l`,
    TOGGLE_PLAY: `p`,
    TOGGLE_RECORD: `r`,
    TOGGLE_RESET: `${isMac ? 'command' : 'ctrl'}+shift+r`,
    TOGGLE_MODE: `m`,
    TOGGLE_INFO: `i`,
  };

  const handlers = {
    TOGGLE_LISTEN: (event) => {
      event.preventDefault();
      if (practiceMode) handleToggleListen();
    },
    TOGGLE_PLAY: (event) => {
      event.preventDefault();
      if (practiceMode && !showCountDownTimerRef.current) handleTogglePlay();
    },
    TOGGLE_RECORD: (event) => {
      event.preventDefault();

      if (
        !practiceModeRef.current &&
        !showSaveRecordingPopUpRef.current &&
        !showCountDownTimerRef.current
      )
        handleToggleRecord();
    },
    TOGGLE_RESET: (event) => {
      event.preventDefault();
      if (practiceMode) handleToggleReset();
    },
    TOGGLE_MODE: (event) => {
      event.preventDefault();
      setPracticeMode((prevMode) => {
        const updatedMode = !prevMode;
        handleToggleMode();

        return updatedMode;
      });
    },
    TOGGLE_INFO: (event) => {
      event.preventDefault();
      handleToggleInfo();
    },
  };

  const navigate = useNavigate();
  const scoreID = JSON.parse(localStorage.getItem('scoreData')).find(
    (item) => item.fname === params.files
  )._id;

  // Reset the reset button
  const onResetDone = () => {
    setIsResetButtonPressed(false);
  };

  // Fetch user data from the database
  const fetchDataFromAPI = () => {
    if (userData === null) {
      getCurrentUser()
        .then((result) => {
          setUserData(result);
        })
        .catch((error) => {
          console.log(`Error getting user: ${error}`);
        });
    }
  };

  // Update pitch tracking information as audio is being recorded by the audio streamer
  const handlePitchCallback = (pitchData) => {
    pitchCount = pitchCount + 1;
    if (pitchCount > 0) {
      // console.log("Dynamic Stability:\n", featureValues.rms.computeSD());
      setPitchValue(pitchData.pitch);
      setConfidenceValue(pitchData.confidence);
      //setDynStability(featureValues.rms.computeSD());
      pitchCount = 0;
    }
  };

  // Check when the OSMD cursor reaches the end of the score (after recording) and stop recording audio
  const handleFinishedCursorOSMDCallback = (OSMDfinishedCursor) => {
    if (OSMDfinishedCursor) {
      const playbackManager = playbackRef.current;
      stopRecordingAudio(playbackManager);

      setCursorFinished(true);
    }
  };

  // Handle downloading saved audio recording and upload recording to the user profile
  async function handleDownload(dataBlob) {
    setAudioReady(false);
    const jsonData = JSON.parse(jsonToDownload); //convert data to json
    const jsonComplete = {
      studentId: userData.id,
      scoreId: scoreID,
      recordingName: `${fileName}`,
      date: new Date(),
      audio: dataBlob,
      sharing: false,
      info: jsonData,
    };

    // Upload info to database
    try {
      await putRecording(jsonComplete);
      await updateRecordingsPastWeek(userData.id);
    } catch (error) {
      console.error('Error handling download:', error);
    }
  }

  // Update flags so that the saved audio recording can be downloaded
  const handleGetJsonCallback = (json) => {
    setJsonToDownload(json);
    setCanDownload(false);
    setAudioReady(true);
  };

  // Keep track of repetition that user is currently seeing --> WILL BE INTEGRATED IN THE FUTURE
  const handleReceiveRepetitionInfo = (showingRep, totalRep) => {
    if (totalRep === 0) {
      setRepetitionMessage('No recordings yet');
    } else {
      const message_aux =
        'Seeing ' + (showingRep + 1) + ' of ' + (totalRep + 1);
      setRepetitionMessage(message_aux);
    }
  };

  // Keep track of the history of the audio features we extract
  const featureValues = {
    // queue length (for computing means and SDs), normlow, normhi, sdnormlow, sdnormhi
    pitch: new Queue(8, 24, 61, 0, 0.5), //[110Hz, 440Hz] = [A2, A4] = midinote[24,69]
    rms: new Queue(8, 0, 0.25, 0, 0.01),
    spectralCentroid: new Queue(8, 0, 500),
    spectralFlux: new Queue(8, 3, 1, 0, 0.1),
  };

  // Receive callbacks from makeAudioStreamer with object properties containing attributes that are Meyda features
  const aCb = (features) => {
    featureValues.rms.push(features.rms); // DYNAMIC STABILITY
    featureValues.spectralCentroid.push(features.spectralCentroid); // SPECTRAL CENTROID
    featureValues.spectralFlux.push(features.spectralFlux); // SPECTRAL FLUX
  };

  useEffect(() => {
    const checkAndSetFile = async () => {
      try {
        const fileUrl = `${folderBasePath}/${params.files}.xml`;

        // Fetch the file from the server
        const response = await fetch(fileUrl);
        const xmlFileData = await response.text();

        // Check if the file is valid XML (file found in folderBasePath)
        if (xmlFileData.startsWith('<?xml')) {
          setXmlFile(fileUrl);
        } else {
          const localStorageFile = localStorage.getItem(params.files);

          if (localStorageFile) {
            // Create a Blob URL from the XML data
            const blob = new Blob([localStorageFile], {
              type: 'application/xml',
            });
            const blobUrl = URL.createObjectURL(blob);
            setXmlFile(blobUrl);
          } else {
            console.error('File not found on server or in localStorage.');
            setXmlFile('');
          }
        }
      } catch (error) {
        console.error('Error fetching file:', error);
        setXmlFile('');
      }
    };

    checkAndSetFile();
  }, [folderBasePath, params.files]);

  useEffect(() => {
    const newAudioStreamer = makeAudioStreamer(handlePitchCallback, null, aCb);
    newAudioStreamer.preload(['rms', 'spectralCentroid', 'spectralFlux']);
    audioStreamerRef.current = newAudioStreamer;
  }, []);

  // Get user data once the score title is loaded
  useEffect(() => {
    if (scoreTitle !== null) {
      fetchDataFromAPI();
    }
  }, [scoreTitle]);

  // Get title information from the current score
  useEffect(() => {
    const requestScoreTitle = async () => {
      //Get score title
      try {
        const response = await fetch(`${folderBasePath}/${params.files}.xml`);
        const xmlFileData = await response.text();
        // Check if the file was actually found (if not, html is found)
        if (xmlFileData.startsWith('<?xml')) {
          const movementTitle = Array.from(
            new XMLParser()
              .parseFromString(xmlFileData)
              .getElementsByTagName('movement-title')
          );
          if (movementTitle.length > 0) {
            setScoreTitle(movementTitle[0].value);
          } else {
            setScoreTitle('untitledScore');
          }
        } else {
          // TO DO: refactor requestScoreTitle in ProgressPlayFile so that it takes the same name as the LessonCard does
          setScoreTitle(params.files.split('.').slice(0, -1).join('.'));
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    requestScoreTitle();
  }, [params.files]);

  // Ask user for microphone permissions so that the application can record audio
  useEffect(() => {
    if (!isMicrophoneActive()) {
      startMicrophone().catch((error) => {
        console.error('Failed to get microphone access:', error);
        alert('Please allow microphone access to use this feature');
        setCanRecord(false);
        window.location.reload();
      });
    }

    return () => {
      if (isMicrophoneActive()) {
        stopMicrophone();
      }
      audioStreamerRef.current && audioStreamerRef.current.close();
    };
  }, []); //This should run only once

  // Save recording to user profile when audio is available to download
  useEffect(() => {
    if (audioReady) {
      audioStreamerRef.current
        .save_or_not('save')
        .then((dataToDownload) => {
          const buffer = new Buffer.from(dataToDownload);
          handleDownload(buffer); // send data to downloading function
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }, [audioReady]);

  // Remove the count down from screen when the count down has finished
  const handleCountDownFinished = useCallback(() => {
    setCountDownFinished(true);
  }, []);

  // Reset the audio playback to its initial state
  const resetAudio = (playbackManager) => {
    pauseAudio(playbackManager);
    playbackManager.reset();

    setStartPitchTrack(false);
    setShowPitchTrack(false);
    setPitch([]);
    setDynamicValue([]);
    setConfidence([]);
    setRecordInactive(true);
  };

  // Start recording audio (whether in record or practice mode)
  const recordAudio = (playbackManager) => {
    resetAudio(playbackManager);
    setIsResetButtonPressed(true);

    if (!practiceMode) {
      setIsRecording(true);
      setIsBpmDeactivated(true);
    }
    setRecordInactive(false);
    setShowPitchTrack(true);
    setShowCountDownTimer(true);
  };

  // Stop recording audio
  const stopRecordingAudio = (playbackManager) => {
    setStartPitchTrack(false);
    if (practiceMode) audioStreamerRef.current.close_not_save();
    else {
      audioStreamerRef.current.close_maybe_save();
      if (!isSwitchingMode) {
        setShowSaveRecordingPopUp(true);
      }
      setIsRecording(false);
      setIsBpmDeactivated(false);
    }

    setIsPlaying(false);

    resetAudio(playbackManager);
    setIsSwitchingMode(false);
  };

  // Start playing MIDI audio from the playback manager
  const playAudio = (playbackManager) => {
    playbackManager.play();
  };

  // Stop playing MIDI audio from the playback manager
  const pauseAudio = (playbackManager) => {
    playbackManager.pause();
  };

  // Toggle the listening state
  const handleToggleListen = () => {
    setIsListening((prevIsListening) => !prevIsListening);
  };

  // Toggle the playing state
  const handleTogglePlay = () => {
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
  };

  // Toggle the recording state
  const handleToggleRecord = () => {
    setIsRecording((prevIsRecording) => !prevIsRecording);
  };

  // Reset and stop all recording and MIDI playback
  const handleToggleReset = () => {
    const playbackManager = playbackRef.current;
    resetAudio(playbackManager);
    playbackManager.setPlaybackStart(0);

    setIsListening(false);
    setIsPlaying(false);
    setIsResetButtonPressed(true);
  };

  // Toggle between the practice and record mode states
  const handleToggleMode = () => {
    setIsResetButtonPressed(true);

    if (isRecording || isPlaying) {
      setIsSwitchingMode(true);
    }

    const playbackManager = playbackRef.current;
    if (playbackManager) playbackManager.reset();
    if (isRecording) setIsRecording(false);
  };

  // Navigate to all recordings for this particular score
  const handleViewAllRecordings = () => {
    const score = `${params.files}`;
    const song = `${scoreTitle}`;
    const typeList = 'single-song';

    navigate('/ListRecordings', { state: { score, song, typeList } });
  };

  // Save a recording that was just made to the user's profile
  const handleSaveRecording = () => {
    setShowSaveRecordingPopUp(false);

    setCanDownload(true); // Raise flag order to initiate downloading process (json in OSMD)
    setPitch([]);
    setConfidence([]);

    const playbackManager = playbackRef.current;
    resetAudio(playbackManager);
  };

  // Delete a recording that was just made
  const handleDeleteRecording = () => {
    setShowSaveRecordingPopUp(false);

    audioStreamerRef.current.save_or_not('delete');
    setPitch([]);
    setConfidence([]);

    const playbackManager = playbackRef.current;
    resetAudio(playbackManager);
  };

  // Update recording file name as it is being changed in the popup window
  const handleRenameFile = (e) => {
    setFileName(e.target.value);
  };

  // Show shortcuts panel when triggered
  const handleToggleInfo = () => {
    setShowInfo((prevShowInfo) => !prevShowInfo);
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

  // Get real time state update from showSaveRecordingPopup for hotkey events
  useEffect(() => {
    showSaveRecordingPopUpRef.current = showSaveRecordingPopUp;
  }, [showSaveRecordingPopUp]);

  // Get real time state update from practiceMode for hotkey events
  useEffect(() => {
    practiceModeRef.current = practiceMode;
  }, [practiceMode]);

  // Get real time state update from showCountDownTimer for hotkey events
  useEffect(() => {
    showCountDownTimerRef.current = showCountDownTimer;
  }, [showCountDownTimer]);

  // Handle audio operations based on isListening and isPlaying changes
  useEffect(() => {
    const playbackManager = playbackRef.current;
    if (playbackManager) {
      if (!isListening) {
        pauseAudio(playbackManager);
      } else if (isListening && isPlaying) {
        setIsResetButtonPressed(true);
        setIsPlaying(false); // This will trigger the useEffect for isPlaying
        resetAudio(playbackManager);
        playAudio(playbackManager);
      } else if (isListening) {
        playAudio(playbackManager);
      }
    }
  }, [isListening]);

  // Handle audio operations based on isPlaying changes
  useEffect(() => {
    const playbackManager = playbackRef.current;
    if (playbackManager) {
      if (!isPlaying) {
        resetAudio(playbackManager);
      } else if (isPlaying && isListening) {
        setIsResetButtonPressed(true);
        setIsListening(false); // This will trigger the useEffect for isListening
        resetAudio(playbackManager);
        recordAudio(playbackManager);
      } else if (isPlaying) {
        recordAudio(playbackManager);
      }
    }
  }, [isPlaying]);

  // Handle audio operations based on isRecording changes
  useEffect(() => {
    const playbackManager = playbackRef.current;
    if (playbackManager) {
      if (isRecording) {
        playbackManager.setPlaybackStart(0);
        recordAudio(playbackManager);
      } else {
        stopRecordingAudio(playbackManager);
      }
    }
  }, [isRecording]);

  // Stop playing all audio whenever practice or record mode is toggled
  useEffect(() => {
    setIsListening(false);
    setIsPlaying(false);
    const playbackManager = playbackRef.current;

    if (playbackManager) {
      resetAudio(playbackManager);
    }
  }, [practiceMode]);

  // Set OSMD cursor back to start position when the whole piece is finished playing
  useEffect(() => {
    if (cursorFinished) {
      const playbackManager = playbackRef.current;
      playbackManager.setPlaybackStart(0);

      setCursorFinished(false);
      setIsListening(false);
    }
  }, [cursorFinished]);

  // Stop recording audio when recording is inactive (either paused or finished)
  useEffect(() => {
    if (recordInactive && canRecord) {
      const playbackManager = playbackRef.current;
      if (playbackManager) stopRecordingAudio(playbackManager);
      if (isListening) playAudio(playbackManager);
    }
  }, [recordInactive]);

  // Start recording when the count down timer finishes
  useEffect(() => {
    if (countDownFinished) {
      const playbackManager = playbackRef.current;

      // Activate pitch tracking
      setPitch([]);
      setConfidence([]);
      setStartPitchTrack(true);
      setShowPitchTrack(true);

      // Start recording with audio streamer
      audioStreamerRef.current.start(!practiceMode);

      // Play MIDI audio playback
      playAudio(playbackManager);
      setShowCountDownTimer(false);
    }

    // Reset count down timer when recording is finished
    setCountDownFinished(false);
  }, [countDownFinished]);

  // Update pitch values so that they can be drawn on screen
  useEffect(() => {
    if (pitchValue) {
      setPitch([...pitch, pitchValue]);
      setConfidence([...confidence, confidenceValue]);
      if (!practiceMode) setDynStability([...dynStability, dynamicValue]);
    }
  }, [pitchValue, dynamicValue]);

  // Effect to set isMac based on the detected OS
  useEffect(() => {
    const checkIsMacOs = async () => {
      const result = await isMacOs();
      setIsMac(result);
    };

    checkIsMacOs();
  }, []);

  // Delete recording if system crashes or user leaves page while recording
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      // Ensure recording is not saved and audioStreamer is properly cleaned up
      if (isRecording && audioStreamerRef.current) {
        audioStreamerRef.current.save_or_not('delete');
        stopRecordingAudio(playbackRef.current);
      }
      // Cancel the event as stated by the standard
      event.preventDefault();
      // Chrome requires returnValue to be set
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (isMicrophoneActive()) {
        stopMicrophone();
      }
      audioStreamerRef.current && audioStreamerRef.current.close();
    };
  }, []);

  if (!xmlFile) {
    return <LoadingScreen />;
  }

  return (
    <HotKeys keyMap={keyMap} handlers={handlers}>
      <div className="flex flex-col min-h-screen justify-between mb-40">
        <div className="relative">
          <OpenSheetMusicDisplay
            file={xmlFile}
            autoResize={true}
            cursorRef={cursorRef}
            playbackRef={playbackRef}
            metroVol={metronomeVolume / 100}
            bpm={bpm}
            zoom={zoom}
            followCursor={true}
            dynamicStability={dynStability}
            pitch={pitch}
            pitchConfidence={confidence}
            startPitchTrack={startPitchTrack}
            showPitchTrack={showPitchTrack}
            recordVol={midiVolume / 100}
            isResetButtonPressed={isResetButtonPressed}
            repeatsIterator={repeatsIterator}
            showRepeatsInfo={handleReceiveRepetitionInfo}
            onResetDone={onResetDone}
            cursorActivity={handleFinishedCursorOSMDCallback}
            mode={practiceMode}
            dataToDownload={handleGetJsonCallback}
            canDownload={canDownload}
            visual={'no'}
            transpose={transpose}
          />
          {(isRecording || isPlaying) && (
            <div className="absolute top-0 left-0 w-full h-full bg-transparent z-20 pointer-events-auto"></div>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-30 flex justify-center mb-32">
          <ControlBar
            onTransposeChange={(newTranspose) => setTranspose(newTranspose)}
            onBpmChange={(newBpm) => setBpm(newBpm)}
            onMidiVolumeChange={(newVolume) => setMidiVolume(newVolume)}
            onMetronomeVolumeChange={(newMetronomeVolume) =>
              setMetronomeVolume(newMetronomeVolume)
            }
            onModeChange={(newMode) => {
              setPracticeMode(newMode);
              handleToggleMode();
            }}
            onToggleListen={handleToggleListen}
            onTogglePlay={handleTogglePlay}
            onReset={handleToggleReset}
            onRecord={handleToggleRecord}
            handleViewAllRecordings={handleViewAllRecordings}
            isListening={isListening}
            isPlaying={isPlaying}
            isRecording={isRecording}
            isBpmDisabled={isBpmDeactivated}
            playbackMode={false} // playback mode is the mode for listening back to a recording
            practiceMode={practiceMode}
            handleToggleInfo={handleToggleInfo}
            showInfo={showInfo}
            isMac={isMac}
          />
        </div>

        {showCountDownTimer ? (
          <CountDownTimer
            bpm={parseInt(bpm)}
            mode={practiceMode}
            onCountDownFinished={handleCountDownFinished}
          />
        ) : null}

        <PopUpWindow isOpen={showSaveRecordingPopUp}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="fileName">
              Name Recording:
            </label>
            <input
              type="text"
              id="fileName"
              value={fileName}
              onChange={handleRenameFile}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-between space-x-2">
            <button
              onClick={handleSaveRecording}
              className="bg-green-500 border-none outline-none text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300 ease-in-out w-full"
            >
              Save
            </button>
            <button
              onClick={handleDeleteRecording}
              className="bg-red-500 border-none outline-none text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300 ease-in-out w-full"
            >
              Delete
            </button>
          </div>
        </PopUpWindow>
      </div>
    </HotKeys>
  );
};

export default ProgressPlayFile;
