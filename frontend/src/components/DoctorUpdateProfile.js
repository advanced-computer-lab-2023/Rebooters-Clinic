import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const DoctorUpdateProfile = () => {
  const [formData, setFormData] = useState({
    email: "",
    hourlyRate: "",
    affiliation: "",
    doctorUsername: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.hourlyRate || !formData.affiliation) {
        setError("Please fill in all fields.");
        setMessage("");
        return;
      }
    try {
      const response = await fetch("/api/doctor/doctor-update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage("Profile updated successfully");
        setError("");
        setFormData({
          email: "",
          hourlyRate: "",
          affiliation: "",
          doctorUsername: "",
        })
      } else {
        const errorData = await response.json();
        setError(errorData.error);
        setMessage("");
      }
    } catch (error) {
      setError("An error occurred while updating the profile");
      setMessage("");
    }
  };

  return (
    <div className="container">
      <h2>Update Your Profile:</h2>
      {message && <p className="text-success">{message}</p>}
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleSubmit}>
      <div className="mb-3">
          <label htmlFor="doctorUsername" className="form-label">
            Doctor Username:
          </label>
          <input
            type="text"
            className="form-control"
            id="doctorUsername"
            name="doctorUsername"
            value={formData.doctorUsername}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email:
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="hourlyRate" className="form-label">
            Hourly Rate:
          </label>
          <input
            type="text"
            className="form-control"
            id="hourlyRate"
            name="hourlyRate"
            value={formData.hourlyRate}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="affiliation" className="form-label">
            Affiliation:
          </label>
          <input
            type="text"
            className="form-control"
            id="affiliation"
            name="affiliation"
            value={formData.affiliation}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default DoctorUpdateProfile;
