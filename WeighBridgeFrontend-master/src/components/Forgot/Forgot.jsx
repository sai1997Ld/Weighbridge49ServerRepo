import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import login from "../../assets/login.jpg";

const Forgot = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://49.249.180.125:8080/api/v1/auths/forgot?emailId=${email}`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        const data = await response.text();
        Swal.fire({
          title: "Success",
          text: data,
          icon: "success",
          confirmButtonText: "OK",
        });
        setOtpSent(true);
      } else {
        const error = await response.json();
        Swal.fire({
          title: "Error",
          text: error.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://49.249.180.125:8080/api/v1/auths/forget/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            emailId: email,
            otp: otp,
            newPassword: newPassword,
          }),
        }
      );

      if (response.ok) {
        const data = await response.text();
        Swal.fire({
          title: "Success",
          text: data,
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/");
        });
      } else {
        const error = await response.json();
        Swal.fire({
          title: "Error",
          text: error.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page">
      <div className="login-background"></div>
      <div className="login-container">
        <div className="login-content">
          <h1 className="login-title" style={{ backgroundColor: "white" }}>
            Weighbridge Management System
          </h1>
          <img src={login} alt="Truck" className="login-truck-image" />
          <form
            onSubmit={otpSent ? handleResetPasswordSubmit : handleEmailSubmit}
            className="login-form"
            style={{ backgroundColor: "white" }}
          >
            <div className="form-group">
              <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control login-input"
                required
                disabled={otpSent}
              />
            </div>
            {otpSent && (
              <>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="form-control login-input"
                    required
                  />
                </div>
                <div className="form-group password-input">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="form-control login-input"
                    required
                  />
                  <span
                    className="password-toggle"
                    onClick={togglePasswordVisibility}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </span>
                </div>
              </>
            )}
            <button type="submit" className="btn btn-primary login-btn">
              {otpSent ? "Reset Password" : "Send OTP"}
            </button>
            {!otpSent && (
              <Link to="/" className="login-forgot-password">
                Back to Login
              </Link>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Forgot;
