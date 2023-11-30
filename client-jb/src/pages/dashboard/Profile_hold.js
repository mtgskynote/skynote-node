import React, { useState, useEffect } from 'react';
import { useAppContext } from "../../context/appContext";

/*
The useEffect hook runs once when the component mounts ([] as a dependency means it runs only once).
Inside useEffect, an asynchronous operation (fetching data in this case) is performed.
While the data is being fetched, the component displays a loading message (<p>Loading...</p>).
Once the data is fetched successfully, the state data is updated, and the loading state is set to false.

This might be overkill for grabbing the user's email, but it's a good pattern to follow for more complex data fetching from the server.
*/

const Profile = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const { getCurrentUser } = useAppContext();
  console.log("Hi " + getCurrentUser() + "!");  // Here is prints out Promise 

  useEffect(() => {
    const fetchDataFromAPI = () => {
      getCurrentUser() // fetchData is already an async function
        .then((result) => {
          setData(result);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          // Handle errors if necessary
        });
    };

    fetchDataFromAPI();
  }, []);

  /*------------ Return the component! ----------*/
  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : data ? (
        <div  align="center">
           <h1 >Profile Page</h1>
           <pre>Hello, your email is: {JSON.stringify(data.user.email, null, 2)}</pre>
        </div>
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
};

export default Profile;
