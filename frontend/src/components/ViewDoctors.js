import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ViewSlotsAndMakeAppointment from "./ViewSlotsAndMakeAppointment";

const ViewDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState("");
  const [patientUsername, setPatientUsername] = useState("");
  const [showBookAppointment, setShowBookAppointment] = useState(false);
  const [chosenDoctor, setChosenDoctor] = useState(null);

  const handleBookAppointment = (doctor) => {
    setShowBookAppointment(true);
    setChosenDoctor(doctor);
  };

  const handleCloseBookAppointment = () => {
    setShowBookAppointment(false);
    setChosenDoctor(null);
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

  useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <div className="container">
      {showBookAppointment && (
        <div className="modal-overlay">
          <div className="card">
            <div className="editPrescription" onHide={() => setShowBookAppointment(false)}>
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
      <h2 style={{ textAlign: "center" }}>Available Doctors:</h2>
      {error && <p className="text-danger">{error}</p>}
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
          {doctors.map((doctor) => (
            <tr key={doctor._id}>
              <td>{doctor.name}</td>
              <td>{doctor.speciality}</td>
              <td>${doctor.sessionPrice.toFixed(2)}</td>
              <td>
                <button className="btn btn-primary" onClick={(e) => {handleBookAppointment(doctor)}}>
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
