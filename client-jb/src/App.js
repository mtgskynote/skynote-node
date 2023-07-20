import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Register, OurTeam, Demos, Research, Landing, Error, ProtectedRoute } from "./pages";

import { Profile, Stats, SharedLayout } from "./pages/dashboard";

import AllLessons from "./components/AllLessons";
import ProgressPlayFile from "./components/ProgressPlayFile";

import LevelOne from "./components/levels/LevelOne";
import LevelTwo from "./components/levels/LevelTwo";
import LevelThree from "./components/levels/LevelThree";
import ErrorBoundary from "./components/ErrorBoundary";

import TimbreVisualization from "./components/TimbreVisualization";

function App() {
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
                <Route path="all-lessons" element={<AllLessons />} />
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
              </Route>

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
