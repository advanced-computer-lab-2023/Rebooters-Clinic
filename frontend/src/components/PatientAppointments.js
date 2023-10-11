import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const PatientAppointments = () => {
  const [patientUsername, setPatientUsername] = useState("");
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [error, setError] = useState("");
  const [filterByStatusData, setFilterByStatusData] = useState([]);
  const [customStatus, setCustomStatus] = useState("");
  const [filterByDateRange, setFilterByDateRange] = useState([]);
  const [startDate, setStartDate] = useState(""); // Input for start date
  const [endDate, setEndDate] = useState(""); // Input for end date

  const handlePatientUsernameChange = (e) => {
    setPatientUsername(e.target.value);
  };
  const handleFetchAppointments = () => {
    if (patientUsername) {
      fetchAppointments();
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch("/api/patient/viewMyAppointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ patientUsername }),
      });
      const json = await response.json();
      if (response.ok) {
        setAppointmentsData(json);
        setFilterByStatusData([]);
        setFilterByDateRange([]);
      } else {
        setError("An error occurred while fetching appointments");
      }
    } catch (error) {
      setError("An error occurred while fetching appointments");
    }
  };

  const filterAppointmentsByStatus = async (appointmentStatus) => {
    try {
      const response = await fetch("/api/patient/filterAppointmentsByStatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ patientUsername, appointmentStatus }),
      });
      const json = await response.json();
      if (response.ok) {
        setAppointmentsData([]);
        setFilterByStatusData(json);
        setFilterByDateRange([]);
        setCustomStatus(""); // Clear the custom status input field
      } else {
        setError("An error occurred while filtering appointments by status");
      }
    } catch (error) {
      setError("An error occurred while filtering appointments by status");
    }
  };

  const filterAppointmentsByDateRange = async () => {
    try {
      const response = await fetch("/api/patient/filterAppointmentsByDate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ patientUsername, startDate, endDate }),
      });
      const json = await response.json();
      if (response.ok) {
        setFilterByDateRange(json);
        setAppointmentsData([]);
        setFilterByStatusData([]);
      } else {
        setError(
          "An error occurred while filtering appointments by date range"
        );
      }
    } catch (error) {
      setError("An error occurred while filtering appointments by date range");
    }
  };

  return (
    <div className="container">
      <h2>My Appointments:</h2>
      <div>
        <label>Patient Username:</label>
        <input
          type="text"
          value={patientUsername}
          onChange={handlePatientUsernameChange}
        />
      </div>
      <button className="btn btn-primary" onClick={handleFetchAppointments}>
        Submit
      </button>
      <div>
        <label>Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div>
        <label>End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <button
        className="btn btn-primary"
        onClick={filterAppointmentsByDateRange}
      >
        Filter by Date Range
      </button>
      <input
        type="text"
        className="form-control"
        placeholder="Custom Status"
        value={customStatus}
        onChange={(e) => setCustomStatus(e.target.value)}
      />
      <button
        className="btn btn-primary"
        onClick={() => filterAppointmentsByStatus(customStatus)}
      >
        Filter by Status
      </button>
      <button className="btn btn-primary" onClick={fetchAppointments}>
        Remove Filters
      </button>
      {error && <p className="text-danger">{error}</p>}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Doctor</th>
            <th>Date and Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filterByStatusData.length > 0
            ? filterByStatusData.map((appointment) => (
                <tr>
                  <td>{appointment._id}</td>
                  <td>{appointment.doctor}</td>
                  <td>
                    {new Date(appointment.datetime).toLocaleDateString()}{" "}
                    {new Date(appointment.datetime).toLocaleTimeString()}
                  </td>
                  <td>{appointment.status}</td>
                </tr>
              ))
            : filterByDateRange.length > 0
            ? filterByDateRange.map((appointment) => (
                <tr>
                  <td>{appointment._id}</td>
                  <td>{appointment.doctor}</td>
                  <td>
                    {new Date(appointment.datetime).toLocaleDateString()}{" "}
                    {new Date(appointment.datetime).toLocaleTimeString()}
                  </td>
                  <td>{appointment.status}</td>
                </tr>
              ))
            : appointmentsData.map((appointment) => (
                <tr>
                  <td>{appointment._id}</td>
                  <td>{appointment.doctor}</td>
                  <td>
                    {new Date(appointment.datetime).toLocaleDateString()}{" "}
                    {new Date(appointment.datetime).toLocaleTimeString()}
                  </td>
                  <td>{appointment.status}</td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientAppointments;
