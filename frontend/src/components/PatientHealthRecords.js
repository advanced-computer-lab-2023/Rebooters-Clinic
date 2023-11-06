import React, { useState, useEffect } from "react";

function PatientHealthRecords() {
  const [patientUsername, setPatientUsername] = useState("");
  const [patientRecords, setPatientRecords] = useState([]);
  const [error, setError] = useState(null);

  const handleUsernameChange = (e) => {
    setPatientUsername(e.target.value);
  };

  const fetchPatientHealthRecords = async () => {
    try {
      const response = await fetch("/api/patient/health-records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ patientUsername: patientUsername }),
      });

      if (response.ok) {
        const data = await response.json();
        setPatientRecords(data.healthRecords);
        setError(null);
      } else {
        setError("No health records found for the patient");
        setPatientRecords([]);
      }
    } catch (error) {
      setError("An error occurred while fetching patient health records");
      setPatientRecords([]);
    }
  };

  useEffect(() => {
    fetchPatientHealthRecords();
  }, []);

  return (
    <div className="card mt-4">
      <div className="card-body">
        <div className="container">
          <div>
            <h2>Patient Health Records</h2>
            <div>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Patient Username"
                value={patientUsername}
                onChange={handleUsernameChange}
              />
              <button className="btn btn-primary" onClick={fetchPatientHealthRecords}>Submit</button>
            </div>
            {patientRecords.length > 0 &&
              patientRecords.map((record) => (
                <div>
                  <h6>Record Date: {record.date}</h6>
                  <p>
                    <strong>Doctor:</strong> {record.doctor}
                  </p>
                  <p>
                    <strong>diagnosis:</strong> {record.diagnosis}
                  </p>
                  <p>
                    <strong>Treatment:</strong> {record.treatment}
                  </p>
                  <p>
                    <strong>Notes:</strong> {record.notes}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientHealthRecords;
