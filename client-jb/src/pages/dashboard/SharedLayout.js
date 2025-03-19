import React from 'react';
import { Outlet } from 'react-router-dom';
import SharedLayoutCSS from './SharedLayout.module.css';
import Navbar from '../../components/Navbar';
// import Footer from '../../components/Footer';

const SharedLayout = () => {
  return (
    <main className={SharedLayoutCSS.dashboard}>
      <Navbar />
      <div className={`${SharedLayoutCSS.dashboardPage} pt-16`}>
        <Outlet />
      </div>
      {/* <Footer /> */}
    </main>
  );
};

export default SharedLayout;
