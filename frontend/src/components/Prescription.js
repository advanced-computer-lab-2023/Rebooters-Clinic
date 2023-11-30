import React, { useEffect, useState } from "react";
import { saveAs } from 'file-saver';
import { Viewer, Document, Page, Text, View, PDFDownloadLink } from '@react-pdf-viewer/core';
import jsPDF from 'jspdf';

function Prescription() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [viewMessage, setViewMessage] = useState("");
  const [filterMessage, setFilterMessage] = useState("");
  const [prescriptionDetails, setPrescriptionDetails] = useState(null);
  const [filterParams, setFilterParams] = useState({
    date: "",
    doctorName: "",
    filled: undefined,
  });
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  const handleViewPrescriptions = async () => {
    try {
      const response = await fetch("/api/patient/viewAllPrescriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (data.message) {
        setViewMessage(data.message);
        setPrescriptions([]);
      } else {
        setViewMessage("");
        setPrescriptions(data);
        setSelectedPrescription(null); // Clear selected prescription when viewing all prescriptions
      }
    } catch (error) {
      console.error(error);
      setViewMessage("An error occurred while fetching prescriptions.");
      setPrescriptions([]);
    }
  };
    const handleClosePrescription = (index) => {
    // Create a copy of the prescriptions array
    const updatedPrescriptions = [...prescriptions];

    // Remove the specific prescription at the given index
    updatedPrescriptions.splice(index, 1);

    // Update the state with the modified array
    setPrescriptions(updatedPrescriptions);

    // If the closed prescription was the selected one, clear the selection
    if (selectedPrescription === index) {
      setSelectedPrescription(null);
    }
  };

  const handleSelectPrescription = (index) => {
    setSelectedPrescription(selectedPrescription === index ? null : index);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilterParams({
      ...filterParams,
      [name]: value,
    });
  };

  const handleDownloadPDF = async () => {
    if (!prescriptionDetails) {
      return;
    }
  
    try {
      // Create a new jsPDF instance
      const pdf = new jsPDF();
  
      // Add content to the PDF
      pdf.text(`Prescription Details:
  Doctor: ${prescriptionDetails.doctorName}
  Patient: ${prescriptionDetails.patientName}
  Date: ${new Date(prescriptionDetails.date).toLocaleString()}
  Filled: ${prescriptionDetails.filled ? "Yes" : "No"}`, 10, 10);
  
      prescriptionDetails.medicationInfo.forEach((med, index) => {
        const yOffset = 50 + index * 20;
        pdf.text(`Medicine ${index + 1}:
  - Name: ${med.medicine}
  - Dosage: ${med.dosage}
  - Instructions: ${med.instructions}`, 10, yOffset);
      });
  
      // Save the PDF
      pdf.save('prescription_details.pdf');
    } catch (error) {
      console.error(error);
      // Handle the error, e.g., display an error message to the user
    }
  };
  const handleFilterPrescriptions = async () => {
    if (
      !filterParams.date &&
      !filterParams.doctorName &&
      filterParams.filled === undefined
    ) {
      setFilterMessage("Please fill the text");
      setPrescriptions([]);
      return;
    }

    try {
      const response = await fetch("/api/patient/filterPrescription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filterParams),
      });

      const data = await response.json();

      if (!response.ok) {
        setFilterMessage(data.error);
      }

      if (data.message) {
        setFilterMessage(data.message);
        setPrescriptions([]);
      } else {
        setFilterMessage("");
        setPrescriptions(data);
        setSelectedPrescription(null); // Clear selected prescription when filtering
      }
    } catch (error) {
      console.error(error);
      setFilterMessage("An error occurred while filtering prescriptions.");
      setPrescriptions([]);
    }
  };
  const handleShowPrescriptionDetails = (prescription) => {
    setPrescriptionDetails(prescription);
  };
  const handleClosePrescriptionDetails = () => {
    setPrescriptionDetails(null);
  };

  const errorStyle = {
    color: "red",
    fontWeight: "bold",
  };

  useEffect(() => {
    handleViewPrescriptions();
  }, []);

  return (
    <div>
      <h2>Prescriptions:</h2>
      <div>{viewMessage && <p style={errorStyle}>{viewMessage}</p>}</div>
      <div>
        <h3>Filter Prescriptions</h3>

        <input
          type="date"
          name="date"
          placeholder="Enter Date (YYYY-MM-DD)"
          value={filterParams.date}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="doctorName"
          placeholder="Enter Doctor's Name"
          value={filterParams.doctorName}
          onChange={handleFilterChange}
        />
        <select
          name="filled"
          value={filterParams.filled}
          onChange={handleFilterChange}
          className="btn btn-secondary dropdown-toggle"
        >
          <option value={undefined}>Select Filled Status</option>
          <option value={true}>Filled</option>
          <option value={false}>Unfilled</option>
        </select>
        <button onClick={handleFilterPrescriptions} className="btn btn-primary">Filter</button>
        <button className="btn btn-danger" onClick={handleViewPrescriptions}>
          Remove Filters
        </button>
        {filterMessage && <p style={errorStyle}>{filterMessage}</p>}
      </div>
      {prescriptions.length > 0 && !prescriptionDetails && (
        <div>
          <ul>
            {prescriptions.map((prescription, index) => (
              <li key={index}>
                <div className="card">
                  <h3>Prescription {index + 1}</h3>
                  <p>
                    <strong>Doctor:</strong> {prescription.doctorName}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(prescription.date).toLocaleDateString()}{" "}
                    {new Date(prescription.date).toLocaleTimeString()}{" "}
                  </p>
                </div>
                <button
                  onClick={() => handleShowPrescriptionDetails(prescription)}
                >
                  Select
                </button>
                <button onClick={() => handleClosePrescription(index)}>
                  Close
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {prescriptionDetails && (
        <div className="card">
          <h3>Prescription Details:</h3>
          <p>
            <strong>Doctor:</strong> {prescriptionDetails.doctorName}
          </p>
          {prescriptionDetails.medicationInfo.map((medicine, index) => (
            <div key={index}>
              <p>
                <strong>Medicine {index + 1}:</strong> {medicine.medicine}
              </p>
              <p style={{ marginLeft: "20px" }}>
                <strong>Dosage:</strong> {medicine.dosage}
              </p>
              <p style={{ marginLeft: "20px" }}>
                <strong>Instructions:</strong> {medicine.instructions}
              </p>
            </div>
          ))}
          <p>
            <strong>Filled:</strong> {prescriptionDetails.filled ? "Yes" : "No"}
          </p>
          <p>
            <strong>Date:</strong>
            {new Date(prescriptionDetails.date).toLocaleDateString()}{" "}
            {new Date(prescriptionDetails.date).toLocaleTimeString()}{" "}
          </p>
          <div>
            <button onClick={handleClosePrescriptionDetails}>
              Close Details
            </button>
            <button onClick={handleDownloadPDF}>
              Download PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Prescription;
