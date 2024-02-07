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
  const [localData, setLocalData] = useState(null);
  const [recordingList, setRecordingList] = useState(null);
  const [recordingNames, setRecordingNames] = useState(null);
  const [recordingStars, setRecordingStars] = useState(null);
  const [recordingScores, setRecordingScores] = useState(null);
  const [recordingDates, setRecordingDates] = useState(null);
  const [recordingSkills, setRecordingSkills] = useState(null);
  const [recordingLevels, setRecordingLevels] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();


  // Starting --> load recordings from userID and scoreID
  useEffect(() => {

    const local=JSON.parse(localStorage.getItem("scoreData"))
    setLocalData(local)

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
        getAllRecData(userData.id).then((result) => {
          setRecordingList(JSON.stringify(result));
          // Define options for formatting date
          const options = {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          };
          setRecordingNames(result.map((recording) => recording.recordingName));
          setRecordingStars(result.map((recording) => recording.recordingStars));
          setRecordingDates(result.map((recording) => {
            //Set correct date format
            const recordingDate = new Date(recording.recordingDate);
            return recordingDate.toLocaleDateString("es-ES", options);
          }))
          setRecordingLevels(result.map((recording)=> {
            return local.find(item => item._id === recording.scoreID).level
          }))
          setRecordingSkills(result.map((recording)=> {
            return local.find(item => item._id === recording.scoreID).skill
          }))
          setRecordingScores(result.map((recording)=> {
            return local.find(item => item._id === recording.scoreID).title
          }))
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
  const handleSeeClick = (index)=> {
      const id = JSON.parse(recordingList)[index].recordingId;
      const scoreName=recordingScores[index]
      const scoreXML=localData.find(item => item.title == scoreName).fname
      console.log(id, scoreName, scoreXML, "hola")
      navigate(`/ListRecordings/${scoreXML}`, {state:{'recordingID':id}})
    }


  // Event handler for click on Trash
  const handleTrashClick = (nameOfFile, index) => {
    if (recordingNames.indexOf(nameOfFile) !== -1) {
      const idToDelete = JSON.parse(recordingList)[recordingNames.indexOf(nameOfFile)].recordingId;
      // Delete recording entry of state arrays
      const auxArrayNames = recordingNames.filter((item, index) => index !== recordingNames.indexOf(nameOfFile));
      const auxArrayList = JSON.parse(recordingList).filter((item, index) => index !== recordingNames.indexOf(nameOfFile));
      const auxRecordingStars = recordingStars.filter((item, index) => index !== recordingNames.indexOf(nameOfFile));
      const auxRecordingScores = recordingScores.filter((item, index) => index !== recordingNames.indexOf(nameOfFile));
      const auxRecordingDates = recordingDates.filter((item, index) => index !== recordingNames.indexOf(nameOfFile));
      const auxRecordingSkills = recordingSkills.filter((item, index) => index !== recordingNames.indexOf(nameOfFile));
      const auxRecordingLevels = recordingLevels.filter((item, index) => index !== recordingNames.indexOf(nameOfFile));
      // Delete recording from database
      console.log("Deleting: ", idToDelete);
      deleteRecording(idToDelete).then(() => {
        setRecordingNames(auxArrayNames);
        setRecordingList(auxArrayList);
        setRecordingStars(auxRecordingStars)
        setRecordingScores(auxRecordingScores)
        setRecordingScores(auxRecordingDates)
        setRecordingLevels(auxRecordingLevels)
        setRecordingSkills(auxRecordingSkills)
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
    <div className={ListAllRecordingsCSS.container}>
      <div> 
        <h2>All recordings...</h2>
      </div>

      {/* List of songs */}
      {recordingNames.length!==0?
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
              <div><h6>
                <FontAwesomeIcon icon={faMusic} className={ListAllRecordingsCSS.auxIcon}/>
                {recordingScores[index]}
              </h6></div>
              <div><h6 >
                <FontAwesomeIcon icon={faPencilSquare} className={ListAllRecordingsCSS.auxIcon}/>
                {recordingSkills[index]}
              </h6></div>
              <div><h6 >
                <FontAwesomeIcon icon={faBoxArchive} className={ListAllRecordingsCSS.auxIcon}/>
                Level {recordingLevels[index]}
              </h6></div>
            </div>
            
            <div className={ListAllRecordingsCSS.dateTime}>
              <i>{recordingDates[index]}</i>
            </div>
            <div className={ListAllRecordingsCSS.buttonGroup}>
              <button className={ListAllRecordingsCSS.iconbutton} onClick={() => handleSeeClick(index)}>
                <FontAwesomeIcon icon={faEye} />
              </button>
              <button className={ListAllRecordingsCSS.iconbutton} onClick={() => handleTrashClick(nameOfFile, index)}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </li>
          </div>
      ))}
      </div>:
      <div> No recordings yet</div>
    }
      

      {/* Button to go back */}
      <button className={ListAllRecordingsCSS.backbutton} onClick={handleGoBack}>
        Back
      </button>
    </div>
  );
};

export default ListAllRecordings;
