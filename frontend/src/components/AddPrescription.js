import React, { useState } from "react";

const AddPrescription = ({patient}) => {
  const [patientUsername, setPatientUsername] = useState(patient);
  const [medicationInfo, setMedicationInfo] = useState([
    { medicine: "", dosage: "", instructions: "" },
  ]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleAddMedication = () => {
    setMedicationInfo((prevMedicationInfo) => [
      ...prevMedicationInfo,
      { medicine: "", dosage: "", instructions: "" },
    ]);
  };

  const handleRemoveMedication = (index) => {
    setMedicationInfo((prevMedicationInfo) =>
      prevMedicationInfo.filter((_, i) => i !== index)
    );
  };

  const handleMedicationChange = (index, key, value) => {
    setMedicationInfo((prevMedicationInfo) =>
      prevMedicationInfo.map((medication, i) =>
        i === index ? { ...medication, [key]: value } : medication
      )
    );
  };

  const handleAddPrescription = async () => {
    try {
      const response = await fetch("/api/doctor/addPrescription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientUsername,
          medicationInfo,
        }),
      });

      if (response.status === 201) {
        setMessage("Prescription added successfully.");
        setError("");
        // Clear the input fields
        setPatientUsername("");
        setMedicationInfo([{ medicine: "", dosage: "", instructions: "" }]);
      } else {
        setMessage("");
        const data = await response.json();
        setError(data.error);
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred while adding the prescription.");
    }
  };

  return (
    <div className="container">
      <h2>Add Prescription</h2>
      <label>Patient Username:</label>
      <input
        type="text"
        className="form-control"
        value={patientUsername}
        onChange={(e) => setPatientUsername(e.target.value)}
      />
      <br />

      {medicationInfo.map((medication, index) => (
        <div key={index}>
          <label>Medication:</label>
          <input
            type="text"
            className="form-control"
            value={medication.medicine}
            onChange={(e) =>
              handleMedicationChange(index, "medicine", e.target.value)
            }
          />
          <br />
          <label>Dosage:</label>
          <input
            type="text"
            className="form-control"
            value={medication.dosage}
            onChange={(e) =>
              handleMedicationChange(index, "dosage", e.target.value)
            }
          />
          <br />
          <label>Instructions:</label>
          <input
            type="text"
            className="form-control"
            value={medication.instructions}
            onChange={(e) =>
              handleMedicationChange(index, "instructions", e.target.value)
            }
          />
          <br />

          {index > 0 && (
            <button className="btn btn-danger" onClick={() => handleRemoveMedication(index)}>
              Remove Medication
            </button>
          )}

          <hr />
        </div>
      ))}
    <div>
      <button className="btn btn-info" onClick={handleAddMedication}>Add More Medication</button>
      </div>
      <br/>
      <div>
        <button className="btn btn-primary" onClick={handleAddPrescription}>
          Add Prescription
        </button>
      </div>

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default AddPrescription;
