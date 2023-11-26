import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AddPrescription from "./AddPrescription";
import EditPrescription from "./EditPrescription";
import AddHealthRecord from "./AddHealthRecord";
import ScheduleFollowup from "./ScheduleFollowup";

const DoctorMyAppointments = () => {
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [selectedPatientProfile, setSelectedPatientProfile] = useState(null);
  const [selectedPatientPrescriptions, setSelectedPatientPrescriptions] =
    useState([]);
  const [selectedPatientRecords, setSelectedPatientRecords] = useState([]);
  const [error, setError] = useState("");
  const [filterByStatusData, setFilterByStatusData] = useState([]);
  const [filterByDateData, setFilterByDateData] = useState([]);
  const [customStatus, setCustomStatus] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" or "desc"
  const [sortByField, setSortByField] = useState("datetime"); // Default to sorting by appointment datetime
  const [filterByDateRange, setFilterByDateRange] = useState([]);
  const [startDate, setStartDate] = useState(""); // Input for start date
  const [endDate, setEndDate] = useState(""); // Input for end date
  const [patientUsername, setPatientUsername] = useState(""); // Input for end date
  const [showAddPrescription, setShowAddPrescription] = useState(false);
  const [showEditPrescription, setShowEditPrescription] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showAddHealthRecord, setShowAddHealthRecord] = useState(false);
  const [showScheduleFollowup, setShowScheduleFollowup] = useState(false);

  const handleAddPrescription = (patient) => {
    setShowAddPrescription(true);
    setPatientUsername(patient);
  };

  const handleCloseAddPrescription = () => {
    setShowAddPrescription(false);
  };

  const handleViewProfile = (patient) => {
    setShowProfile(true);
    setPatientUsername(patient);
  };

  const handleCloseViewProfile = () => {
    setShowProfile(false);
  };

  const handleEditPrescription = (patient) => {
    setShowEditPrescription(true);
    setPatientUsername(patient);
  };

  const handleCloseEditPrescription = () => {
    setShowEditPrescription(false);
  };

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleAddHealthRecord = (patient) => {
    setPatientUsername(patient);
    setShowAddHealthRecord(true);
  };

  const handleCloseAddHealthRecord = () => {
    setShowAddHealthRecord(false);
  };

  const handleScheduleFollowup = (patient) => {
    setPatientUsername(patient);
    setShowScheduleFollowup(true);
  };

  const handleCloseScheduleFollowup = () => {
    setShowScheduleFollowup(false);
  };

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
        } else {
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
      const response = await fetch(
        "/api/doctor/doctor-patients/status-filter",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );
      const json = await response.json();
      if (response.ok) {
        setAppointmentsData([]);
        setFilterByDateData([]);
        setFilterByStatusData(json);
        setFilterByDateRange([]);
      } else {
        setError("An error occurred while filtering appointments by status");
      }
    } catch (error) {
      setError("An error occurred while filtering appointments by status");
    }
  };

  const filterAppointmentsByDate = async () => {
    try {
      const response = await fetch(
        "/api/doctor/doctor-patients/upcoming-date-filter",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const json = await response.json();
      if (response.ok) {
        setFilterByDateData(json);
        setAppointmentsData([]);
        setFilterByStatusData([]);
        setFilterByDateRange([]);
      } else {
        setError(
          "An error occurred while filtering appointments by upcoming date"
        );
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
      const response = await fetch(
        "/api/doctor/doctor-patients/date-range-filter",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ startDate, endDate }),
        }
      );
      const json = await response.json();
      if (response.ok) {
        setFilterByDateRange(json);
        setFilterByDateData([]);
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
          body: JSON.stringify({ patientName: json[0].username }),
        }
      );
      const json2 = await response2.json();
      if (response2.ok && json2.length > 0) {
        setSelectedPatientPrescriptions(json2);
      }

      const response3 = await fetch("/api/doctor/get-health-records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ patientUsername: appointment.patient }),
      });
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

  const sortedAppointments = [...appointmentsData].sort((a, b) => {
    const dateA = new Date(a.datetime);
    const dateB = new Date(b.datetime);
    const comparison = dateA - dateB;
    return sortOrder === "asc" ? comparison : -comparison;
  });

  return (
    <div className="container">
      {showAddPrescription && (
        <div className="modal-overlay">
          <div className="card">
            <div className="addPrescription">
              <AddPrescription patient={patientUsername} />
            </div>
            <button
              className="btn btn-danger"
              onClick={handleCloseAddPrescription}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showEditPrescription && (
        <div className="modal-overlay">
          <div className="card">
            <div className="editPrescription">
              <EditPrescription patient={patientUsername} />
            </div>
            <button
              className="btn btn-danger"
              onClick={handleCloseEditPrescription}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {showAddHealthRecord && (
        <div className="modal-overlay">
          <div className="card">
            <div className="editPrescription">
              <AddHealthRecord patient={patientUsername} />
            </div>
            <button
              className="btn btn-danger"
              onClick={handleCloseAddHealthRecord}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showScheduleFollowup && (
        <div className="modal-overlay">
          <div className="card">
            <div className="scheduleFollowup">
              <ScheduleFollowup patient={patientUsername} />
            </div>
            <button
              className="btn btn-danger"
              onClick={handleCloseScheduleFollowup}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showProfile && (
        <div className="modal-overlay">
          <div className="card">
            <div className="editPrescription">
              {selectedPatientProfile && (
                <div className="card mt-3">
                  <div className="card-body">
                    <h5 className="card-title">Patient Profile</h5>
                    <p className="card-text">
                      <strong>Username:</strong>{" "}
                      {selectedPatientProfile.username}
                      <br />
                      <strong>Name:</strong> {selectedPatientProfile.name}
                      <br />
                      <strong>National ID:</strong>{" "}
                      {selectedPatientProfile.national_id}
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
                      <hr></hr>
                      <h5>Patient Health Record:</h5>
                      {selectedPatientRecords.length > 0 &&
                        selectedPatientRecords.map((record) => (
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
                      {selectedPatientPrescriptions.map((prescription) => (
                        <div className="card" key={prescription._id}>
                          <h6>
                            Prescription Date:{" "}
                            {new Date(prescription.date).toLocaleDateString()}{" "}
                            {new Date(prescription.date).toLocaleTimeString()}
                          </h6>
                          {prescription.medicationInfo.map(
                            (medicine, index) => (
                              <div key={index}>
                                <p>
                                  <strong>Medicine {index + 1}:</strong>{" "}
                                  {medicine.medicine}
                                </p>
                                <p style={{ marginLeft: "20px" }}>
                                  <strong>Dosage:</strong> {medicine.dosage}
                                </p>
                                <p style={{ marginLeft: "20px" }}>
                                  <strong>Instructions:</strong>{" "}
                                  {medicine.instructions}
                                </p>
                              </div>
                            )
                          )}
                          <p>
                            <strong>Doctor:</strong> {prescription.doctorName}
                          </p>
                          {prescription.filled ? (
                            <p>Status: Filled</p>
                          ) : (
                            <p>Status: Not Filled</p>
                          )}
                        </div>
                      ))}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <button className="btn btn-danger" onClick={handleCloseViewProfile}>
              Close
            </button>
          </div>
        </div>
      )}
      <h2>My Appointments:</h2>
      <button className="btn btn-secondary" onClick={handleToggleFilters}>
        {showFilters ? "Hide Filters" : "Show Filters"}
      </button>
      {showFilters && (
        <>
          <div className="card">
            <div className="card-body">
              <label>Start Date:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              &nbsp; &nbsp;&nbsp;
              <label>End Date:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              &nbsp; &nbsp;&nbsp;
              <button
                className="btn btn-primary"
                onClick={filterAppointmentsByDateRange}
              >
                Filter by Date Range
              </button>
            </div>
            <div>
              <select
                className="btn btn-secondary dropdown-toggle"
                value={customStatus}
                onChange={(e) => setCustomStatus(e.target.value)}
              >
                <option value="Completed">Completed</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Rescheduled">Rescheduled</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <button
                className="btn btn-primary"
                onClick={() => filterAppointmentsByStatus(customStatus)}
              >
                Filter by Status
              </button>
              <button
                className="btn btn-primary"
                onClick={filterAppointmentsByDate}
              >
                Filter by Upcoming Date
              </button>
              <button
                className="btn btn-primary"
                onClick={filterAppointmentsByPastDate}
              >
                Filter by Past Date
              </button>
            </div>
            <button className="btn btn-danger" onClick={fetchAppointments}>
              Remove Filters
            </button>
          </div>
        </>
      )}

      {error && <p className="text-danger">{error}</p>}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Patient</th>
            <th
              onClick={() => handleSort("datetime")}
              style={{ cursor: "pointer" }}
            >
              Date and Time {getSortIcon("datetime")}
            </th>
            <th>Status </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filterByStatusData.length > 0
            ? filterByStatusData.map((appointment) => (
                <tr
                  key={appointment._id}
                  onClick={() => handleRowClick(appointment)}
                >
                  <td>{appointment.patient}</td>
                  <td>{new Date(appointment.datetime).toLocaleString()}</td>
                  <td>{appointment.status}</td>
                  <td>
                    <button
                      className="btn btn-info"
                      onClick={(e) => {
                        handleViewProfile(appointment.patient);
                      }}
                    >
                      View Patient Profile
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={(e) => {
                        handleAddPrescription(appointment.patient);
                      }}
                    >
                      Add Prescription
                    </button>
                    <button
                      className="btn btn-success"
                      onClick={(e) => {
                        handleEditPrescription(appointment.patient);
                      }}
                    >
                      Manage Prescriptions
                    </button>
                    <button
                      className="btn btn-warning"
                      onClick={(e) => {
                        handleAddHealthRecord(appointment.patient);
                      }}
                    >
                      Add Health Record
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={(e) => {
                        handleScheduleFollowup(appointment.patient);
                      }}
                    >
                      Schedule Followup
                    </button>
                  </td>
                </tr>
              ))
            : filterByDateData.length > 0
            ? filterByDateData.map((appointment) => (
                <tr
                  key={appointment._id}
                  onClick={() => handleRowClick(appointment)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{appointment.patient}</td>
                  <td>
                    {new Date(appointment.datetime).toLocaleDateString()}{" "}
                    {new Date(appointment.datetime).toLocaleTimeString()}
                  </td>
                  <td>{appointment.status}</td>
                  <td>
                    <button
                      className="btn btn-info"
                      onClick={(e) => {
                        handleViewProfile(appointment.patient);
                      }}
                    >
                      View Patient Profile
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={(e) => {
                        handleAddPrescription(appointment.patient);
                      }}
                    >
                      Add Prescription
                    </button>
                    <button
                      className="btn btn-success"
                      onClick={(e) => {
                        handleEditPrescription(appointment.patient);
                      }}
                    >
                      Manage Prescriptions
                    </button>
                    <button
                      className="btn btn-warning"
                      onClick={(e) => {
                        handleAddHealthRecord(appointment.patient);
                      }}
                    >
                      Add Health Record
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={(e) => {
                        handleScheduleFollowup(appointment.patient);
                      }}
                    >
                      Schedule Followup
                    </button>
                  </td>
                </tr>
              ))
            : sortedAppointments.length > 0
            ? sortedAppointments.map((appointment) => (
                <tr
                  key={appointment._id}
                  onClick={() => handleRowClick(appointment)}
                >
                  <td>{appointment.patient}</td>
                  <td>
                    {new Date(appointment.datetime).toLocaleDateString()}{" "}
                    {new Date(appointment.datetime).toLocaleTimeString()}
                  </td>
                  <td>{appointment.status}</td>
                  <td>
                    <button
                      className="btn btn-info"
                      onClick={(e) => {
                        handleViewProfile(appointment.patient);
                      }}
                    >
                      View Patient Profile
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={(e) => {
                        handleAddPrescription(appointment.patient);
                      }}
                    >
                      Add Prescription
                    </button>
                    <button
                      className="btn btn-success"
                      onClick={(e) => {
                        handleEditPrescription(appointment.patient);
                      }}
                    >
                      Manage Prescriptions
                    </button>
                    <button
                      className="btn btn-warning"
                      onClick={(e) => {
                        handleAddHealthRecord(appointment.patient);
                      }}
                    >
                      Add Health Record
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={(e) => {
                        handleScheduleFollowup(appointment.patient);
                      }}
                    >
                      Schedule Followup
                    </button>
                  </td>
                </tr>
              ))
            : filterByDateRange.length > 0
            ? filterByDateRange.map((appointment) => (
                <tr
                  key={appointment._id}
                  onClick={() => handleRowClick(appointment)}
                >
                  <td>{appointment.patient}</td>
                  <td>
                    {new Date(appointment.datetime).toLocaleDateString()}{" "}
                    {new Date(appointment.datetime).toLocaleTimeString()}
                  </td>
                  <td>{appointment.status}</td>
                  <td>
                    <button
                      className="btn btn-info"
                      onClick={(e) => {
                        handleViewProfile(appointment.patient);
                      }}
                    >
                      View Patient Profile
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={(e) => {
                        handleAddPrescription(appointment.patient);
                      }}
                    >
                      Add Prescription
                    </button>
                    <button
                      className="btn btn-success"
                      onClick={(e) => {
                        handleEditPrescription(appointment.patient);
                      }}
                    >
                      Manage Prescriptions
                    </button>
                    <button
                      className="btn btn-warning"
                      onClick={(e) => {
                        handleAddHealthRecord(appointment.patient);
                      }}
                    >
                      Add Health Record
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={(e) => {
                        handleScheduleFollowup(appointment.patient);
                      }}
                    >
                      Schedule Followup
                    </button>
                  </td>
                </tr>
              ))
            : appointmentsData.map((appointment) => (
                <tr
                  key={appointment._id}
                  onClick={() => handleRowClick(appointment)}
                >
                  <td>{appointment.patient}</td>
                  <td>
                    {new Date(appointment.datetime).toLocaleDateString()}{" "}
                    {new Date(appointment.datetime).toLocaleTimeString()}
                  </td>
                  <td>{appointment.status}</td>
                  <td>
                    <button
                      className="btn btn-info"
                      onClick={(e) => {
                        handleViewProfile(appointment.patient);
                      }}
                    >
                      View Patient Profile
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={(e) => {
                        handleAddPrescription(appointment.patient);
                      }}
                    >
                      Add Prescription
                    </button>
                    <button
                      className="btn btn-success"
                      onClick={(e) => {
                        handleEditPrescription(appointment.patient);
                      }}
                    >
                      Manage Prescriptions
                    </button>
                    <button
                      className="btn btn-warning"
                      onClick={(e) => {
                        handleAddHealthRecord(appointment.patient);
                      }}
                    >
                      Add Health Record
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={(e) => {
                        handleScheduleFollowup(appointment.patient);
                      }}
                    >
                      Schedule Followup
                    </button>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorMyAppointments;
