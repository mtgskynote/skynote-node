import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import {
  Register,
  OurTeam,
  Demos,
  Research,
  Landing,
  ProtectedRoute,
} from './pages';

import { Profile, Stats, SharedLayout } from './pages/dashboard';
import Lessons from './pages/Lessons';
import { useAppContext } from './context/appContext';
import ProgressPlayFile from './components/ProgressPlayFile';
import ProgressPlayFileVisual from './components/ProgressPlayFileVisual';

import ErrorBoundary from './components/ErrorBoundary';

import TimbreVisualization from './components/TimbreVisualization';
import ListRecordings from './components/ListRecordings';
import ListAllRecordings from './components/ListAllRecordings';
import Assignments from './components/Assignments';
import Error from './components/Error';

function App() {
  const { logoutUser } = useAppContext();

  // Logout user whenever JWT token is missing
  useEffect(() => {
    const checkTokenAndLogout = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        logoutUser();
      }
    };

    // Call checkTokenAndLogout on component mount
    checkTokenAndLogout();

    // Event listener for storage changes
    const handleStorageChange = (event) => {
      if (event.key === 'token' && !event.newValue) {
        logoutUser();
      }
    };

    // Add event listener to window object
    window.addEventListener('storage', handleStorageChange);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Logout user whenver the JWT token is about to expire
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          // Token expired
          logoutUser();
        } else {
          // Set a timeout to logout just before token expiration
          const timeout = (decodedToken.exp - currentTime - 60) * 1000; // 60 seconds before expiry
          const logoutTimer = setTimeout(() => {
            logoutUser();
          }, timeout);
          return () => clearTimeout(logoutTimer); // Clean up timer on component unmount
        }
      } catch (error) {
        console.error('Error decoding JWT token:', error);
        logoutUser(); // Handle error by logging out
      }
    }
  }, []);

  return (
    <div>
      <ErrorBoundary>
        <div className="App">
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <SharedLayout />
                  </ProtectedRoute>
                }
              >
                {/* <Route index element={<Stats />} /> */}
                <Route index element={<ListAllRecordings />} />
                <Route path="profile" element={<Profile />} />
                <Route path="lessons" element={<Lessons />} />
                <Route
                  path="all-lessons/:files"
                  element={<ProgressPlayFile />}
                />
                <Route
                  path="/TimbreVisualization"
                  element={<TimbreVisualization />}
                />
                <Route path="/Assignments" element={<Assignments />} />
                <Route path="/ListRecordings" element={<ListRecordings />} />
                <Route
                  path="ListRecordings/:files"
                  element={<ProgressPlayFileVisual mode="visual" />}
                />
                <Route path="all-recordings" element={<ListAllRecordings />} />
              </Route>

              <Route path="/register" element={<Register />} />
              <Route path="/ourteam" element={<OurTeam />} />
              <Route path="/research" element={<Research />} />
              <Route path="/demos" element={<Demos />} />
              <Route path="/landing" element={<Landing />} />
              <Route path="*" element={<Error type={'404'} />} />
            </Routes>
          </BrowserRouter>
        </div>
      </ErrorBoundary>
    </div>
  );
}

export default App;
