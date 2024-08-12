import { useState, useEffect, useRef } from "react";
import { Chart, ArcElement } from "chart.js/auto";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
// import Header from "../../../../Header/Header";
import SideBar2 from "../../../../SideBar/SideBar2";
// import camView from "../../assets/weighbridgeCam.webp";
import "./UpdateGateEntry.css";
import ScannImage_IB from "../../assets/ScannImage_IB.jpg";
import CameraIcon_IB from "../../assets/CameraIcon_IB.jpg";
import AddNewVehicleImg_IB from "../../assets/AddNewVehicleImg_IB.jpg";
import styled from "styled-components";
// import frontView from "../../assets/frontView.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faEraser,
  faCar,
  faPlus,
  faRectangleXmark,
} from "@fortawesome/free-solid-svg-icons";

import Swal from "sweetalert2";
import Select from "react-select";
import axios from "axios";
import { useLocation } from 'react-router-dom';

function UpdateVehicleEntryDetails() {
  // const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const navigate = useNavigate();
  const chartRef = useRef(null);
  const chartRef2 = useRef(null);
  const homeMainContentRef = useRef(null);
  const [suppliers, setSuppliers] = useState([]);
  const [suppliersAddressLine1, setSuppliersAddressLine1] = useState();
  const [transporter, setTransporter] = useState();
  const [materials, setMaterials] = useState([]);
  // const [transactionType, setTransactionType] = useState();
  const [materialType, setMaterialType] = useState([]);
  const [vehicleNumbers, setVehicleNumbers] = useState([]);
  const [vehicleNo, setVehicleNo] = useState("");

  const location = useLocation(); // Hook to access the location object

  useEffect(() => {
    // Check if location state contains the data
    if (location.state && location.state.data) {
      setFormData(location.state.data); // Set form data with the data passed from the previous page
    }
  }, [location.state]);


  // To add session userid in frontend

  const userId = sessionStorage.getItem("userId");


  const handleVehicleNoKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      // Call API with the entered vehicle number
      fetch(`http://localhost:8080/api/v1/vehicles/vehicle/${formData.vehicle}`)
        .then((response) => response.json())
        .then((data) => {

          // Set transporter state with the data from the API response
          setTransporter(data.transporter);
          // Update other form data fields with the received data
          setFormData((prevData) => ({
            ...prevData,
            vehicleNo: data.vehicle,
            noOfWheels: data.vehicleWheelsNo,
            vehicleType: data.vehicleType,
            transporter: data.transporter,
            rcFitnessUpto: data.vehicleFitnessUpTo
          }));
        })
        .catch((error) => {
          console.error("Error fetching supplier Address:", error);
        });
    }
  };

  useEffect(() => {
    Chart.register(ArcElement);

    const resizeObserver = new ResizeObserver(() => {
      if (
        homeMainContentRef.current &&
        chartRef.current?.chartInstance &&
        chartRef2.current?.chartInstance
      ) {
        chartRef.current.chartInstance.resize();
        chartRef2.current.chartInstance.resize();
      }
    });

    if (homeMainContentRef.current) {
      resizeObserver.observe(homeMainContentRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const [formData, setFormData] = useState({
    // ticketNo: "",
    // poNo: "",
    // tpNo: "",
    // challanNo: "",
    // challanDate: "",
    // vehicleNo: "",
    // vehicleType: "",
    // noOfWheels: "",
    // supplier: "",
    // supplierAddressLine1: "",
    // transporter: "",
    // material: "",
    // materialType: "",
    // driverDLNo: "",
    // driverName: "",
    // tpNetWeight: "",
    // rcFitnessUpto: "",
    // department: "",
    // eWayBillNo: "",
    // transactionType: "Inbound",
    "ticketNo": "",
    "vehicle": "",
    "vehicleIn": "",
    "vehicleOut": "",
    "vehicleType": "",
    "vehicleWheelsNo": "",
    "transporter": "",
    "supplier": "",
    "supplierAddress": "",
    "customer": "",
    "customerAddress": "",
    "material": "",
    "materialType": "",
    "tpNetWeight": "",
    "poNo": "",
    "tpNo": "",
    "challanNo": "",
    "transactionDate": "",
    "challanDate": "",
    "dlNo": "",
    "driverName": "",
    "ewayBillNo": "",
    "transactionType": "",
    "quality": null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Disable TP No if PO No is entered and vice versa
    if (name === "poNo") {
      setFormData((prevData) => ({
        ...prevData,
        tpNo: value ? "" : prevData.tpNo,
      }));
    } else if (name === "tpNo") {
      setFormData((prevData) => ({
        ...prevData,
        poNo: value ? "" : prevData.poNo,
      }));
    }
  };
  // Code for Update API:
  const handleUpdate = () => {
    const gateData = {
      ticketNo: formData.ticketNo,
      supplier: formData.supplier,
      supplierAddressLine1: formData.supplierAddressLine1,
      transporter: formData.transporter,
      material: formData.material,
      materialType: formData.materialType,
      vehicle: formData.vehicle,
      // vehicleWheelsNo: formData.vehicleWheelsNo,
      dlNo: formData.dlNo,
      driverName: formData.driverName,
      supplyConsignmentWeight: formData.supplyConsignmentWeight,
      // vehicleFitnessUpTo: formData.vehicleFitnessUpTo,
      poNo: formData.poNo,
      tpNo: formData.tpNo,
      challanNo: formData.challanNo,
      ewayBillNo: formData.ewayBillNo,
      transactionType: formData.transactionType,
    };

    // Create JSON payload for saving Inbound details
    const payload = JSON.stringify(gateData);
    console.log("payload", payload);

    // Fetch API
    fetch(`http://localhost:8080/api/v1/gate/update?userId=${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: payload,
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {

        // Show success message
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: `Ticket ${data} Updated Successfully!`
        });

        // Reset form data after 3 seconds and navigate to VehicleEntry page
        setTimeout(() => {
          setFormData({
            // ticketNo: "",
            poNo: "",
            tpNo: "",
            challanNo: "",
            vehicle: "",
            vehicleType: "",
            vehicleWheelsNo: "",
            supplier: "",
            supplierAddressLine1: "",
            transporter: "",
            material: "",
            materialType: "",
            dlNo: "",
            driverName: "",
            supplyConsignmentWeight: "",
            vehicleFitnessUpTo: "",
            ewayBillNo: "",
            transactionType: "Inbound",
          });
          navigate("/VehicleEntry");
        }, 3000);
      })
      .catch((error) => {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      });
  };



  // const handleClear = () => {
  //   setFormData({
  //     poNo: "",
  //     tpNo: "",
  //     challanNo: "",
  //     vehicleNo: "",
  //     vehicleType: "",
  //     noOfWheels: "",
  //     supplier: "",
  //     supplierAddressLine1: "",
  //     transporter: "",
  //     material: "",
  //     materialType: "",
  //     driverDLNo: "",
  //     driverName: "",
  //     tpNetWeight: "",
  //     rcFitnessUpto: "",
  //     // department: "",
  //     eWayBillNo: "",
  //     transactionType: "Inbound ",
  //   });
  // };

  const handleCapturePicture = () => {
    // Make a request to the backend to capture the picture
    // Display a Swal modal indicating that the picture will be coming from the backend
    Swal.fire({
      icon: "info",
      title: "Picture will be coming from backend",
      text: "Please wait...",
      customClass: {
        popup: "my-popup-class",
        title: "my-title-class",
        content: "my-content-class",
      },
    });
  };

  //Code for close icon
  const goBack = () => {
    navigate(-1);
  };
  return (
    <SideBar2>
      <div>
        <div className="VehicleEntryDetailsMainContent">
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
          <h2 className="text-center mb-4"> Update Vehicle Entry Inbound </h2>
          <div className="row">
            <div className="row">
              <div className="col-lg-12">
                <div className="card mb-3 p-2 border shadow-lg">
                  <div className="card-body">
                    <div className="row">
                      {/* <!-- First Pair of Fields --> */}
                      <div className="col-md-3">
                        <div className="row">
                          <div className="col-md-12 mb-3">
                            <label htmlFor="ticketNo" className="user-form-label">Ticket No:</label>
                            <input type="text" id="ticketNo" name="tickeNo" value={formData.ticketNo}
                              onChange={handleChange}
                              readOnly
                              disabled
                              className="form-control" />
                          </div>
                          <div className="col-md-12">
                            <label htmlFor="challanDate" className="user-form-label">Challan Date:</label>
                            <input type="text" id="challanDate" name="challanDate" value={formData.challanDate}
                              onChange={handleChange}
                              readOnly
                              disabled
                              className="form-control" />
                          </div>
                        </div>
                      </div>
                      {/* <!-- Second Pair of Fields --> */}
                      <div className="col-md-3">
                        <div className="row">
                          <div className="col-md-12 mb-3">
                            <label htmlFor="tpNo" className="user-form-label">TP No:</label>
                            <div className="input-group d-flex align-items-center">
                              <input type="text" id="tpNo" name="tpNo" value={formData.tpNo}
                                onChange={handleChange} required className="form-control tpscanner"
                                disabled={!!formData.poNo} style={{ flexGrow: 1 }} />
                              {/* <button className="scanner_button1" style={{ marginLeft: "2px", padding: "5px 10px", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => alert("Scan TP No")} disabled={!!formData.poNo}>
                                <img src={ScannImage_IB} alt="Scanner" />
                              </button> */}
                            </div>
                          </div>
                          <div className="col-md-12">
                            <label htmlFor="poNo" className="user-form-label">PO No:</label>
                            <input type="text" id="poNo" name="poNo" value={formData.poNo}
                              onChange={handleChange} required className="form-control"
                              disabled={!!formData.tpNo} />
                          </div>
                        </div>
                      </div>
                      {/* <!-- Third Pair of Fields --> */}
                      <div className="col-md-3">
                        <div className="row">
                          <div className="col-md-12 mb-3">
                            <label htmlFor="material" className="user-form-label">Material:</label>
                            <input type="text" id="material" name="material" value={formData.material}
                              onChange={handleChange}
                              className="form-control" />
                          </div>
                          <div className="col-md-12">
                            <label htmlFor="materialType" className="user-form-label">Material Type:</label>
                            <input type="text" id="materialType" name="materialType" value={formData.materialType}
                              onChange={handleChange}
                              readOnly
                              disabled
                              className="form-control" />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3">
                        {/* Need to show capture picture */}
                        <table className="camview1 table" style={{ width: "100%", tableLayout: "fixed" }}>
                          <tbody>
                            <tr>
                              <td>
                                <div className="camview1" style={{ textAlign: "center", padding: "2px" }}>
                                  <button
                                    type="button"
                                    className="btn btn-primary" // You can adjust the classes as needed
                                    style={{
                                      width: "100%", // Ensure the button occupies the entire width of the container
                                      textAlign: "center", // Center-align the text within the button
                                      padding: "5px", // Add some padding to make the button look visually appealing
                                      fontWeight: "bold", // Make the text bold
                                    }}
                                  >
                                    View Images
                                  </button>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      {/* <!-- Four Pair of Fields - Updated --> */}
                      <div className="col-md-3">
                        <div className="row">
                          <div className="col-md-12 mb-3 ">
                            <label htmlFor="challanNo" className="user-form-label">Challan No:</label>
                            <input type="text" id="challanNo" name="challanNo" value={formData.challanNo}
                              onChange={handleChange}
                              className="form-control" />
                          </div>
                          <div className="col-md-12">
                            <label htmlFor="supplyConsignmentWeight" className="user-form-label">TP Net Weight:</label>
                            <input type="text" id="supplyConsignmentWeight" name="supplyConsignmentWeight"
                              value={formData.supplyConsignmentWeight}
                              onChange={handleChange}
                              className="form-control" />
                          </div>
                        </div>
                      </div>

                      {/* <!-- Five Pair of Fields - Updated --> */}
                      <div className="col-md-3">
                        <div className="row">
                          <div className="col-md-12 mb-3">
                            <label htmlFor="vehicle" className="user-form-label">Vehicle Number:</label>
                            <input
                              type="text"
                              id="vehicle"
                              name="vehicle"
                              value={formData.vehicle}
                              onChange={handleChange}
                              onKeyPress={handleVehicleNoKeyPress}
                              readOnly
                              disabled
                              className="form-control"
                            />
                          </div>
                          <div className="col-md-12">
                            <label htmlFor="supplier" className="user-form-label">Supplier:</label>
                            <input type="text" id="supplier" name="supplier" value={formData.supplier} onChange={handleChange} className="form-control" />
                          </div>
                        </div>
                      </div>

                      {/* <!-- Six Pair of Fields - Updated --> */}
                      <div className="col-md-3">
                        <div className="row">
                          <div className="col-md-12 mb-3">
                            <label htmlFor="driverDLNo" className="user-form-label">Driver DL No:</label>
                            <div className="input-group d-flex align-items-center">
                              <input type="text" id="dlNo" name="dlNo" value={formData.dlNo} onChange={handleChange} required className="form-control tpscanner" style={{ flexGrow: 1 }} />
                              {/* <button className="scanner_button1" style={{ marginLeft: "2px", padding: "5px 10px", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => alert("Scan DriverDLNo No")} >
                                <img src={ScannImage_IB} alt="Scanner" />
                              </button> */}
                            </div>
                          </div>
                          <div className="col-md-12 ">
                            <label htmlFor="driverName" className="user-form-label">Driver Name:</label>
                            <input type="text" id="driverName" name="driverName" value={formData.driverName} onChange={handleChange} className="form-control" />
                          </div>
                        </div>
                      </div>
                      {/* Blank div */}
                      <div className="col-md-3">
                        {/* Blank Div */}
                      </div>
                      {/* <!-- Seventh Pair of Fields - Updated --> */}
                      <div className="col-md-3">
                        <div className="row">
                          <div className="col-md-12 mb-3">
                            <label htmlFor="ewayBillNo" className="user-form-label">E-Way Bill:</label>
                            <input type="text" id="ewayBillNo" name="ewayBillNo" value={formData.ewayBillNo} onChange={handleChange} className="form-control" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 ms-auto">  {/* Use ms-auto to push the column to the right */}
                      <button
                        type="button"
                        className="btn btn-success-1 btn-hover float-end"
                        style={{
                          backgroundColor: "white",
                          color: "#008060",
                          width: "150px",
                          height: "50px",
                          border: "1px solid #cccccc",
                        }}
                        onClick={handleUpdate}
                      >
                        <FontAwesomeIcon icon={faSave} className="me-1" />{" "}
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Code Of Last Section which is coming from Backend */}
            <div className="row">
              <div className="col-lg-12">
                <div className="card mb-3 p-2 border shadow-lg">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-3">
                        <label htmlFor="vehicleWheelsNo" className="user-form-label">
                          No of Wheels:
                        </label>
                        <input
                          type="text"
                          id="vehicleWheelsNo"
                          name="vehicleWheelsNo"
                          value={formData.vehicleWheelsNo}
                          onChange={handleChange}
                          className="form-control"
                          // disabled={!formData.vehicle}
                          disabled
                          readOnly
                          style={{
                            backgroundColor: "#efefef",
                            color: "#818181",
                          }}
                        />
                      </div>
                      {/* Vehicle Type */}
                      <div className="col-md-3">
                        <label
                          htmlFor="vehicleType"
                          className="user-form-label"
                        >
                          Vehicle Type:
                        </label>
                        <input
                          type="text"
                          id="vehicleType"
                          name="vehicleType"
                          value={formData.vehicleType}
                          onChange={handleChange}
                          className="form-control"
                          // disabled={!formData.vehicle}
                          disabled
                          readOnly
                          style={{
                            backgroundColor: "#efefef",
                            color: "#818181",
                          }}
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <label
                          htmlFor="supplierContactNo"
                          className="user-form-label"
                        >
                          Supplier's Address:
                        </label>
                        <input
                          type="text"
                          id="supplierAddressLine1"
                          name="supplierAddressLine1"
                          value={formData.supplierAddressLine1}
                          onChange={handleChange}
                          className="form-control"
                          // disabled={!formData.supplier}
                          disabled
                          readOnly
                          style={{
                            backgroundColor: "#efefef",
                            color: "#818181",
                          }}
                        />
                      </div>
                      {/* Rc fitness UpTo */}
                      <div className="col-md-3">
                        <label
                          htmlFor="vehicleFitnessUpTo"
                          className="user-form-label"
                        >
                          RC Fitness Upto:
                        </label>
                        <input
                          type="text"
                          id="vehicleFitnessUpTo"
                          name="vehicleFitnessUpTo"
                          value={formData.vehicleFitnessUpTo}
                          onChange={handleChange}
                          className="form-control"
                          // disabled={!formData.vehicle}
                          disabled
                          readOnly
                          style={{
                            backgroundColor: "#efefef",
                            color: "#818181",
                          }}
                        />
                      </div>

                      {/* Transporter */}
                      <div className="col-md-3">
                        <label
                          htmlFor="transporter"
                          className="user-form-label"
                        >
                          Transporter:
                        </label>
                        <input
                          type="text"
                          id="transporter"
                          name="transporter"
                          value={formData.transporter}
                          onChange={handleChange}
                          className="form-control"
                          // disabled={!formData.vehicle}
                          disabled
                          readOnly
                          style={{
                            backgroundColor: "#efefef",
                            color: "#818181",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SideBar2>
  );
}

export default UpdateVehicleEntryDetails;
