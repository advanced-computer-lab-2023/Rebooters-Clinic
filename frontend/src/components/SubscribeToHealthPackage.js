import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";

function formatDate(dateString) {
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function SubscribeToHealthPackage() {
  const [packageName, setPackageName] = useState("");
  const [patientInfo, setPatientInfo] = useState(null);
  const [error, setError] = useState("");

  const handleAddHealthPackage = async () => {
    if (!packageName) {
      setError("Please fill in all fields");
      return;
    }
    try {
      const response = await fetch("/api/patient/subscribeToHealthPackage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ packageName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error);
        return;
      }

      const data = await response.json();

      setPatientInfo(data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Container>
      <h1>Subscribe To Health Package</h1>
      <Form>
        <Form.Group>
          <Form.Label>Package Name:</Form.Label>
          <Form.Control
            type="text"
            value={packageName}
            onChange={(e) => setPackageName(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" onClick={handleAddHealthPackage}>
          Add Health Package
        </Button>
        {error && <p className="error-message">{error}</p>}
      </Form>
      {patientInfo && (
        <Card className="mt-4">
          <Card.Body>
            <Card.Title>Patient Information</Card.Title>
            <Card.Text>
              <strong>Username:</strong> {patientInfo.username}
            </Card.Text>
            <Card.Text>
              <strong>Name:</strong> {patientInfo.name}
            </Card.Text>
            <Card.Text>
              <strong>Health Package:</strong> {patientInfo.healthPackage.name}
            </Card.Text>
            <Card.Text>
              <strong>Price:</strong> ${patientInfo.healthPackage.price}
            </Card.Text>
            <Card.Text>
              <strong>Discount on Session:</strong>{" "}
              {patientInfo.healthPackage.discountOnSession * 100}%
            </Card.Text>
            <Card.Text>
              <strong>Discount on Medicine:</strong>{" "}
              {patientInfo.healthPackage.discountOnMedicine * 100}%
            </Card.Text>
            <Card.Text>
              <strong>Discount on Subscription:</strong>{" "}
              {patientInfo.healthPackage.discountOnSubscription * 100}%
            </Card.Text>
            <Card.Text>
              <strong>Status Of Health Package:</strong>
              {patientInfo.statusOfHealthPackage}
            </Card.Text>
            <Card.Text>
              <strong>Health Package Created At:</strong>
              {formatDate(patientInfo.healthPackageCreatedAt)}
            </Card.Text>
          </Card.Body>
        </Card>
      )}
    </Container>
  )
}

export default SubscribeToHealthPackage;
