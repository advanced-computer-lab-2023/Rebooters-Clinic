import React, { useState } from "react";

function DeleteHealthPackage() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleDeleteHealthPackage = async () => {
    if (!name) {
      setMessage("");
      setError("Please fill in all fields");
      return;
    }
    try {
      const response = await fetch("/api/administrator/deleteHealthPackage", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
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
      setError("An error occurred while deleting package");
      setMessage("");
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h2>Delete a Health Package</h2>
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
        <button onClick={handleDeleteHealthPackage} className="btn btn-danger">
          Delete Package
        </button>
      </div>
    </div>
  );
}

export default DeleteHealthPackage;
