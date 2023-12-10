import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt,faPhone,faEnvelope } from '@fortawesome/free-solid-svg-icons';
import loginCoverImage from '../styles/carousel-2.jpg';

const Conc = () => {
    return (
      <div className="site-wrap">
<div className="login-cover">
      <div className="cover-color">
        <nav class="navbar navbar-expand-lg bg-white navbar-light shadow-sm px-5 py-3 py-lg-0">
        <img src={"clinic-logo.png"} width="100"/>
          <a href="/" class="navbar-brand p-0">
            <h1 class="m-0 text-primary">
              <i class="fa fa-tooth me-2"></i>El7a2ni
            </h1>
          </a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarCollapse"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarCollapse">
            <div class="navbar-nav ms-auto py-0">
              <a href="/index" class="nav-item nav-link active">
                Home
              </a>
              <a href="/about" class="nav-item nav-link">
                About
              </a>
              <a href="/service" class="nav-item nav-link">
                Service
              </a>
              <div class="nav-item dropdown">
                <a
                  href="#"
                  class="nav-link dropdown-toggle"
                  data-bs-toggle="dropdown"
                >
                  Pages
                </a>
                <div class="dropdown-menu m-0">
                  <a href="price.html" class="dropdown-item">
                    Pricing Plan
                  </a>
                  <a href="team.html" class="dropdown-item">
                    Our Dentist
                  </a>
                  <a href="testimonial.html" class="dropdown-item">
                    Testimonial
                  </a>
                  <a href="appointment.html" class="dropdown-item">
                    Appointment
                  </a>
                </div>
              </div>
              <a href="/contact" class="nav-item nav-link">
                Contact
              </a>
            </div>
            <button
              type="button"
              class="btn text-dark"
              data-bs-toggle="modal"
              data-bs-target="#searchModal"
            >
              <i class="fa fa-search"></i>
            </button>
            <a href="" class="btn btn-primary py-2 px-4 ms-3">
              Appointment
            </a>
          </div>
        </nav>        
        <div className="text-center" style={{ marginLeft: '30px', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', zIndex: 2 }}>
            <h1>Contact Info</h1>
            <ul className="list-unstyled">
              <li className="address">
                <FontAwesomeIcon icon={faMapMarkerAlt} /> GUC - El Tagamoa El Khames New Cairo City - Egypt
              </li>
              <li className="phone">
                <FontAwesomeIcon icon={faPhone} /> <a href="tel://23923929210">+1 23456789</a>
              </li>
              <li className="email">
                <FontAwesomeIcon icon={faEnvelope} /> rebootersteam9@gmail.com
              </li>
            </ul>
          </div>
          <div className='xy-cover' style={{ backgroundImage: `url(${loginCoverImage})`, backgroundSize: 'cover', height: '100vh', position: 'relative', zIndex: 1 }}>
            
                </div>
                </div>
                </div>
                </div>
    );
};
export default Conc;

