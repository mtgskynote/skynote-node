import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import img_404 from '../assets/images/not-found.svg';
import img_general from '../assets/images/error_violin.png';

/**
 * The Error component is a functional React component that displays an error message.
 * It supports two types of errors: '404' and 'general'.
 *
 * - If the type is '404', it displays a "Page Not Found" message with an image.
 * - If the type is 'general', it displays a general error message with a different image.
 *
 * Props:
 * - type (string): The type of error to display. Defaults to 'general'.
 * - message (string): The error message to display for general errors. Defaults to an empty string.
 */
const Error = ({ type = 'general', message = '' }) => {
  if (type === '404') {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <img className="w-2/3 max-w-md mb-8" src={img_404} alt="not found" />
        <h3 className="text-8xl font-semibold text-gray-900 mb-4 normal-case">
          Oops!
        </h3>
        <h3 className="text-xl font-semibold text-gray-600 mb-4 normal-case">
          Page Not Found
        </h3>
        <p className="text-lg text-gray-600 mb-8 normal-case">
          We can&apos;t seem to find the page you are looking for.
        </p>
        <Link to="/" className="text-blue-500 underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <div className="flex items-center">
        <div className="flex flex-col items-start">
          <h5 className="font-semibold normal-case text-8xl text-gray-900 text-normal mb-6">
            Oops!
          </h5>
          <h5 className="normal-case text-xl text-gray-600 text-normal">
            {message}
          </h5>
        </div>
        <div className="flex items-center justify-center ml-10">
          <img className="max-w-lg mb-8" src={img_general} alt="oops!" />
        </div>
      </div>
    </div>
  );
};

Error.propTypes = {
  type: PropTypes.string,
  message: PropTypes.string,
};

export default Error;
