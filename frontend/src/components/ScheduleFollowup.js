import React, { useEffect, useState } from 'react';
const ScheduleFollowup = () => {
    const [dateTime, setDateTime] = useState('');
    const [patientUsername, setPatientUsername] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
  
    const handleScheduleAppointment = async () => {
      try {
        const response = await fetch('/api/doctor/scheduleAppointment',{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({dateTime , patientUsername}),
          });
        if (response.status === 201) {
          setMessage('Appointment scheduled successfully.');
          window.location.reload();
        } else {
          setError('Failed to schedule the appointment.');
        }
      } catch (error) {
        console.error(error);
        setError('An error occurred while scheduling the appointment.');
      }
    };
  
    return (
      <div>
        <h2>Schedule Appointment</h2>
        <input
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
        />
        <label>Patient Username:</label>
        <input
          name="patientUsername"
          placeholder="patient username"
          value={patientUsername}
          onChange={(e) => setPatientUsername(e.target.value)}
        />
        <br />
        <button onClick={handleScheduleAppointment}>Schedule</button>
  
        {message && <p>{message}</p>}
        {error && <p>{error}</p>}
      </div>
    );
  };

  export default ScheduleFollowup;