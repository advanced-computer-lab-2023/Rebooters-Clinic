import React, { useState, useEffect } from "react";

function PatientWallet() {
  const [patientUsername, setPatientUsername] = useState("");
  const [wallet, setWallet] = useState(0);

  const handlePatientUsernameChange = (e) => {
    setPatientUsername(e.target.value);
  };

  const handleViewWallet = async () => {
    try {
      const response = await fetch("/api/patient/view-wallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ patientUsername: patientUsername }),
      });
      const json = await response.json();
      setWallet(json.wallet);
    } catch (error) {
      setWallet(0);
    }
  };

  return (
    <div className="card mt-4">
      <div className="card-body">
        <div className="container">
          <h2>View Patient's Wallet</h2>
          <div className="form-group">
            <label htmlFor="patientUsername">Patient's Username:</label>
            <input
              type="text"
              className="form-control"
              id="patientUsername"
              value={patientUsername}
              onChange={handlePatientUsernameChange}
            />
          </div>
          <button className="btn btn-primary" onClick={handleViewWallet}>
            View Wallet
          </button>
          {wallet != 0 && (
            <div className="alert alert-success mt-3">Wallet: {wallet}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PatientWallet;
