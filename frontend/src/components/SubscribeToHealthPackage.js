import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const SubscribeToHealthPackage = () => {
  const [selectedPackage, setSelectedPackage] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [paymentMessage, setPaymentMessage] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [packages, setPackages] = useState([]);
  const [selectedFamilyMember, setSelectedFamilyMember] = useState("");
  const [familyMembers, setFamilyMembers] = useState([]);

  const handlePackageSelection = (packageOption) => {
    setSelectedPackage(packageOption);
  };

  const handlePaymentSelection = (paymentMethod) => {
    setSelectedPaymentMethod(paymentMethod);
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

  const handleSubscribeAndPay = async () => {
    if (!selectedPackage || !selectedPaymentMethod) {
      setPaymentError("Please select a package and payment method.");

      // Clear the error message after 5 seconds
      setTimeout(() => {
        setPaymentError("");
      }, 5000);

      return;
    }

    try {
      // If the payment method is "pay with my wallet," call the payForHealthPackage function
      if (selectedPaymentMethod === "pay with my wallet") {
        const payResponse = await fetch("/api/patient/payForHealthPackage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            packageName: selectedPackage,
            paymentMethod: "pay with my wallet", // Assuming wallet payment for health packages
          }),
        });

        if (payResponse.ok) {
          const payData = await payResponse.json();
          setPaymentMessage(payData.message);
          setPaymentError("");
          const response = await fetch(
            "/api/patient/subscribeToHealthPackage",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                packageName: selectedPackage,
                subscribingUser: selectedFamilyMember,
              }),
            }
          );
        } else {
          const payErrorData = await payResponse.json();
          setPaymentError(payErrorData.error);
          setPaymentMessage("");
        }
      } else {
        if (selectedPaymentMethod === "pay with credit card") {
          const response = await fetch(
            "/api/patient/subscribeToHealthPackage",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                packageName: selectedPackage,
                subscribingUser: selectedFamilyMember,
              }),
            }
          );
          try {
            const stripeResponse = await fetch(
              "http://localhost:3000/create-checkout-session",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  items: [
                    { id: 1, quantity: 3 },
                    { id: 2, quantity: 1 },
                  ],
                }),
              }
            );

            if (stripeResponse.ok) {
              const { url } = await stripeResponse.json();
              window.location = url;
              console.log(url);
            } else {
              throw new Error("Network response from Stripe was not ok");
            }
          } catch (stripeError) {
            console.error("Stripe Error:", stripeError);
          }
        }
      }
    } catch (error) {
      console.error("Error subscribing and paying:", error);
      setPaymentError("An error occurred while processing the payment.");

      // Clear the error message after 5 seconds
      setTimeout(() => {
        setPaymentError("");
      }, 5000);

      setPaymentMessage("");
    }
  };

  const handleViewPackages = async () => {
    try {
      const response = await fetch("/api/patient/viewHealthPackageOptions", {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        setPackages(data);
      } else {
        console.error("Error fetching health package options.");
      }
    } catch (error) {
      console.error(
        "An error occurred while fetching health package options:",
        error
      );
    }
  };

  useEffect(() => {
    handleViewPackages();
  }, []);

  useEffect(() => {
    handleViewFamilyMembers();
  }, []);

  return (
    <div className="card">
      <h1>Health Package Subscription</h1>

      <Row>
        <Col>
          <Dropdown>
            <Dropdown.Toggle variant="secondary" id="dropdownHealthPackage">
              {selectedPackage || "Select Health Package"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {packages.map((packageOption) => (
                <Dropdown.Item
                  key={packageOption.name}
                  onClick={() => handlePackageSelection(packageOption.name)}
                >
                  {packageOption.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>

        <Col>
          <Dropdown>
            <Dropdown.Toggle variant="secondary" id="dropdownFamilyMember">
              {selectedFamilyMember
                ? `Family Member: ${selectedFamilyMember}`
                : "Select Patient"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                key="myself"
                onClick={() => setSelectedFamilyMember("myself")}
              >
                Myself
              </Dropdown.Item>
              {familyMembers.map((familyMember) => (
                <Dropdown.Item
                  key={familyMember.username}
                  onClick={() =>
                    setSelectedFamilyMember(familyMember.username)
                  }
                >
                  {`Family Member: ${familyMember.username}`}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>

        <Col>
          <Dropdown>
            <Dropdown.Toggle variant="secondary" id="dropdownPaymentMethod">
              {selectedPaymentMethod || "Select Payment Method"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                key="payWithWallet"
                onClick={() =>
                  handlePaymentSelection("pay with my wallet")
                }
              >
                Pay with my wallet
              </Dropdown.Item>
              <Dropdown.Item
                key="payWithCard"
                onClick={() =>
                  handlePaymentSelection("pay with credit card")
                }
              >
                Pay with credit card
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>

        <Col>
          <Button
            onClick={handleSubscribeAndPay}
            // variant="outline-secondary" // Set to the default gray color of Bootstrap
          >
            Subscribe and Pay
          </Button>
        </Col>
      </Row>

      {paymentMessage && <p className="text-success">{paymentMessage}</p>}
      {paymentError && <p className="text-danger">{paymentError}</p>}
      <br />
      <br />
      <br />
      <br />
    </div>
  );
};

export default SubscribeToHealthPackage;
