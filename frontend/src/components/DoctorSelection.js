import React, { useState } from "react";

const DoctorSelection = () => {
  const [selectedDoctors, setSelectedDoctors] = useState([]);
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [searchCriteria, setSearchCriteria] = useState({
    speciality: "",
    name: "",
    date: "",
  });
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSearchCriteriaChange = (e) => {
    setSearchCriteria({
      ...searchCriteria,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearchDoctors = async (searchType) => {
    // Check if all input fields are empty
    if (
      searchCriteria.speciality === "" &&
      searchCriteria.name === "" &&
      searchCriteria.date === "" 
    ) {
      setErrorMessage("Please fill in at least one search criteria.");
      return;
    }

    try {
      let endpoint = "";
      if (searchType === "filterDoctor") {
        endpoint = "/api/patient/filterDoctor";
      } else if (searchType === "findDoctor") {
        endpoint = "/api/patient/findDoctor";
      }

      // Make an API call to the specified endpoint
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchCriteria),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      // Update the selected doctors with the new results, keeping the previous results
      setSelectedDoctors([...data]);

      // Clear the error message
      setErrorMessage(null);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleShowDoctorDetails = (doctor) => {
    // Set the selected doctor's details to display
    setDoctorDetails(doctor);
  };

  const handleCloseDoctorDetails = () => {
    // Clear the selected doctor's details
    setDoctorDetails(null);
  };

  const errorStyle = {
    color: "red",
    fontWeight: "bold",
  };

  return (
    <div>
      <div>
        <h4>Search/filter Doctor(s):</h4>
        <input
          type="text"
          placeholder="Speciality"
          name="speciality"
          value={searchCriteria.speciality}
          onChange={handleSearchCriteriaChange}
        />
          <input
          type="text"
          placeholder="Name"
          name="name"
          value={searchCriteria.name}
          onChange={handleSearchCriteriaChange}
        />
        <button onClick={() => handleSearchDoctors("findDoctor")}>Search (By Speciality or/and Name)</button>
        <br></br>
        <input
          type="datetime-local"
          placeholder="Date"
          name="date"
          value={searchCriteria.date}
          onChange={handleSearchCriteriaChange}
        />
        <button onClick={() => handleSearchDoctors("filterDoctor")}>Search (Filter by Speciality and/or availability)</button>
      </div>

      {errorMessage && <p style={errorStyle}>{errorMessage}</p>}

      {selectedDoctors.length > 0 && !doctorDetails && (
        <div>
          <h3>Search/Filter Results:</h3>
          <ul>
            {selectedDoctors.map((doctor) => (
              <li key={doctor.id}>
                <p>{doctor.name}</p>
                <button onClick={() => handleShowDoctorDetails(doctor)}>Show Details</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {doctorDetails && (
        <div>
          <h3>Doctor Details:</h3>
          <p>Name: {doctorDetails.name}</p>
          <p>Speciality: {doctorDetails.speciality}</p>
          <p>Affiliation (Hospital): {doctorDetails.affiliation}</p>
          <p>Educational Background: {doctorDetails.education}</p>
          <button onClick={handleCloseDoctorDetails}>Close Details</button>
        </div>
      )}
    </div>
  );
};

export default DoctorSelection;
