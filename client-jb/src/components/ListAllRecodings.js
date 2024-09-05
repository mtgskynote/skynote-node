import React, { useState, useEffect } from 'react';
import { getAllRecData } from '../utils/studentRecordingMethods.js';
import { useAppContext } from '../context/appContext';
import RecordingCard from './RecordingCard.js';
import LoadingScreen from './LoadingScreen.js';
import ListRecordingsHeader from './ListRecordingsHeader.js';
import BackButton from './BackButton.js';

const ListAllRecordings = () => {
  const { getCurrentUser } = useAppContext();
  const [userData, setUserData] = useState(null);
  const [localData, setLocalData] = useState(null);
  const [recordingsByScore, setRecordingsByScore] = useState(null);

  // Define options for formatting date
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  // Load recordings from userID and scoreID
  useEffect(() => {
    const local = JSON.parse(localStorage.getItem('scoreData'));
    setLocalData(local);
    const scoreTitles = local.map((item) => item.title);

    const fetchDataFromAPI = () => {
      if (userData === null) {
        getCurrentUser()
          .then((result) => {
            setUserData(result);
          })
          .catch((error) => {
            console.log(`getCurrentUser() error: ${error}`);
          });
      }

      if (
        userData !== null &&
        recordingsByScore === null &&
        scoreTitles !== null
      ) {
        getAllRecData(userData.id)
          .then((result) => {
            const recordings = {};
            result.forEach((recording) => {
              const scoreId = local.find(
                (item) => item._id === recording.scoreID
              );
              if (scoreId) {
                const scoreTitle = scoreId.title;
                if (!(scoreTitle in recordings)) {
                  recordings[scoreTitle] = [];
                }
                recordings[scoreTitle].push(recording);
              }
            });

            const filteredScoreTitles = scoreTitles.filter(
              (title) => title in recordings
            );
            const orderedRecordings = {};
            filteredScoreTitles.forEach((title) => {
              orderedRecordings[title] = recordings[title];
            });
            setRecordingsByScore(orderedRecordings);
          })
          .catch((error) => {
            console.log(`Cannot get recordings from database: ${error}`);
          });
      }
    };

    fetchDataFromAPI();
    // eslint-disable-next-line
  }, [userData, recordingsByScore, getCurrentUser]);

  // Retrieve the score for a specific recording from an object cataloging lists of recordings by score titles
  const findScoreTitleByRecordingName = (recordingsObject, recordingName) => {
    for (let scoreTitle in recordingsObject) {
      let recordings = recordingsObject[scoreTitle];
      for (let recording of recordings) {
        if (recording.recordingName === recordingName) {
          return scoreTitle;
        }
      }
    }
    return null;
  };

  // Handle editing of a recording's name
  const handleEditRecording = (recordingName, newRecordingName) => {
    const scoreTitle = findScoreTitleByRecordingName(
      recordingsByScore,
      recordingName
    );
    const newRecordings = JSON.parse(JSON.stringify(recordingsByScore));

    newRecordings[scoreTitle] = newRecordings[scoreTitle].map((recording) => {
      if (recording.recordingName === recordingName) {
        return {
          ...recording,
          recordingName: newRecordingName,
        };
      }
      return recording;
    });
    setRecordingsByScore(newRecordings);
  };

  // Handle deletion of a recording
  const handleDeleteRecording = (recordingId) => {
    const newRecordings = JSON.parse(JSON.stringify(recordingsByScore));

    for (let scoreTitle in newRecordings) {
      newRecordings[scoreTitle] = newRecordings[scoreTitle].filter(
        (recording) => recording.recordingId !== recordingId
      );
    }

    setRecordingsByScore(newRecordings);
  };

  // Display loading screen while fetching data
  if (recordingsByScore === null) {
    return <LoadingScreen />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton />
      <div className="flex justify-center items-start">
        <h2 className="text-center">All Recordings</h2>
      </div>
      {Object.keys(recordingsByScore).map((scoreTitle, index) => {
        const scoreObject = localData.find((item) => item.title === scoreTitle);
        const recordings = recordingsByScore[scoreTitle];
        return (
          <div key={index}>
            <ListRecordingsHeader
              title={scoreTitle}
              skill={scoreObject.skill}
              level={scoreObject.level}
            />
            <div className="relative overflow-x-auto whitespace-no-wrap no-scrollbar">
              <div className="inline-flex items-start space-x-8 mr-8">
                {recordings.map((recording, index) => {
                  let recordingDate = new Date(recording.recordingDate);
                  recordingDate = recordingDate.toLocaleDateString(
                    'en-UK',
                    options
                  );
                  return (
                    <RecordingCard
                      key={index}
                      recordingName={recording.recordingName}
                      stars={recording.recordingStars}
                      recordingDate={recordingDate}
                      recordingId={recording.recordingId}
                      xml={scoreObject.fname}
                      onEditRecording={handleEditRecording}
                      onDeleteRecording={handleDeleteRecording}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ListAllRecordings;
