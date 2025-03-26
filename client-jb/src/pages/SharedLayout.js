import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
// import Footer from '../../components/Footer';

const SharedLayout = () => {
  return (
    <main>
      <Navbar />
      <div className={`pt-16`}>
        <Outlet />
      </div>
      {/* <Footer /> */}
    </main>
  );
};

export default SharedLayout;
