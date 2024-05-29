import React from 'react';
import EngineeringIcon from '@mui/icons-material/Engineering';

const ErrorComponent = ({ message }) => {
  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <div className="flex items-center">
        <div className="flex flex-col items-start">
          <h5 className="font-semibold normal-case text-8xl text-gray-900 text-normal">
            Oops!
          </h5>
          <h5 className="font-semibold normal-case text-xl text-gray-600 text-normal">
            {message}
          </h5>
        </div>
        <div className="flex items-center justify-center ml-10">
          <EngineeringIcon className="text-blue-500 text-[200px]"/>
        </div>
      </div>
    </div>
  );
};

export default ErrorComponent;
