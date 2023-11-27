import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

function ViewHealthPackage() {
  const [healthPackage, setHealthPackage] = useState(null);
  const [showHealthPackage, setShowHealthPackage] = useState(false);

  const handleViewHealthPackage = async () => {
    try {
      const response = await fetch("/api/patient/viewHealthPackage", {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        setHealthPackage(data);
        setShowHealthPackage(!showHealthPackage); // Toggle the visibility
      } else {
        console.error("Error fetching health package information.");
      }
    } catch (error) {
      console.error(
        "An error occurred while fetching health package information:",
        error
      );
    }
  };

  useEffect(() => {
    handleViewHealthPackage();
  }, []);

  return (
    <div>
      {showHealthPackage && healthPackage && (
        <Card className="mt-4">
          <Card.Body>
            <Card.Title>Health Package Information</Card.Title>
            <Card.Text>
              <strong>Status Of Health Package:</strong>{" "}
              {healthPackage.statusOfHealthPackage}
            </Card.Text>
            {healthPackage.statusOfHealthPackage === "Subscribed" && (
              <Card.Text>
                <strong>Time Remaining:</strong> {healthPackage.timeShown}
              </Card.Text>
            )}
            {healthPackage.statusOfHealthPackage === "Cancelled" && (
              <Card.Text>
                <strong>Package Cancelled At:</strong> {healthPackage.timeShown}
              </Card.Text>
            )}
            {healthPackage.healthPackage && (
              <div>
                <strong>Health Package:</strong>
                <ul>
                  <li>
                    <strong>Name:</strong> {healthPackage.healthPackage.name}
                  </li>
                  <li>
                    <strong>Price:</strong> ${healthPackage.healthPackage.price}
                  </li>
                  <li>
                    <strong>Discount on Session:</strong>{" "}
                    {healthPackage.healthPackage.discountOnSession * 100}%
                  </li>
                  <li>
                    <strong>Discount on Medicine:</strong>{" "}
                    {healthPackage.healthPackage.discountOnMedicine * 100}%
                  </li>
                  <li>
                    <strong>Discount on Subscription:</strong>{" "}
                    {healthPackage.healthPackage.discountOnSubscription * 100}%
                  </li>
                </ul>
              </div>
            )}
          </Card.Body>
        </Card>
      )}
    </div>
  );
}

export default ViewHealthPackage;
