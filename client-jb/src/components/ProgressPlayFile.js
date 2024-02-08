import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import OpenSheetMusicDisplay from "./OpenSheetMusicDisplay";
import ControlBar from "./ControlBar.js";
import ControlBarRecord from "./ControlBarRecord.js";
import { makeAudioStreamer } from "./audioStreamer.js";
import CountdownTimer from "./MetronomeCountDown.js";
import SimpleMessaje from "./AnyMessage.js"
//import { log } from "@tensorflow/tfjs";
import ModeToggle from "./ModeToggle.js";
import PopUpWindow from "./PopUpWindow.js";
import XMLParser from "react-xml-parser";
import { getRecData, getRecording, putRecording, deleteRecording, patchViewPermissions } from "../utils/studentRecordingMethods.js";
import { Buffer } from 'buffer';
import { useAppContext } from "../context/appContext";
// @ts-ignore
window.Buffer = Buffer;


const folderBasePath = "/xmlScores/violin";

const ProgressPlayFile = (props) => {
  const { getCurrentUser } = useAppContext();
  const [userData, setUserData] = useState(null);
  const params = useParams();

  const cursorRef = useRef(null);
  const playbackRef = useRef(null);

  const [scoreTitle, setScoreTitle] = useState(null);

  const [canRecord, setCanRecord] = useState(true);
  const [canDownload, setCanDownload] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [userFileName, setUserFileName] = useState("");

  const [metroVol, setMetroVol] = useState(0);
  const [bpmChange, setBpm] = useState(100);

  const [recordVol, setRecordVol] = useState(0.5);
  const [recordInactive, setRecordInactive] = useState(true)
  
  const [showTimer, setShowTimer] = useState(false);
  const [finishedTimer, setFinishedTimer] = useState(false);

  const [zoom, setZoom] = useState(1.0);

  const [pitchValue, setPitchValue] = useState(null);
  const [confidenceValue, setConfidenceValue] = useState(null);
  const [pitch, setPitch] = useState([]);
  const [confidence, setConfidence] = useState([]);
  var pitchCount =0;

  const [startPitchTrack, setStartPitchTrack] = useState(false);
  const [showPitchTrack, setShowPitchTrack] = useState(false);

  const [isResetButtonPressed, setIsResetButtonPressed] = useState(false);
  const [repeatsIterator, setRepeatsIterator] = useState(false);
  const [showRepetitionMessage, setShowRepetitionMessage]=useState(false);
  const [repetitionMessage, setRepetitionMessage]=useState("No stored recordings yet");

  const [cursorFinished, setCursorFinished] = useState(false);
  const [showPopUpWindow, setShowPopUpWindow]= useState(false);
  const [jsonToDownload, setJsonToDownload] = useState();

  const [practiceMode, setPracticeMode] = useState(true);
  const [recordMode, setRecordMode] = useState(false);

  const navigate = useNavigate();
  const scoreID=JSON.parse(localStorage.getItem("scoreData")).find(item => item.fname === params.files)._id;
  console.log("scoreID:", scoreID)

  
  const onResetDone = () => {
    setIsResetButtonPressed(false);
  };

  const fetchDataFromAPI = () => {
    if(userData===null){
    getCurrentUser() // fetchData is already an async function
      .then((result) => {
        console.log(`getCurentUser() has returnd this result: ${JSON.stringify(result)}`);
        setUserData(result);
      }).catch((error) => {
        console.log(`getCurentUser() error: ${error}`)
        // Handle errors if necessary
      })

    }};   

  

  // Define pitch callback function 
  const handlePitchCallback = (pitchData) => {
    pitchCount=pitchCount+1;
      if(pitchCount>0){
          setPitchValue(pitchData.pitch);
          setConfidenceValue(pitchData.confidence);
        pitchCount=0;
      }
  };

  // Define recording stop when cursor finishes callback function
  const handleFinishedCursorOSMDCallback = (OSMDfinishedCursor) => {
    if (OSMDfinishedCursor){//cursor has finished

      //Send info to ControlBar--> true cursor finished
      setCursorFinished(true);
      //"Reset" funcionalities
      //No recording
      if(recordMode && !recordInactive){
        audioStreamer.close_maybe_save(); //maybe save audio in Record mode
        handleSaveDeleteWindowPopUp(true); //call popup window save/delete
      }else{
        audioStreamer.close_not_save(); //never save audio in Practice mode
      }
      const playbackManager = playbackRef.current;
      playbackManager.pause();
      setStartPitchTrack(false);
      setRecordInactive(true) //Set to true, just like the initial state
    }
  };

  //function in charge of downloading
  async function handleDownload (dataBlob){
    setAudioReady(false);
    //console.log("I received audio, i proceed to save everything: ", dataBlob, jsonToDownload)
    const jsonData = JSON.parse(jsonToDownload)//convert data to json
    const jsonComplete={
      studentId: userData.id, 
      scoreId: scoreID, 
      recordingName: `${userFileName}`, 
      date: new Date(), 
      audio: dataBlob,
      sharing: false,
      info:jsonData,
    }

    ///////////CODE TO DOWNLOAD LOCALLY THE JSON THAT IS UPLOADED TO DATABASE
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

      // upload to database
      try{
        console.log(jsonComplete)
        let result = await putRecording(jsonComplete);
        if (result!=null) {
          //recdatalist.push(result); // save results locally
          console.log('putRecording return OK, and result is now ', result) 
          //console.log(`putRecording return OK, and recdatalist is now  ${JSON.stringify(recdatalist)}`)  
        }
      } catch (error) { 
        console.log(`error in putRecording`, error  );
      }  
    //}
  }
  const handleGetJsonCallback = (json) => {
    setJsonToDownload(json);
    setCanDownload(false);
    setAudioReady(true);
    console.log("im storing json data in state")
  };
  
  const handleFinishedCursorControlBarCallback = (controlBarFinishedCursor) => {
    if (controlBarFinishedCursor===false){//ControlBar already took cursor finishing actions 
      //Update value, ready for new cursor finishings--> false cursor finished
      setCursorFinished(false);
    }
  };
  // Define recording stop when cursor finishes callback function
  const handleReceiveRepetitionInfo = (showingRep, totalRep) => {
    if(totalRep===0){
      setRepetitionMessage("No recordings yet")
    }else{
      const message_aux="Seeing "+ (showingRep+1) + " of "+ (totalRep+1)
      setRepetitionMessage(message_aux)
    }
  };
  //save/delete recording when cursor finishes or when recording is stopped
  const handleSaveDeleteWindowPopUp=(windowShow, answer, fileName)=>{
      if(windowShow){ //recording stopped or cursor finished --> pop up window
        setShowPopUpWindow(true);
      }else{ //user already choose save or delete options --> hide window
        //hide pop-up window
        setShowPopUpWindow(false)
        //Depending on answer save or delete:
        if(answer==="delete"){
          //console.log("received delete answer")
          audioStreamer.save_or_not(answer) //No save wanted
          setPitch([]);
          setConfidence([]);
          setIsResetButtonPressed(true);
        }else if(answer==="save"){
          setUserFileName(fileName) //save file name introduced by the user
          setCanDownload(true); //raise flag order to initiate downloading process (json in OSMD)
          setPitch([]);
          setConfidence([]);
          setIsResetButtonPressed(true);
        }
        //Do like a reset:
        const playbackManager = playbackRef.current;
        const cursor = cursorRef.current;
        playbackManager.pause();
        playbackManager.setPlaybackStart(0);
        playbackManager.reset();
        cursor.reset();
        setStartPitchTrack(false);
        setShowPitchTrack(false)
        setRecordInactive(true) //Set to true, just like the initial state        
      }
      
  }

  //when audioReady activates (meaning that we can download the data)
  useEffect(() => {
    if(audioReady){
      audioStreamer.save_or_not("save")
        .then(dataToDownload => {
          const buffer= new Buffer.from(dataToDownload)
          handleDownload(buffer); // send data to downloading function
        })
        .catch(error => {
          console.error("Error:", error);
        });
    }
  }, [audioReady]);

  useEffect(()=>{
    //Now that we know that score is loaded, get userData
    if(scoreTitle!==null){
      fetchDataFromAPI();
    }
  },[scoreTitle])

  useEffect(() => {
    //This part just gets the tittle of the score, so it can later be used for the saving part
    //I don't know if it's the most efficient way, I based the code on the one used in AllLessons.js
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
        const workTitle = Array.from(
          new XMLParser()
            .parseFromString(xmlFileData)
            .getElementsByTagName("work-title")
        );
        if (movementTitle.length > 0) {
          setScoreTitle(movementTitle[0].value);
        } else if (workTitle.length > 0) {
          setScoreTitle(workTitle[0].value);}

      } catch (error) {
        console.log(error.message);
      }
    };
    //This part deals with microphone permissions.
    //Accepting permissions works as expected
    //Denying permissions shows an alert that refreshes the page when accepted, but won't go away until permissions are given
    //Ignoring permissions allows to use the page, but audio won't be picked up and an error will show when the recorging process is finished  
    const requestMicrophonePermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: {
          echoCancellation: false,
          autoGainControl: false,
          noiseSuppression: false,
          latency: 0,
          sampleRate: 22050
        } });
        setCanRecord(true);
      } catch (error) {
        setCanRecord(false);
        alert('Microphone access denied. If you have trouble with permissions, try clicking on the small lock at the left of your search bar and make sure the microphone is enabled, then accept this message :)');
        window.location.reload();
      }
    };
    requestMicrophonePermission();
    requestScoreTitle();
  }, []); //This should run only once
    

  var audioStreamer = makeAudioStreamer(handlePitchCallback);
  
  //When countdown timer (previous to start recording) finishes
  useEffect(() => {
    if(finishedTimer){
      const playbackManager = playbackRef.current;
      playbackManager.play()
      
      //Once countdown is finished, activate Pitch tracking
      setPitch([])
      setConfidence([])
      setStartPitchTrack(true);
      setShowPitchTrack(true);

      //Start audioStreamer
      audioStreamer.init(recordMode);

      //And play file, make cursor start
      playbackManager.play();
      //Timer work is done, false until next call
      setShowTimer(false)
    }
    //Finished timer duties done, false until next call
    setFinishedTimer(false)
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
      setPitch([])
      setConfidence([])
      const playbackManager = playbackRef.current;
      const cursor = cursorRef.current;
      playbackManager.pause();
      playbackManager.setPlaybackStart(0);
      playbackManager.reset();
      cursor.reset();
      setStartPitchTrack(false);
      setShowPitchTrack(false)
      setRecordInactive(true) //Set to true, just like the initial state
      
    };
   recordModeButton.addEventListener("click", handleRecordModeButtonClick);
    //--------------------------------------------------------------------------------

    return () => {
      practiceModeButton.removeEventListener("click", handlePracticeModeButtonClick);
      recordModeButton.removeEventListener("click", handleRecordModeButtonClick);
    };
  }, [practiceMode, recordMode]);

  //Handles basically any change
  useEffect(() => {

    if(practiceMode===true){ //Practice Mode
      
      // RECORD BUTTON -----------------------------------------------------------------
      const recordButton = document.getElementById("record/stopRecording");
      const handleRecordButtonClick = () => {
        //console.log("Can I record?: ", canRecord);
        //Toggle recording state (FIXME does not work the first time, so recordInactive is started with true value)
        setRecordInactive(!recordInactive)

        if (recordInactive && canRecord) { //Recoding is wanted
          setShowTimer(true) //initialize process of countdown, which will then lead to recording
        } else { //Recording is unwanted
          audioStreamer.close_not_save() //when practice mode on, no saving
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
        setShowPopUpWindow(false)
        audioStreamer.close_not_save() //when practice mode is on, no saving
        setIsResetButtonPressed(true);
        const playbackManager = playbackRef.current;
        const cursor = cursorRef.current;
        //Reset
        playbackManager.pause();
        playbackManager.setPlaybackStart(0);
        playbackManager.reset();
        cursor.reset();
        setStartPitchTrack(false);
        setShowPitchTrack(false)
        setPitch([])
        setConfidence([])
        setRecordInactive(true) //Set to true, just like the initial state
        
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
        }else if(sliderId === "zoom-slider"){
          setZoom(event.target.value)
        }else if(sliderId==="bpm-slider"){
          setBpm(event.target.value)
        }else if(sliderId==="metroVol-slider"){
          setMetroVol(event.target.value)
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
      repeatLayersButton.addEventListener("click", handleRepeatLayersButtonClick);
      repeatLayersButton.addEventListener("mousemove", handleRepeatLayersMouseOver);
      repeatLayersButton.addEventListener("mouseout", handleRepeatLayersMouseLeave);
      //--------------------------------------------------------------------------------


      //Add new pitch value to pitch array
      if(pitchValue){
        setPitch([...pitch,pitchValue])
        setConfidence([...confidence,confidenceValue])
      }
    
      return () => {
        recordButton.removeEventListener("click", handleRecordButtonClick);
        repeatLayersButton.removeEventListener("click", handleRepeatLayersButtonClick);
        repeatLayersButton.removeEventListener("mouseover", handleRepeatLayersMouseOver);
        repeatLayersButton.removeEventListener("mouseleave", handleRepeatLayersMouseLeave);
        resetButton.removeEventListener("click", handleResetButtonClick);
        playButton.removeEventListener("click", handlePlayButtonClick);
      }
    }else if(recordMode===true){//Record Mode
      
      // RECORD BUTTON -----------------------------------------------------------------
      const recordButton = document.getElementById("record/stopRecording");
      const handleRecordButtonClick = () => {

        //Toggle recording state (FIXME does not work the first time, so recordInactive is started with true value)
        setRecordInactive(!recordInactive)

        if (recordInactive) { //Recoding is wanted
          setShowTimer(true) //initialize process of countdown, which will then lead to recording
        } else { //Recording is unwanted
          audioStreamer.close_maybe_save() //when record mode is active, maybe we save
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
        }else if(sliderId === "zoom-slider"){
          setZoom(event.target.value)
        }else if(sliderId==="bpm-slider"){
          setBpm(event.target.value)
        }else if(sliderId==="metroVol-slider"){
          setMetroVol(event.target.value)
        }
      };
      settingsSliders.addEventListener("click", handleSettings);
      //--------------------------------------------------------------------------------

      // GO TO SAVINGS BUTTON  ------------------------------------
      const savedButton = document.getElementById("saved");
      const handleSavedButtonClick = () => {
        const score = `${params.files}`;
        const song = `${scoreTitle}`;
        const typeList = 'single-song';

        console.log("info ", score, song, typeList)

        // Use navigate to go to the ListRecordings page with parameters in the URL
        navigate('/ListRecordings', { state: { score, song, typeList } });
  
      };
      savedButton.addEventListener("click", handleSavedButtonClick);
      //--------------------------------------------------------------------------------


      //Add new pitch value to pitch array
      if(pitchValue){
        setPitch([...pitch,pitchValue])
        setConfidence([...confidence,confidenceValue])
      }
    
      return () => {
        recordButton.removeEventListener("click", handleRecordButtonClick);
        playButton.removeEventListener("click", handlePlayButtonClick);
      }
    };
  }, [recordVol, zoom, recordInactive, pitchValue, repeatsIterator, practiceMode, recordMode, showRepetitionMessage, userFileName, jsonToDownload]);

  return (
    
    <div>
      {(showRepetitionMessage&&<SimpleMessaje message={repetitionMessage}/>)}

      <OpenSheetMusicDisplay
        file={`${folderBasePath}/${params.files}.xml`}
        autoResize={true}
        cursorRef={cursorRef}
        playbackRef={playbackRef}
        metroVol={metroVol}
        bpm={bpmChange}
        zoom={zoom}
        followCursor={true}
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
      {showTimer ? (<CountdownTimer bpm={bpmChange} mode={practiceMode}  onComplete={() => setFinishedTimer(true)} />):(null)}
      
      {(practiceMode ===true && recordMode===false)?<ControlBar 
        cursorFinished={cursorFinished} cursorFinishedCallback={handleFinishedCursorControlBarCallback}
      /> : <ControlBarRecord cursorFinished={cursorFinished} cursorFinishedCallback={handleFinishedCursorControlBarCallback}/>}

      {(showPopUpWindow && <PopUpWindow showWindow={showPopUpWindow} handlerBack={handleSaveDeleteWindowPopUp}/>)}
      
      <ModeToggle/>
    </div>
  );
};

export default ProgressPlayFile;