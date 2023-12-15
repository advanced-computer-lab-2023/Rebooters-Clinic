import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import "../styles/home.css";
import Footer from "../components/footer";
import Navbar from "../components/Navbar";
const Homey = () => {
  const [containerTransform, setContainerTransform] =
    useState("translateX(-100%)");

  useEffect(() => {
    // Update the transform when the component mounts
    setContainerTransform("translateX(0)");
  }, []);

  return (
    <div>
      <Navbar />

      <div className="site-wrap">
        <div
          className="login-cover"
          style={{ height: "800px", overflow: "hidden" }}
        >
          <div className="cover-color">
            <div
              style={{
                maxWidth: "600px",
                padding: "20px",
                margin: "auto",
                overflow: "hidden",
                transform: "translate(0%, 20%)",
              }}
            >
              <div
                className="card mt-4"
                style={{
                  transform: containerTransform,
                  transition: "transform 0.5s ease-in-out",
                }}
              >
                <div className="card-body text-center">
                  <h1
                    style={{
                      fontSize: "40px",
                      marginBottom: "20px",
                      color: "black",
                    }}
                  >
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
            <div style={{paddingTop: '13%'}}>
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Homey;
