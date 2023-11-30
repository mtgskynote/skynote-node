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

const folderBasePath = "/xmlScores/violin";

const ProgressPlayFile = (props) => {
  const params = useParams();

  const cursorRef = useRef(null);
  const playbackRef = useRef(null);

  const [scoreTitle, setScoreTitle] = useState(null);

  const [canRecord, setCanRecord] = useState(true);
  const [canDownload, setCanDownload] = useState(false);

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

  const [practiceMode, setPracticeMode] = useState(true);
  const [recordMode, setRecordMode] = useState(false);

  const navigate = useNavigate();

  const onResetDone = () => {
    setIsResetButtonPressed(false);
  };

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
      //audioStreamer.close()
      //console.log("Recording stopped because cursor finished")
      const playbackManager = playbackRef.current;
      //const cursor = cursorRef.current;
      playbackManager.pause();
      //playbackManager.setPlaybackStart(0);
      //playbackManager.reset();
      //cursor.reset();
      setStartPitchTrack(false);
      setRecordInactive(true) //Set to true, just like the initial state
    }
  };

  const handleDownload = (dataBlob) => {
    //THIS IS JUST TO GET THE NAME RIGHT
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');
    let formattedDate = `${params.files.replace(".xml", "")}_${year}_${month}_${day}-${hours}_${minutes}_${seconds}`;

    if (dataBlob.type === "audio/wav") {
      formattedDate = formattedDate + ".wav";
    } else if (dataBlob.type === "application/json") {
      formattedDate = formattedDate + ".json";
    }
    
    console.log("DOWNLOADING: ", formattedDate)
    /*const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(dataBlob);
    downloadLink.download = formattedDate;
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    setCanDownload(false);*/
    console.log("The download worked (trust me bro I wrote the code), you should see this message twice");
  }
  
  const handleFinishedCursorControlBarCallback = (controlBarFinishedCursor) => {
    if (controlBarFinishedCursor===false){//ControlBar already took cursor finishing actions 
      //Update value, ready for new cursor finishings--> false cursor finished
      setCursorFinished(false);
    }
  };
  // Define recording stop when cursor finishes callback function
  const handleReceiveRepetitionInfo = (showingRep, totalRep) => {
    /*console.log("im in the handlerrrr", showingRep)
    const message_aux="Seeing "+ showingRep +" of " + totalRep
    setRepetitionMessage(message_aux)*/
    if(totalRep===0){
      setRepetitionMessage("No recordings yet")
    }else{
      const message_aux="Seeing "+ (showingRep+1) + " of "+ (totalRep+1)
      setRepetitionMessage(message_aux)
    }
  };
  //save/delete recording when cursor finishes or when recording is stopped
  const handleSaveDeleteWindowPopUp=(windowShow, answer)=>{
      if(windowShow){ //recording stopped or cursor finished --> pop up window
        setShowPopUpWindow(true);
      }else{ //user already choose save or delete options --> hide window
        //hide pop-up window
        setShowPopUpWindow(false)
        //Depending on answer save or delete:
        if(answer==="delete"){
          //console.log("received delete answer")
          audioStreamer.save_or_not(answer) //No save wanted
          setIsResetButtonPressed(true);
          setPitch([]);
          setConfidence([]);
        }else if(answer==="save"){
          //console.log("received save answer")
          const song_name = `${params.files}`;
          const dataToDownload = audioStreamer.save_or_not(answer,song_name) //save wanted, send name of file
          handleDownload(dataToDownload);
          setCanDownload(true);
          setIsResetButtonPressed(true);
          setPitch([])
          setConfidence([])
        }
        //Do like a reset:
        //audioStreamer.resume()
        //audioStreamer.save()
        //audioStreamer.close()
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

  useEffect(() => {
    //This part just gets the tittle of the score, so it can later be used for the saving part
    //I don't know if it's the most efficient way, I based the code on the one used in AllLessons.js
    const requestScoreTitle = async () => {
      try {
        const response = await fetch(`${folderBasePath}/${params.files}`);
        const xmlFileData = await response.text();
        const arr = Array.from(
          new XMLParser()
            .parseFromString(xmlFileData)
            .getElementsByTagName("movement-title")
        );
        if (arr.length > 0) {
          setScoreTitle(arr[0].value);
        }
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
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
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
    //console.log("record active??? ", recordInactive)
    if(finishedTimer){

      //console.log("TIMER IS FINISHED")
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
          //audioStreamer.init(recordMode)
          //setShowPitchTrack(true)
          //console.log("Recording started")
          setShowTimer(true) //initialize process of countdown, which will then lead to recording
        } else { //Recording is unwanted
          audioStreamer.close_not_save() //when practice mode on, no saving
          //console.log("Recording stopped")
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
        //console.log("playyyyy")
        const playbackManager = playbackRef.current;
        //const cursor = cursorRef.current;
        //const currentTime = cursor.Iterator.currentTimeStamp;
        
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
          //audioStreamer.init(recordMode)
          //setShowPitchTrack(true)
          //console.log("Recording started")
          setShowTimer(true) //initialize process of countdown, which will then lead to recording
        } else { //Recording is unwanted
          audioStreamer.close_maybe_save() //when record mode is active, maybe we save
          //console.log("Recording stopped")
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
        //console.log("playyyyy")
        const playbackManager = playbackRef.current;
        //const cursor = cursorRef.current;
        //const currentTime = cursor.Iterator.currentTimeStamp;
        
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
        //window.location.href = "/TimbreVisualization";
        const song = `${scoreTitle}`;
        const typeList = 'single-song';

        // Use navigate to go to the ListRecordings page with parameters in the URL
        navigate('/ListRecordings', { state: { song, typeList } });
  
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
  }, [recordVol, zoom, recordInactive, pitchValue, repeatsIterator, practiceMode, recordMode, showRepetitionMessage]);

  return (
    
    <div>
      {(showRepetitionMessage&&<SimpleMessaje message={repetitionMessage}/>)}

      <OpenSheetMusicDisplay
        file={`${folderBasePath}/${params.files}`}
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
        dataToDownload={handleDownload}
        canDownload={canDownload}
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