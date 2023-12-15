import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import DoctorHome from "./pages/DoctorHome";
import PatientHome from "./pages/PatientHome";  
import Admin from "./pages/Admin";
import Guest from "./pages/Guest";
import Login from "./pages/Login";
import OTP from "./pages/OTP";
import ForgotPassword from "./pages/ForgotPassword";
import AboutUs from "./pages/AboutUs";
import ContactPage from "./pages/ContactPage";
import HomePage from "./pages/HomePage";
import RegPatient from "./pages/RegPatient";
import ReqDoc from "./pages/ReqDoc";
import Service from "./pages/service";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        {/* <Navbar /> */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/guest" element={<Guest />} />
          <Route path="/doctor-home" element={<DoctorHome />} />
          <Route path="/patient-home" element={<PatientHome />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/otp" element={<OTP />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/Register" element={<RegPatient />} />
          <Route path="/RequestDoc" element={<ReqDoc />} />
          <Route path="/service" element={<Service />} />


        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
