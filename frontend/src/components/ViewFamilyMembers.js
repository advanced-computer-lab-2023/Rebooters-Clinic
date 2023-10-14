import React, { useState, useEffect } from "react";

const ViewFamilyMembers = () => {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [username, setUsername] = useState(""); // State for the input field

  const fetchData = async (inputUsername) => {
    try {
      const response = await fetch("/api/patient/viewRegisteredFamilyMembers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
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

  useEffect(() => {
    
    fetchData(username);
  }, []);

  
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

 
  const handleFetchFamilyMembers = () => {
    fetchData(username);
  };

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h2>View Registered Family Members</h2>
        <div className="mb-3">
          <label htmlFor="usernameInput" className="form-label">
            Enter Patient's Username:
          </label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              id="usernameInput"
              value={username}
              onChange={handleUsernameChange}
            />
            <button className="btn btn-primary" onClick={handleFetchFamilyMembers}>
              Fetch Family Members
            </button>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>NationalID</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Relation</th>
            </tr>
          </thead>
          <tbody>
            {familyMembers.map((member) => (
              <tr key={member._id}>
                <td>{member.name}</td>
                <td>{member.nationalId}</td>
                <td>{member.age}</td>
                <td>{member.gender}</td>
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
