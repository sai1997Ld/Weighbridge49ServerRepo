import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Country, State, City } from "country-state-city";
import Select from "react-select";
import "./NewSupplier.css";
import SideBar2 from "../../../../SideBar/SideBar2";
import {
  faSave,
  faEraser,
  faRectangleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Spin } from "antd";

function NewSupplier() {
  const navigate = useNavigate();
  const [supplierName, setSupplierName] = useState("");
  const [supplierEmail, setSupplierEmail] = useState("");
  const [supplierContactNo, setSupplierContactNo] = useState("");
  const [supplierAddressLine1, setSupplierAddressLine1] = useState("");
  const [supplierAddressLine2, setSupplierAddressLine2] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [zip, setZip] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const userId = sessionStorage.getItem("userId");
  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = () => {
    const countryData = Country.getAllCountries().map((country) => ({
      label: country.name,
      value: country.isoCode,
    }));
    setCountries(countryData);
  };

  const fetchStates = (countryCode) => {
    const stateData = State.getStatesOfCountry(countryCode).map((state) => ({
      label: state.name,
      value: state.isoCode,
    }));
    setStates(stateData);
  };

  const fetchCities = (countryCode, stateCode) => {
    const cityData = City.getCitiesOfState(countryCode, stateCode).map(
      (city) => ({
        label: city.name,
        value: city.name,
      })
    );
    setCities(cityData);
  };

  const handleClear = () => {
    setSupplierName("");
    setSupplierEmail("");
    setSupplierContactNo("");
    setSupplierAddressLine1("");
    setSupplierAddressLine2("");
    setSelectedCountry(null);
    setSelectedState(null);
    setSelectedCity(null);
    setZip("");
    setEmailError("");
    setPhoneError("");
  };

  const handleSave = () => {
    setIsSaving(true);
    let emailIsValid = true;
    let phoneIsValid = true;

    if (
      supplierName.trim() === "" ||
      // supplierContactNo.trim() === "" ||
      // supplierEmail.trim() === "" ||
      supplierAddressLine1.trim() === "" ||
      supplierAddressLine2.trim() === "" ||
      !selectedCountry ||
      !selectedState ||
      !selectedCity
      // zip.trim() === ""
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

    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (supplierEmail !== "" && !emailRegex.test(supplierEmail)) {
    //   setEmailError("Please enter a valid email address.");
    //   emailIsValid = false;
    // } else {
    //   setEmailError("");
    // }

    // const phoneRegex = /^\d{10}$/;
    // if (supplierContactNo !== "" && !phoneRegex.test(supplierContactNo)) {
    //   setPhoneError("Please enter a valid 10-digit phone number.");
    //   phoneIsValid = false;
    // } else {
    //   setPhoneError("");
    // }

    // if (!emailIsValid || !phoneIsValid) {
    //   return;
    // }

    // return false;
    const supplierData = {
      supplierName,
      supplierEmail,
      supplierContactNo,
      supplierAddressLine1,
      supplierAddressLine2,
      city: selectedCity.value,
      state: selectedState.value,
      country: selectedCountry.value,
      zip,
    };

    fetch(`http://49.249.180.125:8080/api/v1/supplier?userId=${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(supplierData),
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
          title: "Supplier added successfully",
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "btn btn-success",
          },
        });
        setIsSaving(false);
        handleClear();
        navigate("/VehicleEntryDetails"); // Navigate to VehicleEntryDetails page
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
      <div className="supplier-management">
        <div className="supplier-main-content container-fluid">
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
          <h2 className="text-center my-3"> Supplier Registration </h2>
          <div
            className="supplier-card-container card"
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
                    <label htmlFor="supplierName" className="form-label">
                      Supplier Name{" "}
                      <span style={{ color: "red", fontWeight: "bold" }}>
                        *
                      </span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="supplierName"
                      placeholder="Enter Supplier Name"
                      value={supplierName}
                      onChange={(e) => setSupplierName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="supplierEmail" className="form-label">
                      Supplier Email
                    </label>
                    {/*<span style={{ color: "red", fontWeight: "bold" }}> *</span>*/}
                    <input
                      type="email"
                      // className={`form-control ${
                      //   emailError ? "is-invalid" : ""
                      // }`}
                      className="form-control"
                      id="supplierEmail"
                      placeholder="Enter Supplier Email"
                      value={supplierEmail}
                      onChange={(e) => setSupplierEmail(e.target.value)}
                      required
                    />
                    {/* {emailError && (
                      <div className="invalid-feedback">{emailError}</div>
                    )} */}
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-md-6">
                    <label htmlFor="supplierContactNo" className="form-label">
                      Contact Number{" "}
                      {/* <span style={{ color: "red", fontWeight: "bold" }}>
                        *
                      </span> */}
                    </label>
                    <input
                      type="tel"
                      // className={`form-control ${
                      //   phoneError ? "is-invalid" : ""
                      // }`}
                      className="form-control"
                      id="supplierContactNo"
                      placeholder="Enter Contact Number"
                      value={supplierContactNo}
                      onChange={(e) => setSupplierContactNo(e.target.value)}
                      required
                      pattern="\d{10}"
                      title="Please enter 10 numbers"
                      maxLength="10"
                      onInput={(e) =>
                        (e.target.value = e.target.value.replace(/\D/g, ""))
                      }
                    />
                    {/* {phoneError && (
                      <div className="invalid-feedback">{phoneError}</div>
                    )} */}
                  </div>
                  <div className="col-md-6">
                    <label
                      htmlFor="supplierAddressLine1"
                      className="form-label"
                    >
                      Address Line 1
                    </label>
                    <span style={{ color: "red", fontWeight: "bold" }}> *</span>
                    <input
                      type="text"
                      className="form-control"
                      id="supplierAddressLine1"
                      placeholder="Enter Address Line 1"
                      value={supplierAddressLine1}
                      onChange={(e) => {
                        const onlyAlphabetsAndSpace = e.target.value.replace(
                          /[^A-Za-z\s]/gi,
                          ""
                        );
                        setSupplierAddressLine1(onlyAlphabetsAndSpace);
                      }}
                      required
                    />
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-md-6">
                    <label
                      htmlFor="supplierAddressLine2"
                      className="form-label"
                    >
                      Address Line 2{" "}
                      <span style={{ color: "red", fontWeight: "bold" }}>
                        *
                      </span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="supplierAddressLine2"
                      placeholder="Enter Address Line 2"
                      value={supplierAddressLine2}
                      onChange={(e) => setSupplierAddressLine2(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="country" className="form-label">
                      Country{" "}
                      <span style={{ color: "red", fontWeight: "bold" }}>
                        *
                      </span>
                    </label>
                    <Select
                      options={countries}
                      value={selectedCountry}
                      onChange={(selectedOption) => {
                        setSelectedCountry(selectedOption);
                        setSelectedState(null);
                        setSelectedCity(null);
                        setStates([]);
                        setCities([]);
                        fetchStates(selectedOption.value);
                      }}
                      placeholder="Select Country"
                    />
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-md-6">
                    <label htmlFor="state" className="form-label">
                      State{" "}
                      <span style={{ color: "red", fontWeight: "bold" }}>
                        *
                      </span>
                    </label>
                    <Select
                      options={states}
                      value={selectedState}
                      onChange={(selectedOption) => {
                        setSelectedState(selectedOption);
                        setSelectedCity(null);
                        setCities([]);
                        fetchCities(
                          selectedCountry.value,
                          selectedOption.value
                        );
                      }}
                      placeholder="Select State"
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="city" className="form-label">
                      City{" "}
                      <span style={{ color: "red", fontWeight: "bold" }}>
                        *
                      </span>
                    </label>
                    <Select
                      options={cities}
                      value={selectedCity}
                      onChange={(selectedOption) =>
                        setSelectedCity(selectedOption)
                      }
                      placeholder="Select City"
                    />
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-md-6">
                    <label htmlFor="zip" className="form-label">
                      ZIP{" "}
                      {/* <span style={{ color: "red", fontWeight: "bold" }}>
                        *
                      </span> */}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="zip"
                      placeholder="Enter ZIP"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      onInput={(e) =>
                        (e.target.value = e.target.value.replace(/\D/g, ""))
                      }
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

                      width: "100px",

                      border: "1px solid #cccccc",
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

export default NewSupplier;
