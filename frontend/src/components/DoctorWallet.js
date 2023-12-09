import React, { useState, useEffect } from "react";

function DoctorWallet() {
  const [wallet, setWallet] = useState(0);

  const handleViewWallet = async () => {
    try {
      const response = await fetch("/api/doctor/view-wallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
    <div className="container">
      <div className="card mt-4">
        <h2 className="card-header">Your Wallet</h2>
        <div className="card-body">
          <h4 className="card-title">Current Balance</h4>
          <h1 className="display-1">${wallet}</h1>
        </div>
      </div>
    </div>
  );
}

export default DoctorWallet;
