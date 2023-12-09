import React, { useState, useEffect } from "react";
import CreateNotFoundPatient from "./CreateNotFoundPatient";

const FamilyMembers = () => {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [newFamilyMember, setNewFamilyMember] = useState({
    familyMemberUsername: "",
    relation: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showAddPatientForm, setShowAddPatientForm] = useState(false);

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
        setFamilyMembers(data);
      } else {
        console.error("Error fetching family members data");
      }
    } catch (error) {
      console.error("An error occurred while fetching family members:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFamilyMember({
      ...newFamilyMember,
      [name]: value,
    });
  };

  const handleAddFamilyMember = async () => {
    if (!newFamilyMember.familyMemberUsername || !newFamilyMember.relation) {
      setErrorMessage("Please fill in all fields.");
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
      return;
    }

    try {
      const response = await fetch("/api/patient/addFamilyMember", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newFamilyMember),
      });

      if (response.ok) {
        setSuccessMessage("Family member added successfully!");
        setErrorMessage("");
        setNewFamilyMember({
          familyMemberUsername: "",
          relation: "",
        });
        // Fetch family members again after adding a new member
        fetchData();

        setTimeout(() => {
          setSuccessMessage("");
        }, 5000);
      } else {
        if (response.status === 404) {
          setShowAddPatientForm(true);
        } else {
          if(response.status === 400){
            setErrorMessage("Error adding family member to the patient.");
            setTimeout(() => {
              setErrorMessage("");
            }, 5000);
          }
          console.error("Error adding family member to the patient.");
        }
      }
    } catch (error) {
      console.error("An error occurred while adding the family member:", error);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2>Registered Family Members</h2>
              <div className="mb-3">
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
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2>Add New Family Member</h2>
              <div className="mb-3">
                <label htmlFor="familyMemberUsername" className="form-label">
                  Family Member's Username:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="familyMemberUsername"
                  name="familyMemberUsername"
                  value={newFamilyMember.familyMemberUsername}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="relation" className="form-label">
                  Relation to Patient:
                </label>
                <select
                  className="form-select"
                  id="relation"
                  name="relation"
                  value={newFamilyMember.relation}
                  onChange={handleInputChange}
                >
                  <option value="">Select Relation</option>
                  <option value="Wife">Wife</option>
                  <option value="Husband">Husband</option>
                  <option value="Child">Child</option>
                </select>
              </div>
              <button className="btn btn-primary" onClick={handleAddFamilyMember}>
                Add Family Member
              </button>
              {errorMessage && (
                <div className="alert alert-danger mt-3" role="alert">
                  {errorMessage}
                </div>
              )}
              {successMessage && (
                <div className="alert alert-success mt-3" role="alert">
                  {successMessage}
                </div>
              )}
              {showAddPatientForm && <CreateNotFoundPatient />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyMembers;


