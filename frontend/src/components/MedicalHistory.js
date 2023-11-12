import React, { useState, useEffect } from 'react';

const MedicalHistoryComponent = () => {
  const [files, setFiles] = useState([]);
  const [fileInput, setFileInput] = useState(null);

  // Fetch and display medical history files on component mount
  useEffect(() => {
    const fetchMedicalHistory = async () => {
      try {
        const response = await fetch('/api/patient/viewMedicalHistory');
        const data = await response.json();
        setFiles(data);
      } catch (error) {
        console.error('Error fetching medical history:', error);
      }
    };

    fetchMedicalHistory();
  }, []);

  // Handle file upload
  const handleFileUpload = async (e) => {
    const formData = new FormData();
    formData.append('file', e.target.files[0]);

    try {
      await fetch('/api/patient/addMedicalHistory', {
        method: 'POST',
        body: formData,
      });

      // Refresh the list of medical history files
      const response = await fetch('/api/patient/viewMedicalHistory');
      const data = await response.json();
      setFiles(data);
    } catch (error) {
      console.error('Error uploading medical history file:', error);
    }
  };

  // Handle file download
  const downloadDocument = async (fileName) => {
    const link = document.createElement("a");
    const url = fileName;
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };


  // Handle file deletion
  const handleFileDelete = async (filename) => {
    try {
      await fetch(`/api/patient/deleteMedicalHistory/${filename}`, {
        method: 'DELETE',
      });

      // Refresh the list of medical history files
      const response = await fetch('/api/patient/viewMedicalHistory');
      const data = await response.json();
      setFiles(data);
    } catch (error) {
      console.error('Error deleting medical history file:', error);
    }
  };

  return (
    <div>
      <h2>Medical History</h2>

      {/* File Upload */}
      <input
        type="file"
        accept=".pdf,.doc,.docx,.jpg,.jpeg"
        onChange={(e) => {
          setFileInput(e.target);
          handleFileUpload(e);
        }}
      />
      <br />

      {/* List of Files */}
      <ul>
        {files.map((file) => (
          <li key={file.filename}>
            {file.filename}{' '}
            <button onClick={() => downloadDocument(file.filename)}>Download</button>{' '}
            <button onClick={() => handleFileDelete(file.filename)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MedicalHistoryComponent;
