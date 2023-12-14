import React, { useState, useEffect } from 'react';

const FollowUpRequests = () => {
  const [followUpRequests, setFollowUpRequests] = useState([]);

  useEffect(() => {
    const fetchFollowUpRequests = async () => {
      try {
        const response = await fetch('/api/doctor/getDoctorFollowUpRequests');
        const data = await response.json();
        setFollowUpRequests(data.followUpRequests);
      } catch (error) {
        console.error('Error fetching follow-up requests:', error);
      }
    };

    fetchFollowUpRequests();
  }, []); // Run once on component mount

  const handleAccept = async (datetime, index) => {
    try {
      await fetch('/api/doctor/acceptFollowUpRequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ datetime }),
      });
      // Update the local state to mark the request as accepted
      setFollowUpRequests((prevRequests) =>
        prevRequests.map((request, i) =>
          i === index ? { ...request, accepted: true } : request
        )
      );
    } catch (error) {
      console.error('Error accepting follow-up request:', error);
    }
  };

  const handleRevoke = async (datetime, index) => {
    try {
      await fetch('/api/doctor/revokeFollowUpRequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ datetime }),
      });
      // Update the local state to mark the request as revoked
      setFollowUpRequests((prevRequests) =>
        prevRequests.map((request, i) =>
          i === index ? { ...request, revoked: true } : request
        )
      );
    } catch (error) {
      console.error('Error revoking follow-up request:', error);
    }
  };

  return (
    <div>
      <h2>Follow-up Requests</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Reason</th>
            <th>Preferred Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {followUpRequests.map((request, index) => (
            <tr key={request.datetime}>
              <td>{request.patient}</td>
              <td>{request.FollowUpRequest.reason}</td>
              <td>{new Date(request.FollowUpRequest.preferredDate).toLocaleString()}</td>
              <td>{request.FollowUpRequest.status}</td>
              <td>
                {!request.accepted && !request.revoked && (
                  <>
                    <button className='btn btn-primary' onClick={() => handleAccept(request.datetime, index)}>Accept</button>
                    <button className='btn btn-danger' onClick={() => handleRevoke(request.datetime, index)}>Revoke</button>
                  </>
                )}
                {request.accepted && <p>Follow-up request accepted!</p>}
                {request.revoked && <p>Follow-up request revoked!</p>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FollowUpRequests;
