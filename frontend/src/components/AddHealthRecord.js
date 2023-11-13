import React, { useEffect, useState } from "react";
const AddHealthRecord = () => {
  const [patientUsername, setPatientUsername] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [medication, setMedication] = useState("");
  const [dosage, setDosage] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleAddHealthRecord = async () => {
    try {
      const response = await fetch("/api/doctor/addHealthRecord", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          diagnosis,
          patientUsername,
          treatment,
          notes,
          medication,
          dosage,
        }),
      });
      if (response.status === 201) {
        setMessage("Health record added successfully.");
        // Clear the input fields
        setDiagnosis("");
        setTreatment("");
        setNotes("");
      } else {
        setError("Failed to add the health record.");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred while adding the health record.");
    }
  };

  return (
    <div className="container">
      <h2>Add Health Record</h2>
      <label>Patient Username:</label>
      <input
        type="text"
        className="form-control"
        value={patientUsername}
        onChange={(e) => setPatientUsername(e.target.value)}
      />
      <br />
      <label>Diagnosis:</label>
      <input
        type="text"
        className="form-control"
        value={diagnosis}
        onChange={(e) => setDiagnosis(e.target.value)}
      />
      <br />
      <label>Medication:</label>
      <input
        type="text"
        className="form-control"
        value={medication}
        onChange={(e) => setMedication(e.target.value)}
      />
      <br />
      <label>Dosage:</label>
      <input
        type="text"
        className="form-control"
        value={dosage}
        onChange={(e) => setDosage(e.target.value)}
      />
      <br />
      <label>Treatment/Instructions:</label>
      <input
        type="text"
        className="form-control"
        value={treatment}
        onChange={(e) => setTreatment(e.target.value)}
      />
      <br />
      <label>Notes:</label>
      <textarea value={notes} className="form-control" onChange={(e) => setNotes(e.target.value)} />
      <br />
      <div>
        <button  className="btn btn-primary" onClick={handleAddHealthRecord}>Add Health Record</button>
      </div>

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default AddHealthRecord;
