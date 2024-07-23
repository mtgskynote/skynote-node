/* eslint-disable */
// TODO: Eslint is disabled because this file will be deleted

import React, { useState, useEffect } from 'react';
import PopUpWindowCSS from './PopUpWindow.module.css';
import StatsRecentCSS from './StatsRecentRecordings.module.css';
import { getRecData } from '../utils/studentRecordingMethods.js';
import { updateAssignment } from '../utils/assignmentsMethods.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar,
  faMusic,
  faPencilSquare,
  faBoxArchive,
  faPaperPlane,
  faCheck,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import ListRecordingsCSS from './ListRecordings.module.css';

const PopUpWindowRecordings = (props) => {
  const [userId, setUserId] = useState(null);
  const [scoreId, setScoreId] = useState(null);
  const [announcementId, setAnnouncementId] = useState(null);
  const [scoreData, setScoreData] = useState(null);
  const [data, setData] = useState(null);
  const [recordingNames, setRecordingNames] = useState(null);
  const [recordingIds, setRecordingIds] = useState(null);
  const [recordingStars, setRecordingStars] = useState(null);
  const [recordingDates, setRecordingDates] = useState(null);
  const [checkOption, setCheckOption] = useState(false);
  const [recordingIndexSubmit, setRecordingIndexSubmit] = useState(false);
  // const location = useLocation();

  // Define options for formatting date
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  const fetchDataFromAPI = () => {
    getRecData(userId, scoreId)
      .then((result) => {
        //Store everything
        setRecordingNames(result.map((recording) => recording.recordingName));
        setRecordingIds(result.map((recording) => recording.recordingId));
        setRecordingStars(result.map((recording) => recording.recordingStars));
        setRecordingDates(result.map((recording) => recording.recordingDate));
      })
      .catch((error) => {
        console.log(`Cannot get recordings from database: ${error}`);
        // Handle errors if necessary
      });
  };

  const handleClose = () => {
    props.handlerBack('close');
  };

  const handleSubmitRecording = (option, index) => {
    if (option === 'check') {
      setCheckOption(true);
      setRecordingIndexSubmit(index);
    } else {
      setCheckOption(false);
      setRecordingIndexSubmit(null);
      if (option === 'yes') {
        //console.log("submit recording ", recordingNames[recordingIndexSubmit], " with id ", recordingIds[recordingIndexSubmit], " to assignment with id ", announcementId, " for task of score ", scoreId)
        updateAssignment(
          announcementId,
          userId,
          scoreId,
          recordingIds[recordingIndexSubmit]
        ).then(() => {
          window.location.reload();
        });
      } else {
        //console.log("dont submit")
      }
    }
  };

  //get Scores data
  useEffect(() => {
    if (scoreId !== null) {
      // import local data
      const local = JSON.parse(localStorage.getItem('scoreData'));
      const itemFoundLocalStorage = local.find((item) => item._id === scoreId);
      // save in state
      setScoreData(itemFoundLocalStorage);
    }
  }, [scoreId]);

  //When props are not null, store them
  useEffect(() => {
    if (
      props.userId !== null &&
      props.userId !== undefined &&
      props.scoreId !== null &&
      props.scoreId !== undefined &&
      props.announcementId !== null &&
      props.announcementId !== undefined
    ) {
      setUserId(props.userId);
      setScoreId(props.scoreId);
      setAnnouncementId(props.announcementId);
    }
  }, [props]);

  //when scores data and userId are available, then fetch recordings
  useEffect(() => {
    if (
      userId !== null &&
      userId !== undefined &&
      scoreId !== null &&
      scoreId !== undefined &&
      scoreData !== null &&
      scoreData !== undefined
    ) {
      fetchDataFromAPI(); //get recordings for this user and this score
    }
  }, [userId, scoreId, scoreData]);

  //when all recordings data is loaded
  useEffect(() => {
    if (recordingNames !== null) {
      //organise together to help with next step
      const allEntries = {
        names: recordingNames,
        ids: recordingIds,
        stars: recordingStars,
        dates: recordingDates,
      };

      // Combine them into the desired format (array of arrays)
      const data = [];
      for (let i = 0; i < allEntries.ids.length; i++) {
        const row = [];
        row.push(allEntries.names[i] || '');
        row.push(
          new Date(allEntries.dates[i]).toLocaleDateString('es-ES', options) ||
            ''
        );
        row.push(allEntries.stars[i] || '');
        data.push(row);
      }
      setData(data);
    }
  }, [recordingNames]);

  return (
    <div className={PopUpWindowCSS.popUpWindowRecordings}>
      <h5 className={StatsRecentCSS.title}>Select recording to submit:</h5>
      {scoreData !== null ? (
        <div className={PopUpWindowCSS.iconGroup}>
          <div>
            <FontAwesomeIcon icon={faMusic} className={PopUpWindowCSS.icon} />{' '}
            {scoreData.title}
          </div>
          <div>
            <FontAwesomeIcon
              icon={faPencilSquare}
              className={PopUpWindowCSS.icon}
            />
            {scoreData.skill}
          </div>
          <div>
            <FontAwesomeIcon
              icon={faBoxArchive}
              className={PopUpWindowCSS.icon}
            />{' '}
            Level {scoreData.level}
          </div>
        </div>
      ) : (
        ''
      )}
      <div className={StatsRecentCSS.tableBox}>
        {data !== null ? (
          <table className={StatsRecentCSS.dynamicTable}>
            <thead>
              <tr>
                <th>Recording</th>
                <th>Date</th>
                <th>Stars</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className>
              {data.map((rowData, rowIndex) => (
                <tr key={rowIndex}>
                  {rowData.map((cellData, cellIndex) => (
                    <td key={cellIndex}>
                      {cellIndex === 2 // Assuming the stars column is at index 5
                        ? Array.from({ length: cellData }, (_, index) => (
                            <FontAwesomeIcon
                              key={index}
                              icon={faStar}
                              className={ListRecordingsCSS.completeStar}
                            />
                          ))
                        : cellData}
                    </td>
                  ))}
                  <td>
                    <FontAwesomeIcon
                      icon={faPaperPlane}
                      className={PopUpWindowCSS.icon}
                      onClick={() => handleSubmitRecording('check', rowIndex)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div>No recordings to show</div>
        )}
      </div>
      {!checkOption ? (
        ''
      ) : (
        <div className={PopUpWindowCSS.assurance}>
          Are you sure you want to submit '
          {recordingNames[recordingIndexSubmit]}' to this task?
          <FontAwesomeIcon
            icon={faCheck}
            className={PopUpWindowCSS.yesIcon}
            onClick={() => handleSubmitRecording('yes')}
          />
          <FontAwesomeIcon
            icon={faXmark}
            className={PopUpWindowCSS.noIcon}
            onClick={() => handleSubmitRecording('no')}
          />
        </div>
      )}

      <button
        className={PopUpWindowCSS.buttonCloseGrades}
        onClick={handleClose}
      >
        Close
      </button>
    </div>
  );
};

export default PopUpWindowRecordings;
