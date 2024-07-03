import axios from "axios";

async function getProfileData(userId) {
    try {
        const response = await axios.get('/api/v1/auth/getProfileData', {params: { userId: userId}});

        if (response.status===200) {
            return response.data; // save results locally
        } else {
            console.log('getProfileData response.status is not 200!')
            return [];
        }
    } catch (error) {
        console.error('Error on axios getProfileData', error);
    }
}

async function getUserFavourites(userId) {
    try {
        const response = await axios.get("/api/v1/auth/getProfileData", {
            params: {
                userId: userId,
            }
        });
        if (response.status === 200) {
            return response.data.user.favourites
        } else {
            console.log('getProfileData response.status is not 200!')
            return [];
        }
    } catch (error) {
        console.error('Error on axios getUserFavourites', error);
    }
}

export { getProfileData, getUserFavourites };