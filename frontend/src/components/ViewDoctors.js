import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const ViewDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState("");
  const [patientUsername, setPatientUsername] = useState(""); // Add patientUsername state

  const fetchDoctors = async () => {
    try {
      const response = await fetch("/api/patient/viewDoctors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ patientUsername }),
      });
      const json = await response.json();

      if (response.ok) {
        setDoctors(json);
      } else {
        setError("An error occurred while fetching doctors");
      }
    } catch (error) {
      setError("An error occurred while fetching doctors");
    }
  };

  return (
    <div className="container">
      <h2>Available Doctors:</h2>
      <div>
        <label>Patient Username:</label>
        <input
          type="text"
          value={patientUsername}
          onChange={(e) => setPatientUsername(e.target.value)}
        />
        <button className="btn btn-primary" onClick={fetchDoctors}>
          Submit
        </button>
      </div>
      {error && <p className="text-danger">{error}</p>}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Speciality</th>
            <th>Session Price</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor) => (
            <tr key={doctor._id}>
              <td>{doctor._id}</td>
              <td>{doctor.name}</td>
              <td>{doctor.speciality}</td>
              <td>${doctor.sessionPrice.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewDoctors;
