import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

function ViewSlotsAndMakeAppointment() {
  const [doctorUsername, setDoctorUsername] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Fetch available slots when the component mounts
    fetchAvailableSlots();
  }, []);

  const fetchAvailableSlots = async () => {
    try {
      if (!doctorUsername) {
        console.log("here")
        return; // Don't fetch slots without a doctor username
      }

      // Replace this with your API endpoint for fetching available slots
      const response = await fetch("/api/patient/viewAvailableDoctorSlots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ doctorUsername }),
      });
      console.log("here2")

      if (response.ok) {
        const data = await response.json();
        setAvailableSlots(data);
      } else {
        console.error("Error fetching available slots.");
      }
    } catch (error) {
      console.error("An error occurred while fetching available slots:", error);
    }
  };

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
    setShowModal(true);
  };

  const handleMakeAppointment = async () => {
    try {
      if (!doctorUsername) {
        console.error("Please enter a doctor's username.");
        return;
      }

      // Replace this with your API endpoint for making an appointment
      const response = await fetch("/api/patient/makeAppointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ doctorUsername, chosenSlot: selectedSlot }),
      });

      if (response.ok) {
        // Handle success, e.g., show a success message
        setShowModal(false);
        fetchAvailableSlots(); // Refresh available slots after making an appointment
      } else {
        console.error("Error making an appointment.");
      }
    } catch (error) {
      console.error("An error occurred while making an appointment:", error);
    }
  };

  const handleSubmitUsername = () => {
    fetchAvailableSlots();
  };

  return (
    <div>
      <h1>Available Slots</h1>
      <Form.Group>
        <Form.Label>Doctor's Username:</Form.Label>
        <Form.Control
          type="text"
          value={doctorUsername}
          onChange={(e) => setDoctorUsername(e.target.value)}
        />
      </Form.Group>
      <Button onClick={handleSubmitUsername}>Submit</Button>
      <ul>
        {Array.isArray(availableSlots) && availableSlots.map((slot, index) => (
          <li key={index}>
            <button onClick={() => handleSlotClick(slot)}>Click to book</button>
            {`${slot.date} ${slot.time}`}
          </li>
        ))}
      </ul>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Make Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSlot && (
            <div>
              <p>Date: {selectedSlot.date}</p>
              <p>Time: {selectedSlot.time}</p>
              <Button onClick={handleMakeAppointment}>Confirm Appointment</Button>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ViewSlotsAndMakeAppointment;