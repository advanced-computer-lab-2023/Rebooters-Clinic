import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

const ViewSlotsAndMakeAppointment = ({ doctor }) => {
  const [doctorUsername, setDoctorUsername] = useState(doctor);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedFamilyMember, setSelectedFamilyMember] = useState("");
  const [familyMembers, setFamilyMembers] = useState([]);

  useEffect(() => {
    fetchAvailableSlots();
  }, []);

  const fetchAvailableSlots = async () => {
    try {
      const response = await fetch("/api/patient/viewAvailableDoctorSlots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ doctorUsername }),
      });

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

  const handleSlotClick = (slot, index) => {
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
        body: JSON.stringify({
          doctorUsername,
          chosenSlot: selectedSlot,
          reservingUser: selectedFamilyMember,
        }),
      });

      if (response.ok) {
        // Handle success, e.g., show a success message
        setShowModal(false);
        fetchAvailableSlots(); // Refresh available slots after making an appointment
        //window.location.reload();
      } else {
        console.error("Error making an appointment.");
      }
    } catch (error) {
      console.error("An error occurred while making an appointment:", error);
    }
  };
  const handleViewFamilyMembers = async () => {
    try {
      const response = await fetch("/api/patient/viewRegisteredFamilyMembers", {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        setFamilyMembers(data);
      } else {
        console.error("Error fetching registered family members.");
      }
    } catch (error) {
      console.error(
        "An error occurred while fetching registered family members:",
        error
      );
    }
  };

  useEffect(() => {
    handleViewFamilyMembers();
  }, []);

  useEffect(() => {
    fetchAvailableSlots();
  }, []);

  return (
    <div>
      <h1>Doctor's Available Slots</h1>
      <ul>
        {Array.isArray(availableSlots) && availableSlots.length > 0 ? (
          <ul>
            {availableSlots.map((slot, index) => (
              <li key={index}>
                <button
                  onClick={() => handleSlotClick(slot, index)}
                  className="btn btn-primary"
                >
                  Click to book
                </button>
                {new Date(slot.datetime).toLocaleDateString()}{" "}
                {new Date(slot.datetime).toLocaleTimeString()}
              </li>
            ))}
          </ul>
        ) : (
          <p>No available slots at the moment.</p>
        )}
      </ul>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Make Appointment</Modal.Title>
        </Modal.Header>
        <Form.Group>
            <Form.Label>Reserve for: (Myself/Family Member)</Form.Label>
            <Form.Control
              as="select"
              value={selectedFamilyMember}
              onChange={(e) => setSelectedFamilyMember(e.target.value)}
            >
              <option value="">...</option>
              <option value="myself">Myself</option>
              {familyMembers.map((familyMember) => (
                <option value={familyMember.username}>
                  {`Family Member: ${familyMember.username}`}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        <Modal.Body>
          {selectedSlot && (
            <div>
              <p>
                Date: {new Date(selectedSlot.datetime).toLocaleDateString()}{" "}
              </p>
              <p>
                Time: {new Date(selectedSlot.datetime).toLocaleTimeString()}
              </p>
              <Button onClick={handleMakeAppointment}>
                Confirm Appointment
              </Button>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ViewSlotsAndMakeAppointment;
