import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import DoctorHome from "./pages/DoctorHome";
import PatientHome from "./pages/PatientHome";  
import Prescription from "./components/Prescription";
import nextPage from "./pages/nextPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctor-home" element={<DoctorHome />} />
          <Route path="/patient-home" element={<PatientHome />} />
          <Route path="/nextPage" element={<nextPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
