import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/admin.css";
import Chart from "chart.js/auto";
import AddHealthPackage from "../components/AddHealthPackage";
import EditHealthPackage from "../components/EditHealthPackage";
import DeleteHealthPackage from "../components/DeleteHealthPackage";
import ViewAllPatients from "../components/ViewAllPatients";
import ChangePassword from "../components/ChangePassword";
import UserPieChart from "../components/UserPieChart";
import DoctorBarChart from "../components/DoctorBarChart";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

function Admin() {
  const [adminUsername, setAdminUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [userToRemove, setUserToRemove] = useState("");
  const [newDoctorRequestData, setNewDoctorRequestData] = useState([]);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [message, setMessage] = useState("");
  const [showDoctorRequests, setShowDoctorRequests] = useState(false);
  const [packages, setPackages] = useState([]);
  const [showPackages, setShowPackages] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [doctors, setDoctors] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserType = async () => {
      try {
        const response = await fetch("/admin");
        if (response.status === 401 || response.status === 403) {
          navigate("/", { state: { errorMessage: "Access Denied" } });
        }
      } catch (error) {
        console.error(error);
      }
    };

    checkUserType();
  }, []);

  const addAdministrator = async () => {
    if (!adminUsername || !password || !email) {
      setSubmissionStatus("error");
      setMessage("Please fill in all required fields.");
      return;
    }
    try {
      const response = await fetch(`/api/administrator/addAdministrator`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username: adminUsername, password }),
      });
      if (!response.ok) {
        throw new Error("Failed to add administrator");
      }
      const data = await response.json();
      console.log("Administrator added successfully");
      setAdminUsername("");
      setPassword("");
      setSubmissionStatus("success");
      setMessage("Administrator added successfully");
    } catch (error) {
      console.error(error);
    }
  };

  const removeUserFromSystem = async () => {
    if (!userToRemove) {
      setSubmissionStatus("error");
      setMessage("Please fill in all required fields.");
      return;
    }
    try {
      const response = await fetch(`/api/administrator/removeUserFromSystem`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: userToRemove }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error("Failed to remove pharmacist/patient");
      }
      if (response.status === 200) {
        console.log("Doctor/Patient/Admin removed successfully");
        setUserToRemove("");
        setSubmissionStatus("success");
        setMessage("Doctor/Patient/Admin removed successfully");
      } else {
        console.log(data);
        setSubmissionStatus("error");
        setMessage("Failed to remove pharmacist/patient");
      }
    } catch (error) {
      setSubmissionStatus("error");
      setMessage("Failed to remove pharmacist/patient");
      console.error(error);
    }
  };

  const viewDoctorRequests = async () => {
    try {
      const response = await fetch(`/api/administrator/viewDoctorApplication`);
      if (!response.ok) {
        throw new Error("Failed to fetch new doctor requests");
      }
      const data = await response.json();
      setNewDoctorRequestData(data);
      setShowDoctorRequests(true);
    } catch (error) {
      console.error(error);
    }
  };

  const approveDoctor = async (username) => {
    try {
      const response = await fetch("/api/administrator/approveDoctorRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      if (response.ok) {
        // Refresh doctor requests
        viewDoctorRequests();
      } else {
        console.error("Failed to approve doctor request");
      }
    } catch (error) {
      console.error("An error occurred while approving doctor request:", error);
    }
  };

  const rejectDoctor = async (username) => {
    try {
      const response = await fetch("/api/administrator/rejectDoctorRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      if (response.ok) {
        // Refresh doctor requests
        viewDoctorRequests();
      } else {
        console.error("Failed to reject doctor request");
      }
    } catch (error) {
      console.error("An error occurred while rejecting doctor request:", error);
    }
  };
  const downloadDocument = async (fileName) => {
    const link = document.createElement("a");
    const url = fileName;
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };
  const toggleDoctorRequests = () => {
    if (!showDoctorRequests) {
      viewDoctorRequests();
    } else {
      setShowDoctorRequests(false);
    }
  };
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/administrator/logout", {
        method: "GET",
      });

      if (response.ok) {
        navigate("/");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleViewHealthPackages = async () => {
    if (showPackages) {
      setShowPackages(false);
    } else {
      try {
        const response = await fetch("/api/administrator/viewHealthPackages", {
          method: "GET",
        });

        if (response.ok) {
          const data = await response.json();
          setPackages(data);
          setShowPackages(true);
        } else {
          console.error("Error fetching health package options.");
        }
      } catch (error) {
        console.error(
          "An error occurred while fetching health package options:",
          error
        );
      }
    }
  };
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="admin-cover">
      <nav class="navbar navbar-expand-lg bg-white navbar-light shadow-sm px-5 py-3 py-lg-0">
        <img src={"clinic-logo.png"} width="100" />
        <a href="" class="navbar-brand p-0">
          <h1 class="m-0 text-primary">
            <i class="fa fa-tooth me-2"></i>El7a2ni
          </h1>
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarCollapse"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto py-0">
            {/* <li>
              <button className="nav-link btn btn-link" onClick={handleLogout}>
                Logout
              </button>
            </li> */}
            <li className={`nav-item ${activeTab === "home" ? "active" : ""}`}>
              <button
                style={{
                  color: activeTab === "home" ? "var(--primary)" : "inherit",
                }}
                className="nav-link btn btn-link"
                onClick={() => handleTabClick("home")}
              >
                Home
              </button>
            </li>
            <li
              className={`nav-item ${activeTab === "profile" ? "active" : ""}`}
            >
              <div className="dropdown">
                <button
                  style={{
                    color:
                      activeTab === "profile" ? "var(--primary)" : "inherit",
                  }}
                  className="nav-link btn btn-link dropdown-toggle"
                  role="button"
                  id="profileDropdown"
                  data-bs-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Profile
                </button>
                <div
                  className="dropdown-menu"
                  aria-labelledby="profileDropdown"
                >
                  <button
                    className="dropdown-item"
                    onClick={() => handleTabClick("profile")}
                  >
                    Profile & Settings
                  </button>
                  <button className="dropdown-item" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </div>
            </li>
            <li
              style={{
                color:
                  activeTab === "administrators" ? "var(--primary)" : "inherit",
              }}
              className={`nav-item ${
                activeTab === "administrators" ? "active" : ""
              }`}
            >
              <button
                style={{
                  color:
                    activeTab === "administrators"
                      ? "var(--primary)"
                      : "inherit",
                }}
                className="nav-link btn btn-link"
                onClick={() => handleTabClick("administrators")}
              >
                Administrators
              </button>
            </li>
            <li
              className={`nav-item ${activeTab === "patients" ? "active" : ""}`}
            >
              <button
                style={{
                  color:
                    activeTab === "patients" ? "var(--primary)" : "inherit",
                }}
                className="nav-link btn btn-link"
                onClick={() => handleTabClick("patients")}
              >
                Patients
              </button>
            </li>
            <li
              className={`nav-item ${
                activeTab === "healthpackages" ? "active" : ""
              }`}
            >
              <button
                style={{
                  color:
                    activeTab === "healthpackages"
                      ? "var(--primary)"
                      : "inherit",
                }}
                className="nav-link btn btn-link"
                onClick={() => handleTabClick("healthpackages")}
              >
                Health Packages
              </button>
            </li>
            <li
              className={`nav-item ${
                activeTab === "usermanager" ? "active" : ""
              }`}
            >
              <button
                style={{
                  color:
                    activeTab === "usermanager" ? "var(--primary)" : "inherit",
                }}
                className="nav-link btn btn-link"
                onClick={() => handleTabClick("usermanager")}
              >
                User Manager
              </button>
            </li>
          </ul>
        </div>
      </nav>
      <div className="container">
        <h1 className="mb-4" style={{ textAlign: "center", paddingTop: "5%" }}>
          Administrator Dashboard
        </h1>
        <hr />
        {submissionStatus === "success" && (
          <div className="alert alert-success">{message}</div>
        )}
        {submissionStatus === "error" && (
          <div className="alert alert-danger">{message}</div>
        )}
        {activeTab === "home" && (
          <div style={{ width: "35%" , float:"left"}}>
            <UserPieChart /> 
          </div>
        )}
        {activeTab === "home" && (
          <div style={{ width: "60%" ,paddingLeft:"5%" , float:"left"  }}>
            <DoctorBarChart />
          </div>
        )}

        {activeTab === "profile" && (
          <div className="card mt-4">
            <ChangePassword userType="administrator" />
          </div>
        )}
        {activeTab === "administrators" && (
          <div className="mb-3">
            <h2>Add Administrator</h2>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control mb-2"
            />
            <input
              type="text"
              placeholder="Administrator Username"
              value={adminUsername}
              onChange={(e) => setAdminUsername(e.target.value)}
              className="form-control mb-2"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control mb-2"
            />
            <button className="btn btn-primary" onClick={addAdministrator}>
              Add Administrator
            </button>
          </div>
        )}

        {activeTab === "usermanager" && (
          <div className="mt-4">
            <h2>Remove an Account (Doctor/Patient/Admin) </h2>
            <div className="mb-3">
              <input
                type="text"
                placeholder="Username to Remove"
                value={userToRemove}
                onChange={(e) => setUserToRemove(e.target.value)}
                className="form-control"
              />
              <button
                className="btn btn-secondary mt-2"
                onClick={removeUserFromSystem}
              >
                Remove User
              </button>
            </div>
          </div>
        )}
        {activeTab === "usermanager" && (
          <div className="mt-4">
            <h2>New Doctor Requests</h2>
            <button className="btn btn-primary" onClick={toggleDoctorRequests}>
              {showDoctorRequests
                ? "Hide New Doctor Requests"
                : "View New Doctor Requests"}
            </button>
            {showDoctorRequests && (
              <table className="table mt-2">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Date of Birth</th>
                    <th>Hourly Rate</th>
                    <th>Speciality</th>
                    <th>Affiliation</th>
                    <th>Educational Background</th>
                    <th>ID Document</th>
                    <th>Medical License</th>
                    <th>Medical Degree</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {newDoctorRequestData.map((request) => (
                    <tr key={request._id}>
                      <td>{request.username}</td>
                      <td>{request.name}</td>
                      <td>{request.email}</td>
                      <td>{request.dateOfBirth}</td>
                      <td>{request.hourlyRate}</td>
                      <td>{request.speciality}</td>
                      <td>{request.affiliation}</td>
                      <td>{request.educationalBackground}</td>
                      <td>
                        {request.idDocument && (
                          <button
                            className="btn btn-info"
                            onClick={() =>
                              downloadDocument(request.idDocument.filename)
                            }
                          >
                            Download ID Document
                          </button>
                        )}
                      </td>
                      <td>
                        {request.medicalLicense && (
                          <button
                            className="btn btn-info"
                            onClick={() =>
                              downloadDocument(request.medicalLicense.filename)
                            }
                          >
                            Download Medical License Document
                          </button>
                        )}
                      </td>
                      <td>
                        {request.medicalDegree && (
                          <button
                            className="btn btn-info"
                            onClick={() =>
                              downloadDocument(request.medicalDegree.filename)
                            }
                          >
                            Download Medical Degree Document
                          </button>
                        )}
                      </td>
                      <td>
                        {request.status === "pending" ? (
                          <div>
                            <button
                              onClick={() => approveDoctor(request.username)}
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => rejectDoctor(request.username)}
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          "Request Handled"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
        <br />
        {activeTab === "healthpackages" && (
          <div className="card">
            <div>
              <button
                className="btn btn-primary"
                onClick={handleViewHealthPackages}
              >
                {showPackages
                  ? "Hide Health Package Options"
                  : "View Health Package Options"}
              </button>
            </div>

            {showPackages && (
              <div>
                <h2>All Health Packages</h2>
                <ul>
                  {packages.map((option, index) => (
                    <li key={index}>
                      <strong>Name: {option.name}</strong>
                      <p>Price: {option.price}</p>
                      <p>
                        Discount on Subscription:{" "}
                        {option.discountOnSubscription}
                      </p>
                      <p>Discount on Session: {option.discountOnSession}</p>
                      <p>Discount on Medicine: {option.discountOnMedicine}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        {activeTab === "healthpackages" && (
          <div className="mt-4">
            <AddHealthPackage />
          </div>
        )}
        {activeTab === "healthpackages" && (
          <div className="mt-4">
            <EditHealthPackage />
          </div>
        )}
        {activeTab === "healthpackages" && (
          <div className="mt-4">
            <DeleteHealthPackage />
          </div>
        )}
        {activeTab === "patients" && (
          <div className="mt-4">
            <ViewAllPatients />
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
