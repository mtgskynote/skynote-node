import React from 'react';
import img from "../assets/images/pencil_violin.png";

const InDevelopment = () => {
  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <div className="flex items-center">
        <div className="flex flex-col items-start">
          <h5 className="font-semibold normal-case text-7xl text-gray-900 text-normal mb-6">
            Coming Soon!
          </h5>
          <h5 className="normal-case text-l text-gray-600 text-normal">
            We are constantly developing the SkyNote Platform. &#x1F3B6;
          </h5>
        </div>
        <div className="flex items-center justify-center ml-10">
            <img className="max-w-lg mb-8" src={img} alt="coming soon!" />
        </div>
      </div>
    </div>
  );
};

export default InDevelopment;
