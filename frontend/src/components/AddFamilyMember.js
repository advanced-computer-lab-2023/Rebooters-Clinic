import React, { useState } from "react";

const AddFamilyMember = () => {
  const [newFamilyMember, setNewFamilyMember] = useState({
    username: "",
    name: "",
    nationalId: "",
    age: "",
    gender: "",
    relation: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFamilyMember({
      ...newFamilyMember,
      [name]: value,
    });
  };

  const handleAddFamilyMember = async () => {
    if (
      !newFamilyMember.username ||
      !newFamilyMember.name ||
      !newFamilyMember.nationalId ||
      !newFamilyMember.age ||
      !newFamilyMember.gender ||
      !newFamilyMember.relation
    ) {
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
          username: "",
          name: "",
          nationalId: "",
          age: "",
          gender: "",
          relation: "",
        });
      } else {
        console.error("Error adding family member to the patient.");
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
        <label htmlFor="username" className="form-label">
          Patient's Username:
        </label>
        <input
          type="text"
          className="form-control"
          id="username"
          name="username"
          value={newFamilyMember.username}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Name:
        </label>
        <input
          type="text"
          className="form-control"
          id="name"
          name="name"
          value={newFamilyMember.name}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="nationalId" className="form-label">
          National ID:
        </label>
        <input
          type="text"
          className="form-control"
          id="nationalId"
          name="nationalId"
          value={newFamilyMember.nationalId}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="age" className="form-label">
          Age:
        </label>
        <input
          type="number"
          className="form-control"
          id="age"
          name="age"
          value={newFamilyMember.age}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="gender" className="form-label">
          Gender:
        </label>
        <select
          className="form-select"
          id="gender"
          name="gender"
          value={newFamilyMember.gender}
          onChange={handleInputChange}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
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
        </div>
      </div>
  );
};

export default AddFamilyMember;
