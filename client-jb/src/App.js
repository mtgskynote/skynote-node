import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Register, Landing, Error } from "./pages";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <nav>
          <Link to="/">
            <div>dashboard</div>
          </Link>
          <Link to="/register">Register</Link>
          <Link to="/landing">Landing</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
