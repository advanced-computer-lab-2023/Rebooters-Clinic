import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import "../styles/home.css";


const Homey = () => {
    const [containerTransform, setContainerTransform] = useState("translateX(-100%)");

    useEffect(() => {
      // Update the transform when the component mounts
      setContainerTransform("translateX(0)");
    }, []);

  return (
    <div className="site-wrap">
      <div className="login-cover" style={{ height: "800px", overflow: "hidden"}}>
      <div
          className="cover-color"
          
        >
          

          <nav className="navbar navbar-expand-lg bg-white navbar-light shadow-sm px-5 py-3 py-lg-0">
            <img src={"clinic-logo.png"} width="100" alt="Clinic Logo" />
            <a href="/" className="navbar-brand p-0">
              <h1 className="m-0 text-primary">
                <i className="fa fa-tooth me-2"></i>El7a2ni
              </h1>
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarCollapse"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarCollapse">
              <div className="navbar-nav ms-auto py-0">
                <a href="/" className="nav-item nav-link active">
                  Home
                </a>
                <a href="/about" className="nav-item nav-link">
                  About
                </a>
                <a href="/service" className="nav-item nav-link">
                  Service
                </a>
                <div className="nav-item dropdown">
                  <a
                    href="#"
                    className="nav-link dropdown-toggle"
                    data-bs-toggle="dropdown"
                  >
                    Pages
                  </a>
                  <div className="dropdown-menu m-0">
                    <a href="price.html" className="dropdown-item">
                      Pricing Plan
                    </a>
                    <a href="team.html" className="dropdown-item">
                      Our Dentist
                    </a>
                    <a href="testimonial.html" className="dropdown-item">
                      Testimonial
                    </a>
                    <a href="appointment.html" className="dropdown-item">
                      Appointment
                    </a>
                  </div>
                </div>
                <a href="/contact" className="nav-item nav-link">
                  Contact
                </a>
              </div>
              <button
                type="button"
                className="btn text-dark"
                data-bs-toggle="modal"
                data-bs-target="#searchModal"
              >
                <i className="fa fa-search"></i>
              </button>
              <a href="" className="btn btn-primary py-2 px-4 ms-3">
                Appointment
              </a>
            </div>
          </nav>
          <div  style={{ maxWidth: "600px", padding: "20px" ,margin: "auto", marginTop: "100px", overflow: "hidden"}}>
          <div className="card mt-4" style={{ transform: containerTransform, transition: "transform 0.5s ease-in-out"}}>
              <div className="card-body text-center">
              <h1 style={{ fontSize: "40px", marginBottom: "20px", color: "black" }}>
                Welcome to El7a2ni Clinic
              </h1>

              <div
                className="button-group"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center", // Center horizontally
                }}
              >
                <Link
                  to="/login"
                  className="btn1 btn1-primary"
                  style={{ margin: "10px 0" }}
                >
                  Login
                </Link>
                <Link
                  to="/RequestDoc"
                  className="btn1 btn1-primary"
                  style={{ margin: "10px 0" }}
                >
                  Request to Join our Team
                </Link>
                <Link
                  to="/Register"
                  className="btn1 btn1-primary"
                  style={{ margin: "10px 0" }}
                >
                  Register as Patient
                </Link>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};
 export default Homey;
