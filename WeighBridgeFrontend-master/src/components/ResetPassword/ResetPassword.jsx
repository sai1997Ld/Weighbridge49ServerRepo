import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./ResetPassword.css";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import login from '../../assets/login.jpg';


const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = location.state;

  console.log("userId:", userId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== rePassword) {
      Swal.fire({
        title: "Error",
        text: "New password and confirm password do not match.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password is invalid. Example: A1!abc"
      );
      return;
    }
    

    try {
      // Send a request to the backend to reset the password
      const response = await fetch(
        `http://49.249.180.125:8080/api/v1/auths/reset/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );

      if (response.ok) {
        Swal.fire({
          title: "Password Reset Successful!",
          text: "Your password has been successfully reset.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/");
        });
      } else {
        console.error("Password reset failed:", response.statusText);
        Swal.fire({
          title: "Password Reset Failed",
          text: response.statusText,
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

  const toggleRePasswordVisibility = () => {
    setShowRePassword(!showRePassword);
  };

  return (
    <div className="login-page">
       <div className="login-background"></div>
      <div className="login-container">
        <div className="login-content">
          <h1 className="login-title" style={{ backgroundColor: "white" }}>
            WeighBridge Management System
          </h1>
          <img
            src={login}
            alt="Truck"
            className="login-truck-image"
          />
          <form
            onSubmit={handleSubmit}
            className="login-form"
            style={{ backgroundColor: "white" }}
          >
            <div className="form-group password-input">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`form-control login-input ${passwordError ? "is-invalid" : ""}`}
                required
              />
              <span
                className="password-toggle"
                onClick={togglePasswordVisibility}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </span>
              {passwordError && <div className="invalid-feedback">{passwordError}</div>}
            </div>
            <div className="form-group password-input">
              <input
                type={showRePassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={rePassword}
                onChange={(e) => setRePassword(e.target.value)}
                className="form-control login-input"
                required
              />
              <span
                className="password-toggle"
                onClick={toggleRePasswordVisibility}
              >
                <FontAwesomeIcon icon={showRePassword ? faEyeSlash : faEye} />
              </span>
            </div>
            <button type="submit" className="btn btn-primary login-btn">
              Reset Password
            </button>
            <a
              href="/"
              className="login-forgot-password"
              style={{ backgroundColor: "white" }}
            >
              Go to Login
            </a>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
