
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"; // Import Link for navigation
import "bootstrap/dist/css/bootstrap.min.css";
import DoctorSelection from "../components/DoctorSelection";
import Prescription from "../components/Prescription";
import AddFamilyMember from "../components/AddFamilyMember";
import PatientAppointments from "../components/PatientAppointments";
import ViewDoctors from "../components/ViewDoctors";
import ViewFamilyMembers from "../components/ViewFamilyMembers";
import PatientWallet from "../components/PatientWallet";
import PatientHealthRecords from "../components/PatientHealthRecords";
import ViewHealthPackageOptions from "../components/ViewHealthPackageOptions";
import SubscribeToHealthPackage from "../components/SubscribeToHealthPackage";
import ViewHealthPackage from "../components/ViewHealthPackage";
import UnsubscribeToHealthPackage from "../components/UnsubscribeToHealthPackage";
import ViewSlotsAndMakeAppointment from "../components/ViewSlotsAndMakeAppointment";
import ChangePassword from "../components/ChangePassword";
import MedicalHistoryComponent from "../components/MedicalHistory";

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
    <div className="container">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li>
              <button className="nav-link btn btn-link" onClick={handleLogout}>
                Logout
              </button>
            </li>
            <li className={`nav-item ${activeTab === "home" ? "active" : ""}`}>
              <button
                className="nav-link btn btn-link"
                onClick={() => handleTabClick("home")}
              >
                Home
              </button>
            </li>
            <li
              className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
            >
              <button
                className="nav-link btn btn-link"
                onClick={() => handleTabClick("settings")}
              >
                Settings
              </button>
            </li>
            <li
              className={`nav-item ${
                activeTab === "appointments" ? "active" : ""
              }`}
            >
              <button
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
                className="nav-link btn btn-link"
                onClick={() => handleTabClick("family")}
              >
                Family
              </button>
            </li>
            <li
              className={`nav-item ${activeTab === "doctors" ? "active" : ""}`}
            >
              <button
                className="nav-link btn btn-link"
                onClick={() => handleTabClick("doctors")}
              >
                Doctors
              </button>
            </li>
          </ul>
        </div>
      </nav>
      {activeTab === "settings" && (
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
      {activeTab === "family" && (
        <div className="mt-4">
          <AddFamilyMember />
        </div>
      )}
      {activeTab === "appointments" && (
        <div className="card mt-4">
          <PatientAppointments />
        </div>
      )}
      {activeTab === "doctors" && (
        <div className="mt-4">
          <ViewDoctors />
        </div>
      )}
      {activeTab === "family" && (
        <div className="mt-4">
          <ViewFamilyMembers />
        </div>
      )}
      {activeTab === "home" && (
        <div className="mt-4">
          <PatientWallet />
        </div>
      )}
      {activeTab === "subscription" && (
        <div className="mt-4">
          <ViewHealthPackage />
        </div>
      )}
      {activeTab === "subscription" && (
        <div className="mt-4">
          <UnsubscribeToHealthPackage />
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
    </div>
  );
};

export default PatientHome;
