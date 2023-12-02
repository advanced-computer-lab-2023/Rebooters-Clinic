import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";

function UnsubscribeToHealthPackage() {
  const [message, setMessage] = useState("");
  const [selectedFamilyMember, setSelectedFamilyMember] = useState("");
  const [familyMembers, setFamilyMembers] = useState([]);

  const handleDeleteHealthPackage = async () => {
    try {
      const response = await fetch("/api/patient/unsubscribeToHealthPackage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          unsubscribingUser: selectedFamilyMember,
        }),
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

  return (
    <Container>
      <Card>
        <h3>Unsubscribe Health Package</h3>
        <Form>
          <Form.Group>
            <Form.Label>Unsubscribe for: (Myself/Family Member)</Form.Label>
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
