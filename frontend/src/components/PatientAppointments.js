import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FollowUpRequest from "./FollowUpRequest";
import RescheduleAppointment from "./RescheduleAppointment";

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
  const [showFilters, setShowFilters] = useState(false);
  const [showPayAppointment, setShowPayAppointment] = useState(false);
  const [chosenAppointment, setChosenAppointment] = useState(null);
  const [followUpRequest, setFollowUpRequest] = useState(false);
  const [appFollowUp, setAppFollowUp] = useState("");
  const [showReschedule, setShowReschedule] = useState(false);
  const [doctor, setDoctor] = useState("");
  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handlePayAppointment = (appointment) => {
    setShowPayAppointment(true);
    setChosenAppointment(appointment);
    setAppointmentId(appointment._id);
  };

  const handleClosePayAppointment = () => {
    setShowPayAppointment(false);
    setChosenAppointment(null);
    setAppointmentId("");
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch("/api/patient/viewMyAppointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
  const FollowUp = async (datetime) => {
    if(datetime.toLocaleString()>new Date().toISOString()){
    alert('This appointment is upcoming!')
    }
    else{
    setAppFollowUp(datetime.toLocaleString());
    setFollowUpRequest(true);
    }
  }
  const closeFollowUpRequest = () => {
    setFollowUpRequest(false);
  };
  
  const closeReschedule = () => {
    setShowReschedule(false);
  };
  const handleRescheduleAppointment  = async (doctor,date) => {
    setShowReschedule(true);
    setDoctor(doctor);
    setAppFollowUp(date)
  }

  const filterAppointmentsByStatus = async (appointmentStatus) => {
    try {
      const response = await fetch("/api/patient/filterAppointmentsByStatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ appointmentStatus }),
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
        body: JSON.stringify({ startDate, endDate }),
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
        },
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
        },
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



  const handlePaymentSelection = (event) => {
    setSelectedPaymentMethod(event.target.value);
  };

  const handleCancelAppointment = async (appointment) => {
    try {
      const response = await fetch("/api/patient/cancelAppointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointmentGiven: appointment
        }),
      })

    }catch(error){
    }

  } 

  

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
        await fetchAppointments(); // Refresh appointments after successful payment
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
      {showReschedule && (
  <div className="modal-overlay">
    <div className="card">
      <div className="scheduleFollowup">
        <RescheduleAppointment doctorUsername={doctor} dateApp={appFollowUp}/>
      </div>
      <button
        className="btn btn-danger"
        onClick={closeReschedule}
      >
        Close
      </button>
    </div>
  </div>
)}
       {followUpRequest && (
  <div className="modal-overlay">
    <div className="card">
      <div className="scheduleFollowup">
        <FollowUpRequest datetimeApp={appFollowUp}/>
      </div>
      <button
        className="btn btn-danger"
        onClick={closeFollowUpRequest}
      >
        Close
      </button>
    </div>
  </div>
)}
      {showPayAppointment && (
        <div className="modal-overlay">
          <div className="card">
            <div className="payAppointment">
              <h2>Pay for Appointment (ID: {chosenAppointment._id})</h2>
              <div className="card">
                <h4>Appointment Details:</h4>
                <label>
                  <strong>Date & Time: </strong>
                  {new Date(
                    chosenAppointment.datetime
                  ).toLocaleDateString()}{" "}
                  {new Date(chosenAppointment.datetime).toLocaleTimeString()}{" "}
                </label>
                <label>
                  <strong>Doctor: </strong>
                  {chosenAppointment.doctor}
                </label>
                <label>
                  <strong>Price: </strong>
                  {chosenAppointment.price}$
                </label>
              </div>
              <Form.Group>
                <Form.Label>Select Payment Method:</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedPaymentMethod}
                  onChange={handlePaymentSelection}
                >
                  <option value="">Select Payment Method</option>
                  <option value="pay with my wallet">Pay with my wallet</option>
                  <option value="pay with credit card">
                    Pay with credit card
                  </option>
                </Form.Control>
              </Form.Group>
              <Button onClick={handlePaymentSubmit}>Submit Payment</Button>
            </div>
            <button
              className="btn btn-danger"
              onClick={handleClosePayAppointment}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <h2>My Appointments:</h2>
      <button className="btn btn-secondary" onClick={handleToggleFilters}>
        {showFilters ? "Hide Filters" : "Show Filters"}
      </button>
      {showFilters && (
        <>
          <div>
            <label>Start Date:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            &nbsp;
            <label>End Date:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            &nbsp;
            <button
              className="btn btn-primary"
              onClick={filterAppointmentsByDateRange}
            >
              Filter by Date Range
            </button>
          </div>

          <select
            className="btn btn-secondary dropdown-toggle"
            value={customStatus}
            onChange={(e) => setCustomStatus(e.target.value)}
          >
            <option value="Completed">Completed</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Rescheduled">Rescheduled</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button
            className="btn btn-primary"
            onClick={() => filterAppointmentsByStatus(customStatus)}
          >
            Filter by Status
          </button>
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
          <div className="card">
            <button className="btn btn-danger" onClick={fetchAppointments}>
              Remove Filters
            </button>
          </div>
        </>
      )}
      {paymentError && <p className="text-danger">{paymentError}</p>}
      {paymentMessage && <p className="text-success">{paymentMessage}</p>}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Doctor</th>
            <th>Date and Time</th>
            <th>Status</th>
            <th>Price</th>
            <th>Payment Status</th>
            <th>Actions</th>

          </tr>
        </thead>
        <tbody>
          {filterByStatusData.length > 0
            ? filterByStatusData.map((appointment) => (
                <tr key={appointment._id}>
                  <td>{appointment.doctor}</td>
                  <td>
                    {new Date(appointment.datetime).toLocaleDateString()}{" "}
                    {new Date(appointment.datetime).toLocaleTimeString()}
                    <button 
                     onClick={
                      () =>handleRescheduleAppointment (appointment.doctor,appointment.datetime)
                    }
                    style={{  marginLeft: 'auto',
                     marginRight: 'auto',
                     display: 'block' }                  
                     }>Reschedule</button>
                  </td>
                  <td>{appointment.status}</td>
                  <td>{appointment.price}</td>
                  <td>{appointment.payment}</td>
                  <td>
                    {appointment.status!="Cancelled" && appointment.payment !== "Paid" && (
                      <button
                        className="btn btn-primary"
                        onClick={(e) => {
                          handlePayAppointment(appointment);
                        }}
                      >
                        Pay
                      </button>
                    )}
                    {appointment.status == "Completed" && (
                      
                      <button 
                      onClick={() => FollowUp(appointment.datetime)}>
                         Request a Follow-up
                         </button>
                     )}
                     {appointment.status !== "Completed" && appointment.status !== "Cancelled" &&(
                    <button onClick={() => handleCancelAppointment(appointment)}>
                       Cancel Appointment
                       </button>
                     )}
                  </td>
                 
                </tr>
              ))
            : filterByDateRange.length > 0
            ? filterByDateRange.map((appointment) => (
                <tr key={appointment._id}>
                  <td>{appointment.doctor}</td>
                  <td>
                    {new Date(appointment.datetime).toLocaleDateString()}{" "}
                    {new Date(appointment.datetime).toLocaleTimeString()}
                    <button 
                     onClick={
                      () =>handleRescheduleAppointment (appointment.doctor,appointment.datetime)
                    }
                    style={{  marginLeft: 'auto',
                     marginRight: 'auto',
                     display: 'block' }                  
                     }>Reschedule</button>
                  </td>
                  <td>{appointment.status}</td>
                  <td>{appointment.price}</td>
                  <td>{appointment.payment}</td>
                  <td>
                    {appointment.status !== "Cancelled" && appointment.payment !== "Paid" && (
                      <button
                        className="btn btn-primary"
                        onClick={(e) => {
                          handlePayAppointment(appointment);
                        }}
                      >
                        Pay
                      </button>
                    )}
                    {appointment.status == "Completed" && (
                      
                      <button 
                      onClick={() => FollowUp(appointment.datetime)}>
                         Request a Follow-up
                         </button>
                     )}
                     {appointment.status !== "Completed" && appointment.status !== "Cancelled" &&(
                    <button onClick={() => handleCancelAppointment(appointment)}>
                       Cancel Appointment
                       </button>
                     )}
                  </td>
                </tr>
              ))
            : filterByUpcomingDate.length > 0
            ? filterByUpcomingDate.map((appointment) => (
                <tr key={appointment._id}>
                  <td>{appointment.doctor}</td>
                  <td>
                    {new Date(appointment.datetime).toLocaleDateString()}{" "}
                    {new Date(appointment.datetime).toLocaleTimeString()}
                    <button 
                     onClick={
                      () =>handleRescheduleAppointment (appointment.doctor,appointment.datetime)
                    }
                    style={{  marginLeft: 'auto',
                     marginRight: 'auto',
                     display: 'block' }                  
                     }>Reschedule</button>
                  </td>
                  <td>{appointment.status}</td>
                  <td>{appointment.price}</td>
                  <td>{appointment.payment}</td>
                  <td>
                    {appointment.status !== "Cancelled" && appointment.payment !== "Paid" && (
                      <button
                        className="btn btn-primary"
                        onClick={(e) => {
                          handlePayAppointment(appointment);
                        }}
                      >
                        Pay
                      </button>
                    )}
                    {appointment.status == "Completed" && (
                      
                      <button 
                      onClick={() => FollowUp(appointment.datetime)}>
                         Request a Follow-up
                         </button>
                     )}
                     {appointment.status !== "Completed" && appointment.status !== "Cancelled" &&(
                    <button onClick={() => handleCancelAppointment(appointment)}>
                       Cancel Appointment
                       </button>
                     )}
                  </td>
                </tr>
              ))
            : filterByPastDate.length > 0
            ? filterByPastDate.map((appointment) => (
                <tr key={appointment._id}>
                  <td>{appointment.doctor}</td>
                  <td>
                    {new Date(appointment.datetime).toLocaleDateString()}{" "}
                    {new Date(appointment.datetime).toLocaleTimeString()}
                    <button 
                     onClick={
                      () =>handleRescheduleAppointment (appointment.doctor,appointment.datetime)
                    }
                    style={{  marginLeft: 'auto',
                     marginRight: 'auto',
                     display: 'block' }                  
                     }>Reschedule</button>
                  </td>
                  <td>{appointment.status}</td>
                  <td>{appointment.price}</td>
                  <td>{appointment.payment}</td>
                  <td>
                    {appointment.status !== "Cancelled" && appointment.payment !== "Paid" && (
                      <button
                        className="btn btn-primary"
                        onClick={(e) => {
                          handlePayAppointment(appointment);
                        }}
                      >
                        Pay
                      </button>
                    )}
                    {appointment.status == "Completed" && (
                      
                      <button 
                      onClick={() => FollowUp(appointment.datetime)}>
                         Request a Follow-up
                         </button>
                     )}
                     {appointment.status !== "Completed" && appointment.status !== "Cancelled" &&(
                    <button onClick={() => handleCancelAppointment(appointment)}>
                       Cancel Appointment
                       </button>
                     )}
                  </td>
                </tr>
              ))
            : appointmentsData.map((appointment) => (
                <tr key={appointment._id}>
                  <td>{appointment.doctor}</td>
                  <td>
                    {new Date(appointment.datetime).toLocaleDateString()}{" "}
                    {new Date(appointment.datetime).toLocaleTimeString()}
                    <button 
                     onClick={
                      () =>handleRescheduleAppointment (appointment.doctor,appointment.datetime)
                    }
                    style={{  marginLeft: 'auto',
                     marginRight: 'auto',
                     display: 'block' }                  
                     }>Reschedule</button>
                  </td>
                  <td>{appointment.status}</td>
                  <td>{appointment.price}</td>
                  <td>{appointment.payment}</td>
                  <td>
                    {appointment.status!= "Cancelled" && appointment.payment !== "Paid" && (
                      <button
                        className="btn btn-primary"
                        onClick={(e) => {
                          handlePayAppointment(appointment);
                        }}
                      >
                        Pay
                      </button>
                    )}
                    {appointment.status == "Completed" && (
                      
                     <button 
                     onClick={() => FollowUp(appointment.datetime)}>
                        Request a Follow-up
                        </button>
                    )}
                    {appointment.status !== "Completed" && appointment.status !== "Cancelled" &&(
                   <button onClick={() => handleCancelAppointment(appointment)}>
                      Cancel Appointment
                      </button>
                    )}
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientAppointments;
