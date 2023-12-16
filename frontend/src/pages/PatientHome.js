import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"; // Import Link for navigation
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/patient.css";
import DoctorSelection from "../components/DoctorSelection";
import Prescription from "../components/Prescription";
import PatientAppointments from "../components/PatientAppointments";
import ViewDoctors from "../components/ViewDoctors";
import PatientWallet from "../components/PatientWallet";
import PatientHealthRecords from "../components/PatientHealthRecords";
import ViewHealthPackageOptions from "../components/ViewHealthPackageOptions";
import SubscribeToHealthPackage from "../components/SubscribeToHealthPackage";
import ChangePassword from "../components/ChangePassword";
import MedicalHistoryComponent from "../components/MedicalHistory";
import PatientFamilyAppointments from "../components/PatientFamilyAppointments";
import PatientChats from "../components/PatientChats";
import NotificationsPatient from "../components/NotificationsPatient";
import FamilyMembers from "../components/FamilyMembers";
import PatientsHealthPackages from "../components/PatientsHealthPackages";
import PatientProfile from "../components/PatientProfile";
import Footer from "../components/footer";
import ChatNavBarPatient from "../components/ChatNavBarPatient";
import ChatBox from "../components/ChatBox";

//import CombinedPatientAppointments from "../components/CombinedPatientAppointments";

const PatientHome = () => {
  const [patientData, setPatientData] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  const navigate = useNavigate();
  useEffect(() => {
    const checkUserType = async () => {
      try {
        const response = await fetch("/patient-home");
        if (response.status === 401 || response.status === 403) {
          navigate("/", { state: { errorMessage: "Access Denied" } });
        }
      } catch (error) {
        console.error(error);
      }
    };

    checkUserType();
  }, []);

  useEffect(() => {
    const viewProfile = async () => {
      try {
        const response = await fetch("/api/patient/patient-profile");
        const json = await response.json();
        if (response.ok) {
          json.dateOfBirth = new Date(json.dateOfBirth).toLocaleDateString();
          setPatientData(json);
        }
      } catch (error) {
        console.error(
          "An error occurred while fetching patient profile:",
          error
        );
      }
    };

    viewProfile();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/patient/logout", {
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

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
    <ChatNavBarPatient />  
    <ChatBox />  

    <div className="patient-cover">
      <div className="cover-color">
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
                <button
                  className="nav-link btn btn-link"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li> */}
              <li
                className={`nav-item ${activeTab === "home" ? "active" : ""}`}
              >
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
                  className={`nav-item ${
                    activeTab === "profile" ? "active" : ""
                  }`}
                >
                  <div className="dropdown">
                    <button
                      style={{
                        color:
                          activeTab === "profile"
                            ? "var(--primary)"
                            : "inherit",
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
                className={`nav-item ${
                  activeTab === "appointments" ? "active" : ""
                }`}
              >
                <button
                  style={{
                    color:
                      activeTab === "appointments"
                        ? "var(--primary)"
                        : "inherit",
                  }}
                  className="nav-link btn btn-link"
                  onClick={() => handleTabClick("appointments")}
                >
                  Appointments
                </button>
              </li>
              <li
                className={`nav-item ${
                  activeTab === "prescriptions" ? "active" : ""
                }`}
              >
                <button
                  style={{
                    color:
                      activeTab === "prescriptions"
                        ? "var(--primary)"
                        : "inherit",
                  }}
                  className="nav-link btn btn-link"
                  onClick={() => handleTabClick("prescriptions")}
                >
                  Prescriptions
                </button>
              </li>
              <li
                className={`nav-item ${activeTab === "health" ? "active" : ""}`}
              >
                <button
                  style={{
                    color:
                      activeTab === "health" ? "var(--primary)" : "inherit",
                  }}
                  className="nav-link btn btn-link"
                  onClick={() => handleTabClick("health")}
                >
                  Health
                </button>
              </li>
              <li
                className={`nav-item ${
                  activeTab === "subscription" ? "active" : ""
                }`}
              >
                <button
                  style={{
                    color:
                      activeTab === "subscription"
                        ? "var(--primary)"
                        : "inherit",
                  }}
                  className="nav-link btn btn-link"
                  onClick={() => handleTabClick("subscription")}
                >
                  Subscription
                </button>
              </li>
              <li
                className={`nav-item ${activeTab === "family" ? "active" : ""}`}
              >
                <button
                  style={{
                    color:
                      activeTab === "family" ? "var(--primary)" : "inherit",
                  }}
                  className="nav-link btn btn-link"
                  onClick={() => handleTabClick("family")}
                >
                  Family
                </button>
              </li>
              <li
                className={`nav-item ${
                  activeTab === "doctors" ? "active" : ""
                }`}
              >
                <button
                  style={{
                    color:
                      activeTab === "doctors" ? "var(--primary)" : "inherit",
                  }}
                  className="nav-link btn btn-link"
                  onClick={() => handleTabClick("doctors")}
                >
                  View Doctors/Reserve
                </button>
              </li>
              
              <li
                className={`nav-item ${
                  activeTab === "notifications" ? "active" : ""
                }`}
              >
                <button
                  style={{
                    color:
                      activeTab === "notifications"
                        ? "var(--primary)"
                        : "inherit",
                  }}
                  className="nav-link btn btn-link"
                  onClick={() => handleTabClick("notifications")}
                >
                  Notifications
                </button>
              </li>
            </ul>
          </div>
        </nav>
        <div className="container">
          {activeTab === "home" && (
            <div className="patient-home-text">
              <p>
                Taking care of yourself is crucial for maintaining good health
                and well-being. It not only enhances your physical health but
                also contributes to your mental and emotional well-being. Make
                sure to prioritize self-care in your daily routine to lead a
                happy and fulfilling life.
              </p>
              <button
                style={{ width: "100%", fontSize: "25px" }}
                className="btn btn-primary"
                onClick={() => handleTabClick("doctors")}
              >
                Reserve Appointment
              </button>
            </div>
          )}
          {activeTab === "profile" && (
            <div className="card mt-4">
              <PatientProfile />
            </div>
          )}
          {activeTab === "profile" && (
            <div className="card mt-4">
              <ChangePassword userType="patient" />
            </div>
          )}
          {activeTab === "prescriptions" && (
            <div className="mt-4">
              <Prescription />
            </div>
          )}
          {activeTab === "health" && (
            <div className="mt-4">
              <PatientHealthRecords />
            </div>
          )}
          {activeTab === "health" && (
            <div className="card mt-4">
              <MedicalHistoryComponent />
            </div>
          )}
          {activeTab === "appointments" && (
            <div className="card mt-4">
              <PatientAppointments />
            </div>
          )}
          {activeTab === "appointments" && (
            <div className="card mt-4">
              <PatientFamilyAppointments />
            </div>
          )}
          {activeTab === "doctors" && (
            <div className="mt-4">
              <ViewDoctors />
            </div>
          )}
          {activeTab === "family" && (
            <div className="mt-4">
              <FamilyMembers />
            </div>
          )}
          {activeTab === "profile" && (
            <div className="mt-4">
              <PatientWallet />
            </div>
          )}
          {activeTab === "subscription" && (
            <div className="mt-4">
              <PatientsHealthPackages />
            </div>
          )}
          {activeTab === "subscription" && (
            <div className="mt-4">
              <ViewHealthPackageOptions />
            </div>
          )}
          {activeTab === "subscription" && (
            <div className="mt-4">
              <SubscribeToHealthPackage />
            </div>
          )}
         
          {activeTab === "notifications" && (
            <div className="mt-4">
              <NotificationsPatient />
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
    </>
  );
};

export default PatientHome;
