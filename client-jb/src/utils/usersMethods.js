import axios from 'axios';

async function getProfileData(userId) {
  try {
    const response = await axios.get('/api/v1/auth/getProfileData', {
      params: { userId: userId },
    });

    if (response.status === 200) {
      return response.data; // save results locally
    } else {
      console.log('getProfileData response.status is not 200!');
      return [];
    }
  } catch (error) {
    console.error('Error on axios getProfileData', error);
  }
}

async function getUserFavourites(userId) {
  try {
    const response = await axios.get('/api/v1/auth/getProfileData', {
      params: {
        userId: userId,
      },
    });
    if (response.status === 200) {
      return response.data.user.favourites;
    } else {
      console.log('getUserFavourites response.status is not 200!');
      return [];
    }
  } catch (error) {
    console.error('Error on axios getUserFavourites', error);
  }
}

async function getUserImportedScores(userId) {
  try {
    const response = await axios.get('/api/v1/auth/getProfileData', {
      params: {
        userId: userId,
      },
    });
    if (response.status === 200) {
      return response.data.user.importedScores;
    } else {
      console.log('getUserImportedScores response.status is not 200!');
      return [];
    }
  } catch (error) {
    console.error('Error on axios getUserImportedScores', error);
  }
}

const loadImportedFileToLocalStorage = async (userId, scoreEntry) => {
  try {
    // Fetch the user's profile data
    const response = await axios.get('/api/v1/auth/getProfileData', {
      params: { userId: userId },
    });

    if (response.status === 200) {
      const importedScores = await getUserImportedScores(userId);

      const matchingScore = importedScores.find(
        (score) => score.fname === scoreEntry.fname
      );

      if (matchingScore) {
        // Check if the file is already in local storage
        if (!localStorage.getItem(matchingScore.fname)) {
          // Get the XML string
          const xmlString = matchingScore.fileData;
          // Store the XML string in local storage
          localStorage.setItem(matchingScore.fname, xmlString);
          console.log(
            `File "${matchingScore.fname}" added to localStorage as XML.`
          );
        } else {
          console.log(
            `File "${matchingScore.fname}" already exists in localStorage.`
          );
        }
      } else {
        console.error('No matching score found for the given fileName.');
      }
    }
  } catch (error) {
    console.error('Error loading imported file to localStorage:', error);
  }
};

const deleteImportedFileFromLocalStorage = (fileName) => {
  try {
    if (localStorage.getItem(fileName)) {
      localStorage.removeItem(fileName);
      console.log(`File "${fileName}" removed from localStorage.`);
    } else {
      console.log(`File "${fileName}" does not exist in localStorage.`);
    }
  } catch (error) {
    console.error('Error deleting imported file from localStorage:', error);
  }
};

const addImportedScore = async (userId, formData, setUploadProgress) => {
  const response = await axios.post(
    `/api/v1/profile/uploadXML/${userId}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress(progress);
      },
    }
  );
  return response;
};

const deleteImportedScore = async (userId, scoreId) => {
  try {
    const response = await axios.delete(
      `/api/v1/profile/removeXMLFile/${userId}/${scoreId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting score:', error);
    throw new Error('Failed to delete score');
  }
};

// Updates local storage by adding a new score to scoreData
const updateScoreDataInLocalStorage = (uploadedScore) => {
  const storedScoreData = JSON.parse(localStorage.getItem('scoreData')) || [];

  const newScoreEntry = {
    _id: uploadedScore._id,
    fname: uploadedScore.fname,
    level: 0,
    skill: uploadedScore.skill,
    title: uploadedScore.scoreTitle,
  };

  storedScoreData.push(newScoreEntry);
  localStorage.setItem('scoreData', JSON.stringify(storedScoreData));
};

// Remove a score from scoreData in local storage
const removeScoreFromScoreDataInLocalStorage = (scoreId) => {
  const storedScoreData = JSON.parse(localStorage.getItem('scoreData')) || [];

  const updatedScoreData = storedScoreData.filter(
    (score) => score._id !== scoreId
  );

  localStorage.setItem('scoreData', JSON.stringify(updatedScoreData));
};

const editImportedScoreTitleInLocalStorageScoreData = (
  scoreId,
  newName,
  newSkill
) => {
  const storedScoreData = JSON.parse(localStorage.getItem('scoreData')) || [];
  const scoreIndex = storedScoreData.findIndex(
    (score) => score._id === scoreId
  );

  // If the score is found, update its name and skill
  if (scoreIndex !== -1) {
    if (newName !== undefined || newName !== '') {
      storedScoreData[scoreIndex].title = newName;
    }
    if (newSkill !== undefined || newSkill !== '') {
      storedScoreData[scoreIndex].skill = newSkill;
    }
  } else {
    console.error(`Score with ID ${scoreId} not found`);
    return;
  }

  localStorage.setItem('scoreData', JSON.stringify(storedScoreData));
};

const editImportedScoreInDataBase = async (scoreId, updates) => {
  try {
    const response = await axios.put(
      `/api/v1/profile/updateXMLFile/${scoreId}`,
      updates, // Pass updates object, which can include title, skill, or both
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );

    if (response.status === 200) {
      console.log('Score updated successfully in the database');
    } else {
      console.error('Failed to update score in the database');
    }
  } catch (error) {
    console.error('Error updating score in the database:', error);
    throw new Error('Failed to update score in the database');
  }
};

const getRecordingsPastWeek = async (userId) => {
  try {
    const response = await axios.get('/api/v1/auth/getProfileData', {
      params: {
        userId: userId,
      },
    });
    if (response.status === 200) {
      return response.data.user.recordingsPastWeek;
    } else {
      console.log('getProfileData response.status is not 200!');
      return [];
    }
  } catch (error) {
    console.error('Error on axios getUserFavourites', error);
  }
};

const updateRecordingsPastWeek = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    await axios.post(`/api/v1/profile/recordingsPastWeek/${userId}`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Error on updateRecordingsPastWeek', error);
    throw error;
  }
};

export {
  getProfileData,
  getUserFavourites,
  updateRecordingsPastWeek,
  getUserImportedScores,
  loadImportedFileToLocalStorage,
  deleteImportedFileFromLocalStorage,
  addImportedScore,
  deleteImportedScore,
  editImportedScoreInDataBase,
  editImportedScoreTitleInLocalStorageScoreData,
  removeScoreFromScoreDataInLocalStorage as removeScoreFromLocalStorageScoreData,
  updateScoreDataInLocalStorage as addImportToLocalStorageScoreData,
  getRecordingsPastWeek,
};
