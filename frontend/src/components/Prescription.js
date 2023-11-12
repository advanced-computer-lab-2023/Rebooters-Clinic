import React, { useState } from "react";

function Prescription() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [viewMessage, setViewMessage] = useState('');
  const [filterMessage, setFilterMessage] = useState('');
  const [prescriptionDetails, setPrescriptionDetails] = useState(null);
  const [filterParams, setFilterParams] = useState({
    date: '',
    doctorName: '',
    filled: undefined,
  });
  const [selectedPrescription, setSelectedPrescription] = useState(null);


  const handleViewPrescriptions = async () => {

    try {
      const response = await fetch('/api/patient/viewPrescription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });


      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data.message) {
        setViewMessage(data.message);
        setPrescriptions([]);
      } else {
        setViewMessage('');
        setPrescriptions(data);
        setSelectedPrescription(null); // Clear selected prescription when viewing all prescriptions
      }
    } catch (error) {
      console.error(error);
      setViewMessage('An error occurred while fetching prescriptions.');
      setPrescriptions([]);
    }
  }

  const handleClosePrescription = (index) => {
    // Create a copy of the prescriptions array
    const updatedPrescriptions = [...prescriptions];

    // Remove the specific prescription at the given index
    updatedPrescriptions.splice(index, 1);

    // Update the state with the modified array
    setPrescriptions(updatedPrescriptions);

    // If the closed prescription was the selected one, clear the selection
    if (selectedPrescription === index) {
      setSelectedPrescription(null);
    }
  };

  const handleSelectPrescription = (index) => {
    setSelectedPrescription(selectedPrescription === index ? null : index);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilterParams({
      ...filterParams,
      [name]: value,
    });
  };

  const handleFilterPrescriptions = async () => {
    if (!filterParams.date && !filterParams.doctorName && filterParams.filled === undefined) {
      setFilterMessage('Please fill the text');
      setPrescriptions([]);
      return;
    }

    try {
      const response = await fetch('/api/patient/filterPrescription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filterParams),
      });


      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data.message) {
        setFilterMessage(data.message);
        setPrescriptions([]);
      } else {
        setFilterMessage('');
        setPrescriptions(data);
        setSelectedPrescription(null); // Clear selected prescription when filtering
      }
    } catch (error) {
      console.error(error);
      setFilterMessage('An error occurred while filtering prescriptions.');
      setPrescriptions([]);
    }
  };
  const handleShowPrescriptionDetails = (prescription) => {
    setPrescriptionDetails(prescription);
  };
  const handleClosePrescriptionDetails = () => {
    setPrescriptionDetails(null);
  };

  const errorStyle = {
    color: "red",
    fontWeight: "bold",
  };

  return (
    <div>
      <h1>Prescription Viewer</h1>
      <div>
        <button onClick={handleViewPrescriptions}>View Prescriptions</button>
        {viewMessage && (
          <p style={errorStyle}>{viewMessage}</p>
        )}
      </div>
      <div>
        <h2>Filter Prescriptions</h2>
        
        <input
          type="text"
          name="date"
          placeholder="Enter Date (YYYY-MM-DD)"
          value={filterParams.date}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="doctorName"
          placeholder="Enter Doctor's Name"
          value={filterParams.doctorName}
          onChange={handleFilterChange}
        />
        <select
          name="filled"
          value={filterParams.filled}
          onChange={handleFilterChange}
        >
          <option value="">Select Filled Status</option>
          <option value="true">Filled</option>
          <option value="false">Unfilled</option>
        </select>
        <button onClick={handleFilterPrescriptions}>Filter</button>
        {filterMessage && (
          <p style={errorStyle}>{filterMessage}</p>
        )}
      </div>
      {prescriptions.length > 0 && !prescriptionDetails && (
        <div>
          <ul>
            {prescriptions.map((prescription, index) => (
              <li key={index}>
                <div>
                  <h3>Prescription {index + 1}</h3>
                  <p><strong>Doctor:</strong> {prescription.doctorName}</p>
                  <p><strong>Medication:</strong> {prescription.medication}</p>
                  <p><strong>Dosage:</strong> {prescription.dosage}</p>
                  <p><strong>Instructions:</strong> {prescription.instructions}</p>
                  <p><strong>Filled:</strong> {prescription.filled ? 'Yes' : 'No'}</p>
                  <p><strong>Date:</strong> {prescription.date}</p>
                </div>
                <button onClick={() => handleShowPrescriptionDetails(prescription)}>Select</button>
                <button onClick={() => handleClosePrescription(index)}>Close</button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {prescriptionDetails && (
        <div>
          <h3>Prescription Details:</h3>
          <p><strong>Doctor:</strong> {prescriptionDetails.doctorName}</p>
          <p><strong>Medication:</strong> {prescriptionDetails.medication}</p>
          <p><strong>Dosage:</strong> {prescriptionDetails.dosage}</p>
          <p><strong>Instructions:</strong> {prescriptionDetails.instructions}</p>
          <p><strong>Filled:</strong> {prescriptionDetails.filled ? 'Yes' : 'No'}</p>
          <p><strong>Date:</strong> {prescriptionDetails.date}</p>
          <button onClick={handleClosePrescriptionDetails}>Close Details</button>
        </div>
      )}
    </div>
  );
}

export default Prescription;
