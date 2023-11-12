import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const PatientAppointments = () => {
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [filterByStatusData, setFilterByStatusData] = useState([]);
  const [customStatus, setCustomStatus] = useState("");
  const [filterByDateRange, setFilterByDateRange] = useState([]);
  const [filterByUpcomingDate, setFilterByUpcomingDate] = useState([]);
  const [filterByPastDate, setFilterByPastDate] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [appointmentId, setAppointmentId] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [paymentMessage, setPaymentMessage] = useState("");
  const [paymentError, setPaymentError] = useState("");


  const fetchAppointments = async () => {
    try {
      const response = await fetch("/api/patient/viewMyAppointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }
      });
      const json = await response.json();
      if (response.ok) {
        setFilterByUpcomingDate([]);
        setFilterByPastDate([]);
        setFilterByDateRange([]);
        setAppointmentsData(json);
        setFilterByStatusData([]);
      } else {
        setPaymentError("An error occurred while fetching appointments");
      }
    } catch (error) {
      setPaymentError("An error occurred while fetching appointments");
    }
  };

  const filterAppointmentsByStatus = async (appointmentStatus) => {
    try {
      const response = await fetch("/api/patient/filterAppointmentsByStatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({  appointmentStatus }),
      });
      const json = await response.json();
      if (response.ok) {
        setFilterByUpcomingDate([]);
        setFilterByPastDate([]);
        setFilterByDateRange([]);
        setAppointmentsData([]);
        setFilterByStatusData(json);
        setCustomStatus("");
      } else {
        setPaymentError(
          "An error occurred while filtering appointments by status"
        );
      }
    } catch (error) {
      setPaymentError(
        "An error occurred while filtering appointments by status"
      );
    }
  };

  const filterAppointmentsByDateRange = async () => {
    try {
      const response = await fetch("/api/patient/filterAppointmentsByDate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({  startDate, endDate }),
      });
      const json = await response.json();
      if (response.ok) {
        setFilterByUpcomingDate([]);
        setFilterByPastDate([]);
        setFilterByDateRange(json);
        setAppointmentsData([]);
        setFilterByStatusData([]);
      } else {
        setPaymentError(
          "An error occurred while filtering appointments by date range"
        );
      }
    } catch (error) {
      setPaymentError(
        "An error occurred while filtering appointments by date range"
      );
    }
  };

  const filterAppointmentsByUpcomingDate = async () => {
    try {
      const response = await fetch("/api/patient/upcoming-appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }
      });
      const json = await response.json();
      if (response.ok) {
        setFilterByUpcomingDate(json);
        setFilterByPastDate([]);
        setFilterByDateRange([]);
        setAppointmentsData([]);
        setFilterByStatusData([]);
      } else {
        setPaymentError(
          "An error occurred while filtering appointments by upcoming date"
        );
      }
    } catch (error) {
      setPaymentError(
        "An error occurred while filtering appointments by upcoming date"
      );
    }
  };

  const filterAppointmentsByPastDate = async () => {
    try {
      const response = await fetch("/api/patient/past-appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }
      });
      const json = await response.json();
      if (response.ok) {
        setFilterByUpcomingDate([]);
        setFilterByPastDate(json);
        setFilterByDateRange([]);
        setAppointmentsData([]);
        setFilterByStatusData([]);
      } else {
        setPaymentError(
          "An error occurred while filtering appointments by past date"
        );
      }
    } catch (error) {
      setPaymentError(
        "An error occurred while filtering appointments by past date"
      );
    }
  };

  const handleAppointmentIdChange = (event) => {
    setAppointmentId(event.target.value);
  };

  const handlePaymentSelection = (event) => {
    setSelectedPaymentMethod(event.target.value);
  };

  const handlePaymentSubmit = async () => {
    if (!appointmentId || !selectedPaymentMethod) {
      setPaymentError("Appointment ID and payment method are required.");
      return;
    }

    try {
      const response = await fetch("/api/patient/payForAppointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointmentId,
          paymentMethod: selectedPaymentMethod,
        }),
      });

      if (selectedPaymentMethod === "pay with credit card") {
        try {
          const stripeResponse = await fetch(
            "http://localhost:3000/create-checkout-session",
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

      if (response.ok) {
        const data = await response.json();
        setPaymentMessage(data.message);
        setPaymentError("");
        fetchAppointments(); // Refresh appointments after successful payment
      } else {
        const errorData = await response.json();
        setPaymentError(errorData.error);
        setPaymentMessage("");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      setPaymentError("An error occurred while processing the payment.");
      setPaymentMessage("");
    }
  };

  useEffect(() => {
    // Fetch appointments when the component mounts
    fetchAppointments();
  }, []);

  return (
    <div className="container">
      <h2>My Appointments:</h2>
      <div>
        <label>Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div>
        <label>End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <button
        className="btn btn-primary"
        onClick={filterAppointmentsByDateRange}
      >
        Filter by Date Range
      </button>
      <input
        type="text"
        className="form-control"
        placeholder="Custom Status"
        value={customStatus}
        onChange={(e) => setCustomStatus(e.target.value)}
      />
      <button
        className="btn btn-primary"
        onClick={filterAppointmentsByUpcomingDate}
      >
        Filter by Upcoming Date
      </button>
      <button
        className="btn btn-primary"
        onClick={filterAppointmentsByPastDate}
      >
        Filter by Past Date
      </button>
      <button
        className="btn btn-primary"
        onClick={() => filterAppointmentsByStatus(customStatus)}
      >
        Filter by Status
      </button>
      <button className="btn btn-primary" onClick={fetchAppointments}>
        Remove Filters
      </button>
      {paymentError && <p className="text-danger">{paymentError}</p>}
      {paymentMessage && <p className="text-success">{paymentMessage}</p>}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Doctor</th>
            <th>Date and Time</th>
            <th>Status</th>
            <th>Payment</th>
          </tr>
        </thead>
        <tbody>
          {filterByStatusData.length > 0
            ? filterByStatusData.map((appointment) => (
                <tr key={appointment._id}>
                  <td>{appointment._id}</td>
                  <td>{appointment.doctor}</td>
                  <td>
                    {new Date(appointment.datetime).toLocaleDateString()}{" "}
                    {new Date(appointment.datetime).toLocaleTimeString()}
                  </td>
                  <td>{appointment.status}</td>
                  <td>{appointment.payment}</td>
                </tr>
              ))
            : filterByDateRange.length > 0
            ? filterByDateRange.map((appointment) => (
                <tr key={appointment._id}>
                  <td>{appointment._id}</td>
                  <td>{appointment.doctor}</td>
                  <td>
                    {new Date(appointment.datetime).toLocaleDateString()}{" "}
                    {new Date(appointment.datetime).toLocaleTimeString()}
                  </td>
                  <td>{appointment.status}</td>
                  <td>{appointment.payment}</td>
                </tr>
              ))
            : filterByUpcomingDate.length > 0
            ? filterByUpcomingDate.map((appointment) => (
                <tr key={appointment._id}>
                  <td>{appointment._id}</td>
                  <td>{appointment.doctor}</td>
                  <td>
                    {new Date(appointment.datetime).toLocaleDateString()}{" "}
                    {new Date(appointment.datetime).toLocaleTimeString()}
                  </td>
                  <td>{appointment.status}</td>
                  <td>{appointment.payment}</td>
                </tr>
              ))
            : filterByPastDate.length > 0
            ? filterByPastDate.map((appointment) => (
                <tr key={appointment._id}>
                  <td>{appointment._id}</td>
                  <td>{appointment.doctor}</td>
                  <td>
                    {new Date(appointment.datetime).toLocaleDateString()}{" "}
                    {new Date(appointment.datetime).toLocaleTimeString()}
                  </td>
                  <td>{appointment.status}</td>
                  <td>{appointment.payment}</td>
                </tr>
              ))
            : appointmentsData.map((appointment) => (
                <tr key={appointment._id}>
                  <td>{appointment._id}</td>
                  <td>{appointment.doctor}</td>
                  <td>
                    {new Date(appointment.datetime).toLocaleDateString()}{" "}
                    {new Date(appointment.datetime).toLocaleTimeString()}
                  </td>
                  <td>{appointment.status}</td>
                  <td>{appointment.payment}</td>
                </tr>
              ))}
        </tbody>
      </table>
      <div>
        <h2>Pay for Appointment</h2>
        <Form.Group>
          <Form.Label>Enter Appointment ID:</Form.Label>
          <Form.Control
            type="text"
            value={appointmentId}
            onChange={handleAppointmentIdChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Select Payment Method:</Form.Label>
          <Form.Control
            as="select"
            value={selectedPaymentMethod}
            onChange={handlePaymentSelection}
          >
            <option value="">Select Payment Method</option>
            <option value="pay with my wallet">Pay with my wallet</option>
            <option value="pay with credit card">Pay with credit card</option>
          </Form.Control>
        </Form.Group>
        <Button onClick={handlePaymentSubmit}>Submit Payment</Button>
      </div>
    </div>
  );
};

export default PatientAppointments;
