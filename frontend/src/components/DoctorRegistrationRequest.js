import React, { useState } from "react";

const DoctorRegistrationRequest = () => {
  const [newDoctorRequest, setNewDoctorRequest] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    dateOfBirth: "",
    hourlyRate: "",
    speciality: "",
    affiliation: "",
    educationalBackground: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDoctorRequest({
      ...newDoctorRequest,
      [name]: value,
    });
  };

  const handleAddDoctorRequest = async () => {
    // Check if any required fields are empty
    if (
      !newDoctorRequest.username ||
      !newDoctorRequest.name ||
      !newDoctorRequest.email ||
      !newDoctorRequest.password ||
      !newDoctorRequest.dateOfBirth
    ) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch("/api/guest/createNewDoctorRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDoctorRequest),
      });

      if (response.ok) {
        setErrorMessage("Created a new request");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error);
      }
    } catch (error) {
      console.error("An error occurred while adding the doctor request:", error);
    }
  };

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h2>Request to register as a Doctor</h2>
        {errorMessage && (
          <div className="alert alert-danger">{errorMessage}</div>
        )}
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username:
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
            value={newDoctorRequest.username}
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
            value={newDoctorRequest.name}
            onChange={handleInputChange}
          />
        </div>
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email:
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={newDoctorRequest.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password:
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={newDoctorRequest.password}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="dateOfBirth" className="form-label">
            Date of Birth:
          </label>
          <input
            type="date"
            className="form-control"
            id="dateOfBirth"
            name="dateOfBirth"
            value={newDoctorRequest.dateOfBirth}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="hourlyRate" className="form-label">
            Hourly Rate:
          </label>
          <input
            type="text"
            className="form-control"
            id="hourlyRate"
            name="hourlyRate"
            value={newDoctorRequest.hourlyRate}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="speciality" className="form-label">
          speciality:
          </label>
          <input
            type="text"
            className="form-control"
            id="speciality"
            name="speciality"
            value={newDoctorRequest.speciality}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="affiliation" className="form-label">
            Affiliation:
          </label>
          <input
            type="text"
            className="form-control"
            id="affiliation"
            name="affiliation"
            value={newDoctorRequest.affiliation}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="educationalBackground" className="form-label">
            Educational Background:
          </label>
          <input
            type="text"
            className="form-control"
            id="educationalBackground"
            name="educationalBackground"
            value={newDoctorRequest.educationalBackground}
            onChange={handleInputChange}
          />
        <button className="btn btn-primary" onClick={handleAddDoctorRequest}>
          Send request as a Doctor
        </button>
      </div>
    </div>
  );
};

export default DoctorRegistrationRequest;
