import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import DoctorHome from "./pages/DoctorHome";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctor-home" element={<DoctorHome />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
