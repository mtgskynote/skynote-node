import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Register, Landing, Error, ProtectedRoute } from "./pages";

import {
  AllJobs,
  AddJob,
  Profile,
  Stats,
  SharedLayout,
} from "./pages/dashboard";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        {/* <nav>
          <Link to="/">
            <div>dashboard div</div>
          </Link>
          <Link to="/register">Register</Link>
          <Link to="/landing">Landing</Link>
        </nav> */}

        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <SharedLayout />
              </ProtectedRoute>
            }
          >
            <Route path="stats" element={<Stats />} />
            <Route path="all-jobs" element={<AllJobs />} />
            <Route path="add-job" element={<AddJob />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          {/* <Route path="all-jobs" element={<AllJobs />} />
            <Route path="add-job" element={<AddJob />} />
            <Route path="profile" element={<Profile />} /> */}
          <Route path="/register" element={<Register />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
