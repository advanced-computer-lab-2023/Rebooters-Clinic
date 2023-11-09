import React, { useState } from "react";
import CreateNotFoundPatient from "./CreateNotFoundPatient";

const AddFamilyMember = () => {
  const [newFamilyMember, setNewFamilyMember] = useState({
    familyMemberUsername: "",
    relation: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showAddPatientForm, setShowAddPatientForm] = useState(false); // State to control AddPatient form visibility

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
        setErrorMessage(""); // Clear any previous error message
        // Clear the input fields if needed
        setNewFamilyMember({
          familyMemberUsername: "",
          relation: "",
        });
      } else {
        // Check if the response status is 404 (Not Found)
        if (response.status === 404) {
          // Family member not found, show the AddPatient form
          setShowAddPatientForm(true);
        } else {
          console.error("Error adding family member to the patient.");
        }
      }
    } catch (error) {
      console.error("An error occurred while adding the family member:", error);
    }
  };

  return (
    <div className="card mt-4">
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
            {/* Add other relation options as needed */}
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

        {/* Conditionally render the AddPatient form */}
        {showAddPatientForm && <CreateNotFoundPatient />}
      </div>
    </div>
  );
};

export default AddFamilyMember;
