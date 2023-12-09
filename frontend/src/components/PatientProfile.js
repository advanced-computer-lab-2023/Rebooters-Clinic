import React, { useState, useEffect } from "react";

const PatientProfile = () => {
  const [patientData, setPatientData] = useState({});

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        // Make an API request to fetch patient data
        const response = await fetch("/api/patient/viewProfile");
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        setPatientData(data);
      } catch (error) {
        console.error("Error fetching patient data:", error.message);
      }
    };

    fetchPatientData();
  }, []);

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <div className="d-flex flex-column align-items-center text-center">
                {/* Add this console.log statement */}
                {console.log("Gender:", patientData.gender)}
                <img
                  src={
                    patientData.gender &&
                    patientData.gender.toLowerCase() === "male"
                      ? "https://bootdey.com/img/Content/avatar/avatar6.png"
                      : "https://bootdey.com/img/Content/avatar/avatar3.png"
                  }
                  alt="Patient"
                  className="rounded-circle p-1 bg-primary"
                  width="110"
                />
                <div className="mt-3">
                  <h4>{patientData.name}</h4>
                  <p className="text-secondary mb-1">Patient</p>
                </div>
              </div>
              <hr className="my-4" />
            </div>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="card">
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-sm-3">
                  <h6 className="mb-0">Full Name</h6>
                </div>
                <div className="col-sm-9 text-secondary">
                  <span>{patientData.name}</span>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-3">
                  <h6 className="mb-0">Email</h6>
                </div>
                <div className="col-sm-9 text-secondary">
                  <span>{patientData.email}</span>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-3">
                  <h6 className="mb-0">Date of Birth</h6>
                </div>
                <div className="col-sm-9 text-secondary">
                  <span>{new Date(patientData.dateOfBirth).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-3">
                  <h6 className="mb-0">Gender</h6>
                </div>
                <div className="col-sm-9 text-secondary">
                  <span>{patientData.gender}</span>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-3">
                  <h6 className="mb-0">Mobile Number</h6>
                </div>
                <div className="col-sm-9 text-secondary">
                  <span>{patientData.mobile_number}</span>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-sm-3">
                  <h6 className="mb-0">Emergency Contact</h6>
                </div>
                <div className="col-sm-9 text-secondary">
                  {patientData.emergency_contact ? (
                    <span>
                      {patientData.emergency_contact.firstName}{" "}
                      {patientData.emergency_contact.lastName} -{" "}
                      {patientData.emergency_contact.mobile_number}
                    </span>
                  ) : (
                    <span>No emergency contact provided</span>
                  )}
                </div>
              </div>

              {/* <div className="row mb-3">
                <div className="col-sm-3">
                  <h6 className="mb-0">Delivery Addresses</h6>
                </div>
                <div className="col-sm-9 text-secondary">
                  {patientData.deliveryAddresses &&
                  patientData.deliveryAddresses.length > 0 ? (
                    patientData.deliveryAddresses.map((address, index) => (
                      <div key={index}>{address}</div>
                    ))
                  ) : (
                    <span>No delivery addresses provided</span>
                  )}
                </div>
              </div> */}
              <div className="row mb-3">
                <div className="col-sm-3">
                  <h6 className="mb-0">Health Package</h6>
                </div>
                <div className="col-sm-9 text-secondary">
                  {patientData.healthPackage ? (
                    <div>
                      <span>Name: {patientData.healthPackage.name}</span>
                      <span>Price: {patientData.healthPackage.price}</span>
                    </div>
                  ) : (
                    <span>No health package provided</span>
                  )}
                </div>
              </div>

              {/* <div className="row mb-3">
                <div className="col-sm-3">
                  <h6 className="mb-0">Wallet</h6>
                </div>
                <div className="col-sm-9 text-secondary">
                  <span>{patientData.wallet}</span>
                </div>
              </div> */}
              <div className="row mb-3">
                <div className="col-sm-3">
                  <h6 className="mb-0">Status Of Health Package</h6>
                </div>
                <div className="col-sm-9 text-secondary">
                  <span>{patientData.statusOfHealthPackage}</span>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-3">
                  <h6 className="mb-0">health Package Created At</h6>
                </div>
                <div className="col-sm-9 text-secondary">
                  <span>{patientData.healthPackageCreatedAt}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
