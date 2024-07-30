import React, { useState, useEffect } from 'react';
import XmlFileUploader from './XmlFileUploader';
import LoadingScreen from '../components/LoadingScreen';
import { useAppContext } from '../context/appContext';
import {
  getUserImportedScores,
  getUserFavourites,
} from '../utils/usersMethods';
import { getAllRecData } from '../utils/studentRecordingMethods.js';
import LessonCard from '../components/LessonCard';

const ImportedScores = () => {
  const [importedScores, setImportedScores] = useState([]);
  const [formattedScores, setFormattedScores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [recordingList, setRecordingList] = useState(null);
  const [favourites, setFavourites] = useState(null);
  const { getCurrentUser } = useAppContext();

  const levelCardWidth = 265;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUserData(currentUser);
        const recordings = await getAllRecData(currentUser.id);
        setRecordingList(recordings);
        const favs = await getUserFavourites(currentUser.id);
        setFavourites(favs);
        const imports = await getUserImportedScores(currentUser.id);
        setImportedScores(imports);
      } catch (error) {
        console.log('Error fetching data: ', error);
      }
    };

    if (!userData || !importedScores || !recordingList || !favourites) {
      fetchData();
    }
  }, [getCurrentUser, userData, importedScores, recordingList, favourites]);

  useEffect(() => {
    if (importedScores && recordingList && favourites) {
      const formatted = importedScores.map((score, index) => {
        // Extract additional information from the file path if available
        const fileName = score.filePath.split('/').pop();
        const title = fileName.replace(/\.[^/.]+$/, ''); // Removing the file extension
        const skill = 'skill';
        const isFavourite = favourites.some(
          (fav) => String(fav.songId) === String(score._id)
        );

        const stars = calculateStars(score._id); // Ensure this function is correctly defined and imported

        return {
          ...score,
          title: title || `Score ${index + 1}`,
          skill: skill || '', // If skill data is available, populate it
          level: 0, // Define level for imported scores
          isFavourite: isFavourite,
          stars: stars,
          xml: score.filePath, // Assuming xml path is the file path
        };
      });

      setFormattedScores(formatted);
      setIsLoading(false);
    }
  }, [importedScores, recordingList, favourites]);

  const calculateStars = (lessonId) => {
    if (!recordingList) return 0;

    const lessonRecordings = recordingList.filter(
      (recording) => recording.scoreID === lessonId
    );

    if (lessonRecordings.length > 0) {
      return Math.max(
        ...lessonRecordings.map((recording) => recording.recordingStars)
      );
    } else {
      return 0;
    }
  };

  const refreshData = async () => {
    try {
      if (userData) {
        const imports = await getUserImportedScores(userData.id);
        setImportedScores(imports);
      }
    } catch (error) {
      console.log('Error refreshing imported scores:', error);
    }
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="w-full flex flex-col items-center justify-center mb-10">
      <div className="w-4/5 flex items-center">
        <span className="font-bold text-xl text-black">Imported Scores</span>
        <div className="flex-grow"></div>
      </div>
      <div className="w-4/5 h-px bg-gray-200"></div>
      <div className="w-4/5 flex flex-wrap justify-center mt-4">
        <XmlFileUploader refreshData={refreshData} />
        <div className="w-full mt-4 flex flex-wrap justify-center gap-4">
          {importedScores.map((score, index) => (
            <LessonCard
              key={index}
              title={score.title || `Score ${index + 1}`}
              skill={score.skill || ''}
              level={0}
              stars={0}
              isFavourite={false}
              xml={score.xml}
              id={score._id}
              width={`${levelCardWidth}px`}
              renderViewRecordings={false}
              refreshData={refreshData}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImportedScores;
