// DoctorSearch.js

import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const DoctorSearch = () => {
  const [searchCriteria, setSearchCriteria] = useState({
    speciality: "",
    name: "",
  });
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    // This effect will run when search criteria change
    // Make a request to the server to fetch doctors based on search criteria
    // You can use either findDoctor or filterDoctor method here
    // Example:
      fetchDoctors(searchCriteria);
  }, [searchCriteria]);

  const handleSearchCriteriaChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria({
      ...searchCriteria,
      [name]: value,
    });
  };

  const handleDoctorSelection = (doctor) => {
    // Update the selected doctor
    setSelectedDoctor(doctor);

    // Add the selected doctor to the patient's selectedDoctors attribute
    // Make a request to the server to update the patient's data
    // Example:
    // addSelectedDoctorToPatient(doctor);
  };

  return (
    <div className="container">
      <h2>Doctor Search</h2>
      <form>
        <div className="form-group">
          <label>Doctor's Speciality</label>
          <input
            type="text"
            className="form-control"
            name="speciality"
            value={searchCriteria.speciality}
            onChange={handleSearchCriteriaChange}
          />
        </div>
        <div className="form-group">
          <label>Doctor's Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={searchCriteria.name}
            onChange={handleSearchCriteriaChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>

      {doctors.length > 0 ? (
        <div>
          <h3>Search Results</h3>
          <ul>
            {doctors.map((doctor) => (
              <li key={doctor._id}>
                {doctor.name} - {doctor.speciality}
                <button onClick={() => handleDoctorSelection(doctor)}>
                  Select
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {selectedDoctor ? (
        <div>
          <h3>Selected Doctor</h3>
          <p>{selectedDoctor.name} - {selectedDoctor.speciality}</p>
        </div>
      ) : null}
    </div>
  );
};

export default DoctorSearch;
