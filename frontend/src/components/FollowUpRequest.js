import React, { useEffect, useState } from "react";

const FollowUpRequest = ({ datetimeApp }) => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleFollowUpRequest = async () => {
    let reason = document.getElementById("reason").value;
    let preferredDate = document.getElementById("preference").value;

    try {
      const response = await fetch("/api/patient/requestFollowUp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ datetime: datetimeApp, reason, preferredDate }),
      });

      if (response.ok) {
        // If the request was successful
        setMessage("Follow-up request submitted successfully!");
        setError("");
      } else {
        // If there was an error in the request
        const data = await response.json();
        setError(data.error || "Something went wrong.");
        setMessage("");
      }
    } catch (error) {
      // If there was a network error or any other issue
      console.error("Error:", error);
      setError("Something went wrong. Please try again later.");
      setMessage("");
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Request Follow-up</h2>
      <p>Reason:</p>
      <textarea id="reason" />
      <p>Preferred Date/Time:</p>
      <input type="date" id="preference" />
      <div>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
        <br />
        <button onClick={handleFollowUpRequest} className="btn btn-primary btn-lg">
          Submit
        </button>
      </div>

    </div>
  );
};

export default FollowUpRequest;
