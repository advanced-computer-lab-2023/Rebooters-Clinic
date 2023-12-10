import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';

const UserPieChart = () => {
  const [doctors, setDoctors] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [patients, setPatients] = useState([]);

  const fetchDoctors = async () => {
    try {
      const response = await fetch("/api/administrator/viewAllDoctors");
      if (response.ok) {
        const json = await response.json();
        setDoctors(json);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const fetchAdmins = async () => {
    try {
      const response = await fetch("/api/administrator/viewAllAdmins");
      if (response.ok) {
        const json = await response.json();
        setAdmins(json);
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await fetch("/api/administrator/viewAllPatients");
      if (!response.ok) {
        throw new Error("Failed to fetch patients");
      }
      const json = await response.json();
      setPatients(json);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDoctors();
    fetchAdmins();
    fetchPatients();
  }, []);

  // Calculate the total number of users
  const totalUsers = doctors.length + admins.length + patients.length;

  // Create data for the pie chart
  const data = {
    labels: ['Doctors', 'Admins', 'Patients'],
    datasets: [
      {
        data: [doctors.length, admins.length, patients.length],
        backgroundColor: ['#1AAC83', '#F57E57', '#06A3DA'],
        hoverBackgroundColor: ['#1AAC83', '#F57E57', '#06A3DA'],
      },
    ],
  };

  return (
    <div>
      <h2 style={{textAlign:'center'}}>Users According to Type</h2>
      <p style={{textAlign:'center'}}><strong>Total Users: {totalUsers}</strong></p>
      <Pie data={data} />
    </div>
  );
};

export default UserPieChart;