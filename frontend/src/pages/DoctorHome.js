import { useEffect, useState } from "react";
import DoctorMyPatients from "../components/DoctorMyPatients";
import SearchForPatient from "../components/SearchForPatient";
import DoctorPatients from "../components/DoctorPatients";
import DoctorUpdateProfile from "../components/DoctorUpdateProfile";
import DoctorMyAppointments from "../components/DoctorMyAppointments";
import "bootstrap/dist/css/bootstrap.min.css";

const DoctorHome = () => {
  const [doctorData, setDoctorData] = useState(null);
  useEffect(() => {
    const viewProfile = async () => {
      const response = await fetch("/api/doctor/doctor-profile");
      const json = await response.json();
      if (response.ok) {
        json.dateOfBirth = new Date(json.dateOfBirth).toLocaleDateString();
        setDoctorData(json);
      }
    };
    viewProfile();
  }, []);
  return (
    <div className="container">
      <div className="card mt-4">
        <div className="card-body">
          <h2 className="card-title">Doctor Profile:</h2>
          {doctorData ? (
            <>
              <p>ID: {doctorData._id}</p>
              <p>Username: {doctorData.username}</p>
              <p>Name: {doctorData.name}</p>
              <p>Email: {doctorData.email}</p>
              <p>Date of Birth: {doctorData.dateOfBirth}</p>
              <p>Hourly Rate: {doctorData.hourlyRate}</p>
              <p>Speciality: {doctorData.speciality}</p>
              <p>Affiliation: {doctorData.affiliation}</p>
              <p>Educational Background: {doctorData.educationalBackground}</p>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
      <div className="card mt-4"> 
        <DoctorUpdateProfile />
      </div>
      <div className="card mt-4"> 
        <DoctorMyAppointments />
      </div>
      <div className="card mt-4">
        <DoctorMyPatients />
      </div>
      <div className="card mt-4"> 
        <SearchForPatient />
      </div>

    </div>
  );
};

export default DoctorHome;
