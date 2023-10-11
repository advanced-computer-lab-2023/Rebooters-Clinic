import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const DoctorApplicationList = () => {
  const [doctorApplications, setDoctorApplications] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDoctorApplications();
  }, []);

  const fetchDoctorApplications = async () => {
    try {
      const response = await fetch("/api/administrator/viewDoctorApplication", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();

      if (response.ok) {
        setDoctorApplications(json);
      } else {
        setError("An error occurred while fetching doctor applications");
      }
    } catch (error) {
      setError("An error occurred while fetching doctor applications");
    }
  };

  return (
    <div className="container">
      <h2>Doctor Applications (Pending):</h2>
      {error && <p className="text-danger">{error}</p>}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Username</th>
            <th>Name</th>
            <th>Email</th>
            <th>Date of Birth</th>
            <th>Hourly Rate</th>
            <th>Affiliation</th>
            <th>Educational Background</th>
          </tr>
        </thead>
        <tbody>
          {doctorApplications.map((application) => (
            <tr key={application._id}>
              <td>{application.username}</td>
              <td>{application.name}</td>
              <td>{application.email}</td>
              <td>{new Date(application.dateOfBirth).toLocaleDateString()}</td>
              <td>${application.hourlyRate.toFixed(2)}</td>
              <td>{application.affiliation}</td>
              <td>{application.educationalBackground}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorApplicationList;
