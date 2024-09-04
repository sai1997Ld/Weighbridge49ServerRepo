import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "./SalesOrder.css";
import SideBar6 from "../../SideBar/Sidebar6";
import { faSave, faEraser, faHome, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, Link } from "react-router-dom";
import Select from 'react-select';

function SalesOrder() {
  const [purchaseOrderedDate, setPurchaseOrderedDate] = useState("");
  const [saleOrderNo, setSaleOrderNo] = useState("");
  const [purchaseOrderNo, setPurchaseOrderNo] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [productName, setProductName] = useState("");
  const [orderedQuantity, setOrderedQuantity] = useState(0);
  const [brokerName, setBrokerName] = useState("");
  const [brokerAddress, setBrokerAddress] = useState("");
  const [lumps, setLumps] = useState(0); 
  const [fines, setFines] = useState(0); 
  const [customerNames, setCustomerNames] = useState([]);
  const [productNames, setProductNames] = useState([]);
  const [requiresLumpsAndFines, setRequiresLumpsAndFines] = useState(false);

  const navigate = useNavigate();

  const userId = sessionStorage.getItem("userId");
  console.log(userId);

  useEffect(() => {
    fetch("http://49.249.180.125:8080/api/v1/customers/names")
      .then((response) => response.json())
      .then((data) => setCustomerNames(data))
      .catch((error) => console.error("Error fetching customer names:", error));

    fetch("http://49.249.180.125:8080/api/v1/products/names")
      .then((response) => response.json())
      .then((data) => setProductNames(data))
      .catch((error) => console.error("Error fetching product names:", error));

    const savedFormData = sessionStorage.getItem("salesOrderFormData");
    if (savedFormData) {
      const parsedData = JSON.parse(savedFormData);
      setPurchaseOrderedDate(parsedData.purchaseOrderedDate || "");
      setSaleOrderNo(parsedData.saleOrderNo || "");
      setPurchaseOrderNo(parsedData.purchaseOrderNo || "");
      setCustomerName(parsedData.customerName || "");
      setCustomerAddress(parsedData.customerAddress || "");
      setProductName(parsedData.productName || "");
      setOrderedQuantity(parsedData.orderedQuantity || 0);
      setBrokerName(parsedData.brokerName || "");
      setBrokerAddress(parsedData.brokerAddress || "");
      setLumps(parsedData.lumps || 0); 
      setFines(parsedData.fines || 0); 
      sessionStorage.removeItem("salesOrderFormData");
    }
  }, []);

  useEffect(() => {
    setRequiresLumpsAndFines(productName === "Sponge Iron");
  }, [productName]);

  const handleAddCustomer = () => {
    sessionStorage.setItem(
      "salesOrderFormData",
      JSON.stringify({
        purchaseOrderedDate,
        saleOrderNo,
        purchaseOrderNo,
        customerName,
        customerAddress,
        productName,
        orderedQuantity,
        brokerName,
        brokerAddress,
        lumps,
        fines
      })
    );
    navigate("/SalesCustomer");
  };

  const handleCustomerChange = (selectedOption) => {
    const selectedCustomerName = selectedOption ? selectedOption.value : "";
    setCustomerName(selectedCustomerName);

    fetch(
      `http://49.249.180.125:8080/api/v1/customers/get/${encodeURIComponent(
        selectedCustomerName
      )}`
    )
      .then((response) => response.json())
      .then((data) => setCustomerAddress(data[0]))
      .catch((error) =>
        console.error("Error fetching customer address:", error)
      );
  };

  const handleClear = () => {
    setPurchaseOrderedDate("");
    setPurchaseOrderNo("");
    setSaleOrderNo("");
    setCustomerName("");
    setCustomerAddress("");
    setProductName("");
    setOrderedQuantity(0);
    setBrokerName("");
    setBrokerAddress("");
    setLumps(0); 
    setFines(0); 
  };

  const handleSave = () => {
    if (
      purchaseOrderedDate.trim() === "" ||
      purchaseOrderNo.trim() === "" ||
      customerName.trim() === "" ||
      customerAddress.trim() === "" ||
      productName.trim() === "" ||
      orderedQuantity === 0 ||
      saleOrderNo.trim() === "" ||
      (requiresLumpsAndFines && (lumps === " " || lumps === 0 || fines === "  " || fines === 0))
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
    if ((lumps+fines) !== 100) {
      Swal.fire({
        title: "Lumps and Fines percentage should sum up to 100.",
        icon: "warning",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "btn btn-warning",
        },
      });
      return;
    }
    const salesData = {
      purchaseOrderedDate,
      purchaseOrderNo,
      saleOrderNo,
      customerName,
      customerAddress,
      productName,
      orderedQuantity,
      brokerName,
      brokerAddress,
      userId,
      lumps,
      fines  
    };

    fetch("http://49.249.180.125:8080/api/v1/sales/add/salesdetail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(salesData),
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
          title: data,
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "btn btn-success",
          },
        });
        handleClear();
        sessionStorage.removeItem("salesOrderFormData");
        navigate("/sales-dashboard");
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

  const customerOptions = customerNames.map((name) => ({
    value: name,
    label: name,
  }));

  return (
    <SideBar6>
      <div className="sales-order-management container-fluid">
        <div className="sales-order-main-content">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="text-center mx-auto">Create Sales Order</h2>
            <Link to={"/sales-dashboard"}>
              <FontAwesomeIcon
                icon={faHome}
                style={{ float: "right", fontSize: "1.5em" }}
                className="mb-2"
              />
            </Link>
          </div>
          <div className="sales-order-card-container ">
            <div
              className="card"
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
                    <div className="col-md-4">
                      <label
                        htmlFor="purchaseOrderedDate"
                        className="form-label"
                      >
                        Sales Order Date{" "}
                        <span style={{ color: "red", fontWeight: "bold" }}>
                          *
                        </span>
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="purchaseOrderedDate"
                        value={purchaseOrderedDate}
                        onChange={(e) => setPurchaseOrderedDate(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="saleOrderNo" className="form-label">
                        Sale Order No{" "}
                        <span style={{ color: "red", fontWeight: "bold" }}>
                          *
                        </span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="saleOrderNo"
                        placeholder="Enter Sale Order No"
                        value={saleOrderNo}
                        onChange={(e) => setSaleOrderNo(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="purchaseOrderNo" className="form-label">
                        Purchase Order No{" "}
                        <span style={{ color: "red", fontWeight: "bold" }}>
                          *
                        </span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="purchaseOrderNo"
                        placeholder="Enter Purchase Order No"
                        value={purchaseOrderNo}
                        onChange={(e) => setPurchaseOrderNo(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-md-6">
                      <div>
                        <label htmlFor="customerName" className="form-label">
                          Customer{" "}
                          <span style={{ color: "red", fontWeight: "bold" }}>
                            *
                          </span>
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
                            onClick={handleAddCustomer}
                            style={{
                              display: "block",
                              textDecoration: "none",
                              color: "black",
                            }}
                          >
                            Add <FontAwesomeIcon icon={faUser} />
                          </div>
                        </button>
                      </div>
                      <Select
                        id="customerName"
                        options={customerOptions}
                        value={customerOptions.find(option => option.value === customerName)}
                        onChange={handleCustomerChange}
                        placeholder="Select Customer Name"
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="customerAddress" className="form-label">
                        Customer Address{" "}
                        <span style={{ color: "red", fontWeight: "bold" }}>
                          *
                        </span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="customerAddress"
                        placeholder="Customer Address"
                        value={customerAddress}
                        disabled
                      />
                    </div>
                  </div>

                  <div className="row mb-2">
                    <div className="col-md-6">
                      <label htmlFor="productName" className="form-label">
                        Product Name{" "}
                        <span style={{ color: "red", fontWeight: "bold" }}>
                          *
                        </span>
                      </label>
                      <select
                        className="form-select"
                        id="productName"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                      >
                        <option value="">Select Product Name</option>
                        {productNames.map((name) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="orderedQuantity" className="form-label">
                        Ordered Quantity{" "}
                        <span style={{ color: "red", fontWeight: "bold" }}>
                          *
                        </span>
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="orderedQuantity"
                        placeholder="Enter Ordered Quantity"
                        value={orderedQuantity || 0}
                        required
                        onChange={(e) => {
                          const newValue = e.target.value === "" ? 0 : Math.max(
                            0,
                            parseFloat(e.target.value, 10)
                          );
                          setOrderedQuantity(newValue);
                        }}
                      />
                    </div>
                  </div>

                  <div className="row mb-2">
                    <div className="col-md-6">
                      <label htmlFor="lumps" className="form-label">
                        Lumps (in %)
                        
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="lumps"
                        placeholder="Enter Lumps"
                        value={lumps || 0}
                        onChange={(e) => {
                          const newValue = e.target.value === "" ? 0 : Math.max(
                            0,
                            parseFloat(e.target.value, 10)
                          );
                          setLumps(newValue);
                        }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="fines" className="form-label">
                        Fines (in %)
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="fines"
                        placeholder="Enter Fines"
                        value={fines || 0}
                        onChange={(e) => {
                          const newValue = e.target.value === "" ? 0 : Math.max(
                            0,
                            parseFloat(e.target.value, 10)
                          );
                          setFines(newValue);
                        }}
                      />
                    </div>
                  </div>

                  <div className="row mb-2">
                    <div className="col-md-6">
                      <label htmlFor="brokerName" className="form-label">
                        Broker Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="brokerName"
                        placeholder="Enter Broker Name"
                        value={brokerName}
                        onChange={(e) => setBrokerName(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="brokerAddress" className="form-label">
                        Broker Address
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="brokerAddress"
                        placeholder="Enter Broker Address"
                        value={brokerAddress}
                        onChange={(e) => setBrokerAddress(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="d-flex justify-content-end mt-3">
                    <button
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
                      <FontAwesomeIcon icon={faEraser} className="me-1" />
                      Clear
                    </button>
                    <button
                      type="button"
                      className="btn btn-success-1 btn-hover"
                      style={{
                        backgroundColor: "white",
                        color: "#008060 ",
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
      </div>
    </SideBar6>
  );
}

export default SalesOrder;
