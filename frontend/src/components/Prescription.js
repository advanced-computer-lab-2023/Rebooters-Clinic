import React, { useState } from "react";

function Prescription() {
  const [patientName, setPatientName] = useState('');
  const [prescriptions, setPrescriptions] = useState([]);
  const [message, setMessage] = useState('');
  const [filterParams, setFilterParams] = useState({
    date: '',
    doctorName: '',
    filled: undefined,
  });
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  const handleInputChange = (event) => {
    setPatientName(event.target.value);
  };

  const handleViewPrescriptions = async () => {
    try {
      const response = await fetch('/api/patient/viewPrescription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ patientName }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data.message) {
        setMessage(data.message);
        setPrescriptions([]);
      } else {
        setMessage('');
        setPrescriptions(data);
        setSelectedPrescription(null); // Clear selected prescription when viewing all prescriptions
      }
    } catch (error) {
      console.error(error);
      setMessage('An error occurred while fetching prescriptions.');
      setPrescriptions([]);
    }
  };

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
        setMessage(data.message);
        setPrescriptions([]);
      } else {
        setMessage('');
        setPrescriptions(data);
        setSelectedPrescription(null); // Clear selected prescription when filtering
      }
    } catch (error) {
      console.error(error);
      setMessage('An error occurred while filtering prescriptions.');
      setPrescriptions([]);
    }
  };

  return (
    <div>
      <h1>Prescription Viewer</h1>
      <div>
        <input
          type="text"
          placeholder="Enter Patient's Name"
          value={patientName}
          onChange={handleInputChange}
        />
        <button onClick={handleViewPrescriptions}>View</button>
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
      </div>
      {prescriptions.length > 0 && (
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
                <button onClick={() => handleSelectPrescription(index)}>
                  {selectedPrescription === index ? "Deselect" : "Select"}
                </button>
                <button onClick={() => handleClosePrescription(index)}>Close</button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}

export default Prescription;
