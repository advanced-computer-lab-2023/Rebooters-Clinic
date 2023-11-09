import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"; // Import Link for navigation
import "bootstrap/dist/css/bootstrap.min.css";
import DoctorSelection from "../components/DoctorSelection"
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

const PatientHome = () => {
  const [patientData, setPatientData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserType = async () => {
      try {
        const response = await fetch("/patient-home")
        if (response.status === 401 ||response.status === 403 ) {
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
        <ViewSlotsAndMakeAppointment/>
      </div>
      <div className="mt-4">
        <ViewDoctors />
      </div>
      <div className="mt-4">
        <ViewFamilyMembers />
      </div>
      <div className="mt-4">
        <PatientWallet/>
      </div>
      <div className="mt-4">
        <PatientHealthRecords/>
      </div>
      <div className="mt-4">
        <ViewHealthPackageOptions/>
      </div>
      <div className="mt-4">
        <ViewHealthPackage/>
      </div>
      <div className="mt-4">
        <SubscribeToHealthPackage/>
      </div>
      <div className="mt-4">
        <UnsubscribeToHealthPackage/>
      </div>
    </div>
    
  );
};

export default PatientHome;
