// ListRecordings.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ListRecordingsCSS from './ListRecordings.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getRecData, getRecording, putRecording, deleteRecording, patchViewPermissions } from "../utils/studentRecordingMethods.js";
import { useAppContext } from "../context/appContext";

import {
  faTrash,
  faPlay,
  faEye,
} from "@fortawesome/free-solid-svg-icons";


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////IMPORTANT READ ME!!//////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  THIS PART IS FOR DATABASE PETITIONS. ATM YOU CAN READ AND DELETE ENTRIES 
//  ATM IT GETS THE USER ID FROM getCurrentUser
//  AND THEN IT REQUESTS THE RECORDINGS FROM THAT USER AND THAT SPECIFIC SONG. WE DON'T HAVE A WAY
//  TO GET THE SONG ID RIGHT NOW, SO WE HAVE A PLACEHOLDER ONE
//  THE DELETE OPTION IS WORKING ON THE DATABASE SIDE, BUT DOESN'T PROPERLY DISPLAY ON SCREEN SO
//  I FORCEFULLY RELOAD THE PAGE. THIS NEEDS TO BE LOOKED INTO, SINCE IT MIGHT BE BETTER TO JUST
//  UPDATE THE RECORDINGLIST, BUT THAT MIGHT IMPLY REWRITING THE WAY RECORDINGLIST WORKS ATM :(


const ListRecordings = () => {

  const { getCurrentUser } = useAppContext();
  const [userData, setUserData] = useState(null);
  const [recordingList, setRecordingList] = useState(null);
  const [recordingNames, setRecordingNames] = useState(null);


  const dataBaseCall = async (action, idToDelete=null) => {
  // ---------------------------------------
  var recdatalist=[];  // list of minimal recording data [{recordingName, recordingId},{...}, ...]

  //getRecData(studentId, scoreId)
  if (action === "read") {
    try {
      console.log("im here ", userData)
      recdatalist = await getRecData("645b6e484612a8ebe8525933", "64d0de60d9ac9a34a66b4d45") // // userID: "645b6e484612a8ebe8525933"; scoreId: "64d0de60d9ac9a34a66b4d45" is for the score "V_001_Cuerdas_Al_Aire_1_Suelta_A"
      //console.log(`getRecData return OK, and recdatalist is ${JSON.stringify(recdatalist)}`)
      return (JSON.stringify(recdatalist))
    } catch (error) {
      console.log(`error in getRecData`, error);
    }
  }

  if (action === "delete") {
    try {
      await deleteRecording(idToDelete);
      return "DONE DONE DONE :)";
    } catch (error) {
      console.log(`error in deleteRecording`, error);
    }
  }
};

  // Starting --> load recordings from userID and scoreID
  useEffect(() => {

    const fetchDataFromAPI = () => {
      if(userData===null){
      getCurrentUser() // fetchData is already an async function
        .then((result) => {
          //console.log(`getCurentUser() has returnd this result: ${JSON.stringify(result)}`);
          setUserData(result);
        }).catch((error) => {
          console.log(`getCurentUser() error: ${error}`)
          // Handle errors if necessary
        })
      }

      if(userData !== null){
        console.log("im in here")
        dataBaseCall("read").then((result) => {
          console.log("result from get is ", result)
          setRecordingList(result);
          //setRecordingNames([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
          setRecordingNames(JSON.parse(result).map((recording) => recording.recordingName));
        }).catch((error) => {
          console.log(`Cannot get recordings from database: ${error}`)
          // Handle errors if necessary
        })

      }
  };   

    fetchDataFromAPI();
    
  }, [userData]);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const location = useLocation();
  const navigate = useNavigate();

  // Access the passed variables from the location object
  const score = location.state?.score || 'DefaultSong';
  const song = location.state?.song || 'DefaultSong1';
  
  // Event handler for going back
  const handleGoBack = () => {
    // Use navigate to go back to the previous page
    navigate(-1);
  };

  // Event handler for click on See
  const handleSeeClick = (score, song, number) => {
    console.log("See recording and score of song ", song, " recording ", number);
    navigate(score);
    //code that opens new page with the score, pitchtrack...
  };

  // Event handler for click on Play
  const handlePlayClick = (score, song, number) => {
    console.log("Play recording and score of song ", song, " recording ", number);

    //code that simply plays the audio of the recording, without having to get into the actual file
  };

  // Event handler for click on Trash
  const handleTrashClick = (nameOfFile, number) => {
    console.log("UNDER CONSTRUCTION :D");
    console.log("Deleting ", nameOfFile, number);
    if (recordingNames.indexOf(nameOfFile) !== -1) {
      const idToDelete = JSON.parse(recordingList)[recordingNames.indexOf(nameOfFile)].recordingId;
      dataBaseCall("delete", idToDelete).then((result) => {
        console.log(result);
      });
      //setRecordingNames(null);
      window.location.reload();
    }

    //send order to delete song to the database and force a re-render updating some state
  };



  if (recordingNames === null) {
    return <p>Loading...</p>;
  }



  // Your component logic using the variables
  return (
    <div className={ListRecordingsCSS.container}>
      <div> 
        <h2>{song}</h2>
        <p>Your recordings...</p>
      </div>

      {/* List of songs */}
      <div className={ListRecordingsCSS.songlist}>
        {recordingNames.map((nameOfFile) => (
          <div className={ListRecordingsCSS.songelement} key={recordingNames.indexOf(nameOfFile)}>
          <li key={recordingNames.indexOf(nameOfFile)}>
              <div>{song} - {nameOfFile}</div>
              <div>
              <button className={ListRecordingsCSS.iconbutton} onClick={() => handleSeeClick(score, song, recordingNames.indexOf(nameOfFile))}>
                <FontAwesomeIcon icon={faEye} />
              </button>
              <button className={ListRecordingsCSS.iconbutton} onClick={() => handlePlayClick(score, song, recordingNames.indexOf(nameOfFile))}>
                <FontAwesomeIcon icon={faPlay} />
              </button>
              <button className={ListRecordingsCSS.iconbutton} onClick={() => handleTrashClick(nameOfFile, recordingNames.indexOf(nameOfFile))}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
              </div>
            </li>
            </div>
        ))}
      </div>

      {/* Button to go back */}
      <button className={ListRecordingsCSS.backbutton} onClick={handleGoBack}>
        Go Back
      </button>
    </div>
  );
};

export default ListRecordings;
