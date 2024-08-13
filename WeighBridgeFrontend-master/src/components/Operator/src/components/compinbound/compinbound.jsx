import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SideBar5 from "../../../../SideBar/SideBar5";

import "./compinbound.css";
import axios from "axios";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRectangleXmark, faSave } from "@fortawesome/free-solid-svg-icons";

function InboundComp() {
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(window.location.search);
  const [inputValue, setInputValue] = useState();
  const [grossWeight, setGrossWeight] = useState(0);
  const [tareWeight, setTareWeight] = useState(0);
  const [netWeight, setNetWeight] = useState(0);
  const [ticket, setTicket] = useState([]);
  const ticketNumber = queryParams.get("ticketNumber");

  const EXIT = queryParams.get("truckStatus");
  const ENTRY = queryParams.get("truckStatus");

  const userId = sessionStorage.getItem("userId");

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
        setSaveSuccess(false);
      })
      .catch((error) => {
        console.error("Error fetching weighments:", error);
      });
  }, []);

  useEffect(() => {
    setNetWeight(grossWeight - tareWeight);
    console.log("Count changed:", netWeight);
  }, [tareWeight]);

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
  const [grossWeightImages, setGrossWeightImages] = useState({
    frontImg1: "",
    backImg2: "",
    leftImg5: "",
    topImg3: "",
  });

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
        setGrossWeightImages({
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

  useEffect(() =>{
    axios
      .get(`http://49.249.180.125:8080/api/v1/camera/get?ticketNo=${ticketNumber}&userId=${userId}&role=${"WEIGHBRIDGE_OPERATOR"}&truckStatus=${EXIT}`)
      .then((response)=>{
        setTareWeightImages({
          frontImg1: response.data.frontImg1,
          backImg2: response.data.backImg2,
          leftImg5: response.data.leftImg5,
          topImg3: response.data.topImg3,
        });
      })
      .catch((error)=>{
        console.error("Error fetching images:", error);
      });
  },[ticketNumber,userId])

  return (
    <SideBar5>
      <div className="container-fluid">
        <div className="container-fluid">
          <button className="close-button" onClick={goBack}>
            <FontAwesomeIcon icon={faRectangleXmark} />
          </button>
          <h2 className="text-center mb-3 mt-1">Inbound Transaction Form</h2>
          <div className="row ">
            <div className="col-md-3 mb-3">
              <input
                type="text"
                id="ticketNo"
                name="ticketNo"
                value={`Ticket No: ${ticketNumber}`}
                onChange={handleChange}
                required
                disabled
                className="abcv"
                readOnly
              />
            </div>
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
                  disabled
                  className="abcv"
                  readOnly
                />
              </div>
            </div>
            {/* TP No */}
            <div className="col-md-3 mb-3 ">
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
                  disabled
                  className="abcv"
                  readOnly
                />
              </div>
            </div>

            {/* Challan No */}
            <div className="col-md-3 mb-3">
              <label htmlFor="challanNo" className="form-label ">
                Challan No:
                {/* <span style={{ color: "red", fontWeight: "bold" }}>*</span> */}
              </label>
              <div className="input-group">
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
            </div>

            <div className="col-md-3 mb-3">
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
                  disabled
                  className="abcv"
                  readOnly
                />
              </div>
            </div>
          </div>
          <div className="row mb-2 p-2 border shadow-lg rounded-lg">
            <div className="col-md-12">
              <h5>Weighment Details:</h5>

              <div className="row mb-3 mt-3">
                <div className="col-4">
                  <div className="form-group">
                    <label htmlFor="grossWeight" className="form-label">
                      Gross Weight:
                    </label>
                    <div style={{ display: "flex", gap: "5px" }}>
                      <input
                        type="text"
                        id="grossWeight"
                        autoComplete="off"
                        value={`${grossWeight} kg`}
                        className="abcv"
                        readOnly
                      />
                      <input
                        type="text"
                        value={ticket.grossWeightTime}
                        className="abcv"
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
                        id="tareWeight"
                        autoComplete="off"
                        value={`${tareWeight} kg`}
                        className="abcv"
                        readOnly
                      />
                      <input
                        type="text"
                        value={ticket.tareWeightTime}
                        className="abcv"
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <div className="col-4">
                  <div className="form-group">
                    <label htmlFor="netWeight" className="form-label">
                      Net Weight:
                    </label>
                    <div style={{ display: "flex", gap: "5px" }}>
                      <input
                        type="text"
                        id="netWeight"
                        autoComplete="off"
                        value={`${netWeight} kg`}
                        className="abcv"
                        readOnly
                      />
                      <input
                        type="text"
                        value={ticket.tareWeightTime}
                        className="abcv"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row mb-2 p-2 border shadow-lg rounded-lg">
            <div className="col-md-12">
              <div className="row">
                <h5>Gross Weight Images</h5>
                <div className="col-md-3">
                  {grossWeightImages.frontImg1 && (
                    <img
                      src={`data:image/jpeg;base64,${grossWeightImages.frontImg1}`}
                      alt="Front View"
                      className="img-fluid"
                    />
                  )}
                </div>
                <div className="col-md-3">
                  {grossWeightImages.backImg2 && (
                    <img
                      src={`data:image/jpeg;base64,${grossWeightImages.backImg2}`}
                      alt="Rear View"
                      className="img-fluid"
                    />
                  )}
                </div>
                <div className="col-md-3">
                  {grossWeightImages.leftImg5 && (
                    <img
                      src={`data:image/jpeg;base64,${grossWeightImages.leftImg5}`}
                      alt="Top View"
                      className="img-fluid"
                    />
                  )}
                </div>
                <div className="col-md-3">
                  {grossWeightImages.topImg3 && (
                    <img
                      src={`data:image/jpeg;base64,${grossWeightImages.topImg3}`}
                      alt="Side View"
                      className="img-fluid"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="row mb-2 p-2 border shadow-lg rounded-lg">
            <div className="col-md-12">
              <div className="row">
                <h5>Tare Weight Images</h5>
                <div className="col-md-3">
                  {tareWeightImages.frontImg1 && (
                    <img
                      src={`data:image/jpeg;base64,${tareWeightImages.frontImg1}`}
                      alt="Front View"
                      className="img-fluid"
                    />
                  )}
                </div>
                <div className="col-md-3">
                  {tareWeightImages.backImg2 && (
                    <img
                      src={`data:image/jpeg;base64,${tareWeightImages.backImg2}`}
                      alt="Rear View"
                      className="img-fluid"
                    />
                  )}
                </div>
                <div className="col-md-3">
                  {tareWeightImages.leftImg5 && (
                    <img
                      src={`data:image/jpeg;base64,${tareWeightImages.leftImg5}`}
                      alt="Side View"
                      className="img-fluid"
                    />
                  )}
                </div>
                <div className="col-md-3">
                  {tareWeightImages.topImg3 && (
                    <img
                      src={`data:image/jpeg;base64,${tareWeightImages.topImg3}`}
                      alt="Top View"
                      className="img-fluid"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="row mb-2 p-2 border shadow-lg rounded-lg">
            <h5>Transaction Details:</h5>
            <div className="grid-container-op">
              <div className="grid-item-op">
                <label htmlFor="supplier" className="form-label">
                  Supplier:
                </label>
                <input
                  type="text"
                  id="supplier"
                  name="supplier"
                  value={ticket.supplierName}
                  onChange={handleChange}
                  className="abcv"
                  readOnly
                />
              </div>
              <div className="grid-item-op">
                <label htmlFor="supplierAddress" className="form-label">
                  Supplier Address:
                </label>
                <input
                  type="text"
                  id="supplierAddress"
                  name="supplierAddress"
                  value={ticket.supplierAddress}
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
                <label htmlFor="material" className="form-label">
                  Material:
                </label>
                <input
                  type="text"
                  id="material"
                  name="material"
                  value={ticket.material}
                  onChange={handleChange}
                  className="abcv"
                  readOnly
                />
              </div>
              <div className="grid-item-op">
                <label htmlFor="material" className="form-label">
                  Material Type:
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
export default InboundComp;
