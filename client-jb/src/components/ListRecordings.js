// ListRecordings.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ListRecordings = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Access the passed variables from the location object
  const song = location.state?.song || 'DefaultSong';
  const typeList = location.state?.typeList || 'DefaultTypeList';

  // Event handler for going back
  const handleGoBack = () => {
    // Use navigate to go back to the previous page
    navigate(-1);
  };

  // Your component logic using the variables
  return (
    <div>
      <h2>Song: {song}</h2>
      <p>Type List: {typeList}</p>
      {/* Your component content */}

      {/* Button to go back */}
      <button onClick={handleGoBack}>Go Back</button>
    </div>
  );
};

export default ListRecordings;

