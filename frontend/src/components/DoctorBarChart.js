import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';

const DoctorBarChart = () => {
  const [doctors, setDoctors] = useState([]);
  const [specialtyData, setSpecialtyData] = useState([]);

  const fetchDoctors = async () => {
    try {
      const response = await fetch("/api/administrator/viewAllDoctors");
      if (response.ok) {
        const json = await response.json();
        setDoctors(json);
  
        // Extract and count the number of doctors in each specialty
        const specialtyCounts = {};
        json.forEach((doctor) => {
          const { speciality } = doctor;
          if (speciality) {
            specialtyCounts[speciality] = (specialtyCounts[speciality] || 0) + 1;
          }
        });
  
        // Convert the specialty counts to an array for chart data
        const specialtyChartData = Object.keys(specialtyCounts).map((speciality) => ({
            speciality,
          count: specialtyCounts[speciality],
        }));
  
        setSpecialtyData(specialtyChartData);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };
  useEffect(() => {
    fetchDoctors();
  }, []);

  // Create data for the bar chart
  const data = {
    labels: specialtyData.map((item) => item.speciality),
    datasets: [
      {
        label: 'Number of Doctors',
        data: specialtyData.map((item) => item.count),
        backgroundColor: 'rgba(	6, 163, 218, 0.6)',
        borderColor: 'rgba(6, 163, 218,1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },

  };

  return (
    <div style={{height:"500px"}}>
      <h2>Doctors According to Speciality</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default DoctorBarChart;
