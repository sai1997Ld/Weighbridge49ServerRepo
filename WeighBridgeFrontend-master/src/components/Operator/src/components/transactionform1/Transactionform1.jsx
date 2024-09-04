/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SideBar5 from "../../../../SideBar/SideBar5";
import "./transactionform1.css";
import axios from "axios";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRectangleXmark, faSave } from "@fortawesome/free-solid-svg-icons";
import LiveVideo from "../transactionform/LiveVideo";
import CircularProgress from "@mui/material/CircularProgress";

function TransactionFrom2() {
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(window.location.search);

  const [inputValue, setInputValue] = useState();

  const [grossWeight, setGrossWeight] = useState(0);
  const [tareWeight, setTareWeight] = useState(0);
  const [netWeight, setNetWeight] = useState(0);
  const [consignmentWeight, setConsignmentWeight] = useState(0);

  const [isGrossWeightEnabled, setIsGrossWeightEnabled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [ticket, setTicket] = useState([]);
  const [port, setPort] = useState(null);

  const ticketNumber = queryParams.get("ticketNumber");
  const ENTRY = queryParams.get("truckStatus");
  const EXIT = queryParams.get("truckStatus");

  const userId = sessionStorage.getItem("userId");

  console.log(ticketNumber);

  useEffect(() => {
    axios
      .get(`http://49.249.180.125:8080/api/v1/weighment/get/${ticketNumber}`, {
        withCredentials: true,
      })
      .then((response) => {
        setTicket(response.data);
        console.log(response.data);
        setGrossWeight(response.data.grossWeight);
        setTareWeight(response.data.tareWeight);
        setNetWeight(response.data.netWeight);
        setConsignmentWeight(response.data.consignmentWeight);
      })
      .catch((error) => {
        console.error("Error fetching weighments:", error);
      });
  }, []);

  useEffect(() => {
    setNetWeight(grossWeight - tareWeight);
    console.log("Count changed:", netWeight);
  }, [grossWeight]);

  const handleChange1 = (value) => {
    const newValue = parseFloat(value);
  
    if (value === "00") {
      // If the value is "00", skip validation and set the input value directly
      setInputValue(value);
      return;
    }
  
    if (newValue === "-" || isNaN(newValue) || newValue <= 0) {
      Swal.fire({
        title: "Please enter a valid positive number",
        icon: "warning",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "btn btn-warning",
        },
      });
      setInputValue("");
      return;
    } else {
      if (ticket.tareWeight === 0) {
        setTareWeight(newValue);
      } else {
        setGrossWeight(newValue);
      }
    }
  };
  

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // const blobFront = await fetch(capturedFrontImage).then((res) =>
      //   res.blob()
      // );
      // const blobRear = await fetch(capturedRearImage).then((res) => res.blob());
      // const blobSide = await fetch(capturedSideImage).then((res) => res.blob());
      // const blobTop = await fetch(capturedTopImage).then((res) => res.blob());
      const payload = {
        machineId: "1",
        ticketNo: ticketNumber,
        weight: inputValue,
      };

      const fetchAndAppendBlob = async (capturedImage, name) => {
        if (capturedImage) {
          const blob = await fetch(capturedImage).then((res) => res.blob());
          return formD.append(name, blob, `${ticketNumber}_weigh_${name}_${Date.now()}.jpg`);
        }
      };
   
      const formD = new FormData();
      await Promise.all([
        fetchAndAppendBlob(capturedFrontImage, "frontImg1"),
        fetchAndAppendBlob(capturedRearImage, "backImg2"),
        fetchAndAppendBlob(capturedSideImage, "leftImg5"),
        fetchAndAppendBlob(capturedTopImage, "topImg3"),
      ]);
   
      formD.append("weighmentRequest", JSON.stringify(payload));
      const response = await axios({
        method: "post",
        url: `http://49.249.180.125:8080/api/v1/weighment/measure?userId=${userId}&role=${"WEIGHBRIDGE_OPERATOR"}`,
        data: formD,
        headers: {
          withCredentials: true,
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        if (grossWeight === 0) {
          Swal.fire({
            title: "Tare weight saved to the database",
            icon: "success",
            confirmButtonText: "OK",
            customClass: {
              confirmButton: "btn btn-success",
            },
          });
        } else {
          if (grossWeight < tareWeight) {
            Swal.fire({
              title: "Gross weight must be greater than tare weight",
              icon: "error",
              confirmButtonText: "OK",
              customClass: {
                confirmButton: "btn btn-danger",
              },
            });
            return;
          }

          Swal.fire({
            title: "Gross weight saved to the database",
            icon: "success",
            confirmButtonText: "OK",
            customClass: {
              confirmButton: "btn btn-success",
            },
          });
        }

        goBack();
        setInputValue("");
        setIsSaving(false);
      }
    } catch (error) {
      setIsSaving(false);
    }
  };

  const [formData, setFormData] = useState({
    date: "",
    inTime: "",
    poNo: "",
    challanNo: "",
    customer: "",
    supplier: "",
    supplierAddress: "",
    supplierContactNo: "",
    vehicleNo: "",
    transporter: "",
    driverDLNo: "",
    driverName: "",
    department: "",
    product: "",
    eWayBillNo: "",
    tpNo: "",
    vehicleType: "",
    tpNetWeight: "",
    rcFitnessUpto: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "poNo" || name === "challanNo") {
      setFormData((prevData) => ({
        ...prevData,
        [name === "poNo" ? "challanNo" : "poNo"]: value
          ? ""
          : prevData[name === "poNo" ? "challanNo" : "poNo"],
      }));
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  const canvasTopRef = useRef(null);
  const canvasRearRef = useRef(null);
  const canvasFrontRef = useRef(null);
  const canvasSideRef = useRef(null);
  const [capturedTopImage, setCapturedTopImage] = useState(null);
  const [capturedRearImage, setCapturedRearImage] = useState(null);
  const [capturedFrontImage, setCapturedFrontImage] = useState(null);
  const [capturedSideImage, setCapturedSideImage] = useState(null);

  const [tareWeightImages, setTareWeightImages] = useState({
    frontImg1: "",
    backImg2: "",
    leftImg5: "",
    topImg3: "",
  });
  useEffect(() => {
    axios
      .get(
        `http://49.249.180.125:8080/api/v1/camera/get?ticketNo=${ticketNumber}&userId=${userId}&role=${"WEIGHBRIDGE_OPERATOR"}&truckStatus=${ENTRY}`
      )
      .then((response) => {
        setTareWeightImages({
          frontImg1: response.data.frontImg1,
          backImg2: response.data.backImg2,
          leftImg5: response.data.leftImg5,
          topImg3: response.data.topImg3,
        });
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
      });
  }, [ticketNumber, userId]);

  const [weight, setWeight] = useState("Connecting...");
  const [trimmedWeight, setTrimmedWeight] = useState("");
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {

    const fetchWeightData = async () => {
      try {
        const response = await axios.get(
          `http://49.249.180.125:8080/api/weight/latest-weight?userId=${userId}`
        );

        const receivedData = response.data.trim();
        setWeight(receivedData);

        const match = receivedData.match(/(\d+(\.\d+)?)/);
        if (match) {
          handleChange1(match[0]);
          setInputValue(match[0]);
        }
      } catch (error) {
        setWeight("Error receiving data");
        console.error("Error fetching weight data:", error);
      }
    };

    fetchWeightData();
    const newIntervalId = setInterval(fetchWeightData, 5000);
    setIntervalId(newIntervalId);

    return () => {
      clearInterval(intervalId);
    };
  }, [ticket,userId]);

  // useEffect(() => {
  //    const match = true;
  //    if (match) {
  //      setInputValue(90);
  //      handleChange1(90);
  //    }
  //  },[ticket])
  // const [company, setCompany] = useState("VK01");
  // const [site, setSite] = useState("ROU01");

  const [images, setImages] = useState({
    weigh1: null,
    weigh2: null,
    weigh3: null,
    frame5: null,
  });

  // Fetches the latest image for a given camera
  const fetchImage = async (camera) => {
    try {
      const response = await axios.get(
        `http://49.249.180.125:8080/api/v1/camera/latest-images?userId=${userId}&location=${camera}`
      );

      const data = response.data;
      console.log(`Fetched ${camera}:`, data);

      if (data && data.image) {
        setImages((prevImages) => ({
          ...prevImages,
          [camera]: data.image,
        }));
      }
    } catch (error) {
      console.error(`Error fetching ${camera}:`, error);
    }
  };

  useEffect(() => {
    // Fetch all images initially
    ["weigh3", "weigh1", "weigh2"].forEach(fetchImage);

    // Set up an interval to fetch images periodically
    const intervalId = setInterval(() => {
      ["weigh3", "weigh1", "weigh2"].forEach(fetchImage);
    }, 5000); // Fetch images every 5 seconds

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [userId]); // Depend on company and site state

  return (
    <SideBar5>
      <div className="container-fluid">
        <div className="container-fluid">
          <button className="close-button" onClick={goBack}>
            <FontAwesomeIcon icon={faRectangleXmark} />
          </button>
          <h2 className="text-center mb-3 mt-3">Outbound Transaction Form</h2>
          <div className="row">
            <div className="col-md-3 mb-3">
              <input
                type="text"
                id="ticketNo"
                name="ticketNo"
                value={`Ticket No: ${ticketNumber}`}
                onChange={handleChange}
                required
                className="abcv"
                readOnly
              />
            </div>
            {/* <div className="col-md-6 mb-3">
              <button
                type="button"
                className="btn btn-primary"
                onClick={connectSerial}
                style={{ float: "right" }}
              >
                Connect Serial Port
              </button>
            </div> */}
          </div>
          <div className="row mb-2 p-2 border shadow-lg rounded-lg">
            <div className="col-md-3 mb-3">
              <label htmlFor="poNo" className="form-label ">
                PO No:
                {/* <span style={{ color: "red", fontWeight: "bold" }}>*</span> */}
              </label>
              <div className="input-group">
                <input
                  type="text"
                  id="poNo"
                  name="poNo"
                  value={ticket.poNo}
                  onChange={handleChange}
                  required
                  className="abcv"
                  readOnly
                />
              </div>
            </div>
            {/* TP No */}
            <div className="col-md-3 mb-3">
              <label htmlFor="tpNo" className="form-label ">
                TP No:
                {/* <span style={{ color: "red", fontWeight: "bold" }}>*</span> */}
              </label>
              <div className="input-group">
                <input
                  type="text"
                  id="tpNo"
                  name="tpNo"
                  value={ticket.tpNo}
                  onChange={handleChange}
                  required
                  className="abcv"
                  readOnly
                />
              </div>
            </div>

            {/* Challan No */}
            <div className="col-md-3 mb-3 ">
              <label htmlFor="challanNo" className="form-label ">
                Challan No:
                {/* <span style={{ color: "red", fontWeight: "bold" }}>*</span> */}
              </label>
              <input
                type="text"
                id="challanNo"
                name="challanNo"
                value={ticket.challanNo}
                onChange={handleChange}
                required
                disabled
                className="abcv"
                readOnly
              />
            </div>
            {/* Vehicle No */}
            <div className="col-md-3 mb-3 ">
              <label htmlFor="vehicleNo" className="form-label ">
                Vehicle No:
                {/* <span style={{ color: "red", fontWeight: "bold" }}>*</span> */}
              </label>
              <div className="input-group">
                <input
                  type="text"
                  id="vehicleNo"
                  name="vehicleNo"
                  value={ticket.vehicleNo}
                  onChange={handleChange}
                  required
                  className="abcv"
                  readOnly
                />
              </div>
            </div>
          </div>
          <div className="row mb-2 p-2 border shadow-lg rounded-lg">
            <div className="col-md-12">
              {/* Input fields */}
              <h5>Weighment Details:</h5>
              <div className="row mb-2">
                <div className="col-md-5">
                  <div className="sub">
                    <input
                      type="number"
                      className="abcv"
                      placeholder="0"
                      style={{
                        height: "50px",
                        // Add these lines to ensure the appearance is consistently set
                        WebkitAppearance: "none",
                        MozAppearance: "textfield",
                        appearance: "textfield",
                      }}
                      min="0"
                      value={inputValue}
                      onChange={(e) => {
                        console.log(e);
                        setInputValue(e.target.value);
                        handleChange1(e.target.value);
                      }}
                      inputMode="numeric"
                    />
                    <div className="icons-group">
                      <div>
                        {ticket.grossWeight === 0 && ticket.netWeight === 0 ? (
                          <button
                            type="button"
                            className="btn btn-success"
                            style={{
                              width: "100px",
                              border: "1px solid #cccccc",
                            }}
                            onClick={handleSave}
                          >
                            {isSaving ? (
                              <div style={{ color: "white" }}>
                                <CircularProgress color="inherit" size={20} />
                              </div>
                            ) : (
                              <>
                                <FontAwesomeIcon
                                  icon={faSave}
                                  className="me-3"
                                />
                                Save
                              </>
                            )}
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-4">
                  <div className="form-group">
                    <label htmlFor="vehicleType" className="form-label">
                      Gross Weight:
                    </label>

                    <div style={{ display: "flex", gap: "5px" }}>
                      <input
                        type="text"
                        autoComplete="off"
                        value={`${grossWeight} kg`}
                        className="abcx"
                        readOnly
                      />
                      <input
                        type="text"
                        value={ticket.grossWeightTime}
                        className="abcx"
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <div className="col-4">
                  <div className="form-group">
                    <label htmlFor="tareWeight" className="form-label">
                      Tare Weight:
                    </label>

                    <div style={{ display: "flex", gap: "5px" }}>
                      <input
                        type="text"
                        autoComplete="off"
                        value={`${tareWeight} kg`}
                        required={isGrossWeightEnabled}
                        className="abcx"
                        readOnly
                      />
                      <input
                        type="text"
                        value={ticket.tareWeightTime}
                        className="abcx"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="form-group">
                    <label htmlFor="vehicleType" className="form-label">
                      Net Weight:
                    </label>

                    <div style={{ display: "flex", gap: "5px" }}>
                      <input
                        type="text"
                        autoComplete="off"
                        value={`${netWeight} kg`}
                        // required={isGrossWeightEnabled}
                        className="abcx"
                        readOnly
                      />
                      <input
                        type="text"
                        value={ticket.grossWeightTime}
                        className="abcx"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-4">
                  <div className="form-group">
                    <label htmlFor="vehicleType" className="form-label">
                      Consignment Weight:
                    </label>
                  </div>
                  <div style={{ display: "flex" }}>
                    <input
                      type="text"
                      autoComplete="off"
                      value={`${consignmentWeight} kg`}
                      className="abcx"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row mb-2 p-2 border shadow-lg rounded-lg">
            <div className="col-md-12">
              <div className="row">
                {Object.entries(images).map(([camera, image]) => (
                  <div className="col-md-3" key={camera}>
                    <LiveVideo
                      image={image}
                      label={camera.replace("frame", "View")}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="row mb-2 p-2 border shadow-lg rounded-lg">
            <div className="col-md-12">
              <div className="row">
                <h5>Tare Weight Images</h5>
                {/* Iterate over the grossWeightImages object keys and display them */}
                {Object.entries(tareWeightImages).map(([key, image]) => (
                  <div className="col-md-3" key={key}>
                    {image && (
                      <img
                        src={`data:image/jpeg;base64,${image}`}
                        alt={`${key} View`}
                        className="img-fluid"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="row mb-2 p-2 border shadow-lg rounded-lg">
            <h5>Transaction Details:</h5>
            <div className="grid-container-op">
              <div className="grid-item-2">
                <label htmlFor="supplier" className="form-label">
                  Customer:
                </label>
                <input
                  type="text"
                  id="supplier"
                  name="supplier"
                  value={ticket.customerName}
                  onChange={handleChange}
                  className="abcv"
                  readOnly
                />
              </div>
              <div className="grid-item-op">
                <label htmlFor="supplierAddress" className="form-label">
                  Customer Address:
                </label>
                <input
                  type="text"
                  id="supplierAddress"
                  name="supplierAddress"
                  value={ticket.customerAddress}
                  onChange={handleChange}
                  className="abcv"
                  readOnly
                />
              </div>
              <div className="grid-item-op">
                <label htmlFor="transporter" className="form-label">
                  Transporter:
                </label>
                <input
                  type="text"
                  id="transporter"
                  name="transporter"
                  value={ticket.transporter}
                  onChange={handleChange}
                  className="abcv"
                  readOnly
                />
              </div>
              {/* <div className="grid-item-op">
                <label htmlFor="department" className="form-label">
                  Department:
                </label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={ticket.department}
                  onChange={handleChange}
                  className="abcv"
                  readOnly
                />
              </div> */}
              <div className="grid-item-op">
                <label htmlFor="driverDL" className="form-label">
                  Driver DL No:
                </label>
                <input
                  type="text"
                  id="driverDL"
                  name="driverDL"
                  value={ticket.driverDlNo}
                  onChange={handleChange}
                  className="abcv"
                  readOnly
                />
              </div>
              <div className="grid-item-op">
                <label htmlFor="driverName" className="form-label">
                  Driver Name:
                </label>
                <input
                  type="text"
                  id="driverName"
                  name="driverName"
                  value={ticket.driverName}
                  onChange={handleChange}
                  className="abcv"
                  readOnly
                />
              </div>
              <div className="grid-item-op">
                <label htmlFor="product" className="form-label">
                  Product:
                </label>
                <input
                  type="text"
                  id="product"
                  name="product"
                  value={ticket.material}
                  onChange={handleChange}
                  className="abcv"
                  readOnly
                />
              </div>
              <div className="grid-item-op">
                <label htmlFor="product" className="form-label">
                  Product Type:
                </label>
                <input
                  type="text"
                  id="material"
                  name="material"
                  value={ticket.materialType}
                  onChange={handleChange}
                  className="abcv"
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SideBar5>
  );
}

// eslint-disable-next-line no-undef
export default TransactionFrom2;
