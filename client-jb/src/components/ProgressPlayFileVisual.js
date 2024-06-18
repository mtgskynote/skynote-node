import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import OpenSheetMusicDisplay from "./OpenSheetMusicDisplay";
import PopUpWindow from "./PopUpWindow.js";
import {
  getRecording,
  deleteRecording,
} from "../utils/studentRecordingMethods.js";
import ControlBar from "./ControlBar.js";
import {
  getAudioContext,
  suspendAudioContext,
  resumeAudioContext,
} from "../context/audioContext";

const folderBasePath = "/xmlScores/violin";

let currentSource = null; // has to be global so that React redraws don't lose track of the source

const ProgressPlayFileVisual = () => {
  let audioContext = getAudioContext();
  const params = useParams();

  const [songFile, setSongFile] = useState(null);

  const cursorRef = useRef(null);
  const playbackRef = useRef(null);

  const [metronomeVolume, setMetronomeVolume] = useState(0);
  const [midiVolume, setMidiVolume] = useState(0);
  const [bpm, setBpm] = useState(100);
  const [zoom, setZoom] = useState(1.0);
  const [transpose, setTranspose] = useState(0);

  const [recordInactive, setRecordInactive] = useState(true);
  const [showDeleteRecordingPopUp, setShowDeleteRecordingPopUp] =
    useState(false);
  const [showStats, setShowStats] = useState(false);

  const [pitch, setPitch] = useState([]);
  const [confidence, setConfidence] = useState([]);

  const [startPitchTrack, setStartPitchTrack] = useState(false);
  const [showPitchTrack, setShowPitchTrack] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const [isResetButtonPressed, setIsResetButtonPressed] = useState(false);
  const [repeatsIterator, setRepeatsIterator] = useState(false);
  const [showRepetitionMessage, setShowRepetitionMessage] = useState(false);
  const [repetitionMessage, setRepetitionMessage] = useState(
    "No stored recordings yet"
  );

  const [cursorFinished, setCursorFinished] = useState(false);
  const [cursorJumped, setCursorJumped] = useState(false);

  const [visualMode, setVisualMode] = useState(true);
  const [json, setJson] = useState([]);
  const [metaData, setMetaData] = useState({
    name: null,
    stars: null,
    date: null,
  });

  //const { getCurrentUser } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  const newUrl = window.location.href;

  const recordingID = location.state?.id;

  useEffect(() => {
    getRecording(recordingID).then((recordingJSON) => {
      console.log(recordingJSON);
      // get score info
      const scoreInfo = JSON.parse(localStorage.getItem("scoreData")).find(
        (item) => item.fname === params.files
      );
      //Set metaData
      const recordingDate = new Date(recordingJSON.date);
      setMetaData({
        name: recordingJSON.recordingName,
        stars: recordingJSON.info.stars,
        date: recordingDate.toLocaleDateString("es-ES", options),
        skill: scoreInfo.skill,
        lesson: scoreInfo.lesson,
        score: scoreInfo.title,
      });
      //Save json.info (recording data, pitch, colors...) to send it to osmd
      setJson(recordingJSON.info);
      //Set bpm
      setBpm(recordingJSON.info.bpm);
      // Save audio
      setSongFile(recordingJSON.audio);
    });
  }, [recordingID]);

  const onResetDone = () => {
    setIsResetButtonPressed(false);
  };

  // Define recording stop when cursor finishes callback function
  const handleFinishedCursorOSMDCallback = (OSMDfinishedCursor) => {
    if (OSMDfinishedCursor) {
      //cursor has finished

      //Send info to ControlBar--> true cursor finished
      setCursorFinished(true);
      const playbackManager = playbackRef.current;
      playbackManager.pause();
      playbackManager.setPlaybackStart(0);
      setStartPitchTrack(false);
      setIsResetButtonPressed(true);
      setRecordInactive(true); //Set to true, just like the initial state
    }
  };

  // When cursor jumps (osmd detects it, we need to generate state)
  const handleJumpedCursorOSMDCallback = () => {
    setCursorJumped(!cursorJumped);
  };

  // Define recording stop when cursor finishes callback function
  const handleReceiveRepetitionInfo = (showingRep, totalRep) => {
    if (totalRep === 0) {
      setRepetitionMessage("No recordings yet");
    } else {
      const message_aux =
        "Seeing " + (showingRep + 1) + " of " + (totalRep + 1);
      setRepetitionMessage(message_aux);
    }
  };

  const playAudio = async () => {
    try {
      // Transform data type and play
      var uint8Array = new Uint8Array(songFile.data);
      var arrayBuffer = uint8Array.buffer;
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();
      currentSource = source; // keep track of the current source for stopping later
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  const stopAudio = async () => {
    if (currentSource) {
      currentSource.stop();
      currentSource.disconnect(); // Clean up connections
      currentSource = null;
    }
  };

  //Handles basically any change
  useEffect(() => {
    if (visualMode === true) {
      //Visual Mode
      // PLAY/STOP BUTTON -------------------------------------------------------------
      // gets the playback manager and sets the start time to the current time
      // plays the music where the cursor is
      const playButton = document.getElementById("play/stop");
      const handlePlayButtonClick = () => {
        const playbackManager = playbackRef.current;
        //const cursor = cursorRef.current;
        if (playbackManager.isPlaying) {
          //Pause/stop audio of recording
          stopAudio();
          //Pause/stop osmd
          playbackManager.pause();
          //playbackManager.setPlaybackStart(0);
          playbackManager.reset();
          //cursor.reset(); //seems right, but a runtime error follows
          setStartPitchTrack(false);
          setShowPitchTrack(false);
          setPitch([]);
          setConfidence([]);
          setRecordInactive(true); //Set to true, just like the initial state
          setIsResetButtonPressed(true);
        } else {
          //Play audio of recording
          playAudio();
          //Play osmd
          setIsResetButtonPressed(true);
          playbackManager.play();
        }
      };
      // playButton.addEventListener("click", handlePlayButtonClick);
      //--------------------------------------------------------------------------------

      // SETTINGS SLIDERS --------------------------------------------------------------
      const settingsSliders = document.getElementById("settings");

      const handleSettings = (event) => {
        //Check which setting slider has been clicked
        const sliderId = event.target.id;
        if (sliderId === "volume-slider") {
          setMidiVolume(event.target.value);
        } else if (sliderId === "zoom-slider") {
          setZoom(event.target.value);
        } else if (sliderId === "metroVol-slider") {
          setMetronomeVolume(event.target.value);
        }
      };
      // settingsSliders.addEventListener("click", handleSettings);
      //--------------------------------------------------------------------------------

      // SWITCH BETWEEN REPETITION/RECORDING LAYERS ------------------------------------
      const repeatLayersButton = document.getElementById("switchRepetition");
      const handleRepeatLayersButtonClick = () => {
        //window.location.href = "/TimbreVisualization";
        setRepeatsIterator(!repeatsIterator);
      };
      const handleRepeatLayersMouseOver = () => {
        setShowRepetitionMessage(true);
      };
      const handleRepeatLayersMouseLeave = () => {
        setShowRepetitionMessage(false);
      };
      // repeatLayersButton.addEventListener(
      //   "click",
      //   handleRepeatLayersButtonClick
      // );
      // repeatLayersButton.addEventListener(
      //   "mousemove",
      //   handleRepeatLayersMouseOver
      // );
      // repeatLayersButton.addEventListener(
      //   "mouseout",
      //   handleRepeatLayersMouseLeave
      // );

      return () => {
        // repeatLayersButton.removeEventListener(
        //   "click",
        //   handleRepeatLayersButtonClick
        // );
        // repeatLayersButton.removeEventListener(
        //   "mouseover",
        //   handleRepeatLayersMouseOver
        // );
        // repeatLayersButton.removeEventListener(
        //   "mouseleave",
        //   handleRepeatLayersMouseLeave
        // );
        // playButton.removeEventListener("click", handlePlayButtonClick);
        //deleteButton.removeEventListener("click", handleDeleteButtonClick);
      };
    }
  }, [
    midiVolume,
    zoom,
    recordInactive,
    repeatsIterator,
    visualMode,
    showRepetitionMessage,
    json,
    songFile,
    cursorFinished,
    cursorJumped,
  ]);

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [newUrl]);

  const handleViewAllRecordings = () => {
    navigate(-1);
  };

  const resetAudio = (playbackManager) => {
    playbackManager.pause();
    playbackManager.reset();
    stopAudio();

    setStartPitchTrack(false);
    setShowPitchTrack(false);
    setPitch([]);
    setConfidence([]);
    setRecordInactive(true);
  };

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

  const handleShowPopUpWindow = () => {
    setShowDeleteRecordingPopUp(true);
  };

  const handleHidePopUpWindow = () => {
    setShowDeleteRecordingPopUp(false);
  };

  const handleDeleteRecording = () => {
    setShowDeleteRecordingPopUp(false);
    deleteRecording(recordingID)
      .then(() => {
        navigate(-1);
      })
      .catch((error) => {
        console.log(`Cannot delete recording from database: ${error}`);
      });
  };

  useEffect(() => {
    if (cursorFinished) {
      setCursorFinished(false);
      setIsPlaying(false);
    }
  });

  console.log(showStats);

  return (
    <div className="flex flex-col min-h-screen justify-between">
      {/* {showRepetitionMessage && <SimpleMessaje message={repetitionMessage} />} */}
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
          mode={visualMode}
          visual={"yes"}
          visualJSON={json}
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
          onTogglePlay={handleTogglePlay}
          onToggleStats={() => setShowStats(!showStats)}
          onReset={() => {
            const playbackManager = playbackRef.current;
            resetAudio(playbackManager);

            setIsPlaying(false);
            setIsResetButtonPressed(true);
          }}
          handleViewAllRecordings={handleViewAllRecordings}
          isPlaying={isPlaying}
          playbackMode={true}
          handleShowPopUpWindow={handleShowPopUpWindow}
        />
        {showStats && (
          <div
            className="absolute bottom-0 left-0 w-full transform transition-transform duration-500 ease-in-out"
            style={{
              transform: showStats ? "translateY(0)" : "translateY(100%)",
            }}
          >
            <div className="bg-black p-4">RANDOM STATS</div>
          </div>
        )}
      </div>

      <PopUpWindow isOpen={showDeleteRecordingPopUp}>
        <div>
          <p className="text-xl font-extrabold text-gray-800 mb-1">
            Are you sure you want to delete{" "}
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
  );
};

export default ProgressPlayFileVisual;
