import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";

function PatientHealthPackages() {
  const [healthPackage, setHealthPackage] = useState(null);
  const [familyHealthPackages, setFamilyHealthPackages] = useState([]);
  const [message, setMessage] = useState("");
  const [showHealthPackages, setShowHealthPackages] = useState([]);

  const handleViewHealthPackage = async () => {
    try {
      const response = await fetch("/api/patient/viewHealthPackage", {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        setHealthPackage(data);
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

  const isSubscribed = (familyHealthPackage) => {
    return familyHealthPackage && familyHealthPackage.statusOfHealthPackage === "Subscribed";
  };

  const handleViewFamilyHealthPackages = async () => {
    try {
      const response = await fetch(
        "/api/patient/viewFamilyMembersHealthPackages",
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setFamilyHealthPackages(data);
        // Initialize showHealthPackages array with false for each family member
        setShowHealthPackages(Array(data.length).fill(false));
      } else {
        console.error("Error fetching family members' health packages.");
      }
    } catch (error) {
      console.error(
        "An error occurred while fetching family members' health packages:",
        error
      );
    }
  };

  const handleUnsubscribe = async (unsubscribingUser) => {
    try {
      const response = await fetch("/api/patient/unsubscribeToHealthPackage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          unsubscribingUser,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setMessage(errorData.error);
        return;
      }

      setMessage("Unsubscribed from health package successfully.");
      // Refresh health package and family health packages after unsubscribing
      handleViewHealthPackage();
      handleViewFamilyHealthPackages();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleViewHealthPackage();
    handleViewFamilyHealthPackages();
  }, []);

  const toggleHealthPackageDetails = (index) => {
    setShowHealthPackages((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = !updatedArray[index];
      return updatedArray;
    });
  };

  return (
    <Container>
      <Card className="mt-4">
        <Card.Body>
          <Card.Title>
            <span
              onClick={() => toggleHealthPackageDetails(0)}
              style={{
                cursor: isSubscribed(healthPackage) ? "pointer" : "default",
                color: isSubscribed(healthPackage) ? "black" : "grey",
              }}
            >
              My Health Package Information
            </span>
          </Card.Title>
          {showHealthPackages[0] && healthPackage && isSubscribed(healthPackage) && (
            <>
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
              <Button
                className="btn btn-danger"
                onClick={() => handleUnsubscribe("myself")}
              >
                Unsubscribe
              </Button>
            </>
          )}
        </Card.Body>
      </Card>

      {familyHealthPackages.length > 0 && (
        <div>
          {familyHealthPackages.map((familyHealthPackage, index) => (
            <Card key={index} className="mt-4">
              <Card.Body>
                <Card.Title>
                  <span
                    onClick={() => toggleHealthPackageDetails(index + 1)}
                    style={{
                      cursor: isSubscribed(familyHealthPackage) ? "pointer" : "default",
                      color: isSubscribed(familyHealthPackage) ? "black" : "grey",
                    }}
                  >
                    {familyHealthPackage.familyMemberUsername}'s Health Package
                  </span>
                </Card.Title>
                {showHealthPackages[index + 1] && isSubscribed(familyHealthPackage) && (
                  <>
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
                    <Button
                      className="btn btn-danger"
                      onClick={() =>
                        handleUnsubscribe(familyHealthPackage.familyMemberUsername)
                      }
                    >
                      Unsubscribe
                    </Button>
                  </>
                )}
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}
export default PatientHealthPackages;
