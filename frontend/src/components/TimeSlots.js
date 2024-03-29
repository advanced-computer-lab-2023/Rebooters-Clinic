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
        body: JSON.stringify({datetime : date}),
      });
      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
        setError("");
      } else {
        const data = await response.json();
        setError(data.error);
        setMessage("");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred while adding available time slots.");
      setMessage("");
    }
  };

  return (
    <div>
      <h2>Add Available Time Slots</h2>
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
      <input
        type="datetime-local"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <button onClick={handleAddSlots}>Add Slots</button>

    </div>
  );
};

export default TimeSlots;
