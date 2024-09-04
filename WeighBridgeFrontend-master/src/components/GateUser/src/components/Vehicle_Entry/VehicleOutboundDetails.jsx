import { useState, useEffect, useRef } from "react";

import { useNavigate } from "react-router-dom";

import SideBar2 from "../../../../SideBar/SideBar2";
import "./VehicleOutboundDetails.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faRectangleXmark,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

import axios from "axios";
import CameraLiveVideo from "../Vehicle_Entry/CameraLiveVideo.jsx";
import { Spin } from "antd";

function VehicleOutboundDetails() {
  const navigate = useNavigate();

  const [Customers, setCustomers] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const [Products, setProducts] = useState([]);

  const queryParams = new URLSearchParams(window.location.search);
  const [saleDetails, setSaleDetails] = useState([]);

  const sale = queryParams.get("sales");

  // Get API for Customer
  useEffect(() => {
    const fetchCustomerList = async () => {
      try {
        const response = await fetch(
          `http://49.249.180.125:8080/api/v1/Customer/get/list`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        // Assuming data is an array of Customers, update state or handle data accordingly
        console.log(data); // Log the data to see its structure
        setCustomers(data);
      } catch (error) {
        console.error("Error fetching Customer list:", error);
      }
    };

    fetchCustomerList();
  }, []);



  useEffect(() => {
    const fetchProductList = async () => {
      try {
        const response = await fetch(
          `http://49.249.180.125:8080/api/v1/Products/names`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        // Assuming data is an array of Products, update state or handle data accordingly
        console.log(data); // Log the data to see its structure
        setProducts(data);
      } catch (error) {
        console.error("Error fetching Products list:", error);
      }
    };

    fetchProductList();
  }, []);

 
  const [formData, setFormData] = useState({
    poNo: "",
    salePassNo: "",
    SaleOrderNo: "",
    vehicleNo: "",
    vehicleType: "",
    noOfWheels: "",
    Customer: "",
    CustomerAddressLine1: "",
    transporter: "",
    Product: "",
    ProductType: "",
    driverDLNo: "",
    driverName: "",
    quantity: "",
    rcFitnessUpto: "",
    department: "",
    eWayBillNo: "",
    transactionType: "Inbound",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });


    if (name === "poNo") {
      setFormData((prevData) => ({
        ...prevData,
        salePassNo: value ? "" : prevData.salePassNo,
      }));
    } else if (name === "salePassNo") {
      setFormData((prevData) => ({
        ...prevData,
        poNo: value ? "" : prevData.poNo,
      }));
    }
  };



  const userId = sessionStorage.getItem("userId");

  const handleSave = async () => {
    setIsSaving(true);
    const gateData = {

      customer: saleDetails.customerName,
      customerAddressLine: saleDetails.customerAddress,
      transporter: saleDetails.transporterName,
      material: saleDetails.productName,
      materialType: saleDetails.productType,
      vehicle: saleDetails.vehicleNo,
      dlNo: formData.driverDLNo,
      driverName: formData.driverName,
      supplyConsignmentWeight: saleDetails.consignmentWeight,
      poNo: saleDetails.purchaseOrderNo,
      challanDate: formData.saleOrderDate,
      tpNo: saleDetails.salePassNo,
      challanNo: saleDetails.saleOrderNo,
  
      transactionType: "Outbound",
    };

   
    const fetchAndAppendBlob = async (capturedImage, name) => {
      if (capturedImage) {
        const blob = await fetch(capturedImage).then((res) => res.blob());
        return formD.append(
          name,
          blob,
          `${name}_GATE_USER_${userId}_${Date.now()}.jpg`
        );
      }
    };

    const formD = new FormData();
    await Promise.all([
      fetchAndAppendBlob(capturedFrontImage, "frontImg1"),
      fetchAndAppendBlob(capturedRearImage, "backImg2"),
      fetchAndAppendBlob(capturedSideImage, "leftImg5"),
      fetchAndAppendBlob(capturedTopImage, "topImg3"),
    ]);

    // Append gateData fields to formD
    formD.append("requestBody", JSON.stringify(gateData));

    console.log("FormData:", formD);
    try {
      const response = await axios.post(
        `http://49.249.180.125:8080/api/v1/gate/saveTransaction?userId=${userId}&role=${"GATE_USER"}`,
        formD,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      console.log({ response });

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: `Transaction with id ${response.data} created Successfully!`,
      });
      setIsSaving(false);
      // Reset form data and navigate
      sessionStorage.removeItem("vehicleData");
      // handleClear();
      navigate("/VehicleEntry");
    } catch (error) {
      console.error("Error:", error);

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
      setIsSaving(false);
    }
  };




  useEffect(() => {
    axios
      .get(
        `http://49.249.180.125:8080/api/v1/sales/getBySalePassNo?salePassNo=${sale}&userId=${userId} `,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        setSaleDetails(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching sale details:", error);
      });
  }, []);


  const canvasTopRef = useRef(null);
  const canvasRearRef = useRef(null);
  const canvasFrontRef = useRef(null);
  const canvasSideRef = useRef(null);
  const [capturedTopImage, setCapturedTopImage] = useState(null);
  const [capturedRearImage, setCapturedRearImage] = useState(null);
  const [capturedFrontImage, setCapturedFrontImage] = useState(null);
  const [capturedSideImage, setCapturedSideImage] = useState(null);

  return (
    <SideBar2>
      <>
        <div className="VehicleoutboundDetailsMainContent container-fluid" >
          
      <div className="d-flex justify-content-between align-items-center mt-3">
              <h2 className="text-center mx-auto">Create Outbound Ticket</h2>
   
              <FontAwesomeIcon icon={faRectangleXmark} style={{float: "right", fontSize: "1.5em", color: "red", cursor: "pointer"}}  className="mb-2" onClick={() => navigate(-1)}/>
 
        </div>
          {/* <div className="row"> */}
            <div className="row">
              <div className="col-lg-12">
                <div className="card mb-3 p-2 border shadow-lg">
                  <div className="card-body">
                    <p style={{ color: "red" }}>
                      Please fill all * marked fields.
                    </p>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="row">
                          {/* Code of Challan Date */}
                          <div className="col-md-6 mb-3">
                            <label
                              htmlFor="saleOrderDate"
                              className="outbound-form-label"
                            >
                              Sale Order Date:
                            </label>
                            <input
                              type="text"
                              id="saleOrderDate"
                              name="saleOrderDate"
                              value={saleDetails.saleOrderDate}
                              onChange={handleChange}
                              // required
                              readOnly
                              disabled
                              className="form-control"
                            />
                          </div>
                          {/* Code Of Challan No */}
                          <div className="col-md-6">
                            <label
                              htmlFor="SaleOrderNo"
                              className="outbound-form-label "
                            >
                              Sale Order No:
                              {/* <span style={{ color: "red", fontWeight: "bold" }}>*</span> */}
                            </label>
                            <input
                              type="text"
                              id="SaleOrderNo"
                              name="SaleOrderNo"
                              value={saleDetails.saleOrderNo}
                              onChange={handleChange}
                              // required
                              readOnly
                              disabled
                              className="form-control"
                            />
                          </div>
                          {/* Code of TP NO */}
                          <div className="col-md-6 ">
                            <label
                              htmlFor="poNo"
                              className="outbound-form-label "
                            >
                              PO No:
                              {/* <span style={{ color: "red", fontWeight: "bold" }}>*</span> */}
                            </label>
                            <input
                              type="text"
                              id="poNo"
                              name="poNo"
                              value={saleDetails.purchaseOrderNo}
                              onChange={handleChange}
                              // required
                              readOnly
                              className="form-control"
                              disabled
                            />
                          </div>
                          {/* Code of PO NO */}
                          <div className="col-md-6 mb-3">
                            <label
                              htmlFor="salePassNo"
                              className="outbound-form-label "
                            >
                              Sale Pass No:
                              {/* <span style={{ color: "red", fontWeight: "bold" }}>*</span> */}
                            </label>
                            <div className="input-group">
                              <input
                                type="text"
                                id="salePassNo"
                                name="salePassNo"
                                value={saleDetails.salePassNo}
                                onChange={handleChange}
                                // required
                                readOnly
                                className="form-control tpscanner"
                                disabled
                              />
                            </div>
                          </div>
                          {/* Code of Material */}
                          <div className="col-md-6">
                            <label
                              htmlFor="Product"
                              className="outbound-form-label"
                            >
                              Product:
                            </label>
                            <input
                              type="text"
                              id="Product"
                              name="Product"
                              value={saleDetails.productName}
                              onChange={handleChange}
                              readOnly
                              disabled
                              className="form-control"
                            />
                          </div>
                          {/* Code of Material Type */}
                          <div className="col-md-6 mb-3">
                            <label
                              htmlFor="ProductType"
                              className="outbound-form-label"
                            >
                              Product Type:
                            </label>
                            <input
                              type="text"
                              id="ProductType"
                              name="ProductType"
                              value={saleDetails.productType}
                              onChange={handleChange}
                              readOnly
                              disabled
                              className="form-control"
                            />
                          </div>
                          {/* Code Of E-Way Bill No */}

                          {/* Code of TP Net Weight */}
                          <div className="col-md-6 mb-3">
                            <label
                              htmlFor="quantity"
                              className="outbound-form-label"
                            >
                              Quantity (MT):
                            </label>
                            <input
                              type="text"
                              id="quantity"
                              name="quantity"
                              value={saleDetails.consignmentWeight}
                              onChange={handleChange}
                              readOnly
                              disabled
                              className="form-control"
                            />
                          </div>
                          {/* Code of Vehicle No */}

                          <div className="col-md-6">
                            <label
                              htmlFor="vehicleType"
                              className="outbound-form-label"
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
                              disabled={!formData.vehicleNo}
                              style={{
                                backgroundColor: "#efefef",
                                color: "#818181",
                              }}
                            />
                          </div>

                          {/* Code of Driver DL No */}
                          <div className="col-md-6">
                            <label
                              htmlFor="transporter"
                              className="outbound-form-label "
                            >
                              Transporter:
                            </label>
                            <input
                              type="text"
                              id="transporter"
                              name="transporter"
                              value={saleDetails.transporterName}
                              onChange={handleChange}
                              className="form-control"
                              // placeholder="Enter Transporter"
                              disabled={!formData.vehicleNo}
                              style={{
                                backgroundColor: "#efefef",
                                color: "#818181",
                              }}
                            />
                          </div>
                          {/* Code Of RC Fitness Upto */}
                          <div className="col-md-6 mb-3">
                            <label
                              htmlFor="rcFitnessUpto"
                              className="outbound-form-label"
                            >
                              RC Fitness Upto:
                              {/* <span style={{ color: "red", fontWeight: "bold" }}>*</span> */}
                            </label>
                            <input
                              type="text"
                              id="rcFitnessUpto"
                              name="rcFitnessUpto"
                              value={formData.rcFitnessUpto}
                              onChange={handleChange}
                              // required
                              className="form-control"
                              disabled={!formData.vehicleNo}
                              style={{
                                backgroundColor: "#efefef",
                                color: "#818181",
                              }}
                            />
                          </div>

                          <div className="col-md-6">
                            <label
                              htmlFor="Customer"
                              className="outbound-form-label "
                            >
                              Customer:
                            </label>
                            <input
                              type="text"
                              id="customer"
                              name="customer"
                              value={saleDetails.customerName}
                              onChange={handleChange}
                              readOnly
                              className="form-control"
                              disabled
                            />
                          </div>

                          <div className="col-md-6 mb-3">
                            <label
                              htmlFor="CustomerContactNo"
                              className="outbound-form-label"
                            >
                              Customer's Address:
                            </label>
                            <input
                              type="text"
                              id="CustomerAddressLine1"
                              name="CustomerAddressLine1"
                              value={saleDetails.customerAddress}
                              onChange={handleChange}
                              className="form-control"
                              disabled={!formData.Customer}
                              style={{
                                backgroundColor: "#efefef",
                                color: "#818181",
                              }}
                            />
                          </div>

                          <div className="col-md-6 col-sm-12">
                            <label
                              htmlFor="driverDLNo"
                              className="outbound-form-label "
                            >
                              Driver DL No:
                              <span
                                style={{ color: "red", fontWeight: "bold" }}
                              >
                                *
                              </span>
                            </label>
                            <div className="input-group">
                              <input
                                type="text"
                                id="driverDLNo"
                                name="driverDLNo"
                                value={formData.driverDLNo}
                                onChange={handleChange}
                                required
                                className="form-control tpscanner"
                                style={{ flexGrow: 1 }}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <label
                              htmlFor="driverName"
                              className="outbound-form-label"
                            >
                              Driver Name:
                              <span
                                style={{ color: "red", fontWeight: "bold" }}
                              >
                                *
                              </span>
                            </label>
                            <input
                              type="text"
                              id="driverName"
                              name="driverName"
                              value={formData.driverName}
                              onChange={handleChange}
                              required
                              className="form-control"
                            />
                          </div>

                          <div className="col-md-6 mb-3"></div>
                        </div>
                      </div>
                      {/* Code of Camera View  */}
                      <div className="col-md-6" style={{ marginTop: "-16px" }}>
                        <div className="mb-0">
                          <div>
                            <table className="camview1 table">
                              <tbody>
                                <tr>
                                  <td>
                                    <div className="row">
                                      <div className="col-md-3">
                                        <CameraLiveVideo
                                          wsUrl={
                                            "ws://49.249.180.125:8080/ws/frame3"
                                          }
                                          imageRef={canvasTopRef}
                                          setCapturedImage={setCapturedTopImage}
                                          capturedImage={capturedTopImage}
                                        />
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="row">
                                      <div className="col-md-3">
                                        <CameraLiveVideo
                                          wsUrl={
                                            "ws://49.249.180.125:8080/ws/frame4"
                                          }
                                          imageRef={canvasRearRef}
                                          setCapturedImage={
                                            setCapturedRearImage
                                          }
                                          capturedImage={capturedRearImage}
                                        />
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                                <tr></tr>
                                <tr>
                                  <td>
                                    <div className="row">
                                      <div className="col-md-3">
                                        <CameraLiveVideo
                                          wsUrl={
                                            "ws://49.249.180.125:8080/ws/frame51"
                                          }
                                          imageRef={canvasFrontRef}
                                          setCapturedImage={
                                            setCapturedFrontImage
                                          }
                                          capturedImage={capturedFrontImage}
                                        />
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="row">
                                      <div className="col-md-3">
                                        <CameraLiveVideo
                                          wsUrl={
                                            "ws://49.249.180.125:8080/ws/frame51"
                                          }
                                          imageRef={canvasSideRef}
                                          setCapturedImage={
                                            setCapturedSideImage
                                          }
                                          capturedImage={capturedSideImage}
                                        />
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                                <tr></tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div style={{ height: 20 }}></div>
                        <div className="row justify-content-end mt-6 mb-2">
                          <div className="col-md-6 col-sm-12 d-flex justify-content-center">
                            {/* <button
                              type="button"
                              className="btn btn-danger me-4 btn-hover"
                              style={{
                                backgroundColor: "white",
                                color: "#d63031",
                                border: "1px solid #cccccc",
                                width: "100px",
                              }}
                              onClick={handleClear}
                            >
                              <FontAwesomeIcon icon={faEraser} className="me-1" /> Clear
                            </button> */}
                            <button
                              type="button"
                              className="btn btn-success-1 btn-hover"
                              style={{
                                backgroundColor: "white",
                                color: "#008060",
                                width: "150px",
                                height: "50px",
                                border: "1px solid #cccccc",
                              }}
                              onClick={handleSave}
                              disabled={isSaving}
                            >
                              {isSaving ? (
                                <Spin size="small" />
                              ) : (
                                <>
                                  <FontAwesomeIcon
                                    icon={faSave}
                                    className="me-1"
                                  />{" "}
                                  Save
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

      </>
    </SideBar2>
  );
}

export default VehicleOutboundDetails;
