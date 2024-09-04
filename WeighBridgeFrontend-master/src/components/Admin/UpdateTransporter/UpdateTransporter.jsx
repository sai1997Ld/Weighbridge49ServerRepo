import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEraser, faSave, faRectangleXmark } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import "./UpdateTransporter.css";
import SideBar from "../../SideBar/SideBar";
import { useLocation, useNavigate } from "react-router-dom";

function UpdateTransporter() {
  const location = useLocation();
  const transporter = location.state;
  const [id, setid] = useState(transporter.id);
  const [transporterName, setTransporterName] = useState(
    transporter.transporterName
  );
  const [transporterContactNo, setTransporterContactNo] = useState(
    transporter.transporterContactNo
  );
  const [transporterEmailId, setTransporterEmailId] = useState(
    transporter.transporterEmailId
  );
  const [transporterAddress, setTransporterAddress] = useState(
    transporter.transporterAddress
  );
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const navigate = useNavigate();

  const handleClear = () => {
    setTransporterName("");
    setTransporterContactNo("");
    setTransporterEmailId("");
    setTransporterAddress("");
    setEmailError("");
    setPhoneError("");
  };

  const handleSave = () => {
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
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      transporterEmailId.trim() !== "" &&
      !emailRegex.test(transporterEmailId)
    ) {
      setEmailError("Please enter a valid email address.");
      emailIsValid = false;
    } else {
      setEmailError("");
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(transporterContactNo)) {
      setPhoneError("Please enter a valid 10-digit phone number.");
      phoneIsValid = false;
    } else {
      setPhoneError("");
    }

    if (!emailIsValid || !phoneIsValid) {
      return;
    }

    const transporterData = {
      id,
      transporterName,
      transporterContactNo,
      transporterEmailId,
      transporterAddress,
    };

    fetch(
      `http://49.249.180.125:8080/api/v1/transporter/${transporter.id
      }?userId=${sessionStorage.getItem("userId")}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transporterData),
        credentials: "include",
      }
    )
      .then(async (response) => {
        if (response.ok) {
          return response.text();
        } else {
          const error = await response.json();
          throw new Error(error.message);
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
        navigate("/view-transporter");
      })
      .catch((error) => {
        console.error("Error:", error);
        Swal.fire({
          title: "Error",
          text: error.message,
          icon: "error",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "btn btn-danger",
          },
        });
      });
  };

  return (
    <SideBar>
      <div className="update-transporter">
        <div className="update-main-content container-fluid">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="text-center mx-auto">Update Transporter</h2>

            <FontAwesomeIcon icon={faRectangleXmark} style={{ float: "right", fontSize: "1.5em", color: "red", cursor: "pointer" }} className="mb-2" onClick={() => navigate(-1)} />

          </div>
          <div
            className="update-transporter-container card"
            style={{
              boxShadow:
                "0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)",
            }}
          >
            <div className="card-body p-4">
              <form>
                <p style={{ color: "red" }}>
                  Please fill all * marked fields.
                </p>
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
                      className={`form-control ${phoneError ? "is-invalid" : ""
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
                      className={`form-control ${emailError ? "is-invalid" : ""
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
                    }}
                    onClick={handleSave}
                  >
                    <FontAwesomeIcon icon={faSave} className="me-1" />
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </SideBar>
  );
}

export default UpdateTransporter;
