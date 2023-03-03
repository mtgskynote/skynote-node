import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Register, Landing, Error } from "./pages";
import {
  AllJobs,
  Profile,
  SharedLayout,
  Stats,
  AddJob,
} from "./pages/dashboard";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <nav>
          <Link to="/">dashboard</Link>
          <Link to="/register">Register</Link>
          <Link to="/landing">Landing</Link>
        </nav>

        <Routes>
          <Route path="/">
            <Route path="stats" element={<Stats />} />
            <Route path="all-jobs" element={<AllJobs />}></Route>
            <Route path="add-job" element={<AddJob />}></Route>
            <Route path="profile" element={<Profile />}></Route>
          </Route>
          <Route path="/register" element={<Register />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
