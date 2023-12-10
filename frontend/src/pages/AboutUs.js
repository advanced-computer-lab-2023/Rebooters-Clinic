import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStethoscope, faUserMd, faHandHoldingHeart, faMapMarkerAlt, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import loginCoverImage from '../styles/carousel-2.jpg';
import bgImage from '../styles/carousel-1.jpg';
import heroImage from '../styles/doctor-background.jpg';
import "../styles/au.css";

const AboutUs = () => {
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
        <div className="text-center" style={{ marginLeft: '40px', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', zIndex: 2 }}>
            <h1>About Us</h1>
            <p>
              Welcome to Our Clinic, your trusted partner in healthcare. At Our Clinic, we are committed to providing high-quality medical services to our valued patients.
            </p>
          </div>
          <div className='xy-cover' style={{ backgroundImage: `url(${loginCoverImage})`, backgroundSize: 'cover', height: '100vh', position: 'relative', zIndex: 1 }}>
           
      </div>

      <div className="container-fluid mt-5" style={{ marginLeft: '20px' }}> {/* Adjust the margin-left as needed */}
        {/* Mission Card */}
        <div className="row justify-content-center mb-5">
          <div className="col-md-8">
            <div className="site-section bg-light custom-border-bottom" data-aos="fade">
              <div className="row mb-5">
                <div className="col-md-6">
                  <div className="block-16">
                    <figure>
                      <img src={bgImage} alt="Image placeholder" className="img-fluid rounded" />
                    </figure>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="row justify-content-center">
                    <div className="site-section-heading pt-3 mb-4">
                      <h2 className="text-black">Mission</h2>
                    </div>
                    <p>
                      Our mission is to enhance the well-being of our community by ensuring access to a wide range of medical solutions. Whether you're seeking preventive care, diagnostic services, or personalized health advice, our dedicated team of healthcare professionals is here to assist you.
                    </p>
                    <p>
                      Our Clinic is more than just a healthcare facility; we strive to create a welcoming and caring environment. Your health is our priority, and we work tirelessly to exceed your expectations in every aspect of our service.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trusted Company Card */}
        <div className="row justify-content-center mb-5">
          <div className="col-md-8">
            <div className="site-section bg-light custom-border-bottom" data-aos="fade">
              <div className="row mb-5">
                <div className="col-md-6">
                  <div className="block-16">
                    <figure>
                      <img src={heroImage} alt="Image placeholder" className="img-fluid rounded" />
                    </figure>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="row justify-content-center">
                    <div className="site-section-heading pt-3 mb-4">
                      <h2 className="text-black">We Are Your Trusted Healthcare Partner</h2>
                    </div>
                    <p className="text-black">
                      We value the trust you place in us, and we are honored to be part of your healthcare journey. Thank you for choosing Our Clinic as your healthcare partner. We look forward to serving you with dedication and compassion.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Free Services, Patient-Centered Care, Expert Healthcare Support */}
        <div className="row justify-content-center mb-5">
          <div className="col-lg-4 mb-4 mb-lg-0">
            <div className="text">
              <h2><FontAwesomeIcon icon={faStethoscope} /> Comprehensive Services</h2>
              <p>Experience comprehensive healthcare services for all your medical needs.</p>
            </div>
          </div>
          <div className="col-lg-4 mb-4 mb-lg-0">
            <div className="text">
              <h2><FontAwesomeIcon icon={faUserMd} /> Patient-Centered Care</h2>
              <p>We are committed to providing patient-centered care. Your satisfaction is our priority.</p>
            </div>
          </div>
          <div className="col-lg-4 mb-4 mb-lg-0">
            <div className="text">
              <h2><FontAwesomeIcon icon={faHandHoldingHeart} /> Expert Healthcare Support</h2>
              <p>Our dedicated healthcare team is here to provide expert support and guidance.</p>
            </div>
          </div>
        </div>

        <footer className="site-footer">
          <div className="row">
            <div className="col-md-6 col-lg-3">
              <div className="block-5 mb-5">
                <div className="container-fluid mt-5" style={{ marginLeft: '1070px' }}> {/* Adjust the margin-left as needed */}

                  <h3 className="footer-heading mb-4">Contact Info</h3>
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
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
    </div>
    </div>
  );
};

export default AboutUs;
