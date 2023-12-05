// ListRecordings.js
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ListRecordingsCSS from './ListRecordings.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faTrash,
  faPlay,
  faEye,
} from "@fortawesome/free-solid-svg-icons";

const ListRecordings = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Access the passed variables from the location object
  const song = location.state?.song || 'DefaultSong';
  const typeList = location.state?.typeList || 'DefaultTypeList';

  // Array of numbers (replace with the actual array of recordings later)
  // Use state to manage the recordingNumbers array
  const [recordingNumbers, setRecordingNumbers] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
  console.log(song)


  // Event handler for going back
  const handleGoBack = () => {
    // Use navigate to go back to the previous page
    navigate(-1);
  };

  // Event handler for click on See
  const handleSeeClick = (song, number) => {
    console.log("See recording and score of song ", song, " recording ", number)
    navigate("../AudioPlayer");
    //code that opens new page with the score, pitchtrack...
  };

  // Event handler for click on Play
  const handlePlayClick = (song, number) => {
    console.log("Play recording and score of song ", song, " recording ", number)

    //code that simply plays the audio of the recording, without having to get into the actual file
  };

  // Event handler for click on Trash
  const handleTrashClick = (song, number) => {
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
              <button className={ListRecordingsCSS.iconbutton} onClick={() => handleSeeClick(song, number)}>
                <FontAwesomeIcon icon={faEye} />
              </button>
              <button className={ListRecordingsCSS.iconbutton} onClick={() => handlePlayClick(song, number)}>
                <FontAwesomeIcon icon={faPlay} />
              </button>
              <button className={ListRecordingsCSS.iconbutton} onClick={() => handleTrashClick(song, number)}>
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
