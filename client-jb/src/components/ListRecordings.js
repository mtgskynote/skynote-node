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


const ListRecordings = () => {

  const { getCurrentUser } = useAppContext();
  const [userData, setUserData] = useState(null);
  const [recordingList, setRecordingList] = useState(null);
  const [recordingNames, setRecordingNames] = useState(null);
  const [recordingStars, setRecordingStars] = useState(null);
  const [recordingDates, setRecordingDates] = useState(null);
  const [scoreSkill, setScoreSkill] = useState(null);
  const [scoreLevel, setScoreLevel] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Access the passed variables from the location object
  const score = location.state?.score || 'DefaultSong';
  const song = location.state?.song || 'DefaultSong1';

  // Starting --> load recordings from userID and scoreID
  useEffect(() => {
    const itemFoundLocalStorage=JSON.parse(localStorage.getItem("scoreData")).find(item => item.fname === score)
    const scoreID=itemFoundLocalStorage._id;
    setScoreLevel(itemFoundLocalStorage.level)
    setScoreSkill(itemFoundLocalStorage.skill)

    const fetchDataFromAPI = () => {
      if(userData===null){
      getCurrentUser() // fetchData is already an async function
        .then((result) => {
          setUserData(result);
        }).catch((error) => {
          console.log(`getCurentUser() error: ${error}`)
          // Handle errors if necessary
        })
      }

      if(userData !== null){
        getRecData(userData.id, scoreID).then((result) => {
          // Define options for formatting date
          const options = {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          };
          setRecordingList(JSON.stringify(result));
          setRecordingNames(result.map((recording) => recording.recordingName));
          setRecordingStars(result.map((recording) => recording.recordingStars));
          setRecordingDates(result.map((recording) => {
            //Set correct date format
            const recordingDate = new Date(recording.recordingDate);
            return recordingDate.toLocaleDateString("es-ES", options);
          }))
        }).catch((error) => {
          console.log(`Cannot get recordings from database: ${error}`)
          // Handle errors if necessary
        })

      }
  };   

    fetchDataFromAPI();

    
    
  }, [userData,recordingList]);

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
      console.log("ID ", id)
      //Pass recording ID to ProgressPlayfileVisual
      navigate(score, {state:{'recordingID':id}})
    }


  // Event handler for click on Trash
  const handleTrashClick = (nameOfFile, number) => {
    /*if (recordingNames.indexOf(nameOfFile) !== -1) {
      const idToDelete = JSON.parse(recordingList)[recordingNames.indexOf(nameOfFile)].recordingId;
      const auxArrayNames = recordingNames.filter((item, index) => index !== recordingNames.indexOf(nameOfFile));
      const auxArrayList = JSON.parse(recordingList).filter((item, index) => index !== recordingNames.indexOf(nameOfFile));
      console.log("holaaaaa", JSON.parse(recordingDates))
      const auxArrayDates = JSON.parse(recordingDates).filter((item, index) => index !== recordingDates.indexOf(nameOfFile));
      console.log("Deleting: ", idToDelete);
      deleteRecording(idToDelete).then(() => {
        setRecordingNames(auxArrayNames);
        setRecordingList(auxArrayList);
        setRecordingDates(auxArrayDates);
        //window.location.reload();
      }).catch((error) => {
        console.log(`Cannot delete recordings from database: ${error}`)
      })
    }*/
    console.log("not deleting, not working")
  };



  if (recordingNames === null) {
    return <p>Loading...</p>;
  }



  // Your component logic using the variables
  return (
    <div className={ListRecordingsCSS.container}>
      <h2>
        <FontAwesomeIcon icon={faMusic} className={ListRecordingsCSS.auxIcon}/>
        {song} 
        <FontAwesomeIcon icon={faMusic} className={ListRecordingsCSS.auxIcon}/>
      </h2> 
      <div className={ListRecordingsCSS.textGroup}>
        <div><h7 >
          <FontAwesomeIcon icon={faPencilSquare} className={ListRecordingsCSS.auxIcon}/>
          {scoreSkill} 
        </h7></div>
        <div><h7 >
          <FontAwesomeIcon icon={faBoxArchive} className={ListRecordingsCSS.auxIcon}/>
          Level {scoreLevel}
        </h7></div>
      </div>

      {/* List of songs */}
      <div className={ListRecordingsCSS.songlist}>
        {recordingNames.map((nameOfFile, index) => (
          <div className={ListRecordingsCSS.songelement} key={index}>
          <li key={index}>
          <div className={ListRecordingsCSS.recTitle}><h5 >{nameOfFile}</h5></div>
              <div className={ListRecordingsCSS.starsGroup}>
                <FontAwesomeIcon icon={faStar} className={recordingStars[index]>=1 ? ListRecordingsCSS.completeStar : ListRecordingsCSS.incompleteStar}/>
                <FontAwesomeIcon icon={faStar} className={recordingStars[index]>=2 ? ListRecordingsCSS.completeStar : ListRecordingsCSS.incompleteStar}/>
                <FontAwesomeIcon icon={faStar} className={recordingStars[index]>=3 ? ListRecordingsCSS.completeStar : ListRecordingsCSS.incompleteStar}/>
              </div>
              <div>
                <button className={ListRecordingsCSS.iconbutton} onClick={() => handleSeeClick(nameOfFile, index)}>
                  <FontAwesomeIcon icon={faEye} />
                </button>
                <button className={ListRecordingsCSS.iconbutton} onClick={() => handleTrashClick(nameOfFile, index)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
              <div className={ListRecordingsCSS.dateTime}>
                <i>{recordingDates[index]}</i>
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
