import React, { useState, useEffect } from "react";

const ViewFamilyMembers = () => {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [username, setUsername] = useState(""); // State for the input field

  const fetchData = async () => {
    try {
      const response = await fetch("/api/patient/viewRegisteredFamilyMembers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data); // Log the data received
        setFamilyMembers(data);
      } else {
        console.error("Error fetching family members data");
      }
    } catch (error) {
      console.error("An error occurred while fetching family members:", error);
    }
  };

 
  const handleFetchFamilyMembers = () => {
    fetchData();
  };

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h2>View Registered Family Members</h2>
        <div className="mb-3">
          <div className="input-group">
            <button className="btn btn-primary" onClick={handleFetchFamilyMembers}>
              Fetch Family Members
            </button>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Relation</th>
            </tr>
          </thead>
          <tbody>
            {familyMembers.map((member) => (
              <tr key={member._id}>
                <td>{member.username}</td>
                <td>{member.relation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewFamilyMembers;
