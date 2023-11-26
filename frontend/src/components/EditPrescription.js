import React, { useState, useEffect } from "react";
import PrescriptionCard from "./PrescriptionCard";

const EditPrescription = ({ patient }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await fetch(
          "/api/doctor/doctor-patients/get-prescriptions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ patientName: patient }),
          }
        );
        if (response.status === 200) {
          const data = await response.json();
          setPrescriptions(data);
        } else {
          setError("Failed to fetch prescriptions");
        }
      } catch (error) {
        console.error(error);
        setError("An error occurred while fetching prescriptions");
      }
    };

    fetchPrescriptions();
  }, [patient]);


  return (
    <div className="container">
      <h2>Prescriptions for {patient}</h2>

      {prescriptions.map((prescription) => (
        <PrescriptionCard
          key={prescription.id} 
          prescription={prescription}
          patientUsername={patient}
        />
      ))}

      {error && <p>{error}</p>}
    </div>
  );
};

export default EditPrescription;
