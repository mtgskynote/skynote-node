import React from 'react';
import { useAppContext } from '../context/appContext';

/**
 * The Alert component displays an alert message based on the app context.
 */
const Alert = () => {
  const { alertType, alertText } = useAppContext();

  return <div className={`alert alert-${alertType}`}>{alertText}</div>;
};

export default Alert;
