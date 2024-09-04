import React, { useState, useEffect } from 'react';
import { getAllRecData } from '../utils/studentRecordingMethods.js';
import { useAppContext } from '../context/appContext';
import RecordingCard from './RecordingCard.js';
import LoadingScreen from './LoadingScreen.js';

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

  const findScoreTitleByRecordingName = (object, recordingName) => {
    for (let scoreTitle in object) {
      let recordings = object[scoreTitle];
      for (let recording of recordings) {
        if (recording.recordingName === recordingName) {
          return scoreTitle;
        }
      }
    }
    return null;
  };

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

  const handleDeleteRecording = (recordingId) => {
    const newRecordings = JSON.parse(JSON.stringify(recordingsByScore));

    for (let scoreTitle in newRecordings) {
      newRecordings[scoreTitle] = newRecordings[scoreTitle].filter(
        (recording) => recording.recordingId !== recordingId
      );
    }

    setRecordingsByScore(newRecordings);
  };

  if (recordingsByScore === null) {
    return <LoadingScreen />;
  }

  // Your component logic using the variables
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center items-start">
        <h2 className="text-center">All Recordings</h2>
      </div>
      {Object.keys(recordingsByScore).map((scoreTitle, index) => {
        const scoreObject = localData.find((item) => item.title === scoreTitle);
        const recordings = recordingsByScore[scoreTitle];
        return (
          <div key={index}>
            <div>
              <div className="flex items-center justify-between mt-12">
                {/* Left side: Title */}
                <div className="text-2xl font-bold capitalize">
                  {scoreTitle}
                </div>

                {/* Right side: Skill and Level */}
                <div className="text-lg text-gray-600 text-right">
                  <div>{scoreObject.skill}</div>
                  <div>Level {scoreObject.level}</div>
                </div>
              </div>
              <hr className="h-0.5 border-t-0 bg-gray-700 mb-10" />
            </div>
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
