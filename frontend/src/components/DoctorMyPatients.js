import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const DoctorMyPatients = () => {
  const [patientsData, setPatientsData] = useState([]);

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


  return (
    <div>
      <h2>List of My Patients:</h2>
      {patientsData.length > 0 ? (
        <table className="table table-bordered">
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

    </div>
  );
};

export default DoctorMyPatients;
