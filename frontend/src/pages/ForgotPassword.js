import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/forgotPass.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleRequestPasswordResetOTP = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/guest/requestPasswordResetOTP", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      });

      if (response.ok) {
        const json = response.json();
        console.log(json);
        navigate("/otp");
      } else {
        console.error("Not working");
      }
    } catch (error) {
      console.error("Error requesting OTP:", error.message);
    }
  };
  return (
    <div className="email-cont">
      <div className="card-body">
        <div className="logo-forgot">
          <img
            src={"clinic-logo.png"}
            className="logo-img"
            width="50"
            alt="El7a2ni Logo"
          />
          <h2 className="logo-name text-primary">El7a2ni</h2>
        </div>
        <div className="enter-email">Enter your email:</div>
        <input
          name="email"
          className="form-control col-8"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <button
          className="btn btn-primary req-otp"
          onClick={(e) => handleRequestPasswordResetOTP(e)}
        >
          Request OTP Code
        </button>

        <br />
      </div>
    </div>
  );
};
export default ForgotPassword;
