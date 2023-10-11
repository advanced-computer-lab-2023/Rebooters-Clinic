import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import "bootstrap/dist/css/bootstrap.min.css";
import DoctorSelection from "../components/DoctorSelection"
import Prescription from "../components/Prescription";
import AddFamilyMember from "../components/AddFamilyMember";
import PatientAppointments from "../components/PatientAppointments";
import ViewDoctors from "../components/ViewDoctors";

const PatientHome = () => {
  const [patientData, setPatientData] = useState(null);

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
        console.error("An error occurred while fetching patient profile:", error);
      }
    };

    viewProfile();
  }, []);

  return (
    <div className="container">
      
      <div className="mt-4">
        <DoctorSelection />
      </div>
      <div className="mt-4">
        <Prescription />
      </div>
      <div className="mt-4">
        <AddFamilyMember />
      </div>
      <div className="mt-4">
        <PatientAppointments />
      </div>
      <div className="mt-4">
        <ViewDoctors />
      </div>
    </div>
    
  );
};

export default PatientHome;
