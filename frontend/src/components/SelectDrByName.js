import React, { useState } from "react";

const SelectDrByName = () => {
  const [patientName, setPatientName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  console.log('patientName:', patientName);
  console.log('doctorName:', doctorName);
  console.log('message:', message);
  console.log('error:', error);
  console.log('isLoading:', isLoading);


  const handleSelectDoctor = async (e) => {
    e.preventDefault();
  
    if (!patientName || !doctorName) {
      setError("Please provide both patient and doctor names.");
      setMessage("");
      return;
    }
  
    setIsLoading(true);
  
    try {
      const response = await fetch("/doctor", {
        method: "POST", // Change the method to POST
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ patientName, doctorName }), // Send data in the request body as JSON
      });
  
      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
        setError("");
        setPatientName("");
        setDoctorName("");
      } else {
        const errorData = await response.json();
        setError(errorData.error);
        setMessage("");
      }
    } catch (error) {
      setError("An error occurred while selecting the doctor.");
      setMessage("");
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="container">
      <h2>Select Doctor by Name:</h2>
      <form onSubmit={handleSelectDoctor}>
        <div className="mb-3">
          <label htmlFor="patientName" className="form-label">
            Patient Name:
          </label>
          <input
            type="text"
            className="form-control"
            id="patientName"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="doctorName" className="form-label">
            Doctor Name:
          </label>
          <input
            type="text"
            className="form-control"
            id="doctorName"
            value={doctorName}
            onChange={(e) => setDoctorName(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" type="submit" disabled={isLoading}>
          {isLoading ? "Selecting..." : "Select Doctor"}
        </button>
      </form>
      {message && <p className="text-success">{message}</p>}
      {error && <p className="text-danger">{error}</p>}
    </div>
  );
};

export default SelectDrByName;
