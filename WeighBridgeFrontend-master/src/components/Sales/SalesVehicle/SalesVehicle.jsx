import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "./SalesVehicle.css";
import SideBar6 from "../../SideBar/Sidebar6";
import { faSave, faEraser, faRectangleXmark, faExchangeAlt, faCarAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

function SalesVehicle() {
  const [vehicleNo, setVehicleNo] = useState("");
  const [transporter, setTransporter] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleManufacturer, setVehicleManufacturer] = useState("");
  const [vehicleWheelsNo, setvehicleWheelsNo] = useState("");
  const [vehicleFitnessUpTo, setvehicleFitnessUpTo] = useState("");
  const [vehicleLoadCapacity, setVehicleLoadCapacity] = useState(0);
  const [loadCapacityUnit, setLoadCapacityUnit] = useState("kg");
  const [transporters, setTransporters] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    // Load data from sessionStorage
    const savedData = sessionStorage.getItem('salesVehicleData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setVehicleNo(parsedData.vehicleNo || '');
      setTransporter(parsedData.transporter || '');
      setVehicleType(parsedData.vehicleType || '');
      setVehicleManufacturer(parsedData.vehicleManufacturer || '');
      setvehicleWheelsNo(parsedData.vehicleWheelsNo || '');
      setvehicleFitnessUpTo(parsedData.vehicleFitnessUpTo || '');
      setVehicleLoadCapacity(parsedData.vehicleLoadCapacity || 0);
      setLoadCapacityUnit(parsedData.loadCapacityUnit || 'kg');
    }

    // Fetch transporters
    fetch("http://49.249.180.125:8080/api/v1/transporter")
      .then((response) => response.json())
      .then((data) => setTransporters(data))
      .catch((error) => console.error("Error fetching transporters:", error));
  }, []);

  useEffect(() => {
    return () => {
      saveFormToSession();
    };
  }, [vehicleNo, transporter, vehicleType, vehicleManufacturer, vehicleWheelsNo, vehicleFitnessUpTo, vehicleLoadCapacity, loadCapacityUnit]);

  const saveFormToSession = () => {
    const formData = {
      vehicleNo,
      transporter,
      vehicleType,
      vehicleManufacturer,
      vehicleWheelsNo,
      vehicleFitnessUpTo,
      vehicleLoadCapacity,
      loadCapacityUnit,
    };
    sessionStorage.setItem('salesVehicleData', JSON.stringify(formData));
  };

  const handleAddTransporter = () => {
    saveFormToSession();
    navigate("/SalesTransporter");
  }

  const handleClear = () => {
    setVehicleNo("");
    setTransporter("");
    setVehicleType("");
    setVehicleManufacturer("");
    setvehicleWheelsNo("");
    setvehicleFitnessUpTo("");
    setVehicleLoadCapacity(0);
    setLoadCapacityUnit("kg");
    sessionStorage.removeItem('salesVehicleData');
  };

  const handleSave = () => {
    if (
      vehicleNo.trim() === "" ||
      transporter.trim() === ""
    ) {
      Swal.fire({
        title: "Please fill in all required fields.",
        icon: "warning",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "btn btn-warning",
        },
      });
      return;
    }

    const vehicleData = {
      vehicleNo,
      vehicleType,
      vehicleManufacturer,
      vehicleWheelsNo,
      vehicleFitnessUpTo,
      vehicleLoadCapacity: loadCapacityUnit === "kg" ? vehicleLoadCapacity : vehicleLoadCapacity * 1000,
    };

    fetch(`http://49.249.180.125:8080/api/v1/vehicles/${transporter}?userId=${sessionStorage.getItem("userId")}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(vehicleData),
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
          title: data,
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "btn btn-success",
          },
        });
        handleClear();
        navigate("/ProcessOrder")
        sessionStorage.removeItem('salesVehicleData');
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

  const toggleLoadCapacityUnit = () => {
    if (loadCapacityUnit === "kg") {
      setVehicleLoadCapacity(vehicleLoadCapacity / 1000);
      setLoadCapacityUnit("ton");
    } else {
      setVehicleLoadCapacity(vehicleLoadCapacity * 1000);
      setLoadCapacityUnit("kg");
    }
  };

  const selectStyles = {
    control: (provided) => ({
      ...provided,
      marginBottom: '20px',
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
  };

  return (
    <SideBar6>
      <div className="vehicle-register">
        <div className="vehicle-content container-fluid">
        
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="text-center mx-auto">Vehicle Registration</h2>
            <FontAwesomeIcon icon={faRectangleXmark} style={{float: "right", fontSize: "1.5em", color: "red", cursor: "pointer"}}  className="mb-2" onClick={() => navigate(-1)}/>
          </div>
 
          <div className="vehicle-user-container card" style={{boxShadow:"0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)"}}>
            <div className="card-body p-4">
              <form>
  <p style={{ color: "red" }}>
                      Please fill all * marked fields.
                    </p>
                <div className="row mb-2">
                  <div className="col-md-6">
                    <label htmlFor="vehicleNo" className="form-label">
                      Vehicle Number <span style={{ color: "red", fontWeight: "bold" }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="vehicleNo"
                      placeholder="Enter Vehicle Number"
                      value={vehicleNo}
                      onChange={(e) => setVehicleNo(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="transporter" className="form-label">
                      Transporter <span style={{ color: "red", fontWeight: "bold" }}>*</span>
                    </label>
                    
                    <button
                      className="btn btn-sm border btn-success-1 btn-hover"
                      style={{
                        borderRadius: "5px",
                        marginLeft: "5px",
                        backgroundColor: "lightblue",
                      }}
                    >
                      <div
                        onClick={handleAddTransporter}
                        style={{
                          display: "block",
                          textDecoration: "none",
                          color: "black",
                        }}
                      >
                        Add <FontAwesomeIcon icon={faCarAlt} />
                      </div>
                    </button>
                    <Select
                      options={transporters.map((transporter) => ({
                        value: transporter,
                        label: transporter,
                      }))}
                      value={transporter ? { value: transporter, label: transporter } : null}
                      onChange={(selectedOption) => setTransporter(selectedOption.value)}
                      placeholder="Select Transporter"
                      isSearchable
                      required
                      styles={selectStyles}
                    />
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-md-6">
                    <label htmlFor="vehicleType" className="form-label">
                      Vehicle Type
                    </label>
                    <Select
                      options={[
                        { value: "mini-truck", label: "Mini Truck" },
                        { value: "large-truck", label: "Large Truck" },
                        { value: "others", label: "Others" },
                      ]}
                      value={vehicleType ? { value: vehicleType, label: vehicleType } : null}
                      onChange={(selectedOption) => setVehicleType(selectedOption.value)}
                      placeholder="Select Vehicle Type"
                      isSearchable
                      styles={selectStyles}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="vehicleManufacturer" className="form-label">
                      Vehicle Manufacturer
                    </label>
                    <Select
                      options={[
                        { value: "Tata Motors", label: "Tata Motors" },
                        { value: "Ashok Leyland Limited", label: "Ashok Leyland Limited" },
                        { value: "VE Commercial Vehicles Limited", label: "VE Commercial Vehicles Limited" },
                        { value: "Mahindra & Mahindra Limited", label: "Mahindra & Mahindra Limited" },
                        { value: "Piaggio India", label: "Piaggio India" },
                        { value: "Scania Commercial Vehicle India Pvt Ltd", label: "Scania Commercial Vehicle India Pvt Ltd" },
                        { value: "Force Motors", label: "Force Motors" },
                        { value: "Bharat Benz", label: "Bharat Benz" },
                        { value: "others", label: "Others" },
                      ]}
                      value={vehicleManufacturer ? { value: vehicleManufacturer, label: vehicleManufacturer } : null}
                      onChange={(selectedOption) => setVehicleManufacturer(selectedOption.value)}
                      placeholder="Select Manufacturer"
                      isSearchable
                      styles={selectStyles}
                    />
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-md-6">
                    <label htmlFor="vehicleLoadCapacity" className="form-label">
                      Vehicle Load Capacity ({loadCapacityUnit})
                    </label>
                    <div className="input-group">
                      <input
                        type="number"
                        className="form-control"
                        id="vehicleLoadCapacity"
                        placeholder={`Enter Vehicle Load Capacity in ${loadCapacityUnit}`}
                        value={vehicleLoadCapacity || 0}
                        onChange={(e) => {
                          const newValue = e.target.value === "" ? 0 : Math.max(
                            0,
                            parseFloat(e.target.value, 10)
                          );
                          setVehicleLoadCapacity(newValue);
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={toggleLoadCapacityUnit}
                      >
                        <FontAwesomeIcon icon={faExchangeAlt} />
                      </button>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <label htmlFor="vehicleFitnessUpTo" className="form-label">
                      Fitness Upto
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="vehicleFitnessUpTo"
                      value={vehicleFitnessUpTo}
                      onChange={(e) => setvehicleFitnessUpTo(e.target.value)}
                    />
                  </div>
                  <div className="col-md-3">
                    <label htmlFor="vehicleWheelsNo" className="form-label">
                      Wheels
                    </label>
                    <select
                      className="form-select vehicle-select"
                      id="vehicleWheelsNo"
                      value={vehicleWheelsNo}
                      onChange={(e) => setvehicleWheelsNo(e.target.value)}
                    >
                      {["select wheel", 4, 6, 8, 10, 12, 14, 16, 18, 20, 22].map((wheel) => (
                        <option key={wheel} value={wheel}>
                          {wheel}
                        </option>
                      ))}
                    </select>
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

export default SalesVehicle;