import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DoctorMyPatients from "../components/DoctorMyPatients";
import SearchForPatient from "../components/SearchForPatient";
//import DoctorPatients from "../components/DoctorPatients";
import DoctorUpdateProfile from "../components/DoctorUpdateProfile";
import DoctorMyAppointments from "../components/DoctorMyAppointments";
import DoctorWallet from "../components/DoctorWallet";
import ChangePassword from "../components/ChangePassword";
import "bootstrap/dist/css/bootstrap.min.css";
import Contract from "../components/Contract";
import ScheduleFollowup from "../components/ScheduleFollowup";
import AddHealthRecord from "../components/AddHealthRecord";
import TimeSlots from "../components/TimeSlots";

const DoctorHome = () => {
  const [doctorData, setDoctorData] = useState(null);
  const [contractStatus, setContractStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserType = async () => {
      try {
        const response = await fetch("/doctor-home");
        if (response.status === 401 || response.status === 403) {
          navigate("/", { state: { errorMessage: "Access Denied" } });
        }
      } catch (error) {
        console.error(error);
      }
    };

    checkUserType();
  }, []);
  const viewProfile = async () => {
    try {
      const response = await fetch("/api/doctor/doctor-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const json = await response.json();
        json.dateOfBirth = new Date(json.dateOfBirth).toLocaleDateString();
        setDoctorData(json);
      } else {
        setDoctorData("");
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/doctor/logout", {
        method: "GET",
      });

      if (response.ok) {
        navigate("/");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  useEffect(() => {
    viewProfile();
  }, []);
  return (
    <div className="container">
      <button onClick={handleLogout} className="btn btn-danger mt-2">
        Logout
      </button>
      <div className="card mt-4">
        <div className="card-body">
          <h2 className="card-title">Your Profile:</h2>
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
          ) : null}
        </div>
      </div>
      {doctorData && !doctorData.acceptedContract ? (
        <div className="card mt-4">
          <Contract />
        </div>
      ) : (
        <>
          <div className="card mt-4">
            <DoctorUpdateProfile />
          </div>
          <div className="card mt-4">
            <ChangePassword userType="doctor" />
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
          <div className="card mt-4">
            <DoctorWallet />
          </div>
          <div className="card mt-4">
            <ScheduleFollowup />
          </div>
          <div className="card mt-4">
            <AddHealthRecord />
          </div>
          <div className="card mt-4">
            <TimeSlots />
          </div>
        </>
      )}
    </div>
  );
};

export default DoctorHome;
