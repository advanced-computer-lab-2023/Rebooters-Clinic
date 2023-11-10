import React, { useEffect, useState } from 'react';

const Contract = () => {
  const [contracts, setContract] = useState([]);

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const response = await fetch(`/api/doctor/viewContract`);
        if (response.ok) {
          const data = await response.json();
          setContract(data.contract);
        } else {
          console.error('Failed to fetch contract details');
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchContract();
  }, []);

  const handleAcceptContract = async (contractID) => {
    try {
      const response = await fetch(`/api/doctor/acceptContract`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({contractID}),
      });
      if (response.ok) {
        const data = await response.json();
        window.location.reload();
      } else {
        console.log('Already accepted')
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRejectContract = async (contractID) => {
    try {
      const response = await fetch(`/api/doctor/rejectContract`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({contractID}),
      });
      if (response.ok) {
        const data = await response.json();
        window.location.reload();
      } else {
        console.log('Already accepted')
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Doctor's Contracts</h2>
      {contracts.length > 0 ? (
        contracts.map((contract) => (
          <div key={contract._id}>
            <h3>Contract ID: {contract._id}</h3>
            <p>Doctor Name: {contract.doctorName}</p>
            <p>Employer Name: {contract.employerName}</p>
            <p>Start Date: {contract.startDate}</p>
            <p>End Date: {contract.endDate}</p>
            <p>Salary: {contract.salary}</p>
            <p>Status: {contract.status}</p>
            <button
              type="button"
              onClick={() => handleAcceptContract(contract._id)}
              className="btn btn-primary"
            >
              Accept
            </button>
            <button type="button" 
            onClick={() => handleRejectContract(contract._id)}
            className="btn btn-danger">
              Reject
            </button>
          </div>
        ))
      ) : (
        <p>No contracts available</p>
      )}
    </div>
  );
};


export default Contract;