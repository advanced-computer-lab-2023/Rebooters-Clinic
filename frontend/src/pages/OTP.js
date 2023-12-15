import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/otp.css";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
const OTP = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [joinedOtp, setJoinedOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();
  const [showEmailWindow, setShowEmailWindow] = useState(false);

  const handleEmail = () => {
    setShowEmailWindow(true);
  };

  const handleCloseForgotEmail = () => {
    setShowEmailWindow(false);
  };
  const resetPasswordWithOTP = async () => {
    try {
      const response = await fetch("/api/guest/resetPasswordWithOTP", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          otp: joinedOtp,
          newPassword: newPassword,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        navigate("/");
      } else {
        const error = await response.json();
        console.error(error);
      }
    } catch (error) {
      console.error("Error resetting password:", error.message);
    }
  };

  const handleChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const handleSubmit = () => {
    setJoinedOtp(otp.join(""));
    resetPasswordWithOTP();
  };
  return (
    <div>
      <Navbar />
      <div className="login-cover">
        <div className="cover-color">
          <div className="otp-card">
            <div className="otp-container">
              <h2 className="cc">One-Time Passcode</h2>
              <div className="enter-code mb-3 my-4">Enter your code:</div>
              <ul className="boxes">
                {otp.map((digit, index) => (
                  <li className="li-box" key={index}>
                    <input
                      className="single-box"
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                    />
                  </li>
                ))}
              </ul>
              <div className="form-submit">
                <button
                  className="btn btn-primary submit-otp"
                  onClick={handleEmail}
                >
                  Submit Code
                </button>
              </div>
            </div>

            {showEmailWindow && (
              <div className="modal-overlay">
                <div className="emailPass-card card">
                  <div className="row">
                    <div className="col-6">
                      <p>Enter your email:</p>
                      <input
                        name="email"
                        className="form-control"
                        placeholder="johndoe@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="col-6">
                      <p className="">Enter your new password:</p>
                      <input
                        name="newpassword"
                        className="form-control mb-4"
                        placeholder="***************"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="submit-pass form-submit">
                      <button
                        className="sbutton btn-primary btn btn-default-width"
                        onClick={handleSubmit}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                  <button
                    className="close-btn cbutton btn btn-secondary btn-default-width"
                    onClick={handleCloseForgotEmail}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>

    </div>
  );
};
export default OTP;
