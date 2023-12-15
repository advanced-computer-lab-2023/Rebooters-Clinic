import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-scroll"; // Import Link from react-scroll
import "../styles/au.css";
import drDoeImage from "../styles/dr_doe.jpg";
import drSmithImage from "../styles/dr_smith.png";
import drJohnsonImage from "../styles/dr_johnson.png";
import medi from "../styles/Medical.jpeg";
import pat1 from "../styles/patient1.png";
import pat2 from "../styles/patient2.jpg";
import pat3 from "../styles/patient3.png";
import pat4 from "../styles/patient4.jpg";
import Footer from "../components/footer";
import Navbar from "../components/Navbar";
const Service = () => {
  const [showContent, setShowContent] = useState(false);

  // Add a function to handle scroll events

  // Attach the scroll event listener
  useEffect(() => {
    // Set a delay to trigger the animation after a short period (e.g., 500 milliseconds)
    const timeout = setTimeout(() => {
      setShowContent(true);
    }, 500);

    // Clear the timeout on component unmount
    return () => clearTimeout(timeout);
  }, []);
  const testimonialContainerStyle = {
    display: "flex",
    justifyContent: "space-around",
    marginTop: "30px",
    flexWrap: "wrap",
  };

  const singleTestimonialStyle = {
    flex: "0 0 20%", // Adjust the width as needed
    marginBottom: "20px",
  };
  const doctorContainerStyle = {
    display: "flex",
    alignItems: "center",
  };
  const doctorImageStyle = {
    width: "20%", // Adjust the width as needed
    height: "20%", // Maintain the aspect ratio
    marginRight: "20px", // Adjust spacing
    borderRadius: "50%",
  };

  useEffect(() => {
    // Set a delay to trigger the animation after a short period (e.g., 500 milliseconds)
    const timeout = setTimeout(() => {
      setShowContent(true);
    }, 500);

    // Clear the timeout on component unmount
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="site-wrap">
      <div className="login-cover " style={{ height: "1500px" }}>
        <div className="cover-color">
          <Navbar />

          <div className="container-fluid">
            <h2
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                marginTop: "50px",
                marginBottom: "30px",
                textAlign: "center",
                color: "whitesmoke",
              }}
            >
              Service Center
            </h2>

            <div className="row">
              {/* Small Container for List of Services */}
              <div className="col-md-4">
                <Link
                  to="services-container"
                  smooth
                  duration={500}
                  offset={-50}
                  spy
                >
                  <div
                    className={`fade-in ${showContent ? "visible" : ""}`}
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      padding: "20px",
                      borderRadius: "10px",
                    }}
                  >
                    <h2
                      style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                        marginBottom: "10px",
                        textAlign: "center",
                      }}
                    >
                      List of Services
                    </h2>
                    <ul
                      style={{
                        listStyleType: "disc",
                        paddingLeft: "20px",
                        fontSize: "16px",
                      }}
                    >
                      <li>
                        General Medical Services - Comprehensive medical care
                        for various health conditions.
                      </li>
                      <li>
                        Dental Services - Specialized dental care including
                        cleanings, fillings, and more.
                      </li>
                      <li>
                        Orthopedic Consultation - Expert evaluation and
                        treatment for musculoskeletal conditions.
                      </li>
                      <li>
                        Women's Health Services - Specialized care for women's
                        health, including screenings and consultations.
                      </li>
                      <li>
                        Pediatric Care - Comprehensive healthcare services for
                        children, from infancy to adolescence.
                      </li>
                      {/* Add more services as needed */}
                    </ul>
                  </div>
                </Link>
              </div>

              {/* Small Container for Medical Professionals */}
              <div className="col-md-4">
                <Link
                  to="professionals-container"
                  smooh
                  duration={500}
                  offset={-50}
                  spy
                >
                  <div
                    className={`fade-in ${showContent ? "visible" : ""}`}
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      padding: "20px",
                      borderRadius: "10px",
                    }}
                  >
                    <h2
                      style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                        marginBottom: "10px",
                        textAlign: "center",
                      }}
                    >
                      Medical Professionals
                    </h2>
                    {/* Medical Professional 1 */}
                    <div style={doctorContainerStyle}>
                      <img
                        src={drDoeImage}
                        alt="Dr. John Doe"
                        style={doctorImageStyle}
                      />
                      <div>
                        <h3
                          style={{
                            fontSize: "18px",
                            fontWeight: "bold",
                            marginBottom: "5px",
                          }}
                        >
                          Dr. John Doe - General Practitioner
                        </h3>
                        <p style={{ fontSize: "16px", marginBottom: "10px" }}>
                          Dr. Doe is a board-certified general practitioner with
                          over 15 years of experience in providing comprehensive
                          medical care.
                        </p>
                      </div>
                    </div>
                    {/* Medical Professional 2 */}
                    <div style={doctorContainerStyle}>
                      <img
                        src={drSmithImage}
                        alt="Dr. Jane Smith"
                        style={doctorImageStyle}
                      />
                      <div>
                        <h3
                          style={{
                            fontSize: "18px",
                            fontWeight: "bold",
                            marginBottom: "5px",
                          }}
                        >
                          Dr. Jane Smith - Pediatrician
                        </h3>
                        <p style={{ fontSize: "16px", marginBottom: "10px" }}>
                          Dr. Smith specializes in pediatric care, ensuring the
                          well-being of young patients with a compassionate
                          approach.
                        </p>
                      </div>
                    </div>

                    {/* Medical Professional 3 */}
                    <div style={doctorContainerStyle}>
                      <img
                        src={drJohnsonImage}
                        alt="Dr. Sarah Johnson"
                        style={doctorImageStyle}
                      />
                      <div>
                        <h3
                          style={{
                            fontSize: "18px",
                            fontWeight: "bold",
                            marginBottom: "5px",
                          }}
                        >
                          Dr. Sarah Johnson - Dermatologist
                        </h3>
                        <p style={{ fontSize: "16px", marginBottom: "10px" }}>
                          Dr. Johnson is a skilled dermatologist with expertise
                          in diagnosing and treating various skin conditions.
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Container for Technology and Facilities */}
              <div className="col-md-4">
                <Link
                  to="technology-container"
                  smooth
                  duration={500}
                  offset={-50}
                  spy
                >
                  <div
                    className={`fade-in ${showContent ? "visible" : ""}`}
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      padding: "20px",
                      borderRadius: "10px",
                    }}
                  >
                    <h2
                      style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                        marginBottom: "10px",
                        textAlign: "center",
                      }}
                    >
                      Technology and Facilities
                    </h2>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <img
                        src={medi}
                        alt="Technology Image"
                        style={{ width: "70%", borderRadius: "8px" }}
                      />
                    </div>
                    <p style={{ fontSize: "16px", textAlign: "center" }}>
                      Our clinic is equipped with state-of-the-art medical
                      technology and facilities to provide the highest quality
                      of care. We invest in the latest advancements to ensure
                      accurate diagnoses and effective treatments.
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Patient Testimonials */}
          <section>
            <h2
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                marginTop: "30px",
                textAlign: "center",
                color: "whitesmoke",
              }}
            >
              Patient Testimonials
            </h2>

            <div style={testimonialContainerStyle}>
              {/* Testimonial 1 */}

              <div style={singleTestimonialStyle}>
                <div
                  className="testimonial-container p-4 mt-4"
                  style={{ backgroundColor: "#F8F9FA", borderRadius: "15px" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "20px",
                    }}
                  >
                    <img
                      src={pat1}
                      alt="Patient Avatar"
                      style={{
                        width: "70px",
                        height: "70px",
                        borderRadius: "50%",
                        marginRight: "10px",
                      }}
                    />
                    <div>
                      <h4
                        style={{
                          fontSize: "20px",
                          fontWeight: "bold",
                          marginBottom: "5px",
                        }}
                      >
                        Juanpa Zurita
                      </h4>
                      <p
                        style={{
                          fontSize: "16px",
                          marginBottom: "0",
                          color: "#6C757D",
                        }}
                      >
                        {" "}
                        Mexico City, Mexico
                      </p>
                    </div>
                  </div>
                  <p style={{ fontSize: "18px", color: "#495057" }}>
                    "I received excellent dental care at El7a2ni Clinic. The
                    staff was friendly, and the service was top-notch. I highly
                    recommend their dental services."
                  </p>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div style={singleTestimonialStyle}>
                <div
                  className="testimonial-container p-4 mt-4"
                  style={{ backgroundColor: "#F8F9FA", borderRadius: "15px" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "20px",
                    }}
                  >
                    <img
                      src={pat2}
                      alt="Patient Avatar"
                      style={{
                        width: "70px",
                        height: "70px",
                        borderRadius: "50%",
                        marginRight: "10px",
                      }}
                    />
                    <div>
                      <h4
                        style={{
                          fontSize: "20px",
                          fontWeight: "bold",
                          marginBottom: "5px",
                        }}
                      >
                        Aley Hani
                      </h4>
                      <p
                        style={{
                          fontSize: "16px",
                          marginBottom: "0",
                          color: "#6C757D",
                        }}
                      >
                        Fes, Morocco
                      </p>
                    </div>
                  </div>
                  <p style={{ fontSize: "18px", color: "#495057" }}>
                    "The pediatric care at El7a2ni Clinic is outstanding. Dr.
                    Smith is wonderful with children, and the entire team made
                    our visit comfortable and reassuring."
                  </p>
                </div>
              </div>
              {/* Testimonial 3 */}
              <div style={singleTestimonialStyle}>
                <div
                  className="testimonial-container p-4 mt-4"
                  style={{ backgroundColor: "#F8F9FA", borderRadius: "15px" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "20px",
                    }}
                  >
                    <img
                      src={pat3}
                      alt="Patient Avatar"
                      style={{
                        width: "70px",
                        height: "70px",
                        borderRadius: "50%",
                        marginRight: "10px",
                      }}
                    />
                    <div>
                      <h4
                        style={{
                          fontSize: "20px",
                          fontWeight: "bold",
                          marginBottom: "5px",
                        }}
                      >
                        Jacqueline Fernandez
                      </h4>
                      <p
                        style={{
                          fontSize: "16px",
                          marginBottom: "0",
                          color: "#6C757D",
                        }}
                      >
                        Manama, Bahrain
                      </p>
                    </div>
                  </div>
                  <p style={{ fontSize: "18px", color: "#495057" }}>
                    "I had a great experience at El7a2ni Clinic. The medical
                    professionals are highly skilled, and the facilities are
                    top-notch. I recommend their services to everyone."
                  </p>
                </div>
              </div>

              {/* Testimonial 4 */}
              <div style={singleTestimonialStyle}>
                <div
                  className="testimonial-container p-4 mt-4"
                  style={{ backgroundColor: "#F8F9FA", borderRadius: "15px" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "20px",
                    }}
                  >
                    <img
                      src={pat4}
                      alt="Patient Avatar"
                      style={{
                        width: "70px",
                        height: "70px",
                        borderRadius: "50%",
                        marginRight: "10px",
                      }}
                    />
                    <div>
                      <h4
                        style={{
                          fontSize: "20px",
                          fontWeight: "bold",
                          marginBottom: "5px",
                        }}
                      >
                        Aria Burdqani
                      </h4>
                      <p
                        style={{
                          fontSize: "16px",
                          marginBottom: "0",
                          color: "#6C757D",
                        }}
                      >
                        Allepo, Syria
                      </p>
                    </div>
                  </div>
                  <p style={{ fontSize: "18px", color: "#495057" }}>
                    "The staff at El7a2ni Clinic is incredibly caring. I felt
                    comfortable and well taken care of during my visit. I
                    appreciate the dedication to patient well-being."
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Centered Appointment Container */}
          <section>
            <div
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                padding: "20px",
                borderRadius: "10px",
                margin: "0 auto", // This centers the container horizontally
                maxWidth: "800px", // Adjust the maxWidth as needed
              }}
            >
              {" "}
              <h2
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  marginTop: "30px",
                  textAlign: "center",
                }}
              >
                Appointment Information
              </h2>
              <p style={{ fontSize: "18px", textAlign: "center" }}>
                To schedule an appointment for any of our services, please
                contact us at:
              </p>
              {/* Contact Information */}
              <div>
                <Link
                  to="technology-container"
                  smooth
                  duration={500}
                  offset={-50}
                  spy
                >
                  <ul
                    style={{
                      listStyleType: "none",
                      padding: "0",
                      fontSize: "18px",
                      textAlign: "center",
                    }}
                  >
                    <li className={`fade-in ${showContent ? "visible" : ""}`}>
                      <FontAwesomeIcon icon={faMapMarkerAlt} /> {""}{" "}
                      <a
                        href="https://www.google.com/maps?q=GUC,El+Tagamoa+El+Khames,New+Cairo+City,Egypt"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        GUC - El Tagamoa El Khames New Cairo City - Egypt
                      </a>
                    </li>
                    <li className={`fade-in ${showContent ? "visible" : ""}`}>
                      <FontAwesomeIcon icon={faPhone} />{" "}
                      <a href="tel://23923929210">+1 23456789</a>
                    </li>
                    <li className={`fade-in ${showContent ? "visible" : ""}`}>
                      <FontAwesomeIcon icon={faEnvelope} />{" "}
                      <a href="mailto:rebootersteam9@gmail.com">
                        rebootersteam9@gmail.com
                      </a>
                    </li>
                  </ul>
                </Link>
              </div>{" "}
            </div>
          </section>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Service;
