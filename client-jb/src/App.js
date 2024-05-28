import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  Register,
  OurTeam,
  Demos,
  Research,
  Landing,
  Error,
  ProtectedRoute,
} from "./pages";

import { Profile, Stats, SharedLayout } from "./pages/dashboard";

import React from "react";

import AllLessons from "./components/AllLessons";
import ProgressPlayFile from "./components/ProgressPlayFile";
import ProgressPlayFileVisual from "./components/ProgressPlayFileVisual";

import LevelOne from "./components/levels/LevelOne";
import LevelTwo from "./components/levels/LevelTwo";
import LevelThree from "./components/levels/LevelThree";
import ErrorBoundary from "./components/ErrorBoundary";

import TimbreVisualization from "./components/TimbreVisualization";
import ListRecordings from "./components/ListRecordings";
import AudioPlayer from "./components/AudioPlayer";
import ListAllRecordings from "./components/ListAllRecodings";
import Assignments from "./components/Assignments";
import ImportedScores from "./pages/ImportedScores";

import Apitesting from "./components/apitesting";

function App() {
  //  const { startTimer, resetTimer} = useTimer();
  // useEffect(() => {
  //   const handleVisibilityChange = () => {
  //     if (document.hidden) {
  //       // User has navigated away from the tab, or the tab is now in the background
  //       console.log('User has left the app - resetting session timer.');
  //       resetTimer();
  //     } else {
  //       // User has returned to the app
  //       console.log('User has returned to the app - starting session timer.');
  //       startTimer();
  //     }
  //   };
  //   document.addEventListener('visibilitychange', handleVisibilityChange);
  //   return () => {
  //     document.removeEventListener('visibilitychange', handleVisibilityChange);
  //   };
  // }, []);

  // useEffect(() => {
  //   console.log('App loaded or user returned to the app - starting session timer.');
  //   startTimer();
  // }, []);

  // useEffect(() => {
  //   const handleTabClose = (event) => {
  //     // Perform actions like saving the session state
  //     console.log('User is trying to leave the app resetting session timer.');
  //     resetTimer();
  //     // For some browsers, you must return a string that will be shown to the user in a confirmation dialog
  //     event.preventDefault();
  //     event.returnValue = '';
  //   };
  //   window.addEventListener('beforeunload', handleTabClose);
  //   return () => {
  //     window.removeEventListener('beforeunload', handleTabClose);
  //   };
  // }, []);

  //  const { startTimer, resetTimer} = useTimer();
  // useEffect(() => {
  //   const handleVisibilityChange = () => {
  //     if (document.hidden) {
  //       // User has navigated away from the tab, or the tab is now in the background
  //       console.log('User has left the app - resetting session timer.');
  //       resetTimer();
  //     } else {
  //       // User has returned to the app
  //       console.log('User has returned to the app - starting session timer.');
  //       startTimer();
  //     }
  //   };
  //   document.addEventListener('visibilitychange', handleVisibilityChange);
  //   return () => {
  //     document.removeEventListener('visibilitychange', handleVisibilityChange);
  //   };
  // }, []);

  // useEffect(() => {
  //   console.log('App loaded or user returned to the app - starting session timer.');
  //   startTimer();
  // }, []);

  // useEffect(() => {
  //   const handleTabClose = (event) => {
  //     // Perform actions like saving the session state
  //     console.log('User is trying to leave the app resetting session timer.');
  //     resetTimer();
  //     // For some browsers, you must return a string that will be shown to the user in a confirmation dialog
  //     event.preventDefault();
  //     event.returnValue = '';
  //   };
  //   window.addEventListener('beforeunload', handleTabClose);
  //   return () => {
  //     window.removeEventListener('beforeunload', handleTabClose);
  //   };
  // }, []);

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
                <Route index element={<Stats />} />
                <Route path="profile" element={<Profile />} />
                <Route path="apitesting" element={<Apitesting />} />
                <Route path="lessons" element={<AllLessons />} />
                <Route path="imported-scores" element={<ImportedScores />} />
                <Route
                  path="all-lessons/:files"
                  element={<ProgressPlayFile />}
                />
                <Route path="/levels/levelone" element={<LevelOne />} />
                <Route path="/levels/leveltwo" element={<LevelTwo />} />
                <Route path="/levels/levelthree" element={<LevelThree />} />
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
                <Route path="myrecordings" element={<ListAllRecordings />} />
              </Route>

              <Route path="/AudioPlayer" element={<AudioPlayer />} />
              <Route path="/register" element={<Register />} />
              <Route path="/ourteam" element={<OurTeam />} />
              <Route path="/research" element={<Research />} />
              <Route path="/demos" element={<Demos />} />
              <Route path="/landing" element={<Landing />} />
              <Route path="*" element={<Error />} />
            </Routes>
          </BrowserRouter>
        </div>
      </ErrorBoundary>
    </div>
  );
}

export default App;
