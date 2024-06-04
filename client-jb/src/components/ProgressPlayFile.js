import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import OpenSheetMusicDisplay from "./OpenSheetMusicDisplay";
import ControlBar from "./ControlBar.js";
import ControlBarRecord from "./ControlBarRecord.js";
import { makeAudioStreamer, destroyAudioStreamer } from "./audioStreamer.js";
import CountdownTimer from "./MetronomeCountDown.js";
import SimpleMessaje from "./AnyMessage.js";
//import { log } from "@tensorflow/tfjs";
import Queue from "../utils/QueueWithMaxLength";
import ModeToggle from "./ModeToggle.js";
import PopUpWindow from "./PopUpWindow.js";
import XMLParser from "react-xml-parser";
import { putRecording } from "../utils/studentRecordingMethods.js";
import { Buffer } from "buffer";
import { useAppContext} from "../context/appContext";
import { startMicrophone, stopMicrophone, isMicrophoneActive } from "../context/audioContext";

// @ts-ignore
window.Buffer = Buffer;

const folderBasePath = "/xmlScores/violin";

const ProgressPlayFile = (props) => {
  //#region VARIABLES
  const { getCurrentUser } = useAppContext();
  const [userData, setUserData] = useState(null);
  const params = useParams();

  // get search parameters to turn on specific mode after navigation to this page
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const recordModeParam = searchParams.get("recordMode");

  //This ones have to do with OSMD
  const cursorRef = useRef(null);
  const playbackRef = useRef(null);

  //Score title needed to retrieve data from the API
  const [scoreTitle, setScoreTitle] = useState(null);

  //This are flags to check before doing stuff
  const [canRecord, setCanRecord] = useState(true);
  const [canDownload, setCanDownload] = useState(false);
  const [audioReady, setAudioReady] = useState(false);

  //Name for the file that will be saved in the DB
  const [userFileName, setUserFileName] = useState("");

  //Parameters that will be sent to OSMD
  const [metroVol, setMetroVol] = useState(0);
  const [bpmChange, setBpm] = useState(100); //BPM always set to 100 cause the scores don't have BPMs
  const [recordVol, setRecordVol] = useState(0.5);
  const [zoom, setZoom] = useState(1.0);

  //This changes when the record button is pressed
  const [recordInactive, setRecordInactive] = useState(true);

  //This ones are for the metronome countdown
  const [showTimer, setShowTimer] = useState(false);
  const [finishedTimer, setFinishedTimer] = useState(false);

  //This is for the MEYDA features
  const [pitchValue, setPitchValue] = useState(null);
  const [confidenceValue, setConfidenceValue] = useState(null);
  const [pitch, setPitch] = useState([]);
  const [confidence, setConfidence] = useState([]);
  var pitchCount = 0;
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
  const [showPopUpWindow, setShowPopUpWindow] = useState(false);
  const [jsonToDownload, setJsonToDownload] = useState();

  const [practiceMode, setPracticeMode] = useState(true);
  const [recordMode, setRecordMode] = useState(false);

  useEffect(() => {
    // Update practiceMode and recordMode whenever the query parameters change
    const recordModeOn = recordModeParam === "true" || false;
    setPracticeMode(!recordModeOn);
    setRecordMode(recordModeOn);
  }, [location.search]);

  const navigate = useNavigate();
  const scoreID = JSON.parse(localStorage.getItem("scoreData")).find(
    (item) => item.fname === params.files
  )._id;

  const onResetDone = () => {
    setIsResetButtonPressed(false);
  };
  //#endregion

  //#region FUNCTIONS
  /////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////Get data from the student//////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////
  //Currently the userData is stored locally, so I don't think this needs to be
  //done here. This function should be reviewed and possibly deleted from this file :)
  const fetchDataFromAPI = () => {
    if (userData === null) {
      getCurrentUser() // fetchData is already an async function
        .then((result) => {
          setUserData(result);
        })
        .catch((error) => {
          console.log(`getCurentUser() error: ${error}`);
          // Handle errors if necessary
        });
    }
  };

  /////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////Define pitch callback function///////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////
  //This function will be used by audioStreamer.js, more info in the file itself :)
  const handlePitchCallback = (pitchData) => {
    pitchCount = pitchCount + 1;
    if (pitchCount > 0) {
//      console.log("Dynamic Stability:\n", featureValues.rms.computeSD());
      setPitchValue(pitchData.pitch);
      setConfidenceValue(pitchData.confidence);
      //setDynStability(featureValues.rms.computeSD());
      pitchCount = 0;
    }
  };

  /////////////////////////////////////////////////////////////////////////////////////
  ////////////Define recording stop when cursor finishes callback function/////////////
  /////////////////////////////////////////////////////////////////////////////////////
  //This is passed to OSMD as "cursorActivity" and the idea is to check when the cursor
  //reaches the end, and then tell ControlBar.js + create the pop up window if needed...
  const handleFinishedCursorOSMDCallback = (OSMDfinishedCursor) => {
    if (OSMDfinishedCursor) {
      //cursor has finished

      //Send info to ControlBar--> true cursor finished
      setCursorFinished(true);
      //"Reset" funcionalities
      //No recording
      if (recordMode && !recordInactive) {
        audioStreamer.close_maybe_save(); //maybe save audio in Record mode
        handleSaveDeleteWindowPopUp(true); //call popup window save/delete
      } else {
        audioStreamer.close_not_save(); //never save audio in Practice mode
      }
      const playbackManager = playbackRef.current;
      playbackManager.pause();
      setStartPitchTrack(false);
      setRecordInactive(true); //Set to true, just like the initial state
    }
  };

  /////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////Function for ControlBar.js//////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////
  //This is passed to ControlBar.js for resetting purposes.
  const handleFinishedCursorControlBarCallback = (controlBarFinishedCursor) => {
    if (controlBarFinishedCursor === false) {
      //ControlBar already took cursor finishing actions
      //Update value, ready for new cursor finishings--> false cursor finished
      setCursorFinished(false);
    }
  };

  /////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////Function in charge of downloading//////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////
  //This is probably not the right name for this function, but the function prepares
  //"raw" data into the format that will be used to store the info in the DB, and then
  //uploads it to the DB :)
  async function handleDownload(dataBlob) {
    setAudioReady(false);
    const jsonData = JSON.parse(jsonToDownload); //convert data to json
    const jsonComplete = {
      studentId: userData.id,
      scoreId: scoreID,
      recordingName: `${userFileName}`,
      date: new Date(),
      audio: dataBlob,
      sharing: false,
      info: jsonData,
    };

    /////////////////////////////////////////////////////////////////////////////////////
    ///////////CODE TO DOWNLOAD LOCALLY THE JSON THAT IS UPLOADED TO DATABASE////////////
    /////////////////////////////////////////////////////////////////////////////////////
    //This is currently unused cause we don't allow to download the files, but might be
    //useful in the future?? Otherwise it can be deleted :)
    /*
    // Convert the combined data to a JSON string
    const jsonString = JSON.stringify(jsonComplete);
    // Create a Blob from the JSON string
    const blob = new Blob([jsonString], { type: "application/json" });
    // Create a download link
    const url = URL.createObjectURL(blob);
    // Create a link element
    const link = document.createElement("a");
    link.href = url;
    link.download = "yourFileName.json"; // Set the desired file name
    // Append the link to the document
    document.body.appendChild(link);
    // Trigger a click on the link to start the download
    link.click();
    // Remove the link from the document
    document.body.removeChild(link);
    */
    ///////////////////////////////////////////////////////////////////////////

    //Upload info to database
    try {
      await putRecording(jsonComplete);
    } catch (error) {
      console.log(`error in putRecording`, error);
    }
    //}
  }

  /////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////Function for flag control//////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////
  //This function is called from OpenSheetMusicDisplay.js as "dataToDownload". It just
  //gets the data and changes the needed flags :)
  const handleGetJsonCallback = (json) => {
    setJsonToDownload(json);
    setCanDownload(false);
    setAudioReady(true);
  };

  /////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////Function to handle Repetition view/////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////
  //This function gets called from OpenSheetMusciDisplay.js and it deals with small box
  //that tells the user which repetition they're currently seeing :)
  const handleReceiveRepetitionInfo = (showingRep, totalRep) => {
    if (totalRep === 0) {
      setRepetitionMessage("No recordings yet");
    } else {
      const message_aux =
        "Seeing " + (showingRep + 1) + " of " + (totalRep + 1);
      setRepetitionMessage(message_aux);
    }
  };

  /////////////////////////////////////////////////////////////////////////////////////
  //////////////////Function that creates the save/delete popUp window/////////////////
  /////////////////////////////////////////////////////////////////////////////////////
  //This function is called when the cursor reaches the end, or the recording is stopped
  //by the user (in record mode only). It creates a popUp window that is managed by
  //PopUpWindow.js :)
  const handleSaveDeleteWindowPopUp = (windowShow, answer, fileName) => {
    if (windowShow) {
      //recording stopped or cursor finished --> pop up window
      setShowPopUpWindow(true);
    } else {
      //user already choose save or delete options --> hide window
      //hide pop-up window
      setShowPopUpWindow(false);
      //Depending on answer save or delete:
      if (answer === "delete") {
        audioStreamer.save_or_not(answer); //No save wanted
        setPitch([]);
        //setDynStability([]);
        setConfidence([]);
        setIsResetButtonPressed(true);
      } else if (answer === "save") {
        setUserFileName(fileName); //save file name introduced by the user
        setCanDownload(true); //raise flag order to initiate downloading process (json in OSMD)
        setPitch([]);
        //setDynStability({});
        setConfidence([]);
        setIsResetButtonPressed(true);
      }
      //Do like a reset:
      const playbackManager = playbackRef.current;
      // const cursor = cursorRef.current;
      playbackManager.pause();
      playbackManager.setPlaybackStart(0);
      playbackManager.reset();
      //cursor.reset(); //seems right, but a runtime error follows
      setStartPitchTrack(false);
      setShowPitchTrack(false);
      setRecordInactive(true); //Set to true, just like the initial state
    }
  };

  ////////////////////////////////////////////////////////////////////////////////////////////
  ////////HERE I'M TAKING THE MEYDA FEATURES, BUT CURRENTLY NOTHING IS DONE WITH THEM/////////
  ////////////////////////////////////////////////////////////////////////////////////////////
  //---- keep track of the history of features we extract
  const featureValues = {
    // queue length (form computing means and SDs), normlow, normhi, sdnormlow, sdnormhi
    pitch: new Queue(5, 24, 61, 0, 0.5), //[110Hz, 440Hz] = [A2, A4] = midinote[24,69]
    rms: new Queue(5, 0, 0.25, 0, 0.01),
    spectralCentroid: new Queue(5, 0, 500),
    spectralFlux: new Queue(5, 3, 1, 0, 0.1),
  };

  //---- Pass to makeAudioStreamer to get callbaks with object features (with attributes being Meyda features)
  const aCb = function (features) {
    featureValues.rms.push(features.rms); //DYNAMIC STABILITY
    featureValues.spectralCentroid.push(features.spectralCentroid); //SPECTRAL CENTROID
    featureValues.spectralFlux.push(features.spectralFlux); //SPECTRAL FLUX

    // setSegments([featureValues.pitch.computeSD(), featureValues.rms.computeSD(), featureValues.spectralCentroid.computeMean(), featureValues.spectralFlux.computeSD() ]);
    // console.log("Spectral Centroid: ", featureValues.spectralCentroid.computeMean());
    // console.log("Dynamic Stability: ", featureValues.rms.computeSD());
    // console.log("Spectral Flux: ", featureValues.spectralFlux.computeSD());
    // console.log("Pitch: ", featureValues.pitch.computeSD());
  };
  ////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////
  //#endregion
  var audioStreamer = makeAudioStreamer(handlePitchCallback, null, aCb);

  //#region USEEFFECTS()
  //Once the score is loaded, get userData
  useEffect(() => {
    if (scoreTitle !== null) {
      fetchDataFromAPI();
    }
  }, [scoreTitle]);

  //This part just gets the tittle of the score, so it can later be used for the saving part
  //I don't know if it's the most efficient way, I based the code on the one used in AllLessons.js
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
  }, []); //This should run only once

  //This part deals with microphone permissions.
  //Accepting permissions works as expected
  //Denying permissions shows an alert that refreshes the page when accepted, but won't go away until permissions are given
  //Ignoring permissions allows to use the page, but audio won't be picked up and an error will show when the recorging process is finished
  useEffect(() => {
    if (!isMicrophoneActive()) {
      startMicrophone()
        .then(() => {
          console.log("Microphone started");
        })
        .catch((error) => {
          console.error("Failed to get microphone access:", error);
          alert("Please allow microphone access to use this feature");
          window.location.reload();
        });
    }

    return () => {
      console.log("LEAVING PAGE ProgressPlayFile.js ")
      if (isMicrophoneActive()) {
        stopMicrophone();
      }
      audioStreamer && audioStreamer.close()
    };
    
    
  }, []); //This should run only once

  //when audioReady activates (meaning that we can download the data)
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

  //When countdown timer (previous to start recording) finishes
  useEffect(() => {
    if (finishedTimer) {
      const playbackManager = playbackRef.current;
      //playbackManager.play()

      //Once countdown is finished, activate Pitch tracking
      setPitch([]);
      // setDynStability([]);
      setConfidence([]);
      setStartPitchTrack(true);
      setShowPitchTrack(true);

      //Start audioStreamer
      audioStreamer.init(recordMode, [
        "rms",
        "spectralCentroid",
        "spectralFlux",
      ]);

      //And play file, make cursor start
      playbackManager.play();
      //Timer work is done, false until next call
      setShowTimer(false);
    }
    //Finished timer duties done, false until next call
    setFinishedTimer(false);
  }, [finishedTimer]);

  //Changing mode practice/record handler
  useEffect(() => {
    // PRACTICE MODE BUTTON -------------------------------------------------------------
    const practiceModeButton = document.getElementById("PracticeMode");
    const handlePracticeModeButtonClick = () => {
      setPracticeMode(true);
      setRecordMode(false);
    };
    practiceModeButton.addEventListener("click", handlePracticeModeButtonClick);
    //--------------------------------------------------------------------------------

    // RECORD MODE BUTTON -------------------------------------------------------------
    const recordModeButton = document.getElementById("RecordMode");
    const handleRecordModeButtonClick = () => {
      setPracticeMode(false);
      setRecordMode(true);

      //Do like a reset:
      setIsResetButtonPressed(true);
      setPitch([]);
      // setDynStability([]);
      setConfidence([]);
      const playbackManager = playbackRef.current;
      // const cursor = cursorRef.current;
      playbackManager.pause();
      playbackManager.setPlaybackStart(0);
      playbackManager.reset();
      //cursor.reset(); //seems right, but a runtime error follows
      setStartPitchTrack(false);
      setShowPitchTrack(false);
      setRecordInactive(true); //Set to true, just like the initial state
      setBpm(100); //set bpm to original value, 100
    };
    recordModeButton.addEventListener("click", handleRecordModeButtonClick);
    //--------------------------------------------------------------------------------

    return () => {
      practiceModeButton.removeEventListener(
        "click",
        handlePracticeModeButtonClick
      );
      recordModeButton.removeEventListener(
        "click",
        handleRecordModeButtonClick
      );
    };
  }, [practiceMode, recordMode]);

  //Handles basically any change
  useEffect(() => {
    if (practiceMode === true) {
      //Practice Mode

      // RECORD BUTTON -----------------------------------------------------------------
      const recordButton = document.getElementById("record/stopRecording");
      const handleRecordButtonClick = () => {
        //Toggle recording state (FIXME does not work the first time, so recordInactive is started with true value)
        setRecordInactive(!recordInactive);

        if (recordInactive && canRecord) {
          //Recoding is wanted
          setShowTimer(true); //initialize process of countdown, which will then lead to recording
        } else {
          //Recording is unwanted
          audioStreamer.close_not_save(); //when practice mode on, no saving
          //Deactivate Pitch tracking
          setStartPitchTrack(false);
          //Pause file and therefore, cursor
          const playbackManager = playbackRef.current;
          playbackManager.pause();
        }
      };

      recordButton.addEventListener("click", handleRecordButtonClick);
      //--------------------------------------------------------------------------------

      // RESET BUTTON ------------------------------------------------------------------
      const resetButton = document.getElementById("reset");
      const handleResetButtonClick = () => {
        setShowPopUpWindow(false);
        audioStreamer.close_not_save(); //when practice mode is on, no saving
        setIsResetButtonPressed(true);
        const playbackManager = playbackRef.current;
        // const cursor = cursorRef.current;
        //Reset
        playbackManager.pause();
        playbackManager.setPlaybackStart(0);
        playbackManager.reset();
        //cursor.reset(); //seems right, but a runtime error follows
        setStartPitchTrack(false);
        setShowPitchTrack(false);
        setPitch([]);
        setDynamicValue([]);
        setConfidence([]);
        setRecordInactive(true); //Set to true, just like the initial state
      };

      resetButton.addEventListener("click", handleResetButtonClick);
      //--------------------------------------------------------------------------------

      // PLAY/PAUSE BUTTON -------------------------------------------------------------
      // gets the playback manager and sets the start time to the current time
      // plays the music where the cursor is
      const playButton = document.getElementById("play/pause");
      const handlePlayButtonClick = () => {
        const playbackManager = playbackRef.current;

        if (playbackManager.isPlaying) {
          playbackManager.pause();
        } else {
          playbackManager.play();
        }
      };
      playButton.addEventListener("click", handlePlayButtonClick);
      //--------------------------------------------------------------------------------

      // SETTINGS SLIDERS --------------------------------------------------------------
      const settingsSliders = document.getElementById("settings");

      const handleSettings = (event) => {
        //Check which setting slider has been clicked
        const sliderId = event.target.id;
        if (sliderId === "volume-slider") {
          setRecordVol(event.target.value);
        } else if (sliderId === "zoom-slider") {
          setZoom(event.target.value);
        } else if (sliderId === "bpm-slider") {
          setBpm(event.target.value);
        } else if (sliderId === "metroVol-slider") {
          setMetroVol(event.target.value);
        }
      };
      settingsSliders.addEventListener("click", handleSettings);
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
      repeatLayersButton.addEventListener(
        "click",
        handleRepeatLayersButtonClick
      );
      repeatLayersButton.addEventListener(
        "mousemove",
        handleRepeatLayersMouseOver
      );
      repeatLayersButton.addEventListener(
        "mouseout",
        handleRepeatLayersMouseLeave
      );
      //--------------------------------------------------------------------------------

      //Add new pitch value to pitch array
      if (pitchValue) {
        setPitch([...pitch, pitchValue]);
        setConfidence([...confidence, confidenceValue]);
        // setDynStability([...dynStability, dynamicValue]);
      }

      return () => {
        recordButton.removeEventListener("click", handleRecordButtonClick);
        repeatLayersButton.removeEventListener(
          "click",
          handleRepeatLayersButtonClick
        );
        repeatLayersButton.removeEventListener(
          "mouseover",
          handleRepeatLayersMouseOver
        );
        repeatLayersButton.removeEventListener(
          "mouseleave",
          handleRepeatLayersMouseLeave
        );
        resetButton.removeEventListener("click", handleResetButtonClick);
        playButton.removeEventListener("click", handlePlayButtonClick);
      };
    } else if (recordMode === true) {
      //Record Mode

      // RECORD BUTTON -----------------------------------------------------------------
      const recordButton = document.getElementById("record/stopRecording");
      const handleRecordButtonClick = () => {
        //Toggle recording state (FIXME does not work the first time, so recordInactive is started with true value)
        setRecordInactive(!recordInactive);

        if (recordInactive) {
          //Recoding is wanted
          setShowTimer(true); //initialize process of countdown, which will then lead to recording
        } else {
          //Recording is unwanted
          audioStreamer.close_maybe_save(); //when record mode is active, maybe we save
          //Deactivate Pitch tracking
          setStartPitchTrack(false);
          //Pause file and therefore, cursor
          const playbackManager = playbackRef.current;
          playbackManager.pause();
          handleSaveDeleteWindowPopUp(true); //call save/delete popup window
        }
      };

      recordButton.addEventListener("click", handleRecordButtonClick);
      //--------------------------------------------------------------------------------

      // PLAY/PAUSE BUTTON -------------------------------------------------------------
      // gets the playback manager and sets the start time to the current time
      // plays the music where the cursor is
      const playButton = document.getElementById("play/pause");
      const handlePlayButtonClick = () => {
        const playbackManager = playbackRef.current;
        if (playbackManager.isPlaying) {
          playbackManager.pause();
        } else {
          playbackManager.play();
        }
      };
      playButton.addEventListener("click", handlePlayButtonClick);
      //--------------------------------------------------------------------------------

      // SETTINGS SLIDERS --------------------------------------------------------------
      const settingsSliders = document.getElementById("settings");

      const handleSettings = (event) => {
        //Check which setting slider has been clicked
        const sliderId = event.target.id;
        if (sliderId === "volume-slider") {
          setRecordVol(event.target.value);
        } else if (sliderId === "zoom-slider") {
          setZoom(event.target.value);
        } else if (sliderId === "bpm-slider") {
          setBpm(event.target.value);
        } else if (sliderId === "metroVol-slider") {
          setMetroVol(event.target.value);
        }
      };
      settingsSliders.addEventListener("click", handleSettings);
      //--------------------------------------------------------------------------------

      // GO TO SAVINGS BUTTON  ------------------------------------
      const savedButton = document.getElementById("saved");
      const handleSavedButtonClick = () => {
        const score = `${params.files}`;
        const song = `${scoreTitle}`;
        const typeList = "single-song";

        // Use navigate to go to the ListRecordings page with parameters in the URL
        navigate("/ListRecordings", { state: { score, song, typeList } });
      };
      savedButton.addEventListener("click", handleSavedButtonClick);
      //--------------------------------------------------------------------------------

      //Add new pitch value to pitch array
      if (pitchValue) {
        setPitch([...pitch, pitchValue]);
        setConfidence([...confidence, confidenceValue]);
        setDynStability([...dynStability, dynamicValue]);
      }

      return () => {
        recordButton.removeEventListener("click", handleRecordButtonClick);
        playButton.removeEventListener("click", handlePlayButtonClick);
      };
    }
  }, [
    recordVol,
    zoom,
    recordInactive,
    pitchValue,
    dynamicValue,
    repeatsIterator,
    practiceMode,
    recordMode,
    showRepetitionMessage,
    userFileName,
    jsonToDownload,
  ]);
  //#endregion
  const handleComplete = useCallback(() => {
    setFinishedTimer(true);
  }, []);
  //#region RETURN
  return (
    <div>
      {showRepetitionMessage && <SimpleMessaje message={repetitionMessage} />}

      <OpenSheetMusicDisplay
        file={`${folderBasePath}/${params.files}.xml`}
        autoResize={true}
        cursorRef={cursorRef}
        playbackRef={playbackRef}
        metroVol={metroVol}
        bpm={bpmChange}
        zoom={zoom}
        followCursor={true}
        dynamicStability={dynStability}
        pitch={pitch}
        pitchConfidence={confidence}
        startPitchTrack={startPitchTrack}
        showPitchTrack={showPitchTrack}
        recordVol={recordVol}
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
      {showTimer ? (
        <CountdownTimer
          bpm={bpmChange}
          mode={practiceMode}
          onComplete={handleComplete}
        />
      ) : null}

      {practiceMode === true && recordMode === false ? (
        <ControlBar
          cursorFinished={cursorFinished}
          cursorFinishedCallback={handleFinishedCursorControlBarCallback}
        />
      ) : (
        <ControlBarRecord
          cursorFinished={cursorFinished}
          cursorFinishedCallback={handleFinishedCursorControlBarCallback}
        />
      )}

      {showPopUpWindow && (
        <PopUpWindow
          showWindow={showPopUpWindow}
          handlerBack={handleSaveDeleteWindowPopUp}
        />
      )}

      <ModeToggle practiceMode={practiceMode} recordMode={recordMode} />
    </div>
  );
  //#endregion
};

export default ProgressPlayFile;
