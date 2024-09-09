// ListRecordings.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getRecData } from '../utils/studentRecordingMethods.js';
import { useAppContext } from '../context/appContext';
import LoadingScreen from './LoadingScreen.js';
import RecordingCard from './RecordingCard.js';
import ListRecordingsHeader from './ListRecordingsHeader.js';
import BackButton from './BackButton.js';

const ListRecordings = () => {
  const { getCurrentUser } = useAppContext();
  const [userData, setUserData] = useState(null);
  const [recordingList, setRecordingList] = useState(null);
  const [recordingNames, setRecordingNames] = useState(null);
  const [recordingStars, setRecordingStars] = useState(null);
  const [recordingDates, setRecordingDates] = useState(null);
  const [recordingIds, setRecordingIds] = useState(null);
  const [scoreSkill, setScoreSkill] = useState(null);
  const [scoreLevel, setScoreLevel] = useState(null);
  const [scoreXml, setScoreXml] = useState(null);

  const location = useLocation();

  // Define options for formatting date
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  // Access the passed variables from the location object
  const score = location.state?.score || 'DefaultSong';
  const song = location.state?.song || 'DefaultSong1';

  // Load recordings from userID and scoreID
  useEffect(() => {
    const itemFoundLocalStorage = JSON.parse(
      localStorage.getItem('scoreData')
    ).find((item) => item.fname === score);
    const scoreID = itemFoundLocalStorage._id;
    setScoreLevel(itemFoundLocalStorage.level);
    setScoreSkill(itemFoundLocalStorage.skill);
    setScoreXml(itemFoundLocalStorage.fname);
    const fetchDataFromAPI = () => {
      if (userData === null) {
        getCurrentUser() // fetchData is already an async function
          .then((result) => {
            setUserData(result);
          })
          .catch((error) => {
            console.log(`getCurrentUser() error: ${error}`);
          });
      }
      if (userData !== null) {
        getRecData(userData.id, scoreID)
          .then((result) => {
            setRecordingList(result);
            setRecordingIds(result.map((recording) => recording.recordingId));
            setRecordingNames(
              result.map((recording) => recording.recordingName)
            );
            setRecordingStars(
              result.map((recording) => recording.recordingStars)
            );
            setRecordingDates(
              result.map((recording) => {
                // Set correct date format
                const recordingDate = new Date(recording.recordingDate);
                return recordingDate.toLocaleDateString('en-UK', options);
              })
            );
          })
          .catch((error) => {
            console.log(`Cannot get recordings from database: ${error}`);
          });
      }
    };

    fetchDataFromAPI();
  }, [userData]);

  // Update state variables after deleting recording
  const handleDeleteRecording = (recordingId) => {
    const index = recordingIds.indexOf(recordingId);
    if (index !== -1) {
      const newRecordingNames = recordingNames.filter((_, i) => i !== index);
      const newRecordingList = recordingList.filter((_, i) => i !== index);
      const newRecordingDates = recordingDates.filter((_, i) => i !== index);
      const newRecordingIds = recordingIds.filter((_, i) => i !== index);
      const newRecordingStars = recordingStars.filter((_, i) => i !== index);

      setRecordingNames(newRecordingNames);
      setRecordingList(newRecordingList);
      setRecordingDates(newRecordingDates);
      setRecordingIds(newRecordingIds);
      setRecordingStars(newRecordingStars);
    }
  };

  // Update state variables after editing recording
  const handleEditRecording = (recordingName, newRecordingName) => {
    const index = recordingNames.indexOf(recordingName);
    if (index !== -1) {
      const updatedRecordingNames = [...recordingNames];
      updatedRecordingNames[index] = newRecordingName;
      setRecordingNames(updatedRecordingNames);
    }
  };

  if (recordingNames === null) {
    return <LoadingScreen />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton />
      <ListRecordingsHeader
        title={song}
        skill={scoreSkill}
        level={scoreLevel}
      />
      {recordingNames.length !== 0 ? (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
          {recordingNames.map((recordingName, index) => (
            <div key={index} className="flex justify-center">
              <RecordingCard
                recordingName={recordingName}
                stars={recordingStars[index]}
                recordingId={recordingIds[index]}
                recordingDate={recordingDates[index]}
                xml={scoreXml}
                onDeleteRecording={handleDeleteRecording}
                onEditRecording={handleEditRecording}
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="w-full">No recordings found.</p>
      )}
    </div>
  );
};

export default ListRecordings;
