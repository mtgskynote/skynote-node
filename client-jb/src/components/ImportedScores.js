import React from 'react';
import XmlFileUploader from './XmlFileUploader';
import axios from 'axios';

const ImportedScores = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center mb-10">
      <div className="w-4/5 flex items-center">
        <span className="font-bold text-xl text-black">
          {`Imported Scores`}
        </span>
        <div className="flex-grow"></div>
      </div>
      <div className="w-4/5 h-px bg-gray-200"></div>
      <div className="w-4/5 flex flex-wrap justify-center mt-4">
        <XmlFileUploader />
      </div>
    </div>
  );
};

export default ImportedScores;
