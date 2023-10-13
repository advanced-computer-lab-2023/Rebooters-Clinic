import { useEffect, useState } from "react";
import DoctorMyPatients from "../components/DoctorMyPatients";
import SearchForPatient from "../components/SearchForPatient";
//import DoctorPatients from "../components/DoctorPatients";
import DoctorUpdateProfile from "../components/DoctorUpdateProfile";
import DoctorMyAppointments from "../components/DoctorMyAppointments";
import "bootstrap/dist/css/bootstrap.min.css";

const DoctorHome = () => {
  const [doctorData, setDoctorData] = useState(null);
  const [doctorUsername, setDoctorUsername] = useState("");
  const [isProfileView, setIsProfileView] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [message, setMessage] = useState("");

  const viewProfile = async () => {
    if (doctorUsername) {
      try {
        const response = await fetch("/api/doctor/doctor-profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ doctorUsername: doctorUsername }),
        });

        if (response.ok) {
          setSubmissionStatus("");
          setMessage("");
          const json = await response.json();
          json.dateOfBirth = new Date(json.dateOfBirth).toLocaleDateString();
          setDoctorData(json);
          setIsProfileView(true);
        } else {
          setSubmissionStatus("error");
          setMessage("Doctor doesnt exist");
          setDoctorData("");
          setIsProfileView(false);
          return;
        }
      } catch (error) {
        setSubmissionStatus("error");
        setMessage("Error viewing doctor");
        setIsProfileView(false);
        console.error(error);
      }
    } else {
      setSubmissionStatus("error");
      setMessage("Please fill required field.");
    }
  };

  const handleDoctorUsernameChange = (event) => {
    setDoctorUsername(event.target.value);
  };
  const handleProfileSubmit = () => {
    viewProfile();
  };
  return (
    <div className="container">
      <div className="card mt-4">
        <div className="card-body">
          <h2 className="card-title">View Doctor Profile & Full Dashboard:</h2>
          {submissionStatus === "success" && (
            <div className="alert alert-success">{message}</div>
          )}
          {submissionStatus === "error" && (
            <div className="alert alert-danger">{message}</div>
          )}
          <input
            type="text"
            placeholder="Enter Doctor Username To View Profile"
            className="form-control"
            value={doctorUsername}
            onChange={handleDoctorUsernameChange}
          />
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleProfileSubmit}
          >
            Submit
          </button>
          {isProfileView && doctorData ? (
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
      {isProfileView && doctorData && (
        <>
          <div className="card mt-4">
            <DoctorUpdateProfile />
          </div>
          <div className="card mt-4">
            <DoctorMyAppointments doctorUsername={doctorUsername}  />
          </div>
          <div className="card mt-4">
            <DoctorMyPatients doctorUsername={doctorUsername} />
          </div>
          <div className="card mt-4">
            <SearchForPatient />
          </div>
        </>
      )}
    </div>
  );
};

export default DoctorHome;
