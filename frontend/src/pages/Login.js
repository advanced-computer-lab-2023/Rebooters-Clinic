import "../styles/login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Carousel, Button } from "react-bootstrap";
import ForgotPass from "./ForgotPassword";
import Navbar from "../components/Navbar";
//import { useHistory } from 'react-router-dom';
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  //const history = useHistory();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const location = useLocation();
  const errorMessage = location.state && location.state.errorMessage;
  const [showEmailWindow, setShowEmailWindow] = useState(false);

  const handleForgotEmail = () => {
    setShowEmailWindow(true);
  };

  const handleCloseForgotEmail = () => {
    setShowEmailWindow(false);
  };
  const handleLogin = async () => {
    try {
      const response = await fetch("/api/guest/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        switch (data.type) {
          case "patient":
            navigate("/patient-home");
            break;
          case "admin":
            navigate("/admin");
            break;
          case "doctor":
            navigate("/doctor-home");
            break;
          default:
            // Handle other user types or provide a default redirect
            navigate("/");
        }
      } else {
        // Handle login error, e.g., display an error message
        console.error("Login failed");
        setError("An error occurred while logging in. Please try again.");
      }
    } catch (error) {
      console.error("An error occurred while logging in:", error);
    }
    // const userTypeCookie = Cookies.get('type');

    // Handle successful login, e.g., redirect or update state
  };

  const handleSelect = (selectedIndex) => {
    setActiveIndex(selectedIndex);
  };
  return (
    <div>
      <Navbar />
      <div className="login-cover">
        <div className="cover-color">
          <div className="login-card">
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

            <div className="title">
              {error && <p style={{ color: "red" }}>{error}</p>}
              <h2>Welcome Back!</h2>
            </div>
            <div className="login-form">
              <div className="wb">
                <h6>Log in to El7a2ni</h6>
                <br />
              </div>
              <input
                name="username"
                placeholder="Username"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <br />
              <input
                name="password"
                type="password"
                placeholder="Password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <br />

              <button
                onClick={handleLogin}
                className="btn btn-primary"
                style={{ width: "70%" }}
              >
                Login
              </button>
              <br />
              <br />
              <a
                className="forgot"
                style={{ textDecoration: "underline" }}
                onClick={handleForgotEmail}
              >
                Forgot password?
              </a>
              {showEmailWindow && (
                <div className="modal-overlay">
                  <div className="email-card card">
                    <div className="forgotPass">
                      <ForgotPass />
                    </div>
                    <button
                      className="close-btn btn btn-secondary btn-default-width"
                      onClick={handleCloseForgotEmail}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
              <br />
              <hr />
              <a className="btn btn-primary" href="/">
                Create New Account
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
