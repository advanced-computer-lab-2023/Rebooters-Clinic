import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStethoscope,
  faUserMd,
  faHandHoldingHeart,
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import loginCoverImage from "../styles/carousel-2.jpg";
import bgImage from "../styles/carousel-1.jpg";
import heroImage from "../styles/doctor-background.jpg";
import "../styles/au.css";
import { CSSTransition } from "react-transition-group";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
const AboutUs = () => {
  const [showMissionCard, setShowMissionCard] = useState(false);
  const [showTrustedCompanyCard, setShowTrustedCompanyCard] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const missionCardRef = useRef(null);
  const trustedCompanyCardRef = useRef(null);

  const handleIntersection = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        switch (entry.target) {
          case missionCardRef.current:
            setShowMissionCard(true);
            break;
          case trustedCompanyCardRef.current:
            setShowTrustedCompanyCard(true);
            break;
          default:
            break;
        }
        observer.unobserve(entry.target);
      }
    });
  };

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };
    const timeout = setTimeout(() => {
      setShowContent(true);
    }, 500);

    const observer = new IntersectionObserver(handleIntersection, options);

    if (missionCardRef.current) {
      observer.observe(missionCardRef.current);
    }
    if (trustedCompanyCardRef.current) {
      observer.observe(trustedCompanyCardRef.current);
    }

    return () => {
      clearTimeout(timeout);
      if (missionCardRef.current) {
        observer.unobserve(missionCardRef.current);
      }
      if (trustedCompanyCardRef.current) {
        observer.unobserve(trustedCompanyCardRef.current);
      }
    };
  }, []);

  return (
    <div>
      <Navbar />
      <div className="login-cover">
        <div className="cover-color">
          <div
            className="text-center"
            style={{
              marginLeft: "30px",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "white",
              zIndex: 2,
            }}
          >
            <CSSTransition
              in={showContent}
              timeout={500}
              classNames="fade"
              unmountOnExit
            >
              <div>
                <h1 style={{ fontSize: "52px" }}>About Us</h1>
                <p style={{ fontSize: "28px" }}>
                  Welcome to Our Clinic, your trusted partner in healthcare. At
                  Our Clinic, we are committed to providing high-quality medical
                  services to our valued patients.
                </p>
              </div>
            </CSSTransition>
          </div>
          <div
            className="xy-cover"
            style={{
              backgroundImage: `url(${loginCoverImage})`,
              backgroundSize: "cover",
              height: "100vh",
              position: "relative",
              zIndex: 0,
            }}
          ></div>
          <div className="container-fluid mt-5" style={{ marginLeft: "20px" }}>
            {/* Mission Card */}
            <div
              className={`row justify-content-center mb-5 ${
                showMissionCard ? "fade-in slide-from-left" : ""
              }`}
              ref={missionCardRef}
            >
              <div className="col-md-8">
                <div
                  className="site-section bg-light custom-border-bottom"
                  data-aos="fade"
                >
                  <div className="row mb-5">
                    <div className="col-md-6">
                      <div className="block-16">
                        <figure>
                          <img
                            src={bgImage}
                            alt="Image placeholder"
                            className="img-fluid rounded"
                          />
                        </figure>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="row justify-content-center">
                        <div className="site-section-heading">
                          <h2 className="text-black">Mission</h2>
                        </div>
                        <p>
                          Our mission is to enhance the well-being of our
                          community by ensuring access to a wide range of
                          medical solutions. Whether you're seeking preventive
                          care, diagnostic services, or personalized health
                          advice, our dedicated team of healthcare professionals
                          is here to assist you.
                        </p>
                        <p>
                          Our Clinic is more than just a healthcare facility; we
                          strive to create a welcoming and caring environment.
                          Your health is our priority, and we work tirelessly to
                          exceed your expectations in every aspect of our
                          service.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trusted Company Card */}
            <div
              className={`row justify-content-center mb-5 ${
                showTrustedCompanyCard ? "fade-in slide-from-right" : ""
              }`}
              ref={trustedCompanyCardRef}
            >
              <div className="col-md-8">
                <div
                  className="site-section bg-light custom-border-bottom"
                  data-aos="fade"
                >
                  <div className="row mb-5">
                    <div className="col-md-6">
                      <div className="block-16">
                        <figure>
                          <img
                            src={heroImage}
                            alt="Image placeholder"
                            className="img-fluid rounded"
                          />
                        </figure>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="row justify-content-center">
                        <div className="site-section-heading pt-3 mb-4">
                          <h2 className="text-black">
                            We Are Your Trusted Healthcare Partner
                          </h2>
                        </div>
                        <p className="text-black">
                          We value the trust you place in us, and we are honored
                          to be part of your healthcare journey. Thank you for
                          choosing Our Clinic as your healthcare partner. We
                          look forward to serving you with dedication and
                          compassion.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Free Services, Patient-Centered Care, Expert Healthcare Support */}
            <div className="row justify-content-center mb-5 slide-in">
              <div className="col-lg-4 mb-4 mb-lg-0">
                <div className="text">
                  <h2>
                    <FontAwesomeIcon icon={faStethoscope} /> Comprehensive
                    Services
                  </h2>
                  <p>
                    Experience comprehensive healthcare services for all your
                    medical needs.
                  </p>
                </div>
              </div>
              <div className="col-lg-4 mb-4 mb-lg-0">
                <div className="text">
                  <h2>
                    <FontAwesomeIcon icon={faUserMd} /> Patient-Centered Care
                  </h2>
                  <p>
                    We are committed to providing patient-centered care. Your
                    satisfaction is our priority.
                  </p>
                </div>
              </div>
              <div className="col-lg-4 mb-4 mb-lg-0">
                <div className="text">
                  <h2>
                    <FontAwesomeIcon icon={faHandHoldingHeart} /> Expert
                    Healthcare Support
                  </h2>
                  <p>
                    Our dedicated healthcare team is here to provide expert
                    support and guidance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
