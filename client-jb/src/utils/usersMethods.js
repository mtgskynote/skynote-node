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
  getRecordingsPastWeek,
};
