import React, { useState, useEffect } from 'react';
import LevelCard from '../components/LevelCard';
import { useAppContext } from '../context/appContext';
import { getUserFavourites } from '../utils/usersMethods.js';
import { getAllRecData } from '../utils/studentRecordingMethods.js';
import LoadingScreen from '../components/LoadingScreen.js';
import InDevelopment from '../components/InDevelopment.js';

const Lessons = () => {
  const [lessonList, setLessonList] = useState({});
  const [localScoreData, setLocalScoreData] = useState(null);
  const [userData, setUserData] = useState(null);
  const { getCurrentUser } = useAppContext();
  const [recordingList, setRecordingList] = useState(null);
  const [favourites, setFavourites] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('All Lessons');
  const [isLoading, setIsLoading] = useState(true);
  const [filteredLessons, setFilteredLessons] = useState({});
  const [openSubLevel, setOpenSubLevel] = useState(null);
  const [subLevelCounts, setSubLevelCounts] = useState({});

  const filters = [
    'All Lessons',
    'Least Recorded',
    'Almost Perfect!',
    'My Favourites',
    'Imported Scores',
  ];

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('scoreData'));
    setLocalScoreData(data);
    if (data === null) {
      console.log('No scores data found in local storage');
      return;
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUserData(currentUser);
        const recordings = await getAllRecData(currentUser.id);
        setRecordingList(recordings);
        const favs = await getUserFavourites(currentUser.id);
        setFavourites(favs);
      } catch (error) {
        console.log('Error fetching data: ', error);
      }
    };

    if (!userData || !recordingList || !favourites) {
      fetchData();
    }
  }, [getCurrentUser, userData, recordingList, favourites]);

  useEffect(() => {
    if (localScoreData && recordingList && favourites) {
      const lessonData = localScoreData.reduce((result, item) => {
        const { level, skill, _id, fname, title } = item;

        const levelNameMapping = {
          1: 'Getting Started',
          2: 'Building Your Repertoire',
          3: 'Imported Scores',
        };
        const mappedLevel = levelNameMapping[level] || level;

        result[mappedLevel] = result[mappedLevel] || {};
        result[mappedLevel][skill] = result[mappedLevel][skill] || [];

        const isFavourite = favourites.some(
          (fav) => String(fav.songId) === String(_id)
        );

        const lesson = {
          id: _id,
          name: fname,
          title: title,
          path: `/xmlScores/violin/${fname}.xml`,
          route_path: `/all-lessons/${fname}`,
          skill,
          level: mappedLevel,
          stars: calculateStars(_id),
          recordings: calculateRecordings(_id),
          favourite: isFavourite,
        };

        result[mappedLevel][skill].push(lesson);

        return result;
      }, {});

      setLessonList(lessonData);
      setIsLoading(false);
    }
  }, [localScoreData, recordingList, favourites]);

  useEffect(() => {
    // Apply filters to lesson list based on selected filter
    if (selectedFilter === 'My Favourites') {
      const filtered = {};
      Object.keys(lessonList).forEach((level) => {
        filtered[level] = {};
        Object.keys(lessonList[level]).forEach((skill) => {
          filtered[level][skill] = lessonList[level][skill].filter(
            (lesson) => lesson.favourite
          );
        });
      });
      setFilteredLessons(filtered);
    } else if (selectedFilter === 'Almost Perfect!') {
      const filtered = {};
      Object.keys(lessonList).forEach((level) => {
        filtered[level] = {};
        Object.keys(lessonList[level]).forEach((skill) => {
          filtered[level][skill] = lessonList[level][skill].filter(
            (lesson) => lesson.stars === 2
          );
        });
      });
      setFilteredLessons(filtered);
    } else if (selectedFilter === 'Imported Scores') {
      setFilteredLessons({});
    } else if (selectedFilter === 'Least Recorded') {
      const filtered = {};
      // find maximum recording number
      let maxRecordings = 0;
      Object.keys(lessonList).forEach((level) => {
        Object.keys(lessonList[level]).forEach((skill) => {
          lessonList[level][skill].forEach((lesson) => {
            const recordings = lesson.recordings;
            if (recordings > maxRecordings) {
              maxRecordings = recordings;
            }
          });
        });
      });

      const threshold = Math.floor(maxRecordings * 0.6);

      if (maxRecordings === 0) {
        setFilteredLessons(lessonList);
      } else if (maxRecordings === 1) {
        Object.keys(lessonList).forEach((level) => {
          filtered[level] = {};
          Object.keys(lessonList[level]).forEach((skill) => {
            filtered[level][skill] = lessonList[level][skill].filter(
              (lesson) => lesson.recordings === 0
            );
          });
        });
        setFilteredLessons(filtered);
      } else {
        Object.keys(lessonList).forEach((level) => {
          filtered[level] = {};
          Object.keys(lessonList[level]).forEach((skill) => {
            filtered[level][skill] = lessonList[level][skill].filter(
              (lesson) => lesson.recordings < threshold
            );
          });
        });
        setFilteredLessons(filtered);
      }
    } else {
      //default
      setFilteredLessons(lessonList);
    }
  }, [lessonList, selectedFilter]);

  useEffect(() => {
    // Count sublevels dynamically and calculate base index for each level
    let prevCount = 0;
    const counts = {};
    Object.keys(filteredLessons).forEach((level) => {
      counts[level] = prevCount;
      Object.keys(filteredLessons[level]).forEach((skill) => {
        prevCount += filteredLessons[level][skill].length;
      });
    });
    setSubLevelCounts(counts);
  }, [filteredLessons]);

  const calculateRecordings = (lessonId) => {
    if (!recordingList) return 0;

    const lessonRecordings = recordingList.filter(
      (recording) => recording.scoreID === lessonId
    );

    if (lessonRecordings.length > 0) {
      return lessonRecordings.length;
    } else {
      return 0;
    }
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

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
  };

  const handleSubLevelClick = (subLevelIndex) => {
    if (openSubLevel === subLevelIndex) {
      setOpenSubLevel(null); // Close if the same sublevel is clicked again
    } else {
      setOpenSubLevel(subLevelIndex); // Open the clicked sublevel
    }
  };

  const refreshData = async () => {
    const favs = await getUserFavourites(userData.id);
    setFavourites(favs);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div>
      <div className="mx-auto flex justify-center items-center space-x-4 mb-6 mt-6">
        {filters.map((filter, index) => (
          <span
            key={index}
            className={`cursor-pointer font-normal text-sm ${
              selectedFilter === filter
                ? 'text-blue-500'
                : 'text-black opacity-30 hover:text-black hover:opacity-100'
            }`}
            onClick={() => handleFilterClick(filter)}
          >
            {filter}
          </span>
        ))}
      </div>
      {Object.keys(filteredLessons).length > 0 ? (
        Object.keys(filteredLessons).map((level, levelIndex) => (
          <LevelCard
            key={levelIndex}
            levelNumber={levelIndex + 1}
            levelName={level}
            levelLessons={filteredLessons[level]}
            filter={selectedFilter}
            refreshData={refreshData}
            subLevelIsOpen={openSubLevel !== null}
            handleSubLevelClick={handleSubLevelClick}
            openSubLevel={openSubLevel}
            baseSubLevelIndex={subLevelCounts[level]}
          />
        ))
      ) : (
        <InDevelopment />
      )}
    </div>
  );
};

export default Lessons;
