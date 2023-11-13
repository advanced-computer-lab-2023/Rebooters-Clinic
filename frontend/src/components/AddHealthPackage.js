import React, { useState } from "react";

function AddHealthPackage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [discountOnSession, setDiscountOnSession] = useState("");
  const [discountOnMedicine, setDiscountOnMedicine] = useState("");
  const [discountOnSubscription, setDiscountOnSubscription] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleAddHealthPackage = async () => {
    if (
      !name ||
      !price ||
      !discountOnSession ||
      !discountOnMedicine ||
      !discountOnSubscription
    ) {
      setMessage("");
      setError("Please fill in all fields");
      return;
    }
    try {
      const response = await fetch("/api/administrator/addHealthPackage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          price,
          discountOnSession,
          discountOnMedicine,
          discountOnSubscription,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error);
        setMessage("");
        return;
      }

      const data = await response.json();
      setMessage(data);
    } catch (error) {
      console.error(error);
      setError("An error occurred while adding package");
      setMessage("");
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h2>Add a Health Package</h2>
        {message && <p className="text-success">{message}</p>}
        {error && <p className="text-danger">{error}</p>}
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Package Name:
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">
            Price:
          </label>
          <input
            type="number"
            className="form-control"
            id="price"
            name="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="discountOnSession" className="form-label">
            % Discount On Session:
          </label>
          <input
            type="number"
            className="form-control"
            id="discountOnSession"
            name="discountOnSession"
            value={discountOnSession}
            onChange={(e) => setDiscountOnSession(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="discountOnMedicine" className="form-label">
            % Discount On Medicine:
          </label>
          <input
            type="number"
            className="form-control"
            id="discountOnMedicine"
            name="discountOnMedicine"
            value={discountOnMedicine}
            onChange={(e) => setDiscountOnMedicine(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="discountOnSubscription" className="form-label">
            % Discount On Subscription:
          </label>
          <input
            type="number"
            className="form-control"
            id="discountOnSubscription"
            name="discountOnSubscription"
            value={discountOnSubscription}
            onChange={(e) => setDiscountOnSubscription(e.target.value)}
          />
        </div>
        <button onClick={handleAddHealthPackage} className="btn btn-primary">
          Add Package
        </button>
      </div>
    </div>
  );
}

export default AddHealthPackage;
