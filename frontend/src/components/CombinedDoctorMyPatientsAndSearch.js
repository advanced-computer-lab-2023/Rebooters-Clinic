import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const DoctorMyPatients = () => {
    const [patientsData, setPatientsData] = useState([]);
    const [patientStates, setPatientStates] = useState([]);
    const [selectedPatientProfile, setSelectedPatientProfile] = useState(null);
    const [selectedPatientPrescriptions, setSelectedPatientPrescriptions] = useState([]);
    const [error, setError] = useState("");
  
    useEffect(() => {
      viewPatients();
    }, []);
  
    const viewPatients = async () => {
      const response = await fetch("/api/doctor/doctor-mypatients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();
      if (response.ok) {
        setPatientsData(json);
        setPatientStates(new Array(json.length).fill(false)); // Initialize states for each patient
  
      }
    };
  
    const handleRowClick = async (patient) => {
      
      try {
        const response = await fetch("/api/doctor/doctor-patients-username", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            patientUsername: patient.username,
            patientName: patient.name,
          }),
        });
        const json = await response.json();
        if (response.ok && json.length > 0) {
          setSelectedPatientProfile(json[0]);
        } else {
          setError("An error occurred while fetching patient profile");
        }
  
        const response2 = await fetch("/api/doctor/doctor-patients/get-prescriptions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ patientName: patient.username }),
        });
        const json2 = await response2.json();
        if (response2.ok && json2.length > 0) {
          setSelectedPatientPrescriptions(json2);
        } else {
          setError("An error occurred while fetching patient prescriptions");
        }
      } catch (error) {
        setError("An error occurred while fetching patient prescriptions");
      }
    };
  
    return (
      <div>
        
        {patientsData.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Date of Birth</th>
                  <th>Gender</th>
                  <th>Mobile Number</th>
                  <th>Emergency Contact First Name</th>
                  <th>Emergency Contact Middle Name</th>
                  <th>Emergency Contact Last Name</th>
                  <th>Emergency Contact Mobile Phone</th>
                </tr>
              </thead>
              <tbody>
                {patientsData.map((patient) => (
                  <tr
                    key={patient._id}
                    onClick={() => handleRowClick(patient)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{patient.username}</td>
                    <td>{patient.email}</td>
                    <td>{new Date(patient.dateOfBirth).toLocaleDateString()}</td>
                    <td>{patient.gender}</td>
                    <td>{patient.mobile_number}</td>
                    <td>{patient.emergency_contact.firstName}</td>
                    <td>{patient.emergency_contact.middleName}</td>
                    <td>{patient.emergency_contact.lastName}</td>
                    <td>{patient.emergency_contact.mobile_number}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Loading...</p>
        )}
        {selectedPatientProfile && (
          <div className="card mt-3">
            <div className="card-body">
            <div className="d-flex justify-content-end">
  <button
    type="button"
    className="btn btn-outline-danger btn-sm"
    aria-label="Close"
    onClick={() => setSelectedPatientProfile(null)}
  >
    <span aria-hidden="true">&times;</span>
  </button>
</div>
              <h5 className="card-title">Patient Profile</h5>
              <p className="card-text">
                <strong>Username:</strong> {selectedPatientProfile.username}
                <br />
                <strong>Email:</strong> {selectedPatientProfile.email}
                <br />
                <strong>Date of Birth:</strong> {selectedPatientProfile.dateOfBirth}
                <br />
                <strong>Gender:</strong> {selectedPatientProfile.gender}
                <br />
                <strong>Mobile Number:</strong> {selectedPatientProfile.mobile_number}
                <br />
                <strong>Emergency Contact First Name:</strong>{" "}
                {selectedPatientProfile.emergency_contact.firstName}
                <br />
                <strong>Emergency Contact Middle Name:</strong>{" "}
                {selectedPatientProfile.emergency_contact.middleName}
                <br />
                <strong>Emergency Contact Last Name:</strong>{" "}
                {selectedPatientProfile.emergency_contact.lastName}
                <br />
                <strong>Emergency Contact Mobile Phone:</strong>{" "}
                {selectedPatientProfile.emergency_contact.mobile_number}
                <hr />
                <h5>Patient Prescriptions:</h5>
                {selectedPatientPrescriptions.map((prescription) => (
                  <div className="card" key={prescription._id}>
                    {selectedPatientPrescriptions.map((prescription) => (
    <div className="card" key={prescription._id}>
      <h6>Prescription Date: {new Date(prescription.date).toLocaleString()}</h6>
      {prescription.medicationInfo.map((medicine, index) => (
        <div key={index}>
          <p><strong>Medicine {index + 1}:</strong> {medicine.medicine}</p>
          <p><strong>Dosage:</strong> {medicine.dosage}</p>
          <p><strong>Instructions:</strong> {medicine.instructions}</p>
        </div>
      ))}
      <p><strong>Doctor:</strong> {prescription.doctorName}</p>
      <p>Status: {prescription.filled ? "Filled" : "Not Filled"}</p>
    </div>
  ))}
  
                  </div>
                ))}
              </p>
            </div>
          </div>
        )}
        {error && (
          <div className="alert alert-danger mt-3" role="alert">
            {error}
          </div>
        )}
      </div>
    );
  };



  

const SearchForPatient = () => {
  const [name, setName] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const handleSearch = async () => {
      try {
        const response = await fetch("/api/doctor/doctor-patients-name", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name }),
        });
        const json = await response.json();
        setSearchResults(json);
      } catch (error) {
        console.error("Error during search:", error);
      }
    };

    // Avoid making an unnecessary request when the name is empty
    if (name.trim() !== "") {
      handleSearch();
    } else {
      // Clear results if the search input is empty
      setSearchResults([]);
    }
  }, [name]);

  return (
    <div className="search-container">
      <form>
        <input
          type="text"
          placeholder="Search For Patient by Name"
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="form-control"
        />
      </form>
      {searchResults.length > 0 && (
        <div className="search-results">
          <h4>Search Results</h4>
          <table className="table">
            <thead>
              <tr>
                
                <th>Name</th>
                <th>Email</th>
                <th>Date of Birth</th>
                <th>Gender</th>
                <th>Mobile Number</th>
                <th>Emergency Contact</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((result) => (
                <tr >
                  
                  <td>{result.name}</td>
                  <td>{result.email}</td>
                  <td>{new Date(result.dateOfBirth).toLocaleDateString()}</td>
                  <td>{result.gender}</td>
                  <td>{result.mobile_number}</td>
                  <td>
                    {`${result.emergency_contact.firstName} ${result.emergency_contact.middleName} ${result.emergency_contact.lastName} (${result.emergency_contact.mobile_number})`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
  
};

const CombinedComponent = () => {
    const [showDoctorPatients, setShowDoctorPatients] = useState(true);
  
    return (
        <div className="container">
          <div className="row">
            <div className="col-md-10">
              {/* Title based on showDoctorPatients state */}
              <h2>{showDoctorPatients ? 'List of My Patients:' : 'Search for Patients'}</h2>
      
              {/* Button to toggle views */}
              <div className="d-flex justify-content-end mb-2">
              <button
                className="btn btn-primary mb-2"
                onClick={() => setShowDoctorPatients(!showDoctorPatients)}
              >
                {showDoctorPatients ? 'Search For Patient' : "Show Doctor's Patients"}
              </button>
              </div>
              {/* Render either DoctorMyPatients or SearchForPatient component based on state */}
              {showDoctorPatients ? <DoctorMyPatients /> : <SearchForPatient />}
            </div>
          </div>
        </div>
      );
      };
  export default CombinedComponent;
