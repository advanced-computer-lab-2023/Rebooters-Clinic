import React, { useEffect, useState } from "react";
const FollowUpRequest = ({ datetimeApp }) => {
  const [reason, setReason] = useState("");


  const handleFollowUpRequest = async () => {
  let reason= document.getElementById('reason').value;  
  let preferredDate=document.getElementById('preference').value; 
    try {
      const response = await fetch("/api/patient/requestFollowUp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ datetime:datetimeApp,reason,preferredDate}),
      });

    } catch (error) {
      console.log('error')
    }

  };

  return (
    <div style={{textAlign : "center"}}>
      <h2>Request Follow-up</h2>
      <p>Reason:</p>
      <textarea
       id="reason"
/>
      <p>Preferred Date/Time:</p>
      <textarea
      id="preference"
/>
      <div>
        <br/>
      <button onClick={handleFollowUpRequest} className="btn btn-primary btn-lg">Submit</button>
      </div>
    </div>
  );
};

export default FollowUpRequest;
