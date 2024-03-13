import React, { useEffect, useState } from "react";
import {useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {deleteRecording } from "../utils/studentRecordingMethods.js";
import StatsRecentCSS from './StatsRecentRecordings.module.css'

import {
    faStar,
    faEye,
    faTrash,
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
    const [data, setData] = useState(null);
    const navigate = useNavigate();

    

    // Event handler for click on See
  const handleSeeClick = (nameOfFile, number)=> {
    const id = recordingIds[recordingNames.indexOf(nameOfFile)];
    const score = recordingScoresXML[recordingNames.indexOf(nameOfFile)];
    //Pass recording ID to ProgressPlayfileVisual
    navigate(`/ListRecordings/${score}`, {state:{'id':id}})
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
    const auxData = data.filter((item, index) => index !== recordingNames.indexOf(nameOfFile));
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
        setData(auxData)
        //send notice to parent component to remove this recording from their arrays and to charge new recent recording
        props.reloadRecordingsCallBack(idToDelete)
        //window.location.reload();
    }).catch((error) => {
      console.log(`Cannot delete recordings from database: ${error}`)
    })
  }
};
// Your button group component
const ButtonGroup = ({ nameOfFile, index }) => {
  return (
    <div className={ListRecordingsCSS.buttonGroup}>
      <button className={StatsRecentCSS.iconbutton} onClick={() => handleSeeClick(nameOfFile, index)}>
        <FontAwesomeIcon icon={faEye} />
      </button>
      <button className={StatsRecentCSS.iconbutton} onClick={() => handleTrashClick(nameOfFile, index)}>
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>
  );
};

  useEffect(() => {
    const recentRecordings = props.recentRecordings;

    if (recentRecordings !== null) {
      setRecordingNames((recentRecordings.names).reverse())
      setRecordingIds((recentRecordings.ids).reverse())
      setRecordingStars((recentRecordings.stars).reverse())
      setRecordingScoresTitles((recentRecordings.scoresTitles).reverse())
      setRecordingScoresIds((recentRecordings.scoresIds).reverse())
      setRecordingScoresXML((recentRecordings.scoresXML).reverse())
      setRecordingSkills((recentRecordings.skills).reverse())
      setRecordingLevels((recentRecordings.levels).reverse())
      setRecordingDates((recentRecordings.dates).reverse())

      const options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      //setRecordingDates(recentRecordings.dates)
      setRecordingDates((recentRecordings.dates).map((date) => {
        //Set correct date format
        const newDate = new Date(date);
        return newDate.toLocaleDateString("es-ES", options);
      }))



      // Combine them into the desired format (array of arrays)
      const data = [];

      for (let i = 0; i < recentRecordings.ids.length; i++) {
        const row = [];
        row.push(recentRecordings.names[i] || ''); 
        row.push(recentRecordings.scoresTitles[i] || ''); 
        row.push(recentRecordings.skills[i] || '');
        row.push(recentRecordings.levels[i] || '');
        row.push(new Date(recentRecordings.dates[i]).toLocaleDateString("es-ES", options) || '');
        row.push(recentRecordings.stars[i] || '');
        data.push(row);
      }
      setData(data)
    }
  }, [props]);

  
  return (
    <div className={StatsRecentCSS.container}>
      <h4 className={StatsRecentCSS.title}>
        Your latest recordings
      </h4>
      <div className={StatsRecentCSS.tableBox}> 
        {data!==null?
          <table className={StatsRecentCSS.dynamicTable}>
            <thead>
              <tr>
                <th>Recording</th>
                <th>Score</th>
                <th>Skill</th>
                <th>Level</th>
                <th>Date</th>
                <th>Stars</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="tableBody">
            {data.map((rowData, rowIndex) => (
                <tr key={rowIndex}>
                  {rowData.map((cellData, cellIndex) => (
                    <td key={cellIndex}>
                      {cellIndex === 5 ? ( // Assuming the stars column is at index 5
                        Array.from({ length: cellData }, (_, index) => (
                          <FontAwesomeIcon
                            key={index}
                            icon={faStar}
                            className={ListRecordingsCSS.completeStar}
                          />
                        ))
                      ) : (
                        cellData
                      )}
                    </td>
                  ))}
                  
                  <td>
                    <ButtonGroup nameOfFile={rowData[0]} index={rowIndex} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          : <div>No recordings to show</div>}
      </div>
    </div>
  );
};

export default StatsRecentRecordings;