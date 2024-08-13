import { useState } from "react";
import Swal from "sweetalert2";
import SideBar2 from "../../../../SideBar/SideBar2";
import { useNavigate } from "react-router-dom";
import "./NewTransporter.css";
import {
  faSave,
  faEraser,
  faRectangleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { Spin } from "antd";

function NewTransporter() {
  const navigate = useNavigate();
  const [transporterName, setTransporterName] = useState("");
  const [transporterContactNo, setTransporterContactNo] = useState("");
  const [transporterEmailId, setTransporterEmailId] = useState("");
  const [transporterAddress, setTransporterAddress] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // To add session userid in frontend

  const userId = sessionStorage.getItem("userId");

  const handleClear = () => {
    setTransporterName("");
    setTransporterContactNo("");
    setTransporterEmailId("");
    setTransporterAddress("");
    setEmailError("");
    setPhoneError("");
  };

  const handleSave = () => {
    setIsSaving(true);
    let emailIsValid = true;
    let phoneIsValid = true;

    if (
      transporterName.trim() === "" ||
      transporterAddress.trim() === "" ||
      transporterContactNo.trim() === ""
    ) {
      Swal.fire({
        title: "Please fill in all the required fields.",
        icon: "warning",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "btn btn-warning",
        },
      });
      setIsSaving(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Check if email field is not empty before validating
    if (
      transporterEmailId.trim() !== "" &&
      !emailRegex.test(transporterEmailId)
    ) {
      setEmailError("Please enter a valid email address.");
      emailIsValid = false;
      setIsSaving(false);
    } else {
      setEmailError("");
      setIsSaving(false);
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(transporterContactNo)) {
      setPhoneError("Please enter a valid 10-digit phone number.");
      phoneIsValid = false;
      setIsSaving(false);
    } else {
      setPhoneError("");
      setIsSaving(false);
    }

    if (!emailIsValid || !phoneIsValid) {
      setIsSaving(false);
      return;
    }

    const transporterData = {
      transporterName,
      transporterContactNo,
      transporterEmailId,
      transporterAddress,
    };

    fetch(`http://49.249.180.125:8080/api/v1/transporter?userId=${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transporterData),
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          return response.text();
        } else {
          return response.json().then((error) => {
            throw new Error(error.message);
          });
        }
      })
      .then((data) => {
        console.log("Response from the API:", data);
        Swal.fire({
          title: data,
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "btn btn-success",
          },
        });
        setIsSaving(false);
        handleClear();
      })
      .catch((error) => {
        console.error("Error:", error);
        setError(error.message);
        Swal.fire({
          title: "Error",
          text: error.message,
          icon: "error",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "btn btn-danger",
          },
        });
        setIsSaving(false);
      });
  };

  //Code for close icon
  const goBack = () => {
    navigate(-1);
  };

  return (
    <SideBar2>
      <div className="transporter-register">
        <div className="transporter-main-content container-fluid">
          <div className="d-flex justify-content-between align-items-center">
            <button
              className="close-button"
              onClick={goBack}
              style={{
                position: "absolute",
                marginRight: 10,
                backgroundColor: "transparent",
                color: "#f11212",
                border: "none",
                cursor: "pointer",
                fontSize: 30,
                outline: "none",
              }}
            >
              <FontAwesomeIcon icon={faRectangleXmark} />
            </button>
            <h2 className="text-center mx-auto">Transporter Registration</h2>
          </div>
          <div
            className="transporter-user-container card"
            style={{
              boxShadow:
                "0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)",
            }}
          >
            <div className="card-body p-4">
              <p style={{ color: "red" }}>Please fill all * marked fields.</p>
              <form>
                <div className="row mb-2">
                  <div className="col-md-6">
                    <label htmlFor="transporterName" className="form-label">
                      Transporter Name{" "}
                      <span style={{ color: "red", fontWeight: "bold" }}>
                        *
                      </span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="transporterName"
                      placeholder="Enter Transporter Name"
                      value={transporterName}
                      onChange={(e) => setTransporterName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label
                      htmlFor="transporterContactNo"
                      className="form-label"
                    >
                      Contact Number
                      <span style={{ color: "red", fontWeight: "bold" }}>
                        {" "}
                        *
                      </span>
                    </label>
                    <input
                      type="tel"
                      className={`form-control ${
                        phoneError ? "is-invalid" : ""
                      }`}
                      id="transporterContactNo"
                      placeholder="Enter Contact Number"
                      value={transporterContactNo}
                      onChange={(e) => setTransporterContactNo(e.target.value)}
                      required
                      pattern="\d{10}"
                      onInput={(e) =>
                        (e.target.value = e.target.value.replace(/\D/g, ""))
                      }
                      title="Please enter 10 numbers"
                      maxLength="10"
                    />
                    {phoneError && (
                      <div className="invalid-feedback">{phoneError}</div>
                    )}
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-md-6">
                    <label htmlFor="transporterEmailId" className="form-label">
                      Email ID
                    </label>
                    <input
                      type="email"
                      className={`form-control ${
                        emailError ? "is-invalid" : ""
                      }`}
                      id="transporterEmailId"
                      placeholder="Enter Email ID"
                      value={transporterEmailId}
                      onChange={(e) => setTransporterEmailId(e.target.value)}
                    />
                    {emailError && (
                      <div className="invalid-feedback">{emailError}</div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="transporterAddress" className="form-label">
                      Address{" "}
                      <span style={{ color: "red", fontWeight: "bold" }}>
                        *
                      </span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="transporterAddress"
                      placeholder="Enter Address"
                      value={transporterAddress}
                      onChange={(e) => setTransporterAddress(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-end mt-3">
                  <button
                    type="button"
                    className="btn btn-danger me-4 btn-hover"
                    style={{
                      backgroundColor: "white",
                      color: "black",
                      border: "1px solid #cccccc",

                      width: "100px",

                      // transition: "transform 0.3s ease-in-out",
                    }}
                    onClick={handleClear}
                  >
                    <FontAwesomeIcon icon={faEraser} className="me-1" />
                    Clear
                  </button>
                  <button
                    type="button"
                    className="btn btn-success-1 btn-hover"
                    style={{
                      backgroundColor: "white",
                      color: "black",

                      border: "1px solid #cccccc",
                      width: "100px",

                      // transition: "transform 0.3s ease-in-out",
                    }}
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <Spin size="small" />
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faSave} className="me-1" /> Save
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </SideBar2>
  );
}

export default NewTransporter;
