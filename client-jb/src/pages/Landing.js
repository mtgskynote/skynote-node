import React from 'react';
import { useNavigate } from 'react-router-dom';

import logo from '../assets/images/new_logo_2023.jpg';
import cimg1 from '../assets/images/CREDIT_accio.jpg';
import cimg2 from '../assets/images/Logo_Tecniospring_INDUSTRY_transparent.png';
import cimg3 from '../assets/images/EU_emblem_and_funding_declaration_EN.PNG';
import pub2_img from '../assets/images/publications/pub2_img.png';
import pub3_img from '../assets/images/publications/pub3_img.jpeg';
import Skynote_Full_Demos_Video from '../assets/videos/Skynote_Full_Demos_Video_sm.mp4';

const Landing = () => {
  const navigate = useNavigate();

  const handleNavigation = (url) => {
    // Check if the URL starts with 'http://' or 'https://'
    // to determine if it's an external website
    if (url.startsWith('http://') || url.startsWith('https://')) {
      // Open the external website in a new tab/window
      window.open(url, '_blank');
    } else {
      // Navigate to a route within your application
      navigate(url);
    }
  };

  return (
    <div>
      {/* Header */}
      <header className="flex items-center justify-between h-22 bg-white">
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-20 ml-0 md:ml-4" />
        </div>
        <nav className="flex items-center justify-end text-sm   sm:text-base lg:text-xl  mr-2  sm:mr-3 space-x-3 sm:space-x-6 md:space-x-8 ">
          <a href="#" className="text-gray-500 hover:text-gray-700">
            HOME
          </a>
          <div className="bg-gray-400 text-white px-1 py-4  hidden sm:block"></div>
          <a href="/research" className="text-gray-500 hover:text-gray-700">
            RESEARCH
          </a>
          <div className="bg-gray-400 text-white px-1 py-4   hidden sm:block "></div>
          <a href="#" className="text-gray-500 hover:text-gray-700">
            CONTACT
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="bg-[url('hero-image.png')] bg-cover bg-center h-full flex items-center justify-center">
        <div className="bg-blue-500 bg-opacity-80 p-8 text-white">
          <h1 className="mt-6 text-6xl font-bold mb-4">Try Skynote Today</h1>
          <div className="grid  grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="mb-4 text-2xl">
                The intelligent music learning app based on real-time sound and
                motion analysis, backed by the latest artificial intelligence
                technology.
              </p>
              <div className="col-span-1 flex justify-center items-center">
                <button
                  className="text-2xl bg-white text-blue-500 font-bold py-3 px-6 rounded-full hover:bg-blue-500 hover:text-blue-900"
                  onClick={() => handleNavigation('/register')}
                >
                  Login now
                </button>
              </div>
            </div>
            <div>
              <iframe
                src={Skynote_Full_Demos_Video}
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-64"
                autoPlay
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* Research Section */}
      <div className="bg-blue-900 py-16 pb-64">
        <h1 className="text-center text-6xl font-bold text-white mb-8">
          Research
        </h1>
        <div className="max-w-4xl mx-auto">
          <p className="text-2xl text-white mb-8 ml-12 mr-12">
            Skynote has been developed as a product of cutting edge research
            focused on music synthesis and analysis. Our systems and processes
            were designed by fulltime musicians, who on their spare time
            conduct PhD research at UPF and Royal College of Music.
          </p>
          <div className="col-span-1 flex justify-center items-center">
            <button
              className="text-2xl bg-white text-blue-500 font-bold py-3 px-6 rounded-full hover:bg-blue-500 hover:text-blue-900"
              onClick={() => handleNavigation('/research')}
            >
              Learn More
            </button>
          </div>

          <div className="relative mt-4 flex justify-center">
            <img
              src={pub2_img}
              alt="Research"
              className="w-64 absolute  right-20"
            />
            <img
              src={pub3_img}
              alt="Research"
              className="w-64 absolute top-16 right-25"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white mx-1 my-1 ">
        <div className="flex justify-between">
          <img
            src={cimg1}
            alt="Footer"
            className="mx-4 w-1/4 h-auto object-contain"
          />
          <img
            src={cimg2}
            alt="Footer"
            className="mx-4 w-1/4 h-auto object-contain"
          />
          <img
            src={cimg3}
            alt="Footer"
            className="mx-4 w-1/4 h-auto object-contain"
          />
        </div>
      </footer>
    </div>
  );
};

export default Landing;
