import React, { useState, useEffect } from "react";

function PatientWallet() {
  const [wallet, setWallet] = useState(0);


  const handleViewWallet = async () => {
    try {
      const response = await fetch("/api/patient/view-wallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }
      });
      const json = await response.json();
      setWallet(json.wallet);
    } catch (error) {
      setWallet(0);
    }
  };

  useEffect(() => {
    handleViewWallet();
  }, []);

  return (
    <div className="card mt-4">
      <div className="card-body">
        <div className="container">
          <h2>View Patient's Wallet</h2>
            <div className="alert alert-secondary mt-3">Wallet: {wallet}</div>
        </div>
      </div>
    </div>
  );
}

export default PatientWallet;
