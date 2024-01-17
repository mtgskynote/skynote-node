// ListRecordings.js
import React, { useState, useEffect } from 'react';
import { json, useLocation, useNavigate } from 'react-router-dom';
import ListRecordingsCSS from './ListRecordings.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getRecData, getRecording, deleteRecording } from "../utils/studentRecordingMethods.js";
import { useAppContext } from "../context/appContext";

import {
  faTrash,
  faPlay,
  faEye,
  faStar
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
  const location = useLocation();
  const navigate = useNavigate();

  // Access the passed variables from the location object
  const score = location.state?.score || 'DefaultSong';
  const song = location.state?.song || 'DefaultSong1';

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
        getRecData("645b6e484612a8ebe8525933", "64d0de60d9ac9a34a66b4d45").then((result) => {
          setRecordingList(JSON.stringify(result));
          setRecordingNames(result.map((recording) => recording.recordingName));
        }).catch((error) => {
          console.log(`Cannot get recordings from database: ${error}`)
          // Handle errors if necessary
        })

      }
  };   

    fetchDataFromAPI();
    
  }, [userData]);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Event handler for going back
  const handleGoBack = () => {
    // Use navigate to go back to the previous page
    //navigate(-1);
    navigate(`/all-lessons/${score}`);
  };

  // Event handler for click on See
  const handleSeeClick = (nameOfFile, number)=> {
      const id = JSON.parse(recordingList)[recordingNames.indexOf(nameOfFile)].recordingId;
      //Pass recording ID to ProgressPlayfileVisual
      navigate(score, {state:{'recordingID':id}})
    }


  // Event handler for click on Trash
  const handleTrashClick = (nameOfFile, number) => {
    if (recordingNames.indexOf(nameOfFile) !== -1) {
      const idToDelete = JSON.parse(recordingList)[recordingNames.indexOf(nameOfFile)].recordingId;
      const auxArrayNames = recordingNames.filter((item, index) => index !== recordingNames.indexOf(nameOfFile));
      const auxArrayList = JSON.parse(recordingList).filter((item, index) => index !== recordingNames.indexOf(nameOfFile));
      console.log("Deleting: ", idToDelete);
      deleteRecording(idToDelete).then(() => {
        setRecordingNames(auxArrayNames);
        setRecordingList(auxArrayList);
        //window.location.reload();
      }).catch((error) => {
        console.log(`Cannot delete recordings from database: ${error}`)
      })
    }
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
              <button className={ListRecordingsCSS.iconbutton} onClick={() => handleSeeClick(nameOfFile, recordingNames.indexOf(nameOfFile))}>
                <FontAwesomeIcon icon={faEye} />
              </button>
              <button className={ListRecordingsCSS.iconbutton} onClick={() => handleTrashClick(nameOfFile, recordingNames.indexOf(nameOfFile))}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
              </div>
              <div>
                        <FontAwesomeIcon icon={faStar} className={ListRecordingsCSS.completeStar}/>
                        <FontAwesomeIcon icon={faStar} className={ListRecordingsCSS.completeStar}/>
                        <FontAwesomeIcon icon={faStar} className={ListRecordingsCSS.incompleteStar}/>
                      </div>
            </li>
            </div>
        ))}
      </div>

      {/* Button to go back */}
      <button className={ListRecordingsCSS.backbutton} onClick={handleGoBack}>
        Back
      </button>
    </div>
  );
};

export default ListRecordings;
