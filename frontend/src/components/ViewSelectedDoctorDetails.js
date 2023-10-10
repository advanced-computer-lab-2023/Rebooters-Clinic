
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const ViewSelectedDoctorDetails = () => {
  const [patientName, setPatientName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [error, setError] = useState("");

  const handleViewDetails = async () => {
    try {
      const response = await fetch("/doctorDetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ patientName, doctorName }),
      });

      if (response.ok) {
        const data = await response.json();
        setDoctorDetails(data);
        setError("");
      } else {
        const errorData = await response.json();
        setError(errorData.error);
        setDoctorDetails(null);
      }
    } catch (error) {
      setError("An error occurred while fetching doctor details.");
      setDoctorDetails(null);
    }
  };

  return (
    <div className="container">
      <h2>View Selected Doctor Details:</h2>
      <div className="mb-3">
        <label htmlFor="patientName" className="form-label">
          Patient Name:
        </label>
        <input
          type="text"
          className="form-control"
          id="patientName"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="doctorName" className="form-label">
          Doctor Name:
        </label>
        <input
          type="text"
          className="form-control"
          id="doctorName"
          value={doctorName}
          onChange={(e) => setDoctorName(e.target.value)}
        />
      </div>
      <button className="btn btn-primary" onClick={handleViewDetails}>
        View Doctor Details
      </button>
      {error && <p className="text-danger">{error}</p>}
      {doctorDetails && (
        <div className="mt-3">
          <h3>Doctor Details:</h3>
          <p><strong>Name:</strong> {doctorDetails.name}</p>
          <p><strong>Specialty:</strong> {doctorDetails.specialty}</p>
          <p><strong>Hospital Affiliation:</strong> {doctorDetails.hospitalAffiliation}</p>
          <p><strong>Educational Background:</strong> {doctorDetails.educationalBackground}</p>
        </div>
      )}
    </div>
  );
};

export default ViewSelectedDoctorDetails;
