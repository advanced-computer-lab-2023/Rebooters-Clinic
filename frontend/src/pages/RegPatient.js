import React, { useState } from "react";
import Footer from "../components/footer";

const AddPatient = () => {
  const [newPatient, setNewPatient] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    dateOfBirth: "",
    gender: "",
    mobile_number: "",
    emergency_contact: {
      firstName: "",
      middleName: "",
      lastName: "",
      mobile_number: "",
    },
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // If the input name contains a dot, it's a nested field within emergency_contact
    if (name.includes("emergency_contact.")) {
      const nestedField = name.split(".")[1];
      setNewPatient({
        ...newPatient,
        emergency_contact: {
          ...newPatient.emergency_contact,
          [nestedField]: value,
        },
      });
    } else {
      setNewPatient({
        ...newPatient,
        [name]: value,
      });
    }
  };


  const handleAddPatient = async () => {
    if (
      !newPatient.username ||
      !newPatient.name ||
      !newPatient.email ||
      !newPatient.password ||
      !newPatient.dateOfBirth ||
      !newPatient.gender ||
      !newPatient.mobile_number
    ) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }
    try {
      const response = await fetch("/api/guest/createPatient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPatient),
      });

      if (response.ok) {
        setErrorMessage("Patient added successfully!");
        setNewPatient({
          username: "",
          name: "",
          email: "",
          password: "",
          dateOfBirth: "",
          gender: "",
          mobile_number: "",
          emergency_contact: {
            firstName: "",
            middleName: "",
            lastName: "",
            mobile_number: "",
          },
        });
        
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error);
      }
    } catch (error) {
      console.error("An error occurred while adding the patient:", error);
    }
  };

  return (
    <div className="site-wrap">
      <div className="login-cover" style={{ height: "1500px"}}>
        <div className="cover-color">
          <nav className="navbar navbar-expand-lg bg-white navbar-light shadow-sm px-5 py-3 py-lg-0">
            <img src={"clinic-logo.png"} width="100" alt="Clinic Logo" />
            <a href="/" className="navbar-brand p-0">
              <h1 className="m-0 text-primary">
                <i className="fa fa-tooth me-2"></i>El7a2ni
              </h1>
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarCollapse"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarCollapse">
              <div className="navbar-nav ms-auto py-0">
                <a href="/" className="nav-item nav-link active">
                  Home
                </a>
                <a href="/about" className="nav-item nav-link">
                  About
                </a>
                <a href="/service" className="nav-item nav-link">
                  Service
                </a>
                <div className="nav-item dropdown">
                  <a
                    href="#"
                    className="nav-link dropdown-toggle"
                    data-bs-toggle="dropdown"
                  >
                    Pages
                  </a>
                  <div className="dropdown-menu m-0">
                    <a href="price.html" className="dropdown-item">
                      Pricing Plan
                    </a>
                    <a href="team.html" className="dropdown-item">
                      Our Dentist
                    </a>
                    <a href="testimonial.html" className="dropdown-item">
                      Testimonial
                    </a>
                    <a href="appointment.html" className="dropdown-item">
                      Appointment
                    </a>
                  </div>
                </div>
                <a href="/contact" className="nav-item nav-link">
                  Contact
                </a>
              </div>
              <button
                type="button"
                className="btn text-dark"
                data-bs-toggle="modal"
                data-bs-target="#searchModal"
              >
                <i className="fa fa-search"></i>
              </button>
              <a href="" className="btn btn-primary py-2 px-4 ms-3">
                Appointment
              </a>
            </div>
          </nav>
    <div className="card mt-4" style={{ maxWidth: "1200px" ,marginLeft: "150px"}}>
      <div className="card-body">
      <h2 className="mb-4 mt-4 text-center">Register as a Patient</h2>
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
            value={newPatient.username}
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
            value={newPatient.name}
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
            value={newPatient.email}
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
            value={newPatient.password}
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
            value={newPatient.dateOfBirth}
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
            value={newPatient.gender}
            onChange={handleInputChange}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="mobile_number" className="form-label">
            Mobile Number:
          </label>
          <input
            type="tel"
            className="form-control"
            id="mobile_number"
            name="mobile_number"
            value={newPatient.mobile_number}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="emergency_contact.firstName" className="form-label">
            Emergency Contact First Name:
          </label>
          <input
            type="text"
            className="form-control"
            id="emergency_contact.firstName"
            name="emergency_contact.firstName"
            value={newPatient.emergency_contact.firstName}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="emergency_contact.middleName" className="form-label">
            Emergency Contact Middle Name:
          </label>
          <input
            type="text"
            className="form-control"
            id="emergency_contact.middleName"
            name="emergency_contact.middleName"
            value={newPatient.emergency_contact.middleName}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="emergency_contact.lastName" className="form-label">
            Emergency Contact Last Name:
          </label>
          <input
            type="text"
            className="form-control"
            id="emergency_contact.lastName"
            name="emergency_contact.lastName"
            value={newPatient.emergency_contact.lastName}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="emergency_contact.mobile_number" className="form-label">
            Emergency Contact Mobile Number:
          </label>
          <input
            type="tel"
            className="form-control"
            id="emergency_contact.mobile_number"
            name="emergency_contact.mobile_number"
            value={newPatient.emergency_contact.mobile_number}
            onChange={handleInputChange}
          />
        </div>
        <button className="btn btn-primary" onClick={handleAddPatient}>
          Add Patient
        </button>
        </div>
      </div>
      
    </div>
    <Footer />
    </div>
      
      </div>
  );
};

export default AddPatient;
