/*import React, { useState } from "react";
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

*/

import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const SubscribeToHealthPackage = () => {
  const [selectedPackage, setSelectedPackage] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [paymentMessage, setPaymentMessage] = useState("");
  const [paymentError, setPaymentError] = useState("");

  const handlePackageSelection = (event) => {
    setSelectedPackage(event.target.value);
   };

  const handlePaymentSelection = (event) => {
    setSelectedPaymentMethod(event.target.value);
  };

  const handleSubscribeAndPay = async () => {
    if (!selectedPackage || !selectedPaymentMethod) {
      setPaymentError("Please select a package and payment method.");
      return;
    }

    try {
      const response = await fetch("/api/patient/subscribeToHealthPackage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          packageName: selectedPackage,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // If the payment method is "pay with my wallet," call the payForHealthPackage function
        if (selectedPaymentMethod === "pay with my wallet") {
          const payResponse = await fetch("/api/patient/payForHealthPackage", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              price: data.healthPackage.price,
              paymentMethod: "pay with my wallet", // Assuming wallet payment for health packages
            }),
          });

          if (payResponse.ok) {
            const payData = await payResponse.json();
            setPaymentMessage(payData.message);
            setPaymentError("");
          } else {
            const payErrorData = await payResponse.json();
            setPaymentError(payErrorData.error);
            setPaymentMessage("");
          }
        } else {
          if(selectedPaymentMethod === "pay with credit card"){
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
      } else {
        const errorData = await response.json();
        setPaymentError(errorData.error);
        setPaymentMessage("");
      }
    } catch (error) {
      console.error("Error subscribing and paying:", error);
      setPaymentError("An error occurred while processing the payment.");
      setPaymentMessage("");
    }
  };

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
          <option value="Gold">Gold</option>
          <option value="Silver">Silver</option>
          <option value="Platinum">Platinum</option>
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

