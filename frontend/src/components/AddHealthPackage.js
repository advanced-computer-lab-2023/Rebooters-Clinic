import React, { useState } from "react";

function AddHealthPackage() {
  const [patientUsername, setPatientUsername] = useState("");
  const [packageName, setPackageName] = useState("");
  const [patientInfo, setPatientInfo] = useState(null);
  const [error,setError]= useState("");
 
 
  const handleAddHealthPackage = async () => {
   if (!patientUsername||!packageName){
    setError("please fill in all feilds");
    return;
   }
    try {
      const response = await fetch("/api/administrator/addHealthPackage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ patientUsername, packageName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error);
        return;
      }

      const data = await response.json();
      
      setPatientInfo(data);
    } catch (error) {
      console.error(error);
    }
  };
  const renderNestedJSON = (data) => {
    return (
      <ul>
        {Object.entries(data).map(([key, value]) => (
          <li key={key}>
            {typeof value === "object" ? (
              <div>
                {key}:
                {renderNestedJSON(value)}
              </div>
            ) : (
              <div>
                {key}: {value}
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      <h1>Add Health Package</h1>
      <div>
        <label>Patient Username:</label>
        <input
          type="text"
          value={patientUsername}
          onChange={(e) => setPatientUsername(e.target.value)}
        />
      </div>
      <div>
        <label>Package Name:</label>
        <input
          type="text"
          value={packageName}
          onChange={(e) => setPackageName(e.target.value)}
        />
      </div>
      <button onClick={handleAddHealthPackage}>Add Health Package</button>
      {patientInfo && (
        <div>
          <h2>Patient Information:</h2>
          <div>
            <strong>Username:</strong> {patientInfo.username}
          </div>
          <div>
            <strong>Name:</strong> {patientInfo.name}
          </div>
          <div>
            <strong>Health Package:</strong> {JSON.stringify(patientInfo.healthPackage)}
          </div>
        </div>
      )}
    </div>
  );
}

export default AddHealthPackage;
