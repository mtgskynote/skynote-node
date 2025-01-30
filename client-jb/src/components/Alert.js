import React from 'react';
import { useAppContext } from '../context/appContext';

/**
 * Alert component to display alert messages.
 * It uses the context to get the alert type and text.
 * @component
 * @example
 * // Example usage:
 * // <Alert />
 */
const Alert = () => {
  const { alertType, alertText } = useAppContext();

  return <div className={`alert alert-${alertType}`}>{alertText}</div>;
};

export default Alert;
