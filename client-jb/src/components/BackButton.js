import React from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonNoOutline from './ButtonNoOutline';

/**
 * The BackButton component renders a button that navigates the user back to the previous page.
 */
const BackButton = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <ButtonNoOutline
      handler={handleGoBack}
      text="Go Back"
      bgColor="blue-400"
      hoverBgColor="blue-500"
      textColor="white"
    />
  );
};

export default BackButton;
