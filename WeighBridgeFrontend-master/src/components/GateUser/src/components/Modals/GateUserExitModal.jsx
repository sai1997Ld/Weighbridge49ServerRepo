import React, { lazy, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
// import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { IconButton, Slide } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { defaultApiUrl } from "../../../../../Constants";
import axios from "axios";
import CameraLiveVideo from "../Vehicle_Entry/CameraLiveVideo";
import Swal from "sweetalert2";
import { Spin } from "antd";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const GateUserExitModal = ({ modalOpen, toggleModal, ticketNo }) => {
  const descriptionElementRef = React.useRef(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    challanDate: "",
    poNo: "",
    tpNo: "",
    challanNo: "",
    vehicleNo: "",
    vehicleType: "",
    noOfWheels: "",
    supplier: "",
    supplierAddressLine1: "",
    transporter: "",
    material: "",
    materialType: "",
    driverDLNo: "",
    driverName: "",
    tpNetWeight: "",
    rcFitnessUpto: "",
    department: "",
    eWayBillNo: "",
    transactionType: "Inbound",
  });

  const [capturedTopImage, setCapturedTopImage] = useState(null);
  const [capturedRearImage, setCapturedRearImage] = useState(null);
  const [capturedFrontImage, setCapturedFrontImage] = useState(null);
  const [capturedSideImage, setCapturedSideImage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("xl"));

  const canvasTopRef = useRef(null);
  const canvasRearRef = useRef(null);
  const canvasFrontRef = useRef(null);
  const canvasSideRef = useRef(null);

  const handleUpdate = async () => {
    try {
      setIsSaving(true);
      // return;
      const userId = await sessionStorage.getItem("userId");
      const role = JSON.parse(await sessionStorage.getItem("roles"))[0];

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

      console.log("FormData:", formD);

      const config = {
        method: "post",
        url: `${defaultApiUrl}/gate/out/${ticketNo}?userId=${userId}&role=${role}`,
        data: formD,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      };
      console.log({ config });
      const response = await axios(config);
      console.log({ response });
      if (response.status === 200) {
        setIsSaving(false);
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: response.data,
          showClass: {
            popup: `
              animate__animated
              animate__fadeInUp
              animate__faster
            `,
          },
          hideClass: {
            popup: `
              animate__animated
              animate__fadeOutDown
              animate__faster
            `,
          },
        });
        navigate(-1);
      } else {
        toggleModal();
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: response.data,
          showClass: {
            popup: `
              animate__animated
              animate__fadeInUp
              animate__faster
            `,
          },
          hideClass: {
            popup: `
              animate__animated
              animate__fadeOutDown
              animate__faster
            `,
          },
        });
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log("called response");
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: error.response.data.message || "Request failed",
          showClass: {
            popup: `
            animate__animated
            animate__fadeInUp
            animate__faster
          `,
          },
          hideClass: {
            popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster
          `,
          },
        });
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log("called request catch");

        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "No response received from server.",
          showClass: {
            popup: `
            animate__animated
            animate__fadeInUp
            animate__faster
          `,
          },
          hideClass: {
            popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster
          `,
          },
        });
      } else {
        // Something happened in setting up the request that triggered an Error
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Something went wrong! Try Again.",
          showClass: {
            popup: `
            animate__animated
            animate__fadeInUp
            animate__faster
          `,
          },
          hideClass: {
            popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster
          `,
          },
        });
      }
    } finally {
      setIsSaving(false);
      toggleModal();
    }
  };

  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [modalOpen]);

  useEffect(() => {
    const func = async () => {
      try {
        if (ticketNo) {
          console.log({ ticketNo });
          const userId = await sessionStorage.getItem("userId");
          const config = {
            method: "get",
            url: `${defaultApiUrl}/gate/edit/${ticketNo}?userId=${userId}`,
          };
          const res = await axios(config);
          console.log({ res });
          if (res.status === 200) {
            setFormData({
              challanDate: res?.data?.challanDate,
              ...formData,
              ...res.data,
            });
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    func();
  }, [ticketNo]);

  return (
    <div>
      <Dialog
        fullWidth={"100%"}
        maxWidth={"100%"}
        open={modalOpen}
        onClose={toggleModal}
        scroll={"paper"}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        fullScreen={fullScreen}
        TransitionComponent={Transition}
      >
        <DialogTitle id="scroll-dialog-title">Exit Truck</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={toggleModal}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <div className="row">
            <div className="row">
              <div className="col-lg-12">
                <div className="card mb-3 p-2 border shadow-lg">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-7">
                        <div className="row">
                          <div className="col-md-12 mb-3">
                            <label
                              htmlFor="ticketNo"
                              className="user-form-label fw-bold"
                            >
                              Ticket No : {formData.ticketNo}
                            </label>
                          </div>

                          <div className="col-md-6 mb-3">
                            <label
                              htmlFor="challanDate"
                              className="user-form-label"
                            >
                              Challan Date:
                            </label>
                            <input
                              type="text"
                              id="challanDate"
                              name="challanDate"
                              value={formData.challanDate}
                              readOnly
                              disabled
                              className="form-control"
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label
                              htmlFor="challanNo"
                              className="user-form-label"
                            >
                              Challan No:
                            </label>
                            <input
                              type="text"
                              id="challanNo"
                              name="challanNo"
                              value={formData.challanNo}
                              readOnly
                              disabled
                              className="form-control"
                            />
                          </div>

                          <div className="col-md-6 mb-3">
                            <label htmlFor="tpNo" className="user-form-label">
                              TP No:
                            </label>
                            <div className="input-group d-flex align-items-center">
                              <input
                                type="text"
                                id="tpNo"
                                name="tpNo"
                                value={formData.tpNo}
                                disabled
                                required
                                className="form-control tpscanner"
                                style={{ flexGrow: 1 }}
                              />
                              {/* <button className="scanner_button1" style={{ marginLeft: "2px", padding: "5px 10px", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => alert("Scan TP No")} disabled={!!formData.poNo}>
                                <img src={ScannImage_IB} alt="Scanner" />
                              </button> */}
                            </div>
                          </div>
                          <div className="col-md-6 mb-3">
                            <label htmlFor="poNo" className="user-form-label">
                              PO No:
                            </label>
                            <input
                              type="text"
                              id="poNo"
                              name="poNo"
                              value={formData.poNo}
                              disabled
                              required
                              className="form-control"
                              disabled={!!formData.tpNo}
                            />
                          </div>

                          <div className="col-md-6 mb-3">
                            <label
                              htmlFor="material"
                              className="user-form-label"
                            >
                              Material:
                            </label>
                            <input
                              type="text"
                              id="material"
                              name="material"
                              value={formData.material}
                              disabled
                              className="form-control"
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label
                              htmlFor="materialType"
                              className="user-form-label"
                            >
                              Material Type:
                            </label>
                            <input
                              type="text"
                              id="materialType"
                              name="materialType"
                              value={formData.materialType}
                              disabled
                              readOnly
                              disabled
                              className="form-control"
                            />
                          </div>

                          <div className="col-md-6 mb-3">
                            <label
                              htmlFor="ewayBillNo"
                              className="user-form-label"
                            >
                              E-Way Bill:
                            </label>
                            <input
                              type="text"
                              id="ewayBillNo"
                              name="ewayBillNo"
                              value={formData.ewayBillNo}
                              disabled
                              className="form-control"
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label
                              htmlFor="supplyConsignmentWeight"
                              className="user-form-label"
                            >
                              TP Net Weight:
                            </label>
                            <input
                              type="text"
                              id="supplyConsignmentWeight"
                              name="supplyConsignmentWeight"
                              value={formData.supplyConsignmentWeight}
                              disabled
                              className="form-control"
                            />
                          </div>

                          <div className="col-md-6 mb-3">
                            <label
                              htmlFor="vehicle"
                              className="user-form-label"
                            >
                              Vehicle Number:
                            </label>
                            <input
                              type="text"
                              id="vehicle"
                              name="vehicle"
                              value={formData.vehicle}
                              disabled
                              readOnly
                              disabled
                              className="form-control"
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label
                              htmlFor="supplier"
                              className="user-form-label"
                            >
                              Supplier:
                            </label>
                            <input
                              type="text"
                              id="supplier"
                              name="supplier"
                              value={formData.supplier}
                              disabled
                              className="form-control"
                            />
                          </div>

                          <div className="col-md-6 mb-3">
                            <label
                              htmlFor="driverDLNo"
                              className="user-form-label"
                            >
                              Driver DL No:
                            </label>
                            <div className="input-group d-flex align-items-center">
                              <input
                                type="text"
                                id="dlNo"
                                name="dlNo"
                                value={formData.dlNo}
                                disabled
                                required
                                className="form-control tpscanner"
                                style={{ flexGrow: 1 }}
                              />
                              {/* <button className="scanner_button1" style={{ marginLeft: "2px", padding: "5px 10px", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => alert("Scan DriverDLNo No")} >
                                <img src={ScannImage_IB} alt="Scanner" />
                              </button> */}
                            </div>
                          </div>
                          <div className="col-md-6 mb-3">
                            <label
                              htmlFor="driverName"
                              className="user-form-label"
                            >
                              Driver Name:
                            </label>
                            <input
                              type="text"
                              id="driverName"
                              name="driverName"
                              value={formData.driverName}
                              disabled
                              className="form-control"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-md-5">
                        {/* Need to show capture picture */}
                        <table className="camview1 table">
                          <tbody>
                            <tr>
                              <td>
                                <div className="row">
                                  <CameraLiveVideo
                                    wsUrl={"ws://localhost:8080/ws/frame3"}
                                    imageRef={canvasTopRef}
                                    setCapturedImage={setCapturedTopImage}
                                    capturedImage={capturedTopImage}
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="row">
                                  <CameraLiveVideo
                                    wsUrl={"ws://localhost:8080/ws/frame4"}
                                    imageRef={canvasRearRef}
                                    setCapturedImage={setCapturedRearImage}
                                    capturedImage={capturedRearImage}
                                  />
                                </div>
                              </td>
                            </tr>
                            <tr></tr>
                            <tr>
                              <td>
                                <div className="row">
                                  <CameraLiveVideo
                                    wsUrl={"ws://localhost:8080/ws/frame11"}
                                    imageRef={canvasFrontRef}
                                    setCapturedImage={setCapturedFrontImage}
                                    capturedImage={capturedFrontImage}
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="row">
                                  <CameraLiveVideo
                                    wsUrl={"ws://localhost:8080/ws/frame12"}
                                    imageRef={canvasSideRef}
                                    setCapturedImage={setCapturedSideImage}
                                    capturedImage={capturedSideImage}
                                  />
                                </div>
                              </td>
                            </tr>
                            <tr></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="col-md-3 ms-auto">
                      {" "}
                      {/* Use ms-auto to push the column to the right */}
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
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <Spin size={"small"} />
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faSave} className="me-1" />{" "}
                            Exit
                          </>
                        )}
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
                        <label
                          htmlFor="vehicleWheelsNo"
                          className="user-form-label"
                        >
                          No of Wheels:
                        </label>
                        <input
                          type="text"
                          id="vehicleWheelsNo"
                          name="vehicleWheelsNo"
                          value={formData.vehicleWheelsNo}
                          disabled
                          className="form-control"
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
                          disabled
                          className="form-control"
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
                          disabled
                          className="form-control"
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
                          disabled
                          className="form-control"
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
                          disabled
                          className="form-control"
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
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={toggleModal}>Cancel</Button>
          <Button onClick={toggleModal}>Subscribe</Button>
        </DialogActions> */}
      </Dialog>
    </div>
  );
};

export default GateUserExitModal;
