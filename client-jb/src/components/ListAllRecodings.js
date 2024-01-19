// ListAllRecordings.js
import React, { useState, useEffect } from 'react';
import { json, useLocation, useNavigate } from 'react-router-dom';
import ListAllRecordingsCSS from './ListRecordings.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getRecData, getAllRecData, deleteRecording } from "../utils/studentRecordingMethods.js";
import { useAppContext } from "../context/appContext";

import {
  faTrash,
  faPlay,
  faEye,
  faStar,
  faPencilSquare,
  faBoxArchive,
  faMusic,


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


const ListAllRecordings = () => {

  const { getCurrentUser } = useAppContext();
  const [userData, setUserData] = useState(null);
  const [recordingList, setRecordingList] = useState(null);
  const [recordingNames, setRecordingNames] = useState(null);
  const [recordingStars, setRecordingStars] = useState(null);
  const [recordingScores, setRecordingScores] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();


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
        getAllRecData("645b6e484612a8ebe8525933").then((result) => {
          setRecordingList(JSON.stringify(result));
          setRecordingNames(result.map((recording) => recording.recordingName));
          setRecordingStars(result.map((recording) => recording.recordingStars));
          setRecordingScores(result.map((recording) => recording.scoreID));
        }).catch((error) => {
          console.log(`Cannot get recordings from database: ${error}`)
          // Handle errors if necessary
        })

      }
  };   

    fetchDataFromAPI();
    
  }, [userData, recordingList]);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Event handler for going back
  const handleGoBack = () => {
    // Use navigate to go back to the previous page
    //navigate(-1);
    navigate(`/`);
  };

  // Event handler for click on See
  const handleSeeClick = (nameOfFile, number)=> {
      const id = JSON.parse(recordingList)[recordingNames.indexOf(nameOfFile)].recordingId;
      //Pass recording ID to ProgressPlayfileVisual
      //navigate(score, {state:{'recordingID':id}})
    }


  // Event handler for click on Trash
  const handleTrashClick = (nameOfFile, number) => {
    /*if (recordingNames.indexOf(nameOfFile) !== -1) {
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
    }*/
  };



  if (recordingNames === null) {
    return <p>Loading...</p>;
  }



  // Your component logic using the variables
  return (
    <div className={ListAllRecordingsCSS.container}>
      <div> 
        <h2>All recordings...</h2>
      </div>

      {/* List of songs */}
      <div className={ListAllRecordingsCSS.songlist2}>
        {recordingNames.map((nameOfFile, index) => (
            //Each element/recording
          <div className={ListAllRecordingsCSS.songelement2} key={index}>
          <li key={index}>
              <div className={ListAllRecordingsCSS.recTitle}><h5 >{nameOfFile}</h5></div>
              <div className={ListAllRecordingsCSS.starsGroup}>
                  <FontAwesomeIcon icon={faStar} className={recordingStars[index]>=1 ? ListAllRecordingsCSS.completeStar : ListAllRecordingsCSS.incompleteStar}/>
                  <FontAwesomeIcon icon={faStar} className={recordingStars[index]>=2 ? ListAllRecordingsCSS.completeStar : ListAllRecordingsCSS.incompleteStar}/>
                  <FontAwesomeIcon icon={faStar} className={recordingStars[index]>=3 ? ListAllRecordingsCSS.completeStar : ListAllRecordingsCSS.incompleteStar}/>
              </div>
              <div className={ListAllRecordingsCSS.textGroup}>
                <div><h7>
                  <FontAwesomeIcon icon={faMusic} className={ListAllRecordingsCSS.auxIcon}/>
                  '{recordingScores[index]}
                </h7></div>
                <div><h7 >
                  <FontAwesomeIcon icon={faPencilSquare} className={ListAllRecordingsCSS.auxIcon}/>
                  First finger
                </h7></div>
                <div><h7 >
                  <FontAwesomeIcon icon={faBoxArchive} className={ListAllRecordingsCSS.auxIcon}/>
                  Level 1
                </h7></div>
              </div>
              
              <div className={ListAllRecordingsCSS.dateTime}>
                <i>19/02/2024 - 09:18</i>
              </div>
              <div className={ListAllRecordingsCSS.buttonGroup}>
                <button className={ListAllRecordingsCSS.iconbutton} onClick={() => handleSeeClick(nameOfFile, index)}>
                  <FontAwesomeIcon icon={faEye} />
                </button>
                <button className={ListAllRecordingsCSS.iconbutton} onClick={() => handleTrashClick(nameOfFile, index)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </li>
            </div>
        ))}
      </div>

      {/* Button to go back */}
      <button className={ListAllRecordingsCSS.backbutton} onClick={handleGoBack}>
        Back
      </button>
    </div>
  );
};

export default ListAllRecordings;
