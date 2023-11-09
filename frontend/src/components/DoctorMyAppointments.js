import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const DoctorMyAppointments = () => {
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedPatientProfile, setSelectedPatientProfile] = useState(null);
  const [selectedPatientPrescriptions, setSelectedPatientPrescriptions] =useState([]);
  const [selectedPatientRecords, setSelectedPatientRecords] =useState([]);
  const [error, setError] = useState("");
  const [filterByStatusData, setFilterByStatusData] = useState([]);
  const [filterByDateData, setFilterByDateData] = useState([]);
  const [customStatus, setCustomStatus] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" or "desc"
  const [sortByField, setSortByField] = useState("datetime"); // Default to sorting by appointment datetime
  const [filterByDateRange, setFilterByDateRange] = useState([]);
  const [startDate, setStartDate] = useState(''); // Input for start date
  const [endDate, setEndDate] = useState('');     // Input for end date

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch("/api/doctor/doctor-myappointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },  
      });
      const json = await response.json();
      if (response.ok) {
        if (Array.isArray(json)) {
          setAppointmentsData(json);
        }
        else {
          setAppointmentsData([]);
        }

        setFilterByDateData([]);
        setFilterByStatusData([]);
        setFilterByDateRange([]);
      } else {
        setError("An error occurred while fetching appointments");
      }
    } catch (error) {
      setError("An error occurred while fetching appointments");
    }
  };

  const filterAppointmentsByStatus = async (status) => {
    try {
      const response = await fetch("/api/doctor/doctor-patients/status-filter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      const json = await response.json();
      if (response.ok) {
        setAppointmentsData([]);
        setFilterByDateData([]);
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

  const filterAppointmentsByDate = async () => {
    try {
      const response = await fetch("/api/doctor/doctor-patients/upcoming-date-filter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();
      if (response.ok) {
        setFilterByDateData(json);
        setAppointmentsData([]);
        setFilterByStatusData([]);
        setFilterByDateRange([]);
      } else {
        setError("An error occurred while filtering appointments by upcoming date");
      }
    } catch (error) {
      setError("An error occurred while filtering appointments by date");
    }
  };

  const filterAppointmentsByPastDate = async () => {
    try {
      const response = await fetch("/api/doctor/past-appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();
      if (response.ok) {
        setFilterByDateData(json);
        setAppointmentsData([]);
        setFilterByStatusData([]);
        setFilterByDateRange([]);
      } else {
        setError("An error occurred while filtering appointments by past date");
      }
    } catch (error) {
      setError("An error occurred while filtering appointments by date");
    }
  };

  const filterAppointmentsByDateRange = async () => {
    try {
      const response = await fetch("/api/doctor/doctor-patients/date-range-filter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ startDate, endDate}),
      });
      const json = await response.json();
      if (response.ok) {
        setFilterByDateRange(json);
        setFilterByDateData([]);
        setAppointmentsData([]);
        setFilterByStatusData([]);
      } else {
        setError("An error occurred while filtering appointments by date range");
      }
    } catch (error) {
      setError("An error occurred while filtering appointments by date range");
    }
  };

  const handleRowClick = async (appointment) => {
    setSelectedPatientPrescriptions([]);
    setSelectedPatientRecords([]);
    try {
      const response = await fetch("/api/doctor/doctor-patients-username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ patientUsername: appointment.patient }),
      });
      const json = await response.json();
      if (response.ok && json.length > 0) {
        setSelectedAppointment(appointment);
        setSelectedPatientProfile(json[0]);
      } else {
        setError("An error occurred while fetching patient profile");
      }
      const response2 = await fetch(
        "/api/doctor/doctor-patients/get-prescriptions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ patientName: json[0].name }),
        }
      );
      const json2 = await response2.json();
      if (response2.ok && json2.length > 0) {
        setSelectedPatientPrescriptions(json2);
      }

    const response3 = await fetch("/api/doctor/get-health-records",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ patientUsername: appointment.patient }),
      }
    );
    const json3 = await response3.json();
    if (response3.ok) {
      setSelectedPatientRecords(json3.healthRecords);
    }
  } catch (error) {
    setError("An error occurred while fetching patient profile");
  }
  };

  const handleSort = (field) => {
    if (field === sortByField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortByField(field);
      setSortOrder("asc");
    }
  };
  const getSortIcon = (field) => {
    if (field === sortByField) {
      return sortOrder === "asc" ? "▲" : "▼";
    }
    return null;
  };

  const handleCloseCard = () => {
    setSelectedAppointment(null);
    setSelectedPatientProfile(null);
    setSelectedPatientPrescriptions([]);
    setSelectedPatientRecords([]);
  };

  const sortedAppointments = [...appointmentsData].sort((a, b) => {
    const dateA = new Date(a.datetime);
    const dateB = new Date(b.datetime);
    const comparison = dateA - dateB;
    return sortOrder === "asc" ? comparison : -comparison;
  });

  return (
    <div className="container">
      <h2>My Appointments:</h2>
      <div>
        <label>Start Date:</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      </div>
      <div>
        <label>End Date:</label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>
      <button className="btn btn-primary" onClick={filterAppointmentsByDateRange}>
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
      <button className="btn btn-primary" onClick={filterAppointmentsByDate}>
        Filter by Upcoming Date
      </button>
      <button className="btn btn-primary" onClick={filterAppointmentsByPastDate}>
        Filter by Past Date
      </button>
      <button className="btn btn-primary" onClick={fetchAppointments}>
        Remove Filters
      </button>
      {error && <p className="text-danger">{error}</p>}
      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Patient (click to view profile)</th>
            <th
              onClick={() => handleSort("datetime")}
              style={{ cursor: "pointer" }}
            >
              Date and Time {getSortIcon("datetime")}
            </th>
            <th>Status </th>
          </tr>
        </thead>
        <tbody>
          {filterByStatusData.length > 0
            ? filterByStatusData.map((appointment) => (
                <tr
                  key={appointment._id}
                  onClick={() => handleRowClick(appointment)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{appointment._id}</td>
                  <td>{appointment.patient}</td>
                  <td>{new Date(appointment.datetime).toLocaleString()}</td>
                  <td>{appointment.status}</td>
                </tr>
              ))
            : filterByDateData.length > 0
            ? filterByDateData.map((appointment) => (
                <tr
                  key={appointment._id}
                  onClick={() => handleRowClick(appointment)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{appointment._id}</td>
                  <td>{appointment.patient}</td>
                  <td>
                    {new Date(appointment.datetime).toLocaleDateString()}{" "}
                    {new Date(appointment.datetime).toLocaleTimeString()}
                  </td>
                  <td>{appointment.status}</td>
                </tr>
              ))
            : sortedAppointments.length > 0
            ? sortedAppointments.map((appointment) => (
                <tr
                  key={appointment._id}
                  onClick={() => handleRowClick(appointment)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{appointment._id}</td>
                  <td>{appointment.patient}</td>
                  <td>
                    {new Date(appointment.datetime).toLocaleDateString()}{" "}
                    {new Date(appointment.datetime).toLocaleTimeString()}
                  </td>
                  <td>{appointment.status}</td>
                </tr>
            ))
            : filterByDateRange.length > 0
            ? filterByDateRange.map((appointment) => (
              <tr
              key={appointment._id}
              onClick={() => handleRowClick(appointment)}
              style={{ cursor: "pointer" }}
            >
              <td>{appointment._id}</td>
              <td>{appointment.patient}</td>
              <td>
                    {new Date(appointment.datetime).toLocaleDateString()}{" "}
                    {new Date(appointment.datetime).toLocaleTimeString()}
                  </td>
              <td>{appointment.status}</td>
            </tr>
              ))
            : appointmentsData.map((appointment) => (
                <tr
                  key={appointment._id}
                  onClick={() => handleRowClick(appointment)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{appointment._id}</td>
                  <td>{appointment.patient}</td>
                  <td>
                    {new Date(appointment.datetime).toLocaleDateString()}{" "}
                    {new Date(appointment.datetime).toLocaleTimeString()}
                  </td>
                  <td>{appointment.status}</td>
                </tr>
              ))}
        </tbody>
      </table>

      {selectedPatientProfile && (
        <div className="card mt-3">
          <div className="card-body">
            <h5 className="card-title">Patient Profile</h5>
            <p className="card-text">
              <strong>Username:</strong> {selectedPatientProfile.username}
              <br />
              <strong>Name:</strong> {selectedPatientProfile.name}
              <br />
              <strong>National ID:</strong> {selectedPatientProfile.national_id}
              <br />
              <strong>Email:</strong> {selectedPatientProfile.email}
              <br />
              <strong>Date of Birth:</strong>{" "}
              {selectedPatientProfile.dateOfBirth}
              <br />
              <strong>Gender:</strong> {selectedPatientProfile.gender}
              <br />
              <strong>Mobile Number:</strong>{" "}
              {selectedPatientProfile.mobile_number}
              <br />
              <strong>Emergency Contact:</strong>{" "}
              {selectedPatientProfile.emergency_contact}
              <hr></hr>
              <h5>Patient Health Record:</h5>
              {selectedPatientRecords.length > 0 && selectedPatientRecords.map((record) => (
                <div>
                  <h6>Record Date: {record.date}</h6>
                  <p>
                    <strong>Doctor:</strong> {record.doctor}
                  </p>
                  <p>
                    <strong>diagnosis:</strong> {record.diagnosis}
                  </p>
                  <p>
                    <strong>Treatment:</strong> {record.treatment}
                  </p>
                  <p>
                    <strong>Notes:</strong> {record.notes}
                  </p>
                </div>
              ))}
              <hr></hr>
              <h5>Patient Prescriptions:</h5>
              {selectedPatientPrescriptions.length > 0 && selectedPatientPrescriptions.map((prescription) => (
                <div key={prescription._id}>
                  <h6>Prescription Date: {prescription.date}</h6>
                  <p>
                    <strong>Medication:</strong> {prescription.medication}
                  </p>
                  <p>
                    <strong>Dosage:</strong> {prescription.dosage}
                  </p>
                  <p>
                    <strong>Instructions:</strong> {prescription.instructions}
                  </p>
                  <p>
                    <strong>Doctor: </strong>
                    {prescription.doctorName}
                  </p>
                  {prescription.filled ? (
                    <p>Status: Filled</p>
                  ) : (
                    <p>Status: Not Filled</p>
                  )}
                </div>
              ))}

              
            </p>
            <button className="btn btn-primary" onClick={handleCloseCard}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorMyAppointments;
