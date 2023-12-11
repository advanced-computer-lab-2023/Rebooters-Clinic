import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ViewSlotsAndMakeAppointment from "./ViewSlotsAndMakeAppointment";

const ViewDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState("");
  const [patientUsername, setPatientUsername] = useState("");
  const [showBookAppointment, setShowBookAppointment] = useState(false);
  const [chosenDoctor, setChosenDoctor] = useState(null);
  const [selectedDoctors, setSelectedDoctors] = useState([]);
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [searchCriteria, setSearchCriteria] = useState({
    speciality: "",
    name: "",
    date: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleBookAppointment = (doctor) => {
    setShowBookAppointment(true);
    setChosenDoctor(doctor);
  };

  const handleCloseBookAppointment = () => {
    setShowBookAppointment(false);
    setChosenDoctor(null);
  };

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
      setError("Please fill in at least one search criteria.");
      return;
    }

    try {
      let endpoint = "";
      if (searchType === "filterDoctor") {
        endpoint = "/api/patient/filterDoctor";
        if (searchCriteria.date !== "") {
          searchCriteria.date += ":00.000+00:00";
        }
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
      setDoctors(data);

      // Clear the error message
      setError("");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await fetch("/api/patient/viewDoctors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ patientUsername }),
      });
      const json = await response.json();

      if (response.ok) {
        setDoctors(json);
      } else {
        setError("An error occurred while fetching doctors");
      }
    } catch (error) {
      setError("An error occurred while fetching doctors");
    }
  };

  const errorStyle = {
    color: "red",
    fontWeight: "bold",
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <div className="container">
      {showBookAppointment && (
        <div className="modal-overlay">
          <div className="card" style={{ width: '60%', height: '80%' }}> 
            <div
              className="editPrescription"
              onHide={() => setShowBookAppointment(false)}
            >
              <ViewSlotsAndMakeAppointment doctor={chosenDoctor.username} />
            </div>
            <button
              className="btn btn-danger"
              onClick={handleCloseBookAppointment}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <div className="card">
      <h2 style={{ textAlign: "center" }}>Available Doctors:</h2>
        {error && <p className="text-danger">{error}</p>}
        <div>
          <button className="btn btn-secondary" onClick={handleToggleFilters}>
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>
        {showFilters && (
          <>
            <div>
              <h4>Search/filter Doctor(s):</h4>
              <input
                type="text"
                placeholder="Name"
                name="name"
                value={searchCriteria.name}
                onChange={handleSearchCriteriaChange}
              />
              <button onClick={() => handleSearchDoctors("findDoctor")} className="btn btn-primary">
                Search 
              </button>
              <br></br>
              <select
                className="btn btn-secondary dropdown-toggle"
                placeholder="Speciality"
                name="speciality"
                value={searchCriteria.speciality}
                onChange={handleSearchCriteriaChange}
              >
                <option value="">Choose Speciality</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Dentistry">Dentistry</option>
                <option value="Gynecology">Gynecology</option>
                
              </select>
              <input
                type="datetime-local"
                placeholder="Date"
                name="date"
                value={searchCriteria.date}
                onChange={handleSearchCriteriaChange}
              />
              <button onClick={() => handleSearchDoctors("filterDoctor")} className="btn btn-primary">
               Filter
              </button>
            </div>
            <div >
            <button className="btn btn-danger" onClick={fetchDoctors}>
              Remove Filters
            </button>
          </div>
          </>
        )}
      </div>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Speciality</th>
            <th>Session Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.length > 0 &&
            doctors.map((doctor) => (
              <tr key={doctor._id}>
                <td>{doctor.name}</td>
                <td>{doctor.speciality}</td>
                <td>${doctor.sessionPrice.toFixed(2)}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={(e) => {
                      handleBookAppointment(doctor);
                    }}
                  >
                    Book Appointment
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewDoctors;
