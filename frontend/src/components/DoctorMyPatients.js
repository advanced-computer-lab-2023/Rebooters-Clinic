import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const DoctorMyPatients = () => {
  const [patientsData, setPatientsData] = useState([]);
  const [error, setError] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedPatientProfile, setSelectedPatientProfile] = useState(null);

  useEffect(() => {
    const viewPatients = async () => {
      const response = await fetch("/api/doctor/doctor-mypatients");
      const json = await response.json();
      if (response.ok) {
        setPatientsData(json);
      }
    };
    viewPatients();
  }, []);

  const handleRowClick = async (patient) => {
    try {
      const response = await fetch("/api/doctor/doctor-patients-username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ patientUsername: patient.username }),
      });
      const json = await response.json();
      if (response.ok && json.length > 0) {
        setSelectedPatient(patient);
        setSelectedPatientProfile(json[0]);
      } else {
        setError("An error occurred while fetching patient profile");
      }
    } catch (error) {
      setError("An error occurred while fetching patient profile");
    }
  };

  
  const handleCloseCard = () => {
    setSelectedPatient(null);
    setSelectedPatientProfile(null);
  };
  return (
    <div>
      <h2>List of My Patients:</h2>
      {patientsData.length > 0 ? (
        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Name</th>
              <th>Email</th>
              <th>Date of Birth</th>
              <th>Gender</th>
              <th>Mobile Number</th>
              <th>Emergency Contact</th>
            </tr>
          </thead>
          <tbody>
            {patientsData.map((patient) => (
              <tr
                key={patient._id}
                onClick={() => handleRowClick(patient)}
                style={{ cursor: "pointer" }}
              >
                <td>{patient._id}</td>
                <td>{patient.username}</td>
                <td>{patient.name}</td>
                <td>{patient.email}</td>
                <td>{new Date(patient.dateOfBirth).toLocaleDateString()}</td>
                <td>{patient.gender}</td>
                <td>{patient.mobile_number}</td>
                <td>{patient.emergency_contact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading...</p>
      )}
            {selectedPatientProfile && (
        <div className="card mt-3">
          <div className="card-body">
            <h5 className="card-title">Patient Profile</h5>
            <p className="card-text">
              <strong>Username:</strong> {selectedPatientProfile.username}
              <br />
              <strong>Name:</strong> {selectedPatientProfile.name}
              <br />
              <strong>National ID:</strong> {selectedPatientProfile.national_id}
              <br />
              <strong>Email:</strong> {selectedPatientProfile.email}
              <br />
              <strong>Date of Birth:</strong>{" "}
              {selectedPatientProfile.dateOfBirth}
              <br />
              <strong>Gender:</strong> {selectedPatientProfile.gender}
              <br />
              <strong>Mobile Number:</strong>{" "}
              {selectedPatientProfile.mobile_number}
              <br />
              <strong>Emergency Contact:</strong>{" "}
              {selectedPatientProfile.emergency_contact}
              <hr></hr>
              <h5>Patient Health Record:</h5>
              <hr></hr>
              <h5>Patient Prescriptions:</h5>
            </p>
            <button className="btn btn-primary" onClick={handleCloseCard}>
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default DoctorMyPatients;
