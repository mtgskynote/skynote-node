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
    const calculateRecordings = (lessonId) => {
      if (!recordingList) return 0;

      const lessonRecordings = recordingList.filter(
        (recording) => recording.scoreID === lessonId
      );

      return lessonRecordings.length;
    };

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

    if (importedScores && recordingList && favourites) {
      const formatted = importedScores.map((score, index) => {
        const title = score.fname.replace(/\.[^/.]+$/, ''); // Remove the file extension
        const skill = score.skill || '';
        const level = score.level || 0;
        const isFavourite = favourites.some(
          (fav) => String(fav.songId) === String(score._id)
        );

        const stars = calculateStars(score._id);

        const formattedScore = {
          id: score._id,
          name: score.fname,
          title: title || `Score ${index + 1}`,
          path: `/api/v1/profile/xmlScores/${userData.id}/${score.fname}`, // Updated path to access file via API
          route_path: `/all-lessons/${score.fname}`,
          skill: skill,
          level: level,
          stars: stars,
          recordings: calculateRecordings(score._id),
          favourite: isFavourite,
        };

        // Log the formatted score for debugging
        console.log('Formatted Score:', formattedScore);

        return formattedScore;
      });

      setFormattedScores(formatted);
      setIsLoading(false);
    }
  }, [importedScores, recordingList, favourites, userData]);

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
          {formattedScores.map((score, index) => (
            <LessonCard
              key={index}
              title={score.title || `Score ${index + 1}`}
              skill={score.skill || ''}
              level={score.level || 0}
              stars={score.stars || 0}
              isFavourite={score.favourite || false}
              xml={score.route_path}
              path={score.path}
              id={score.id}
              width={`${levelCardWidth}px`}
              renderViewRecordings={false}
              refreshData={refreshData}
              recordings={score.recordings}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImportedScores;
