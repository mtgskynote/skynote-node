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
//  THIS PART IS FOR REQUESTING INFO FROM THE DATABASE. ATM IT GETS THE USER ID FROM getCurrentUser
//  AND THEN IT REQUESTS THE RECORDINGS FROM THAT USER AND THAT SPECIFIC SONG. WE DON'T HAVE A WAY
//  TO GET THE SONG ID RIGHT NOW, SO WE HAVE A PLACEHOLDER ONE
const dataBaseCall = async () => {
  // ---------------------------------------
  var recdatalist=[];  // list of minimal recording data [{recordingName, recordingId},{...}, ...]

  //getRecData(studentId, scoreId)
  try {
    recdatalist = await getRecData("645b6e484612a8ebe8525933", "64d0de60d9ac9a34a66b4d45") // // scoreId: "64d0de60d9ac9a34a66b4d45" is for the score "V_001_Cuerdas_Al_Aire_1_Suelta_A"
    //console.log(`getRecData return OK, and recdatalist is ${JSON.stringify(recdatalist)}`)
    return (JSON.stringify(recdatalist))
  } catch (error) {
    console.log(`error in getRecData`, error);
  }
};

const ListRecordings = () => {

  const { getCurrentUser } = useAppContext();
  const [userData, setUserData] = useState(null);
  const [recordingList, setRecordingList] = useState(null);
  const [numberOfRecordings, setNumberOfRecordings] = useState(null);

  useEffect(() => {

    const fetchDataFromAPI = () => {
      //console.log(`in fetchDataFromAPI, about to call getCurentUser()`)
      getCurrentUser() // fetchData is already an async function
        .then((result) => {
          //console.log(`getCurentUser() has returnd this result: ${JSON.stringify(result)}`);
          setUserData(result);
        })
        .catch((error) => {
          console.log(`getCurentUser() error: ${error}`)
          // Handle errors if necessary
        });
    };

    fetchDataFromAPI();

    dataBaseCall().then((result) => {
      setRecordingList(result);
    });

    try {
      if (recordingList) {
        const recordingsArray = Object.keys(JSON.parse(recordingList)).map(Number);
        setNumberOfRecordings(recordingsArray);
        console.log("Done Done Done Done Done Done Done Done");
      } else {
        console.log("Loading data...");
      }
      
    } catch(error) {
      console.log("Error parsing recordingList:", error);
    }
  }, [getCurrentUser, recordingList]);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const location = useLocation();
  const navigate = useNavigate();

  // Access the passed variables from the location object
  const score = location.state?.score || 'DefaultSong';
  const song = location.state?.song || 'DefaultSong';
  const typeList = location.state?.typeList || 'DefaultTypeList';

  // Array of numbers (replace with the actual array of recordings later)
  // Use state to manage the recordingNumbers array
  const [recordingNumbers, setRecordingNumbers] = useState([1, 2, 3]);//numberOfRecordings has to replace [1, 2, 3]

  //recordingNumbers SHOULD BE FILLED WITH THE DATA IN recordingList, BUT:
  //recordingList TAKES LONGER TO LOAD, AND THAT WILL RAISE AN ERROR FOR TRYING TO
  //Object.keys AN EMPTY OBJECT. CODE SHOULD WAIT FOR THE DATABASE TO SEND THE INFO
  //AND THEN THE PAGE SHOULD LOAD/WORK AS USUAL.
  
  console.log("Song is: ", song);
  console.log("Good luck, ", userData);
  console.log("You have a total of ", numberOfRecordings, " recordings for this piece :)");
  console.log("Here are your recordings: ", JSON.parse(recordingList));


  // Event handler for going back
  const handleGoBack = () => {
    // Use navigate to go back to the previous page
    navigate(-1);
  };

  // Event handler for click on See
  const handleSeeClick = (score, song, number) => {
    console.log("See recording and score of song ", song, " recording ", number)
    navigate(score);
    //code that opens new page with the score, pitchtrack...
  };

  // Event handler for click on Play
  const handlePlayClick = (score, song, number) => {
    console.log("Play recording and score of song ", song, " recording ", number)

    //code that simply plays the audio of the recording, without having to get into the actual file
  };

  // Event handler for click on Trash
  const handleTrashClick = (sscore, ong, number) => {
    console.log("Delete recording and score of song ", song, " recording ", number)

    //send order to delete song to the database and force a re-render updating some state
    setRecordingNumbers((prevNumbers) => prevNumbers.filter((n) => n !== number)); //state update
  };

  // Your component logic using the variables
  return (
    <div className={ListRecordingsCSS.container}>
      <div> 
        <h2>{song}</h2>
        <p>Your recordings...</p>
      </div>

      {/* List of songs */}
      <div className={ListRecordingsCSS.songlist}>
        {recordingNumbers.map((number) => (
          <div className={ListRecordingsCSS.songelement} key={number}>
          <li key={number}>
              <div>{song} - {number}</div>
              <div>
              <button className={ListRecordingsCSS.iconbutton} onClick={() => handleSeeClick(score, song, number)}>
                <FontAwesomeIcon icon={faEye} />
              </button>
              <button className={ListRecordingsCSS.iconbutton} onClick={() => handlePlayClick(score, song, number)}>
                <FontAwesomeIcon icon={faPlay} />
              </button>
              <button className={ListRecordingsCSS.iconbutton} onClick={() => handleTrashClick(score, song, number)}>
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
