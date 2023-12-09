import React, { useEffect, useState } from "react";
import { saveAs } from 'file-saver';
import { Viewer, Document, Page, Text, View, PDFDownloadLink } from '@react-pdf-viewer/core';
import jsPDF from 'jspdf';

function Prescription() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [viewMessage, setViewMessage] = useState("");
  const [filterMessage, setFilterMessage] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [subTotal, setsubTotal] = useState(0);

  const [prescriptionDetails, setPrescriptionDetails] = useState(null);
  const [filterParams, setFilterParams] = useState({
    date: "",
    doctorName: "",
    filled: undefined,
  });
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await fetch(`/api/patient/viewMedicines`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setMedicines(data);
      } catch (err) {
        console.log(err);
      }
    };
  
    fetchMedicines();
  }, []);
  

  const calculateNewValue = (index) => {
    let sum = 0;
    for (let i = 0; i < prescriptions[index].medicationInfo.length; i++) {
      for(let j=0;j<medicines.length;j++){   
      if(  medicines[j].name==prescriptions[index].medicationInfo[i].medicine){
        sum+=medicines[j].price
      }
    }
  }
      setsubTotal(sum)
  };
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
      setTimeout(() => {
          setFilterMessage("");
        }, 5000);
      //setPrescriptions([]);
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
  const handleShowPrescriptionDetails = (prescription,index) => {
    setPrescriptionDetails(prescription);
    calculateNewValue(index)
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
  const pay = async (prescription,index) => {
    if(document.getElementById("payMethod").value=="wallet"){
    const response = await fetch(`/api/patient/payWithWallet`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({value:subTotal}),
    });
    const data = await response.json();
    if(data=="insufficient"){
      alert("insufficient funds")
    }
    else{
      setsubTotal(0)
      alert("successful Payment")
    }
  }
  else{
    try {
      const stripeResponse = await fetch(
        "http://localhost:4000/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: [
              { id: 1, quantity: 3 },
              { id: 2, quantity: 1 },
            ],
          }),
        }
      );

      if (stripeResponse.ok) {

        const { url } = await stripeResponse.json();
        window.location = url;
        console.log(url);
      } else {
        throw new Error("Network response from Stripe was not ok");
      }
    } catch (stripeError) {
      console.error("Stripe Error:", stripeError);
    }
  
  }
}
return (
  <div>
    <h2>Prescriptions:</h2>
    <div>{viewMessage && <p style={errorStyle}>{viewMessage}</p>}</div>
    <div>
      <h3>Filter Prescriptions</h3>

      <div className="mb-3 d-flex align-items-center">
        <input
          type="date"
          id="filterDate"
          className="form-control me-2"
          name="date"
          value={filterParams.date}
          onChange={handleFilterChange}
          placeholder="Enter Date (YYYY-MM-DD)"
        />

        <input
          type="text"
          id="filterDoctorName"
          className="form-control me-2"
          name="doctorName"
          value={filterParams.doctorName}
          onChange={handleFilterChange}
          placeholder="Enter Doctor's Name"
        />

        <select
          name="filled"
          value={filterParams.filled}
          onChange={handleFilterChange}
          className="form-select me-2"
        >
          <option value={undefined}>Select Filled Status</option>
          <option value={true}>Filled</option>
          <option value={false}>Unfilled</option>
        </select>

        <button onClick={handleFilterPrescriptions} className="btn btn-primary me-2">
          Filter
        </button>
        <button className="btn btn-danger" onClick={handleViewPrescriptions}>
          Remove Filters
        </button>
      </div>

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
                onClick={() => handleShowPrescriptionDetails(prescription, index)}
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
        <p>
          <strong>Total Cost:</strong>
          {subTotal}
        </p>
        <div className="d-flex">
          <button onClick={handleClosePrescriptionDetails}>
            Close Details
          </button>
          <button onClick={handleDownloadPDF}>
            Download PDF
          </button>
          <select id="payMethod" className="form-select me-2">
            <option value="wallet">wallet</option>
            <option value="credit card">credit card</option>
          </select>
          <button onClick={() => pay(prescriptionDetails, selectedPrescription)}>
            Pay
          </button>
        </div>
      </div>
    )}
  </div>
);



}

export default Prescription;
