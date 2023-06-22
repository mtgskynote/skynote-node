import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Register, Landing, Error, ProtectedRoute } from "./pages";

import {
  AllLessons,
  AddLesson,
  Profile,
  Stats,
  SharedLayout,
} from "./pages/dashboard";

import Progress from "./components/Progress";
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
                  // <ProtectedRoute>
                  <SharedLayout />
                  // </ProtectedRoute>
                }
              >
                <Route index element={<Stats />} />
                <Route path="all-lessons" element={<AllLessons />} />
                <Route path="add-lesson" element={<AddLesson />} />
                <Route path="profile" element={<Profile />} />
                <Route path="/progress" element={<Progress />} />
                <Route path="/progress/:file" element={<ProgressPlayFile />} />
                <Route path="/levels/levelone" element={<LevelOne />} />
                <Route path="/levels/leveltwo" element={<LevelTwo />} />
                <Route path="/levels/levelthree" element={<LevelThree />} />
                <Route
                  path="/TimbreVisualization"
                  element={<TimbreVisualization />}
                />
              </Route>
              {/* <Route path="/progress" element={<Progress />} />
              <Route path="/progress/:file" element={<ProgressPlayFile />} />
              <Route path="/levels/levelone" element={<LevelOne />} />
              <Route path="/levels/leveltwo" element={<LevelTwo />} />
              <Route path="/levels/levelthree" element={<LevelThree />} /> */}

              <Route path="/register" element={<Register />} />
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
