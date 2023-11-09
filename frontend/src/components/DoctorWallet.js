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
      <h2>Your Wallet</h2>
      <div>
        Current Balance: {wallet} $
      </div>
    </div>
  );
}

export default DoctorWallet;
