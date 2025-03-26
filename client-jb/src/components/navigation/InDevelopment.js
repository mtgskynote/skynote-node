import React from 'react';
import img from '../assets/images/pencil_violin.png';

const InDevelopment = () => {
  return (
    <div className={'relative rounded overflow-hidden w-full'}>
      <div className="flex items-center justify-center">
        <div className="relative flex items-center resizable p-4 bg-white">
          <div className="flex flex-col items-start">
            <h5 className="font-semibold text-5xl text-gray-900 mb-6 ml-20">
              Coming Soon!
            </h5>
            <h5 className="text-base text-gray-600 overflow-hidden ml-20">
              We are constantly developing the SkyNote Platform. &#x1F3B6;
            </h5>
          </div>
          <div className="flex items-center justify-center ml-10">
            <img
              className="max-w-xs sm:max-w-xs mb-8"
              src={img}
              alt="coming soon!"
            />
          </div>
          <div className="handle"></div>
        </div>
      </div>
    </div>
  );
};

export default InDevelopment;
