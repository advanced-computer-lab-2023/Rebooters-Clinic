import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

function ViewFamilyHealthPackage() {
  const [healthPackages, setHealthPackages] = useState([]);
  const [showHealthPackage, setShowHealthPackage] = useState(false);

  const handleViewHealthPackage = async () => {
    try {
      const response = await fetch(
        "/api/patient/viewFamilyMembersHealthPackages",
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setHealthPackages(data);
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
    <Card.Title>Family Members Health Package Information</Card.Title>
      {showHealthPackage && healthPackages.length > 0 && (
        <div>
          {healthPackages.map((healthPackage, index) => (
            <Card key={index} className="mt-4">
              <Card.Body>
              <Card.Text>
                  <strong>{healthPackage.familyMemberUsername}'s Health Package</strong>{" "}

                </Card.Text>
                
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
                    <strong>Package Cancelled At:</strong>{" "}
                    {healthPackage.timeShown}
                  </Card.Text>
                )}
                {healthPackage.healthPackage && (
                  <div>
                    <strong>Health Package:</strong>
                    <ul>
                      <li>
                        <strong>Name:</strong>{" "}
                        {healthPackage.healthPackage.name}
                      </li>
                      <li>
                        <strong>Price:</strong> $
                        {healthPackage.healthPackage.price}
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
                        {healthPackage.healthPackage.discountOnSubscription *
                          100}
                        %
                      </li>
                    </ul>
                  </div>
                )}
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default ViewFamilyHealthPackage;
