import React, { useState, useEffect } from "react";

const ViewFamilyMembers = () => {
  const [familyMembers, setFamilyMembers] = useState([]);

  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const response = await fetch("/api/family-members");
        if (response.ok) {
          const data = await response.json();
          setFamilyMembers(data);
        } else {
          console.error("Error fetching family members data");
        }
      } catch (error) {
        console.error("An error occurred while fetching family members:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h2>View Registered Family Members</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Name</th>
              <th>Email</th>
              
            </tr>
          </thead>
          <tbody>
            {familyMembers.map((member) => (
              <tr key={member._id}>
                <td>{member.username}</td>
                <td>{member.name}</td>
                <td>{member.email}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewFamilyMembers;
