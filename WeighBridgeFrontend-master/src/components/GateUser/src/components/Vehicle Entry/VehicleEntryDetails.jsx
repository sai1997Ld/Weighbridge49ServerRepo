import { useState, useEffect, useRef } from "react";
import { Chart, ArcElement } from "chart.js/auto";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import SideBar2 from "../../../../SideBar/SideBar2";
import scanner from "../../assets/scanner.png";
import Camera_Icon from "../../assets/Camera_Icon.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { faEraser } from '@fortawesome/free-solid-svg-icons';
import Swal from "sweetalert2";

function VehicleEntryDetails() {
  const navigate = useNavigate();
  const chartRef = useRef(null);
  const chartRef2 = useRef(null);
  const homeMainContentRef = useRef(null);
  const [suppliers, setSuppliers] = useState([]);
  const [suppliersAddressLine1, setSuppliersAddressLine1] = useState();
  const [transporter, setTransporter] = useState();
  const [materials, setMaterials] = useState([]);

  const [formData, setFormData] = useState({
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
    transactionType: "Inbound"
  });

  const departmentOptions = ["Department 1", "Department 2", "Department 3"];
  const materialType = ["Lumps", "Fines", "ROM"];
  const transactionType = ["Inbound"];

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

  useEffect(() => {
    const fetchSupplierList = async () => {
      try {
        const response = await fetch(
          "http://49.249.180.125:8080/api/v1/supplier/get/list",
          {
            method: "GET",
            credentials: "include"
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        // Assuming data is an array of suppliers, update state or handle data accordingly
        console.log(data); // Log the data to see its structure
        setSuppliers(data);
      } catch (error) {
        console.error("Error fetching supplier list:", error);
      }
    };

    fetchSupplierList();
  }, []);

  // onChangeSupplier
  const handleSupplierChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    fetch(`http://49.249.180.125:8080/api/v1/supplier/get/${e.target.value}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // Check if data is an array and has at least one element
        if (Array.isArray(data) && data.length > 0) {
          // Set the first element of the array as the supplier address
          setFormData((prevData) => ({
            ...prevData,
            supplierAddressLine1: data[0]
          }));
        }
      })
      .catch((error) => {
        console.error("Error fetching supplier Address:", error);
      });
  };



  // Get API for MAterial:

  useEffect(() => {
    const fetchMaterialList = async () => {
      try {
        const response = await fetch(
          "http://49.249.180.125:8080/api/v1/materials/names",
          {
            method: "GET",
            credentials: "include"
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        // Assuming data is an array of Materials, update state or handle data accordingly
        console.log(data); // Log the data to see its structure
        setMaterials(data);
      } catch (error) {
        console.error("Error fetching Materials list:", error);
      }
    };

    fetchMaterialList();
  }, []);


  // onChangeSupplier
  

    
  // Get API Vehicle No.

  const handleVehicleNoKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      console.log(formData.vehicleNo);
      // Call API with the entered vehicle number
      fetch(`http://49.249.180.125:8080/api/v1/vehicles/vehicle/${formData.vehicleNo}`)
        .then((response) => response.json())
        .then((data) => {

          // Set transporter state with the data from the API response
          setTransporter(data.transporter);
          // Update other form data fields with the received data
          setFormData((prevData) => ({
            ...prevData,
            vehicleNo: data.vehicleNo,
            noOfWheels: data.vehicleWheelsNo,
            vehicleType: data.vehicleType,
            transporter: data.transporter,
            rcFitnessUpto: data.vehicleFitnessUpTo
          }));
        })
        .catch((error) => {
          console.error("Error fetching vehicle details:", error);
        });
    }
  };




  const [capturedImages, setCapturedImages] = useState({
    frontView: null,
    backView: null,
    topView: null,
    sideView: null,
  });
  const handleCapturePicture = async (view) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const videoElement = document.createElement("video");
      videoElement.srcObject = stream;
      await new Promise((resolve) => {
        videoElement.onloadedmetadata = () => {
          resolve();
        };
      });

      const canvas = document.createElement("canvas");
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      canvas.getContext("2d").drawImage(videoElement, 0, 0);
      const capturedImage = canvas.toDataURL("image/png");

      setCapturedImages((prevState) => ({
        ...prevState,
        [view]: capturedImage,
      }));

      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.error("Error capturing picture:", error);
    }
  };

  const handleSave = () => {
    if (
      (!formData.poNo && !formData.tpNo) ||
      !formData.vehicleNo ||
      !formData.driverDLNo ||
      !formData.driverName ||
      !formData.challanNo
    ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill out all mandatory fields.",
      });
      return;
    }

    const gateData = {
      // userId,
      supplier: formData.supplier,
      supplierAddressLine1: formData.supplierAddressLine1,
      transporter: transporter.toString(),
      material: formData.material,
      materialType: formData.materialType,
      vehicle: formData.vehicleNo,
      dlNo: formData.driverDLNo,
      driverName: formData.driverName,
      supplyConsignmentWeight: formData.tpNetWeight,
      poNo: formData.poNo,
      tpNo: formData.tpNo,
      challanNo: formData.challanNo,
      ewayBillNo: formData.eWayBillNo,
      transactionType: formData.transactionType
    };

    // Create JSON payload
    const payload = JSON.stringify(gateData);
    console.log("payload", payload);

    // Fetch API
    fetch("http://49.249.180.125:8080/api/v1/gate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: payload,
      credentials: "include"
    })
      .then((response) => response.json())
      .then((data) => {
        // Show success message
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Data saved Successfully!",
        });

        // Reset form data after 3 seconds and navigate to VehicleEntry page
        setTimeout(() => {
          setFormData({
            poNo: "",
            tpNo: "",
            challanNo: "",
            vehicleNo: "",
            vehicleType: "",
            noOfWheels: "",
            supplier: "",
            susupplierAddressLine1: "",
            transporter: "",
            material: "",
            materialType: "",
            driverDLNo: "",
            driverName: "",
            tpNetWeight: "",
            rcFitnessUpto: "",
            department: "",
            eWayBillNo: "",
            transactionType: "Inbound"
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

  const handleClear = () => {
    setFormData({
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
      transactionType: "Inbound "
    });
  };
  return (
    <SideBar2>
<div className="container-fluid d-flex justify-content-center align-items-center" style={{ marginTop: "-50px" }}>    <div className="row justify-content-center">
      <div className="col-md-10">
            <h2 className="text-center mb-4">Vehicle Entry Inbound Details</h2>
            <div className="row">
              <div className="col-md-3 mb-3">
                <label htmlFor="poNo" className="form-label">PO No:<span className="text-danger fw-bold">*</span></label>
                <input type="text" id="poNo" name="poNo" value={formData.poNo} onChange={handleChange} required className="form-control" disabled={!!formData.tpNo} />
              </div>
              <div className="col-md-3 mb-3 position-relative">
                <label htmlFor="tpNo" className="form-label">TP No:<span className="text-danger fw-bold">*</span></label>
                <div className="input-group">
                  <input type="text" id="tpNo" name="tpNo" value={formData.tpNo} onChange={handleChange} required className="form-control" disabled={!!formData.poNo} />
                  <button
                    className="btn btn-outline-primary"
                    style={{
                      marginLeft: "3px",
                      padding: "2px 6px", // Adjust padding to decrease the height of the outer box
                      borderRadius: "4px", // Adjust border-radius to maintain the button shape
                      height: "40px", // Decrease the height of the outer box
                    }}
                    onClick={() => alert("Scan TP No")}
                  >
                    {/* Use the imported scanner image */}
                    <img
                      src={scanner}
                      alt="Scanner"
                      style={{
                        width: "20px", // Keep the width of the image the same
                        height: "20px", // Keep the height of the image the same
                      }}
                    />
                  </button>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <label htmlFor="challanNo" className="form-label">Challan No:<span className="text-danger fw-bold">*</span></label>
                <input type="text" id="challanNo" name="challanNo" value={formData.challanNo} onChange={handleChange} required className="form-control" />
              </div>
              <div className="col-md-3 mb-3 position-relative">
                <label htmlFor="vehicleNo" className="form-label">Vehicle No:<span className="text-danger fw-bold">*</span></label>
                <div className="input-group">
                  <input type="text" id="vehicleNo" name="vehicleNo" value={formData.vehicleNo} onChange={handleChange} required className="form-control" onKeyDown={handleVehicleNoKeyPress} />
                  <button
                    className="btn btn-outline-primary"
                    style={{
                      marginLeft: "3px",
                      padding: "2px 6px", // Adjust padding to decrease the height of the outer box
                      borderRadius: "4px", // Adjust border-radius to maintain the button shape
                      height: "40px", // Decrease the height of the outer box
                    }}
                    onClick={() => alert("Scan Vehicle No")}
                  >
                    {/* Use the imported scanner image */}
                    <img
                      src={scanner}
                      alt="Scanner"
                      style={{
                        width: "20px", // Keep the width of the image the same
                        height: "20px", // Keep the height of the image the same
                      }}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="row mb-3">
        <div className="col-md-6" style={{ marginLeft: "-55px" }}>
        <h4 className="text-center">Fill up the user details:</h4>

    <div className="row mb-3">
  <div className="col-md-6">
    <label htmlFor="vehicleType" className="form-label">Vehicle Type:</label>
                    <input type="text" id="vehicleType" name="vehicleType" value={formData.vehicleType} onChange={handleChange} className="form-control" />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="noOfWheels" className="form-label">No of Wheels:</label>
                    <input type="text" id="noOfWheels" name="noOfWheels" value={formData.noOfWheels} onChange={handleChange} className="form-control" />
                  </div>
                </div>
                <div className="row mb-3">
                {/* Supplier dropdown */}
                <div className="col-md-6">
                  <label htmlFor="supplier" className="form-label ">
                    Supplier:
                  </label>
                  <select
                    id="supplier"
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleSupplierChange}
                    className="form-select"
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map((s, index) => (
                      <option key={index} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                  <div className="col-md-6">
                    <label htmlFor="supplierContactNo" className="form-label">Supplier's Address:</label>
                    <input type="text" id="supplierAddressLine1" name="supplierAddressLine1" value={formData.supplierAddressLine1} onChange={handleChange} className="form-control" />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="transporter" className="form-label">Transporter:</label>
                    <input type="text" id="transporter" name="transporter" value={formData.transporter} onChange={handleChange} className="form-control" />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="material" className="form-label">Material:</label>
                    <select id="material" name="material" value={formData.material} onChange={handleChange} className="form-select">
                      <option value="">Select material</option>
                      {materials.map((m, index) => (
                        <option key={index} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="driverDLNo" className="form-label">Driver DL No:<span className="text-danger fw-bold">*</span></label>
                    <div className="input-group">
                      <input type="text" id="driverDLNo" name="driverDLNo" value={formData.driverDLNo} onChange={handleChange} required className="form-control" />
                      <button
                        className="btn btn-outline-primary"
                        style={{
                          marginLeft: "3px",
                          padding: "2px 6px", // Adjust padding to decrease the height of the outer box
                          borderRadius: "4px", // Adjust border-radius to maintain the button shape
                          height: "40px", // Decrease the height of the outer box
                        }}
                        onClick={() => alert("Scan Driver DL No")}
                      >
                        {/* Use the imported scanner image */}
                        <img
                          src={scanner}
                          alt="Scanner"
                          style={{
                            width: "20px", // Keep the width of the image the same
                            height: "20px", // Keep the height of the image the same
                          }}
                        />
                      </button>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="driverName" className="form-label">Driver Name:<span className="text-danger fw-bold">*</span></label>
                    <input type="text" id="driverName" name="driverName" value={formData.driverName} onChange={handleChange} required className="form-control" />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="tpNetWeight" className="form-label">TP Net Weight:</label>
                    <input type="text" id="tpNetWeight" name="tpNetWeight" value={formData.tpNetWeight} onChange={handleChange} className="form-control" />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="rcFitnessUpto" className="form-label">RC Fitness Upto:<span className="text-danger fw-bold">*</span></label>
                    <input type="text" id="rcFitnessUpto" name="rcFitnessUpto" value={formData.rcFitnessUpto} onChange={handleChange} required className="form-control" />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="materialType" className="form-label">Material Type:</label>
                    <select id="materialType" name="materialType" value={formData.materialType} onChange={handleChange} className="form-select">
                      <option value="">Select material Type</option>
                      {materialType.map((material, index) => (
                        <option key={index} value={material}>{material}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="eWayBillNo" className="form-label">E-way Bill No:</label>
                    <div className="input-group">
                      <input type="text" id="eWayBillNo" name="eWayBillNo" value={formData.eWayBillNo} onChange={handleChange} className="form-control" />
                      <button
                        className="btn btn-outline-primary"
                        style={{
                          marginLeft: "3px",
                          padding: "2px 6px", // Adjust padding to decrease the height of the outer box
                          borderRadius: "4px", // Adjust border-radius to maintain the button shape
                          height: "40px", // Decrease the height of the outer box
                        }}
                        onClick={() => alert("Scan E-WayBill No")}
                      >
                        {/* Use the imported scanner image */}
                        <img
                          src={scanner}
                          alt="Scanner"
                          style={{
                            width: "20px", // Keep the width of the image the same
                            height: "20px", // Keep the height of the image the same
                          }}
                        />
                      </button>

                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6">
                <table className="text-center camview table">
                  <tbody>
                    <tr>
                      <td colSpan="2" rowSpan="2" style={{ position: "relative", width: "80px", height: "180px", border: "1px solid" }}>
                        <span style={{ marginRight: "5px" }}>Front-View</span>
                        <button className="btn btn-primary" style={{ position: "absolute", bottom: 0, right: 0, border: "0px" }} onClick={handleCapturePicture}>
                          <img src={Camera_Icon} alt="Captured" style={{ width: "45px", height: "36px" }} />
                        </button>
                      </td>
                      <td colSpan="2" rowSpan="2" style={{ position: "relative", width: "80px", height: "180px", border: "1px solid" }}>
                        <span style={{ marginRight: "5px" }}>Back-View</span>
                        <button className="btn btn-primary" style={{ position: "absolute", bottom: 0, right: 0, border: "0px" }} onClick={handleCapturePicture}>
                          <img src={Camera_Icon} alt="Captured" style={{ width: "45px", height: "36px" }} />
                        </button>
                      </td>
                    </tr>
                    <tr></tr>
                    <tr>
                      <td colSpan="2" rowSpan="2" style={{ position: "relative", width: "80px", height: "180px", border: "1px solid" }}>
                        <span style={{ marginRight: "5px" }}>Top-View</span>
                        <button className="btn btn-primary" style={{ position: "absolute", bottom: 0, right: 0, border: "0px" }} onClick={handleCapturePicture}>
                          <img src={Camera_Icon} alt="Captured" style={{ width: "45px", height: "36px" }} />
                        </button>
                      </td>
                      <td colSpan="2" rowSpan="2" style={{ position: "relative", width: "80px", height: "180px", border: "1px solid" }}>
                        <span style={{ marginRight: "5px" }}>Side-View</span>
                        <button className="btn btn-primary" style={{ position: "absolute", bottom: 0, right: 0, border: "0px" }} onClick={handleCapturePicture}>
                          <img src={Camera_Icon} alt="Captured" style={{ width: "45px", height: "36px" }} />
                        </button>
                      </td>
                    </tr>
                    <tr></tr>
                  </tbody>
                </table>

                <div style={{ height: 60 }}></div>
                <div className="row justify-content-end mt-6 mb-2">
  <div className="col-md-6 col-sm-12 d-flex justify-content-end align-items-center">
    <button 
      onClick={handleSave} 
      className="btn btn-success me-2" 
      style={{
        height: '40px',
        minWidth: '120px;',
        width: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center', // Center the content horizontally
        textAlign: 'center' // Center the text within the button
      }}
    >
      <FontAwesomeIcon icon={faSave} className="me-2 d-none d-md-inline" />
      Save
    </button>
    <button 
      onClick={handleClear} 
      className="btn btn-secondary" 
      style={{
        height: '40px',
        minWidth: '120px;',
        width: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center', // Center the content horizontally
        textAlign: 'center' // Center the text within the button
      }}
    >
      <FontAwesomeIcon icon={faEraser} className="me-2 d-none d-md-inline" />
      Clear
    </button>
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

export default VehicleEntryDetails;