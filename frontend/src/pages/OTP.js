import { useState } from "react";
import { useNavigate } from "react-router-dom";
const OTP = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [joinedOtp, setJoinedOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

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
    <div className="otp">
      <div className="otp-card">
        <div className="title">
          <h2>El7a2ni</h2>
        </div>
        <div className="otp-container">
          <div className="cc">Confirmation Code</div>
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
        </div>
        <input
          name="email"
          className="form-control"
          placeholder="your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
                <input
          name="newpassword"
          className="form-control"
          placeholder="your new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <br />
        <button className="login-btn sbmt-btn" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );  
};
export default OTP;
