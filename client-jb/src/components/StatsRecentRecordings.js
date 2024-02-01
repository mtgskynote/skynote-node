import React, { useEffect, useState } from "react";
import {useNavigate } from 'react-router-dom';
import percentagesStarsStatsCSS from './StatsPercentagesStars.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {deleteRecording } from "../utils/studentRecordingMethods.js";

import {
    faStar,
    faEye,
    faTrash,
    faMusic,
    faPencilSquare,
    faBoxArchive,
} from "@fortawesome/free-solid-svg-icons";
import ListRecordingsCSS from './ListRecordings.module.css';


const StatsRecentRecordings = (props) => {
    const [recordingNames, setRecordingNames] = useState(null);
    const [recordingIds, setRecordingIds] = useState(null);
    const [recordingStars, setRecordingStars] = useState(null);
    const [recordingScoresTitles, setRecordingScoresTitles] = useState(null);
    const [recordingScoresIds, setRecordingScoresIds] = useState(null);
    const [recordingScoresXML, setRecordingScoresXML] = useState(null);
    const [recordingDates, setRecordingDates] = useState(null);
    const [recordingSkills, setRecordingSkills] = useState(null);
    const [recordingLevels, setRecordingLevels] = useState(null);
    const navigate = useNavigate();

    // Event handler for click on See
  const handleSeeClick = (nameOfFile, number)=> {
    console.log("here ", recordingIds[recordingNames.indexOf(nameOfFile)])
    const id = recordingIds[recordingNames.indexOf(nameOfFile)];
    const score = recordingScoresXML[recordingNames.indexOf(nameOfFile)];
    console.log("ID ", id, "score ", score)
    //Pass recording ID to ProgressPlayfileVisual
    navigate(`/ListRecordings/${score}`, {state:{'recordingID':id}})
  }



// Event handler for click on Trash
const handleTrashClick = (nameOfFile, number) => {
  if (recordingNames.indexOf(nameOfFile) !== -1) {
    const idToDelete= recordingIds[recordingNames.indexOf(nameOfFile)];
    //delete from all arrays
    const auxArrayNames = recordingNames.filter((item, index) => index !== recordingNames.indexOf(nameOfFile));
    const auxArrayIds = recordingIds.filter((item, index) => index !== recordingNames.indexOf(nameOfFile));
    const auxArrayStars = recordingStars.filter((item, index) => index !== recordingNames.indexOf(nameOfFile));
    const auxArrayScoresTitles = recordingScoresTitles.filter((item, index) => index !== recordingNames.indexOf(nameOfFile));
    const auxArrayScoresIds = recordingScoresIds.filter((item, index) => index !== recordingNames.indexOf(nameOfFile));
    const auxArrayScoresXML = recordingScoresXML.filter((item, index) => index !== recordingNames.indexOf(nameOfFile));
    const auxArraySkills = recordingSkills.filter((item, index) => index !== recordingNames.indexOf(nameOfFile));
    const auxArrayLevels = recordingLevels.filter((item, index) => index !== recordingNames.indexOf(nameOfFile));
    const auxArrayDates = recordingDates.filter((item, index) => index !== recordingNames.indexOf(nameOfFile));
    //delete from database
    deleteRecording(idToDelete).then(() => {
        setRecordingNames(auxArrayNames)
        setRecordingIds(auxArrayIds)
        setRecordingStars(auxArrayStars)
        setRecordingScoresTitles(auxArrayScoresTitles)
        setRecordingScoresIds(auxArrayScoresIds)
        setRecordingScoresXML(auxArrayScoresXML)
        setRecordingSkills(auxArraySkills)
        setRecordingLevels(auxArrayLevels)
        setRecordingDates(auxArrayDates)
      //window.location.reload();
    }).catch((error) => {
      console.log(`Cannot delete recordings from database: ${error}`)
    })
  }
};

  useEffect(() => {
    const recentRecordings = props.recentRecordings;

    if (recentRecordings !== null) {
      setRecordingNames(recentRecordings.names)
      setRecordingIds(recentRecordings.ids)
      setRecordingStars(recentRecordings.stars)
      setRecordingScoresTitles(recentRecordings.scoresTitles)
      setRecordingScoresIds(recentRecordings.scoresIds)
      setRecordingScoresXML(recentRecordings.scoresXML)
      setRecordingSkills(recentRecordings.skills)
      setRecordingLevels(recentRecordings.levels)
      setRecordingDates(recentRecordings.dates)

      const options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };
      setRecordingDates(recentRecordings.dates)
      setRecordingDates(recentRecordings.dates.map((date) => {
        //Set correct date format
        const newDate = new Date(date);
        return newDate.toLocaleDateString("es-ES", options);
      }))

    }
  }, [props]);

  
  return (
    <div className={percentagesStarsStatsCSS.container}>
      <h4>
        Your latest recordings
      </h4>
      {/* List of songs */}
      {recordingNames!==null?
      <div className={ListRecordingsCSS.songlist2}>
      {recordingNames.map((nameOfFile, index) => (
          //Each element/recording
        <div className={ListRecordingsCSS.songelement2} key={index}>
        <li key={index}>
            <div className={ListRecordingsCSS.recTitle}><h5 >{nameOfFile}</h5></div>
            <div className={ListRecordingsCSS.starsGroup}>
                <FontAwesomeIcon icon={faStar} className={recordingStars[index]>=1 ? ListRecordingsCSS.completeStar : ListRecordingsCSS.incompleteStar}/>
                <FontAwesomeIcon icon={faStar} className={recordingStars[index]>=2 ? ListRecordingsCSS.completeStar : ListRecordingsCSS.incompleteStar}/>
                <FontAwesomeIcon icon={faStar} className={recordingStars[index]>=3 ? ListRecordingsCSS.completeStar : ListRecordingsCSS.incompleteStar}/>
            </div>
            <div className={ListRecordingsCSS.textGroup}>
              <div><h6>
                <FontAwesomeIcon icon={faMusic} className={ListRecordingsCSS.auxIcon}/>
                {recordingScoresTitles[index]}
              </h6></div>
              <div><h6 >
                <FontAwesomeIcon icon={faPencilSquare} className={ListRecordingsCSS.auxIcon}/>
                {recordingSkills[index]}
              </h6></div>
              <div><h6 >
                <FontAwesomeIcon icon={faBoxArchive} className={ListRecordingsCSS.auxIcon}/>
                Level {recordingLevels[index]}
              </h6></div>
            </div>
            
            <div className={ListRecordingsCSS.dateTime}>
              <i>{recordingDates[index]}</i>
            </div>
            <div className={ListRecordingsCSS.buttonGroup}>
              <button className={ListRecordingsCSS.iconbutton} onClick={() => handleSeeClick(nameOfFile, index)}>
                <FontAwesomeIcon icon={faEye} />
              </button>
              <button className={ListRecordingsCSS.iconbutton} onClick={() => handleTrashClick(nameOfFile, index)}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </li>
          </div>
      ))}
      </div>:
      <div> No recordings yet</div>
    }
    </div>
  );
};

export default StatsRecentRecordings;