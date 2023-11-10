import React, { useEffect, useState } from 'react';
const AddHealthRecord = () => {
    const [patientUsername, setPatientUsername] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [treatment, setTreatment] = useState('');
    const [notes, setNotes] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
  
    const handleAddHealthRecord = async () => {
      try {
        const response = await fetch('/api/doctor/addHealthRecord',{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({diagnosis , patientUsername , treatment , notes}),
          });
        if (response.status === 201) {
          setMessage('Health record added successfully.');
          // Clear the input fields
          setDiagnosis('');
          setTreatment('');
          setNotes('');
        } else {
          setError('Failed to add the health record.');
        }
      } catch (error) {
        console.error(error);
        setError('An error occurred while adding the health record.');
      }
    };
  
    return (
      <div>
        <h2>Add Health Record</h2>
        <label>Patient Username:</label>
        <input type="text" value={patientUsername} onChange={(e) => setPatientUsername(e.target.value)} />
        <br />
        <label>Diagnosis:</label>
        <input type="text" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />
        <br />
        <label>Treatment:</label>
        <input type="text" value={treatment} onChange={(e) => setTreatment(e.target.value)} />
        <br />
        <label>Notes:</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
        <br />
        <button onClick={handleAddHealthRecord}>Add Health Record</button>
  
        {message && <p>{message}</p>}
        {error && <p>{error}</p>}
      </div>
    );
  };

export default AddHealthRecord;