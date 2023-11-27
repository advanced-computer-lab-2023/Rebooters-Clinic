import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";

function UnsubscribeToHealthPackage() {
  const [message, setMessage] = useState("");

  const handleDeleteHealthPackage = async () => {
    try {
      const response = await fetch("/api/patient/unsubscribeToHealthPackage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setMessage(errorData.error);
        return;
      }

      setMessage("Unsubscribed to health package sucessfully .");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <Card>
        <h3>Unsubscribe Health Package</h3>
        <Form>
          <Button variant="primary" onClick={handleDeleteHealthPackage}>
            Unsubscribe From Health Package
          </Button>
          {message && <p className="error-message">{message}</p>}
        </Form>
      </Card>
    </Container>
  );
}

export default UnsubscribeToHealthPackage;
