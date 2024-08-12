import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./LoginUser.css";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faUser,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import login from "../../assets/login.jpg";

const LoginUser = () => {
  const [userId, setUserId] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/v1/auths/logIn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: userId, userPassword: userPassword }),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        if (data.message === "Please reset your password.") {
          Swal.fire({
            title: data.message,
            text: "Please reset your password.",
            icon: "info",
            confirmButtonText: "OK",
          });
          navigate("/reset-password", { state: { userId } });
        } else {
          sessionStorage.setItem("userName", data.userName);
          sessionStorage.setItem("roles", JSON.stringify(data.roles));
          sessionStorage.setItem("userId", data.userId);
          console.log(data);

          const roleRoutes = {
            ADMIN: "/admin-dashboard",
            QUALITY_USER: "/quality-dashboard",
            MANAGEMENT: "/management-dashboard",
            GATE_USER: "/VehicleEntry",
            WEIGHBRIDGE_OPERATOR: "/weighbridge-dashboard",
            SALE_USER: "/sales-dashboard",
          };

          const userRole = Object.keys(roleRoutes).find((role) =>
            data.roles.includes(role)
          );

          if (userRole) {
            Swal.fire({
              title: "Login Successful!",
              text: `Welcome, ${userRole.replace("_", " ")}!`,
              icon: "success",
              confirmButtonText: "OK",
            }).then(() => {
              navigate(roleRoutes[userRole], {
                state: { userId: data.userId },
              });
            });
          } else {
            Swal.fire({
              title: "Login Successful!",
              text: "Welcome, User!",
              icon: "success",
              confirmButtonText: "OK",
            });
          }
        }
      } else {
        return response.json().then((error) => {
          Swal.fire({
            title: "Error",
            text: error.message,
            icon: "error",
            confirmButtonText: "OK",
          });
          throw new Error(error.message);
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error",
        text: "Something Went Wrong! Please try again.",
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
          <h1 className="login-title">Weighbridge Management System</h1>
          <img src={login} alt="Truck" className="login-truck-image" />
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <FontAwesomeIcon icon={faUser} className="input-icon" />
              <input
                type="text"
                placeholder="User Id"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="form-control login-input"
                required
              />
            </div>
            <div className="form-group password-input">
              <FontAwesomeIcon icon={faLock} className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
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
            <button type="submit" className="btn btn-primary login-btn">
              Sign In
            </button>
            <Link to="/forgot-password" className="login-forgot-password">
              Forgot Password?
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginUser;
