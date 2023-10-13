import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";

function ViewAllPatients() {
  const [patients, setPatients] = useState([]);
  const [showPatients, setShowPatients] = useState(false);

  const fetchAllPatients = async () => {
    try {
      const response = await fetch("/api/administrator/viewAllPatients");
      if (!response.ok) {
        throw new Error("Failed to fetch patients");
      }
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error(error);
    }
  };

  const togglePatientsVisibility = () => {
    if (!showPatients) {
      // Fetch patients only when showing
      fetchAllPatients();
    }
    setShowPatients(!showPatients);
  };

  return (
    <Container>
      <h1>View All Patients</h1>
      <Button variant="primary" onClick={togglePatientsVisibility}>
        {showPatients ? "Hide Patients" : "View All Patients"}
      </Button>
      {showPatients && (
        <div>
          <h2>List of Patients:</h2>
          <ul>
            {patients.length > 0 &&
              patients.map((patient) => (
                <Card key={patient._id} className="mb-3">
                  <Card.Body>
                    <Card.Title>{patient.name}</Card.Title>
                    <Card.Text>
                      <strong>Username:</strong> {patient.username}
                    </Card.Text>
                    <Card.Text>
                      <strong>Email:</strong> {patient.email}
                    </Card.Text>
                    <Card.Text>
                      <strong>Date of Birth:</strong>{" "}
                      {new Date(patient.dateOfBirth).toLocaleDateString()}
                    </Card.Text>
                    <Card.Text>
                      <strong>Gender:</strong> {patient.gender}
                    </Card.Text>
                    <Card.Text>
                      <strong>Mobile Number:</strong> {patient.mobile_number}
                    </Card.Text>
                    <Card.Text>
                      <strong>Emergency Contact:</strong>{" "}
                      {`${patient.emergency_contact.firstName} ${patient.emergency_contact.middleName} ${patient.emergency_contact.lastName} (${patient.emergency_contact.mobile_number})`}
                    </Card.Text>
                    <Card.Text>
                      <strong>Health Package:</strong>{" "}
                      {patient.healthPackage
                        ? patient.healthPackage.name
                        : "Not assigned"}
                    </Card.Text>
                  </Card.Body>
                </Card>
              ))}
          </ul>
        </div>
      )}
    </Container>
  );
}

export default ViewAllPatients;
