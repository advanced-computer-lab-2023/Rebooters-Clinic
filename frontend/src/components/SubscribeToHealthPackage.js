import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const SubscribeToHealthPackage = () => {
  const [selectedPackage, setSelectedPackage] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [paymentMessage, setPaymentMessage] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [packages, setPackages] = useState([]);
  const [selectedFamilyMember, setSelectedFamilyMember] = useState("");
  const [familyMembers, setFamilyMembers] = useState([]);

  const handlePackageSelection = (event) => {
    setSelectedPackage(event.target.value);
  };

  const handlePaymentSelection = (event) => {
    setSelectedPaymentMethod(event.target.value);
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
    <div>
      <h1>Health Package Subscription</h1>
      <Form.Group>
        <Form.Label>Select Health Package:</Form.Label>
        <Form.Control
          as="select"
          value={selectedPackage}
          onChange={handlePackageSelection}
        >
          <option value="">Select Health Package</option>
          {packages.map((packageOption) => (
            <option value={packageOption.name}>{packageOption.name}</option>
          ))}
        </Form.Control>
      </Form.Group>
      <Form.Group>
        <Form.Label>Subscription for: (Myself/Family Member)</Form.Label>
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
      <Form.Group>
        <Form.Label>Select Payment Method:</Form.Label>
        <Form.Control
          as="select"
          value={selectedPaymentMethod}
          onChange={handlePaymentSelection}
        >
          <option value="">Select Payment Method</option>
          <option value="pay with my wallet">Pay with my wallet</option>
          <option value="pay with credit card">Pay with credit card</option>
        </Form.Control>
      </Form.Group>
      <Button onClick={handleSubscribeAndPay}>Subscribe and Pay</Button>
      {paymentMessage && <p className="text-success">{paymentMessage}</p>}
      {paymentError && <p className="text-danger">{paymentError}</p>}
    </div>
  );
};

export default SubscribeToHealthPackage;
