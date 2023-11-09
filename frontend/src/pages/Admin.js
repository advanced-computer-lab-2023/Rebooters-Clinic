import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import AddHealthPackage from "../components/AddHealthPackage";
import EditHealthPackage from "../components/EditHealthPackage";
import DeleteHealthPackage from "../components/DeleteHealthPackage";
import ViewAllPatients from "../components/ViewAllPatients";

function Admin() {
  const [adminUsername, setAdminUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userToRemove, setUserToRemove] = useState('');
  const [newDoctorRequestData, setNewDoctorRequestData] = useState([]);
  const [submissionStatus, setSubmissionStatus] = useState(null); 
  const [message, setMessage] = useState("");
  const [showDoctorRequests, setShowDoctorRequests] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserType = async () => {
      try {
        const response = await fetch("/admin")
        if (response.status === 401 ||response.status === 403) {
          navigate("/", { state: { errorMessage: "Access Denied" } });
        }
      } catch (error) {
        console.error(error);
      }
    };

    checkUserType();
  }, []);


  const addAdministrator = async () => {
    if (
      !adminUsername || !password
    ) {
      setSubmissionStatus("error");
      setMessage("Please fill in all required fields.");
      return;
    }
    try {
      const response = await fetch(`/api/administrator/addAdministrator`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: adminUsername, password }),
      });
      if (!response.ok) {
        throw new Error('Failed to add administrator');
      }
      const data = await response.json();
      console.log('Administrator added successfully');
      setAdminUsername('');
      setPassword('');
      setSubmissionStatus("success");
      setMessage("Administrator added successfully");
    } catch (error) {
      console.error(error);
    }
  };

  const removeUserFromSystem = async () => {
    if (
      !userToRemove 
    ) {
      setSubmissionStatus("error");
      setMessage("Please fill in all required fields.");
      return;
    }
    try {
      const response = await fetch(`/api/administrator/removeUserFromSystem`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: userToRemove }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error('Failed to remove pharmacist/patient');
      }
      if (response.status === 200) {
        console.log('Doctor/Patient/Admin removed successfully');
        setUserToRemove('');
        setSubmissionStatus("success");
        setMessage("Doctor/Patient/Admin removed successfully");
      } else {
        console.log(data);
        setSubmissionStatus("error");
        setMessage('Failed to remove pharmacist/patient');
      }
    } catch (error) {
      setSubmissionStatus("error");
      setMessage('Failed to remove pharmacist/patient');
      console.error(error);
    }
  };

  const viewDoctorRequests = async () => {
    try {
      const response = await fetch(`/api/administrator/viewDoctorApplication`);
      if (!response.ok) {
        throw new Error('Failed to fetch new doctor requests');
      }
      const data = await response.json();
      setNewDoctorRequestData(data);
      setShowDoctorRequests(true);
    } catch (error) {
      console.error(error);
    }
  };

  const approveDoctor = async (username) => {
    try {
      const response = await fetch("/api/administrator/approveDoctorRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      if (response.ok) {
        // Refresh doctor requests
        viewDoctorRequests();
      } else {
        console.error("Failed to approve doctor request");
      }
    } catch (error) {
      console.error("An error occurred while approving doctor request:", error);
    }
  }; 

  const rejectDoctor = async (username) => {
    try {
      const response = await fetch("/api/administrator/rejectDoctorRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      if (response.ok) {
        // Refresh doctor requests
        viewDoctorRequests();
      } else {
        console.error("Failed to reject doctor request");
      }
    } catch (error) {
      console.error("An error occurred while rejecting doctor request:", error);
    }
  };

  const toggleDoctorRequests = () => {
    if (!showDoctorRequests) {
      viewDoctorRequests();
    } else {
      setShowDoctorRequests(false);
    }
  };
//   useEffect(() => {
//     viewAdministrators();
//     viewPharmacists();
//     viewPatients();
//   },);
  

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Administrator Dashboard</h1>
      {submissionStatus === "success" && (
          <div className="alert alert-success">{message}</div>
        )}
        {submissionStatus === "error" && (
          <div className="alert alert-danger">{message}</div>
        )}
      <div className="mb-3">
        <h2>Add Administrator</h2>
        <input
          type="text"
          placeholder="Administrator Username"
          value={adminUsername}
          onChange={(e) => setAdminUsername(e.target.value)}
          className="form-control mb-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-control mb-2"
        />
        <button className="btn btn-primary" onClick={addAdministrator}>
          Add Administrator
        </button>
      </div>
     
      <div className="mt-4">
        <h2>Doctor/Patient/Admin to remove</h2>
        <div className="mb-3">
          <input
            type="text"
            placeholder="Username to Remove"
            value={userToRemove}
            onChange={(e) => setUserToRemove(e.target.value)}
            className="form-control"
          />
          <button className="btn btn-danger mt-2" onClick={removeUserFromSystem}>
            Remove Doctor/Patient/Admin
          </button>
        </div>
      </div>
      <div className="mt-4">
        <h2>New Doctor Requests</h2>
        <button className="btn btn-primary" onClick={toggleDoctorRequests}>
          {showDoctorRequests ? "Hide New Doctor Requests" : "View New Doctor Requests"}
        </button>
        {showDoctorRequests && (
        <table className="table mt-2">
          <thead>
            <tr>
              <th>Username</th>
              <th>Name</th>
              <th>Email</th>
              <th>Date of Birth</th>
              <th>Hourly Rate</th>
              <th>Speciality</th>
              <th>Affiliation</th>
              <th>Educational Background</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {newDoctorRequestData.map((request) => (
              <tr key={request._id}>
                <td>{request.username}</td>
                <td>{request.name}</td>
                <td>{request.email}</td>
                <td>{request.dateOfBirth}</td>
                <td>{request.hourlyRate}</td>
                <td>{request.speciality}</td>
                <td>{request.affiliation}</td>
                <td>{request.educationalBackground}</td>
                <td>
            {request.status === 'pending' ? (
              <div>
                <button onClick={() => approveDoctor(request.username)}>
                  Accept
                </button>
                <button onClick={() => rejectDoctor(request.username)}>
                  Reject
                </button>

              </div>
            ) : (
              'Request Handled'
            )}
          </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
      <div className="mt-4">
          <AddHealthPackage />
        </div>
        <div className="mt-4">
          <EditHealthPackage />
        </div>  
        <div className="mt-4">
          <DeleteHealthPackage />
        </div>
        <div className="mt-4">
          <ViewAllPatients />
        </div>

    </div>
  );
}

export default Admin;
