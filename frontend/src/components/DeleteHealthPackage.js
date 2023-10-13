import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";

function DeleteHealthPackage() {
  const [patientUsername, setPatientUsername] = useState("");
  const [patientInfo, setPatientInfo] = useState(null);
  const [message,setMessage]= useState("");
 
 
  const handleDeleteHealthPackage = async () => {
   if (!patientUsername){
    setMessage("please fill in all feilds");
    return;
   }
    try {
      const response = await fetch("/api/administrator/deleteHealthPackage", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ patientUsername }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setMessage(errorData.error);
        return;
      }

      setMessage("Done deleting health package.")
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <h1>Delete Health Package</h1>
      <Form>
        <Form.Group>
          <Form.Label>Patient Username:</Form.Label>
          <Form.Control
            type="text"
            value={patientUsername}
            onChange={(e) => setPatientUsername(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" onClick={handleDeleteHealthPackage}>
          Delete Health Package
        </Button>
        {message && <p className="error-message">{message}</p>}
      </Form>
    </Container>
  );
}

export default DeleteHealthPackage;
