import React, { useEffect, useState } from "react";
const TimeSlots = ({}) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleAddSlots = async () => {
    try {
      // Split the slots by comma and remove any leading/trailing spaces

      const response = await fetch('/api/doctor/addAvailableSlots',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({date , time}),
      });
      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
      } else {
        setError("Failed to add available time slots.");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred while adding available time slots.");
    }
  };

  return (
    <div>
      <h2>Add Available Time Slots</h2>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />
      <button onClick={handleAddSlots}>Add Slots</button>

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default TimeSlots;
