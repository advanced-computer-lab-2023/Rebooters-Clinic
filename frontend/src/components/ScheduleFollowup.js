import React, { useEffect, useState } from "react";
const ScheduleFollowup = ({ patient }) => {
  const [dateTime, setDateTime] = useState("");
  const [patientUsername, setPatientUsername] = useState(patient);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleScheduleAppointment = async () => {
    try {
      const response = await fetch("/api/doctor/scheduleAppointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dateTime, patientUsername }),
      });
      if (response.status === 201) {
        setMessage("Appointment scheduled successfully.");
        setError("");
        window.location.reload();
      } else {
        const data = await response.json();
        setMessage("");
        setError(data.error);
      }
    } catch (error) {
      console.error(error);
      setMessage("");
      setError("An error occurred while scheduling the appointment.");
    }
  };

  return (
    <div style={{textAlign : "center"}}>
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
      <h2>Schedule Followup Appointment for {patientUsername}</h2>
      <input
        type="datetime-local"
        className="btn btn-secondary btn-lg dropdown-toggle"
        value={dateTime}
        onChange={(e) => setDateTime(e.target.value)}
      />
      <div>
        <br/>
      <button onClick={handleScheduleAppointment} className="btn btn-primary btn-lg">Schedule</button>
      </div>
    </div>
  );
};

export default ScheduleFollowup;
