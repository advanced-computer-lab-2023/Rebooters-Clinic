import React, { useState } from "react";

const PrescriptionCard = ({ prescription, patientUsername }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [prescriptionData, setPrescriptionData] = useState(prescription);
  const [index, setIndex] = useState(0);
  const [editedMedicationInfo, setEditedMedicationInfo] = useState({});
  const [addedMedicationInfo, setAddedMedicationInfo] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleEditClick = (medicineIndex) => {
    setIsEditing(true);  
    setEditedMedicationInfo(prescriptionData.medicationInfo[medicineIndex]);
    setIndex(medicineIndex);  
  };

  const handleAddClick = () => {
    setIsAdding(true);
    setAddedMedicationInfo({});
  };

  const handleAddMedicineClick = async () => {
    try {
      const response = await fetch("/api/doctor/addToPrescription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientUsername: patientUsername,
          prescriptionID: prescriptionData._id,
          medicine: {
            medicine: addedMedicationInfo.medicine,
            dosage: addedMedicationInfo.dosage,
            instructions: addedMedicationInfo.instructions,
          },
        }),
      });

      const json = await response.json();

      if (response.ok) {
        setMessage("Medicine added successfully");
        setError("");
        setIsAdding(false);
        setPrescriptionData(json.prescription);
      } else {
        setMessage("");
        setError(json.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveClick = async () => {
    try {
      const response = await fetch("/api/doctor/editPrescription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientUsername: patientUsername,
          prescriptionID: prescriptionData._id,
          medicineIndex: index,
          dosage: editedMedicationInfo.dosage,
          instructions : editedMedicationInfo.instructions
        }),
      });
      const json = await response.json();
      if (response.ok) {
        setMessage(json.message);
        setError("");
        setIsEditing(false);
        setPrescriptionData(json.prescription);
      } else {
        setMessage("");
        setError(json.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveClick = async (prescriptionID, medicineIndex) => {
    try {
      const response = await fetch("/api/doctor/removeFromPrescription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientUsername: patientUsername,
          prescriptionID: prescriptionID,
          medicineIndex: medicineIndex,
        }),
      });
      const json = await response.json();
      if (response.ok) {
        setMessage(json.message);
        setError("");
        setPrescriptionData(json.prescription);
      } else {
        setMessage("");
        setError(json.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setIsAdding(false);
  };

  const handleMedicationChange = (key, value) => {
    if (isEditing) {
      setEditedMedicationInfo((prevMedicationInfo) => ({
        ...prevMedicationInfo,
        [key]: value,
      }));
    } else if (isAdding) {
      setAddedMedicationInfo((prevAddedMedicationInfo) => ({
        ...prevAddedMedicationInfo,
        [key]: value,
      }));
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        {message && <p className="text-success">{message}</p>}
        {error && <p className="text-danger">{error}</p>}
        {isEditing ? (
          <>
            <div>
                <h4>Edit Medicine Dosage & Instructions</h4>
              <label>Medication: {editedMedicationInfo.medicine}</label>
              <br />
              <label >Dosage:</label>
              <input
                type="text"
                className="form-control"
                value={editedMedicationInfo.dosage}
                onChange={(e) =>
                  handleMedicationChange("dosage", e.target.value)
                }
              />
              <label>Instructions:</label>
              <input
                type="text"
                className="form-control"
                value={editedMedicationInfo.instructions}
                onChange={(e) =>
                  handleMedicationChange("instructions", e.target.value)
                }
              />
              <br />
            </div>

            <button className="btn btn-success" onClick={handleSaveClick}>
              Save
            </button>
            <button className="btn btn-secondary" onClick={handleCancelClick}>
              Cancel
            </button>
          </>
        ) : isAdding ? (
          <>
            <label>Medication: </label>
            <input
              type="text"
              className="form-control"
              value={addedMedicationInfo.medicine}
              onChange={(e) =>
                handleMedicationChange(0, "medicine", e.target.value)
              }
            />
            <br />
            <label style={{ marginLeft: "20px" }}>Dosage:</label>
            <input
              type="text"
              className="form-control"
              value={addedMedicationInfo.dosage}
              onChange={(e) =>
                handleMedicationChange(0, "dosage", e.target.value)
              }
            />
            <br />
            <label style={{ marginLeft: "20px" }}>Instructions:</label>
            <input
              type="text"
              className="form-control"
              value={addedMedicationInfo.instructions}
              onChange={(e) =>
                handleMedicationChange(0, "instructions", e.target.value)
              }
            />
            <br />
            <button
              className="btn btn-success"
              onClick={handleAddMedicineClick}
            >
              Add Medicine
            </button>
            <button className="btn btn-secondary" onClick={handleCancelClick}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <h5 className="card-title">
              Prescription date:{" "}
              {new Date(prescriptionData.date).toLocaleDateString()}{" "}
              {new Date(prescriptionData.date).toLocaleTimeString()}
            </h5>
            {prescriptionData.medicationInfo.map((medication, index) => (
              <div key={index}>
                <p>
                  <strong>{index + 1}. Medication:</strong>{" "}
                  {medication.medicine}
                </p>
                <p style={{ marginLeft: "20px" }}>
                  <strong>Dosage:</strong> {medication.dosage}
                </p>
                <p style={{ marginLeft: "20px" }}>
                  <strong>Instructions:</strong> {medication.instructions}
                </p>
                <button
                  className="btn btn-danger"
                  onClick={() => handleRemoveClick(prescriptionData._id, index)}
                >
                  Remove Medicine
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => handleEditClick(index)}
                >
                  Edit
                </button>
                <br/>
                <br/>
              </div>
            ))}
            <br />
            <button className="btn btn-primary" onClick={handleAddClick}>
              Add Medicine
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PrescriptionCard;
