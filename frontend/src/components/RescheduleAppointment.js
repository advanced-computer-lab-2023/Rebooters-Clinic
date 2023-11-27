import React, { useEffect, useState } from "react";
const RescheduleAppointment = ({doctorUsername ,dateApp }) => {
    const [slots, setSlots] = useState([]);
    const [selectedValue, setSelectedValue] = useState('');
    useEffect(() => {
        fetchAvailableSlots();
      }, []);
        const submit = async () => {

        try {
          // Replace this with your API endpoint for fetching available slots
          const response = await fetch("/api/patient/rescheduleAppointment",{
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({newdate:selectedValue,datetime:dateApp,doctorUsername }),
          });
          if (response.ok) {
            const data = await response.json();
          } else {
            console.error("Error fetching available slots.");
          }

        } catch (error) {
          console.error("An error occurred while fetching available slots:", error);
        }
      }
      const fetchAvailableSlots = async () => {
       try {
          if (!doctorUsername) {
            return; // Don't fetch slots without a doctor username
          }
          // Replace this with your API endpoint for fetching available slots
          const response = await fetch("/api/patient/viewAvailableDoctorSlots",{
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ doctorUsername }),
          });
    
          if (response.ok) {
            const data = await response.json();
            setSlots(data);
          } else {
            console.error("Error fetching available slots.");
          }
        } catch (error) {
          console.error("An error occurred while fetching available slots:", error);
        }
      };

  return (
    <div>
        <h2>Choose the date convenient to you</h2>
      <select value={selectedValue} onChange={(e) => setSelectedValue(e.target.value)}>
  <option value="">Select...</option>
  {slots.map((option) => (
    <option value={`${option.datetime}`}>
    { option.datetime.slice(0, 19).replace('T', ' ')} 
    </option>
  ))}
</select>
<button onClick={submit}>submit</button>
    </div>
  );
};


export default RescheduleAppointment;
