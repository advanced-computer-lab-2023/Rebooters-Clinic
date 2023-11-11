import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";


const DoctorRegistrationRequest = () => {
  const [newDoctor, setNewDoctor] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    dateOfBirth: "",
    hourlyRate: "",
    affiliation: "",
    speciality: "",
    educationalBackground: "",
    idDocument: null,
    medicalLicense: null,
    medicalDegree: null,
  });
  const [submissionStatus, setSubmissionStatus] = useState(""); 
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setNewDoctor({
        ...newDoctor,
        [name]: files[0], // Assuming only one file is uploaded
      });
    } else {
      setNewDoctor({
        ...newDoctor,
        [name]: e.target.value,
      });
    }
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    if (
      !newDoctor.username ||
      !newDoctor.name ||
      !newDoctor.email ||
      !newDoctor.password ||
      !newDoctor.dateOfBirth ||
      !newDoctor.hourlyRate ||
      !newDoctor.affiliation ||
      !newDoctor.speciality ||
      !newDoctor.educationalBackground ||
      !newDoctor.idDocument === null ||
      !newDoctor.medicalLicense === null ||
      !newDoctor.medicalDegree === null
    ) {
      setSubmissionStatus("error");
      setMessage("Please fill in all required fields.");
      return;
    }
    const formData = new FormData();
    for (let key in newDoctor) {
      formData.append(key, newDoctor[key]);
    }
    try {
      console.log("before try")
      const response = await fetch("/api/guest/createNewDoctorRequest", {
        method: "POST",
        body: formData,
      });
      console.log("fetched")


      if (response.ok) {
        setSubmissionStatus("success");
        setMessage("Doctor request added successfully!");
        console.log(message)
        setNewDoctor({
          username: "",
          name: "",
          email: "",
          password: "",
          dateOfBirth: "",
          hourlyRate: "",
          affiliation: "",
          speciality: "",
          educationalBackground: "",
          idDocument: null,
          medicalLicense: null,
          medicalDegree: null,
        });
        console.log("Doctor request added successfully!");
      } else {
        setSubmissionStatus("error");
        setMessage("Error adding doctor request to the database.");
        console.error("Error adding doctor request to the database.");
      }
    } catch (error) {
      setSubmissionStatus("error");
      setMessage("An error occurred while adding the doctor request: " + error.message);
      console.error("An error occurred while adding the doctor request:", error);
    }
  };

  return (
    <div className="card container mt-4">
      <div className="card-body">
        <h2>Request to register as a Doctor</h2>
        {submissionStatus === "success" && (
          <div className="alert alert-success">{message}</div>
        )}
        {submissionStatus === "error" && (
          <div className="alert alert-danger">{message}</div>
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
            value={newDoctor.username}
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
            value={newDoctor.name}
            onChange={handleInputChange}
          />
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
            value={newDoctor.email}
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
            value={newDoctor.password}
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
            value={newDoctor.dateOfBirth}
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
            value={newDoctor.hourlyRate}
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
            value={newDoctor.affiliation}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="speciality" className="form-label">
          Speciality:
          </label>
          <input
            type="text"
            className="form-control"
            id="speciality"
            name="speciality"
            value={newDoctor.speciality}
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
            value={newDoctor.educationalBackground}
            onChange={handleInputChange}
          />
          </div>
          <div className="mb-3">
          <label htmlFor="idDocument" className="form-label">
            ID Document:
          </label>
          <input
            type="file"
            className="form-control"
            id="idDocument"
            name="idDocument"
            onChange={handleInputChange}
          />
        </div> 
        <div className="mb-3">
          <label htmlFor="medicalLicense" className="form-label">
            Medical License Document:
          </label>
          <input
            type="file"
            className="form-control"
            id="medicalLicense"
            name="medicalLicense"
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="medicalDegree" className="form-label">
            Medical Degree Document:
          </label>
          <input
            type="file"
            className="form-control"
            id="medicalDegree"
            name="medicalDegree"
            onChange={handleInputChange}
          />
        </div>
        <button className="btn btn-primary" onClick={handleAddDoctor}>
          Request to be a Doctor
          
        </button>
      </div>
    </div>
  );
};

export default DoctorRegistrationRequest;
