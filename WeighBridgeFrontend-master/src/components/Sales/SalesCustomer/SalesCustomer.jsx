import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Country, State, City } from "country-state-city";
import Select from "react-select";
import "./SalesCustomer.css";
import SideBar6 from "../../SideBar/Sidebar6";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faEraser, faRectangleXmark} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";


function SalesCustomer() {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerContactNo, setCustomerContactNo] = useState("");
  const [customerAddressLine1, setCustomerAddressLine1] = useState("");
  const [customerAddressLine2, setCustomerAddressLine2] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [zip, setZip] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    fetchCountries();
  }, []);

  const navigate = useNavigate();

  const userId = sessionStorage.getItem("userId");

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
    setCustomerName("");
    setCustomerEmail("");
    setCustomerContactNo("");
    setCustomerAddressLine1("");
    setCustomerAddressLine2("");
    setSelectedCountry(null);
    setSelectedState(null);
    setSelectedCity(null);
    setZip("");
    setEmailError("");
    setPhoneError("");
  };

  const handleSave = () => {
    let emailIsValid = true;
    let phoneIsValid = true;

    if (
      customerName.trim() === "" ||
      customerAddressLine1.trim() === "" ||
      customerAddressLine2.trim() === "" ||
      !selectedCountry ||
      !selectedState ||
      !selectedCity 
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
    if (customerEmail !== "" && !emailRegex.test(customerEmail)) {
      setEmailError("Please enter a valid email address.");
      emailIsValid = false;
    } else {
      setEmailError("");
    }

    const phoneRegex = /^\d{10}$/;
    if (customerContactNo !== "" && !phoneRegex.test(customerContactNo)) {
      setPhoneError("Please enter a valid 10-digit phone number.");
      phoneIsValid = false;
    } else {
      setPhoneError("");
    }

    if (!emailIsValid || !phoneIsValid) {
      return;
    }

    const customerData = {
      customerName,
      customerEmail,
      customerContactNo,
      customerAddressLine1,
      customerAddressLine2,
      city: selectedCity.value,
      state: selectedState.value,
      country: selectedCountry.value,
      zip,
    };

    fetch(`http://49.249.180.125:8080/api/v1/customers?userId=${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customerData),
      credentials: "include",
    })
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
          title: "Customer added successfully",
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "btn btn-success",
          },
        });
        handleClear();
        navigate("/SalesOrder");
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
    <SideBar6>
      <div className="customer-management">
        <div className="customer-main-content container-fluid">
        <div className="d-flex justify-content-between align-items-center">
              <h2 className="text-center mx-auto">Customer Registration</h2>
   
              <FontAwesomeIcon icon={faRectangleXmark} style={{float: "right", fontSize: "1.5em", color: "red", cursor: "pointer"}}  className="mb-2" onClick={() => navigate(-1)}/>
 
        </div>
          <div
            className="customer-card-container card"
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
                    <label htmlFor="customerName" className="form-label">
                      Customer Name{" "}
                      <span style={{ color: "red", fontWeight: "bold" }}>
                        *
                      </span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="customerName"
                      placeholder="Enter Customer Name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="customerEmail" className="form-label">
                      Customer Email
                    </label>
                    <input
                      type="email"
                      className={`form-control ${
                        emailError ? "is-invalid" : ""
                      }`}
                      id="customerEmail"
                      placeholder="Enter Customer Email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                    />
                    {emailError && (
                      <div className="invalid-feedback">{emailError}</div>
                    )}
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-md-6">
                    <label htmlFor="customerContactNo" className="form-label">
                      Contact Number{" "}
                    </label>
                    <input
                      type="tel"
                      className={`form-control ${
                        phoneError ? "is-invalid" : ""
                      }`}
                      id="customerContactNo"
                      placeholder="Enter Contact Number"
                      value={customerContactNo}
                      onChange={(e) => setCustomerContactNo(e.target.value)}
                      pattern="\d{10}"
                      title="Please enter 10 numbers"
                      maxLength="10"
                      onInput={(e) =>
                        (e.target.value = e.target.value.replace(/\D/g, ""))
                      }
                    />
                    {phoneError && (
                      <div className="invalid-feedback">{phoneError}</div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label
                      htmlFor="customerAddressLine1"
                      className="form-label"
                    >
                      Address Line 1
                    </label>
                    <span style={{ color: "red", fontWeight: "bold" }}> *</span>
                    <input
                      type="text"
                      className="form-control"
                      id="customerAddressLine1"
                      placeholder="Enter Address Line 1"
                      value={customerAddressLine1}
                      onChange={(e) => {
                        const onlyAlphabetsAndSpace = e.target.value.replace(
                          /[^A-Za-z\s]/gi,
                          ""
                        );
                        setCustomerAddressLine1(onlyAlphabetsAndSpace);
                      }}
                      required
                    />
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-md-6">
                    <label
                      htmlFor="customerAddressLine2"
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
                      id="customerAddressLine2"
                      placeholder="Enter Address Line 2"
                      value={customerAddressLine2}
                      onChange={(e) => setCustomerAddressLine2(e.target.value)}
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
    </SideBar6>
  );
}

export default SalesCustomer;
