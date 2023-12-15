import React, { useState, useEffect } from "react";
import { CSSTransition } from "react-transition-group";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import loginCoverImage from "../styles/carousel-2.jpg";
import "../styles/au.css";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
const Conc = () => {
  const [showContent, setShowContent] = useState(false);

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
      <div className="login-cover">
        <div className="cover-color">
          <Navbar />
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
                <h1 style={{ fontSize: "52px" }}>Contact Info</h1>
                <ul className="list-unstyled">
                  <li className="address" style={{ color: "#add8e6" }}>
                    <FontAwesomeIcon icon={faMapMarkerAlt} /> {""}{" "}
                    <a
                      href="https://www.google.com/maps?q=GUC,El+Tagamoa+El+Khames,New+Cairo+City,Egypt"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#add8e6" }}
                    >
                      GUC - El Tagamoa El Khames New Cairo City - Egypt
                    </a>{" "}
                  </li>
                  <li className="phone">
                    <FontAwesomeIcon icon={faPhone} />{" "}
                    <a href="tel://23923929210" style={{ color: "#add8e6" }}>
                      +1 23456789
                    </a>
                  </li>
                  <li className="email" style={{ color: "#ffffff" }}>
                    <FontAwesomeIcon icon={faEnvelope} />{" "}
                    <a
                      href="mailto:rebootersteam9@gmail.com"
                      style={{ color: "#add8e6" }}
                    >
                      rebootersteam9@gmail.com
                    </a>
                  </li>
                </ul>
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
              zIndex: 1,
            }}
          >
            {/* Your Background Image */}
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Conc;
