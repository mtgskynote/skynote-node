import React, { useEffect, useState, useRef, useCallback } from "react";
import { HotKeys } from "react-hotkeys";
import { useParams, useNavigate } from "react-router-dom";
import OpenSheetMusicDisplay from "./OpenSheetMusicDisplay";
import ControlBar from "./ControlBar.js";
import { makeAudioStreamer, destroyAudioStreamer } from "./audioStreamer.js";
import CountDownTimer from "./CountDownTimer.js";
//import { log } from "@tensorflow/tfjs";
import Queue from "../utils/QueueWithMaxLength";
import PopUpWindow from "./PopUpWindow.js";
import XMLParser from "react-xml-parser";
import { putRecording } from "../utils/studentRecordingMethods.js";
import { Buffer } from "buffer";
import { useAppContext } from "../context/appContext";
import {
  startMicrophone,
  stopMicrophone,
  isMicrophoneActive,
} from "../context/audioContext";
// @ts-ignore
window.Buffer = Buffer;

const folderBasePath = "/xmlScores/violin";

const ProgressPlayFile = () => {
  const { getCurrentUser } = useAppContext();
  const [userData, setUserData] = useState(null);
  const params = useParams();

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
  const [fileName, setFileName] = useState("");

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
    "No stored recordings yet"
  );

  const [cursorFinished, setCursorFinished] = useState(false);
  const [showSaveRecordingPopUp, setShowSaveRecordingPopUp] = useState(false);
  const [jsonToDownload, setJsonToDownload] = useState();

  const [practiceMode, setPracticeMode] = useState(true);

  // Hot keys map and handlers
  const keyMap = {
    TOGGLE_PLAY: "p",
    TOGGLE_RECORD: "r",
    TOGGLE_LISTEN: "l",
  };

  const handlers = {
    TOGGLE_PLAY: (event) => {
      event.preventDefault();
      handleTogglePlay();
    },
    TOGGLE_RECORD: (event) => {
      event.preventDefault();
      handleToggleRecord();
    },
    TOGGLE_LISTEN: (event) => {
      event.preventDefault();
      handleToggleListen();
    },
  };

  const navigate = useNavigate();
  const scoreID = JSON.parse(localStorage.getItem("scoreData")).find(
    (item) => item.fname === params.files
  )._id;

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
          console.log(`getCurentUser() error: ${error}`);
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
    } catch (error) {
      console.log(`error in putRecording`, error);
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
      setRepetitionMessage("No recordings yet");
    } else {
      const message_aux =
        "Seeing " + (showingRep + 1) + " of " + (totalRep + 1);
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

  // Audio streamer that will handle recording audio
  const audioStreamer = makeAudioStreamer(handlePitchCallback, null, aCb);

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
        const movementTitle = Array.from(
          new XMLParser()
            .parseFromString(xmlFileData)
            .getElementsByTagName("movement-title")
        );
        if (movementTitle.length > 0) {
          setScoreTitle(movementTitle[0].value);
        } else {
          setScoreTitle("untitledScore");
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    requestScoreTitle();
  }, []);

  // Ask user for microphone permissions so that the application can record audio
  useEffect(() => {
    if (!isMicrophoneActive()) {
      startMicrophone()
        .then(() => {
          console.log("Microphone started");
        })
        .catch((error) => {
          console.error("Failed to get microphone access:", error);
          alert("Please allow microphone access to use this feature");
          setCanRecord(false);
          window.location.reload();
        });
    }

    return () => {
      console.log("LEAVING PAGE ProgressPlayFile.js ");
      if (isMicrophoneActive()) {
        stopMicrophone();
      }
      audioStreamer && audioStreamer.close();
    };
  }, []); //This should run only once

  // Save recording to user profile when audio is available to download
  useEffect(() => {
    if (audioReady) {
      audioStreamer
        .save_or_not("save")
        .then((dataToDownload) => {
          const buffer = new Buffer.from(dataToDownload);
          console.log("Can u see me now??");
          handleDownload(buffer); // send data to downloading function
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, [audioReady]);

  // Remove the count down from screen when the count down has finished
  const handleCountDownFinished = useCallback(() => {
    setCountDownFinished(true);
  }, []);

  // Reset the audio playback to its initial state
  const resetAudio = (playbackManager) => {
    playbackManager.pause();
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
    setStartPitchTrack(true);
    setShowPitchTrack(true);
    setShowCountDownTimer(true);
  };

  // Stop recording audio
  const stopRecordingAudio = (playbackManager) => {
    if (practiceMode) audioStreamer.close_not_save();
    else {
      audioStreamer.close_maybe_save();
      setShowSaveRecordingPopUp(true);
      setIsRecording(false);
      setIsBpmDeactivated(false);
    }

    setIsPlaying(false);
    setStartPitchTrack(false);

    resetAudio(playbackManager);
  };

  // Start playing MIDI audio from the playback manager
  const playAudio = (playbackManager) => {
    console.log("INSIDE PLAYBACK MANAGER");
    playbackManager.play();
  };

  // Toggle the listening state of the audio playback
  const handleToggleListen = () => {
    const playbackManager = playbackRef.current;
    if (isListening) {
      playbackManager.pause();
      setIsListening(false);
    } else {
      if (isPlaying) {
        // Set playing to false and stop all audio if listen is toggled while playing
        setIsPlaying(false);
        stopRecordingAudio(playbackManager);
        setIsResetButtonPressed(true);
      }

      setIsListening(true);
      playAudio(playbackManager);
    }
  };

  // Toggle the playing state of the audio playback
  const handleTogglePlay = () => {
    const playbackManager = playbackRef.current;
    if (isPlaying) {
      setIsPlaying(false);
      resetAudio(playbackManager);
    } else {
      if (isListening) {
        // Set listening to false and stop all audio if play is toggled while listening
        setIsListening(false);
        resetAudio(playbackManager);
      }
      setIsPlaying(true);
      setIsResetButtonPressed(true);
      recordAudio(playbackManager);
    }
  };

  // Handle when record is toggled on/off
  const handleToggleRecord = () => {
    const playbackManager = playbackRef.current;
    if (isRecording) {
      stopRecordingAudio(playbackManager);
    } else {
      recordAudio(playbackManager);
    }
  };

  // Navigate to all recordings for this particular score
  const handleViewAllRecordings = () => {
    const score = `${params.files}`;
    const song = `${scoreTitle}`;
    const typeList = "single-song";

    navigate("/ListRecordings", { state: { score, song, typeList } });
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

    audioStreamer.save_or_not("delete");
    setPitch([]);
    setConfidence([]);

    const playbackManager = playbackRef.current;
    resetAudio(playbackManager);
  };

  // Update recording file name as it is being changed in the popup window
  const handleRenameFile = (e) => {
    setFileName(e.target.value);
  };

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
      audioStreamer.init(!practiceMode, [
        "rms",
        "spectralCentroid",
        "spectralFlux",
      ]);

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

  return (
    <HotKeys keyMap={keyMap} handlers={handlers}>
      <div className="flex flex-col min-h-screen justify-between">
        <div>
          <OpenSheetMusicDisplay
            file={`${folderBasePath}/${params.files}.xml`}
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
            visual={"no"}
          />
        </div>

        <div className="flex justify-center mb-32">
          <ControlBar
            onTransposeChange={(newTranspose) => setTranspose(newTranspose)}
            onBpmChange={(newBpm) => setBpm(newBpm)}
            onMidiVolumeChange={(newVolume) => setMidiVolume(newVolume)}
            onMetronomeVolumeChange={(newMetronomeVolume) =>
              setMetronomeVolume(newMetronomeVolume)
            }
            onModeChange={(newMode) => {
              setPracticeMode(newMode);
              setIsResetButtonPressed(true);

              const playbackManager = playbackRef.current;
              resetAudio(playbackManager);
            }}
            onToggleListen={handleToggleListen}
            onTogglePlay={handleTogglePlay}
            onReset={() => {
              const playbackManager = playbackRef.current;
              resetAudio(playbackManager);

              setIsListening(false);
              setIsPlaying(false);
              setIsResetButtonPressed(true);
            }}
            onRecord={handleToggleRecord}
            handleViewAllRecordings={handleViewAllRecordings}
            isListening={isListening}
            isPlaying={isPlaying}
            isRecording={isRecording}
            isBpmDisabled={isBpmDeactivated}
            playbackMode={false} // playback mode is the mode for listening back to a recording
          />
        </div>

        {showCountDownTimer ? (
          <CountDownTimer
            bpm={bpm}
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
