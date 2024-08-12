import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import "./ProcessOrder.css";
import SideBar6 from "../../SideBar/Sidebar6";
import { faSave, faEraser, faHome, faTruck, faCarAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { Modal, Select as AntSelect } from 'antd';

const { Option } = AntSelect;

function ProcessOrder() {
  const location = useLocation();
  const navigate = useNavigate();
  const { saleOrderNo, productName, balanceQty, customerName, customerAddress, lumpsBalance, finesBalance } = location.state || {};

  const [formsaleOrderNo, setFormsaleOrderNo] = useState(saleOrderNo || "");
  const [formProductName, setFormProductName] = useState(productName || "");
  const [formCustomerName, setFormCustomerName] = useState(customerName || "");
  const [formCustomerAddress, setFormCustomerAddress] = useState(customerAddress || "");
  const [productType, setProductType] = useState("");
  const [productTypes, setProductTypes] = useState([]);
  const [vehicleNo, setVehicleNo] = useState("");
  const [transporterName, setTransporterName] = useState("");
  const [vehicleNumbers, setVehicleNumbers] = useState([]);
  const [transporters, setTransporters] = useState([]);
  const [balance, setBalance] = useState(balanceQty || 0);
  const [lumpsbalance, setlumpsBalance] = useState(lumpsBalance || 0);
  const [finesbalance, setfinesBalance] = useState(finesBalance || 0);
  const [isFollowOnModalVisible, setIsFollowOnModalVisible] = useState(false);
  const [followOnOrders, setFollowOnOrders] = useState([]);
  const [selectedFollowOnOrder, setSelectedFollowOnOrder] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/vehicles/vehicleList")
      .then((response) => response.json())
      .then((data) => {
        const numbers = data.map((vehicleNo) => ({
          value: vehicleNo,
          label: vehicleNo,
        }));
        setVehicleNumbers(numbers);
      })
      .catch((error) => console.error("Error fetching vehicle numbers:", error));

    const savedFormData = sessionStorage.getItem("processOrderFormData");
    if (savedFormData) {
      const parsedData = JSON.parse(savedFormData);
      setFormsaleOrderNo(parsedData.formsaleOrderNo || "");
      setFormProductName(parsedData.formProductName || "");
      setFormCustomerName(parsedData.formCustomerName || "");
      setFormCustomerAddress(parsedData.formCustomerAddress || "");
      setProductType(parsedData.productType || "");
      setVehicleNo(parsedData.vehicleNo || "");
      setTransporterName(parsedData.transporterName || "");
      setBalance(parsedData.balance || 0);
      setlumpsBalance(parsedData.lumpsbalance || 0);
      setfinesBalance(parsedData.finesbalance || 0);
      sessionStorage.removeItem("processOrderFormData");
    }
  }, []);

  useEffect(() => {
    if (vehicleNo) {
      fetch(`http://localhost:8080/api/v1/vehicles/${vehicleNo.value}`)
        .then((response) => response.json())
        .then((data) => {
          setTransporters(data.transporter);
        })
        .catch((error) => console.error("Error fetching transporter details:", error));
    }
  }, [vehicleNo]);

  useEffect(() => {
    if (formProductName) {
      fetch(`http://localhost:8080/api/v1/products/${encodeURIComponent(formProductName)}/types`)
        .then((response) => response.json())
        .then((data) => {
          setProductTypes(data);
        })
        .catch((error) => console.error("Error fetching product types:", error));
    } else {
      setProductTypes([]);
    }
  }, [formProductName]);

  const handleClear = () => {
    setProductType("");
    setVehicleNo("");
    setTransporterName("");
  };

  const handleAddTransporter = () => {
        navigate("/SalesTransporter")
  }

  const handleAddVehicle = () => {
    sessionStorage.setItem(
      "processOrderFormData",
      JSON.stringify({
        formsaleOrderNo,
        formProductName,
        formCustomerName,
        formCustomerAddress,
        productType,
        vehicleNo,
        transporterName,
        balance,
        lumpsbalance,
        finesbalance
      })
    );
    navigate("/SalesVehicle");
  };

  const handleSave = () => {
    if (!formsaleOrderNo || !formProductName || !vehicleNo || !transporterName) {
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

    if (productType === "Lumps" && lumpsbalance < 60) {
      showLowBalanceWarning('Lumps', lumpsbalance);
    } else if (productType === "Fines" && finesbalance < 60) {
      showLowBalanceWarning('Fines', finesbalance);
    } else if (balance < 60) {
      showLowBalanceWarning('Total', balance);
    } else {
      saveSalesPass();
    }
  };

  const showLowBalanceWarning = (type, currentBalance) => {
    Swal.fire({
      title: `Low ${type} Balance Quantity`,
      html: `The current ${type.toLowerCase()} balance quantity is <strong>${currentBalance}</strong>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Use Existing',
      cancelButtonText: 'Create New',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        saveSalesPass();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        showCreateNewOrderOptions();
      }
    });
  };

  const showCreateNewOrderOptions = () => {
    Swal.fire({
      title: 'Create New Order',
      text: 'Choose an option',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Follow On',
      cancelButtonText: 'New Order',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        fetchFollowOnOrders();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        createNewOrder();  
      }
    });
  };

  const createNewOrder = () => {
    const salesProcessData = {
      saleOrderNo: formsaleOrderNo,
      productName: formProductName,
      productType,
      vehicleNo: vehicleNo.value,
      transporterName,
    };
  
    fetch("http://localhost:8080/api/v1/salesProcess/salesProcess?checkSales=newSaleOrder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(salesProcessData),
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
        console.log("New order created:", data);
        Swal.fire({
          title: "New order sales pass created successfully",
          icon: "success",
          confirmButtonText: "OK",
        });
        handleClear();
        navigate("/sales-dashboard");
      })
      .catch((error) => {
        console.error("Error creating new order:", error);
        Swal.fire({
          title: "Error",
          text: error.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  };

  const fetchFollowOnOrders = () => {
    const queryParams = new URLSearchParams({
      customerName: formCustomerName,
      customerAddress: formCustomerAddress,
      productName: formProductName,
      saleOrder: formsaleOrderNo,
      productType: productType
    });

    fetch(`http://localhost:8080/api/v1/sales/saleOrderList?${queryParams}`)
      .then(response => response.json())
      .then(data => {
        setFollowOnOrders(data);
        setIsFollowOnModalVisible(true);
      })
      .catch(error => {
        console.error('Error fetching follow-on orders:', error);
        Swal.fire('Error', 'Failed to fetch follow-on orders', 'error');
      });
  };

  const handleFollowOnOrderSelect = (value) => {
    setSelectedFollowOnOrder(value);
  };

  const saveSalesPass = () => {
    const salesProcessData = {
      saleOrderNo: formsaleOrderNo,
      productName: formProductName,
      productType,
      vehicleNo: vehicleNo.value,
      transporterName,
    };
  
    let apiUrl = "http://localhost:8080/api/v1/salesProcess/salesProcess";
    if (selectedFollowOnOrder) {
      apiUrl += `?saleOrder=${selectedFollowOnOrder}`;
    }
  
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(salesProcessData),
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
          title: "Sales pass created successfully",
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "btn btn-success",
          },
        });
        handleClear();
        sessionStorage.removeItem("processOrderFormData");
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

  const handleFollowOnModalOk = () => {
    if (selectedFollowOnOrder) {
      setIsFollowOnModalVisible(false);
      saveSalesPass();
    } else {
      Swal.fire('Warning', 'Please select a follow-on order', 'warning');
    }
  };

  const handleFollowOnModalCancel = () => {
    setIsFollowOnModalVisible(false);
    setSelectedFollowOnOrder(null);
  };

  return (
    <SideBar6>
      <div className="sales-process-management container-fluid">
        <div className="sales-process-main-content">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="text-center mx-auto">Create Sales Pass</h2>
            <Link to={"/sales-dashboard"}>
              <FontAwesomeIcon
                icon={faHome}
                style={{ float: "right", fontSize: "1.5em" }}
                className="mb-2"
              />
            </Link>
          </div>
          <div className="sales-process-card-container">
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
                  <div className="row mb-3 border border-1 border-black p-2 bg-body-secondary font-monospace">
                      <strong className="col-md-4">Balance: {balance}</strong>
                      <strong className="col-md-4">Lumps-Balance: {lumpsbalance}</strong>
                      <strong className="col-md-4">Fines-Balance: {finesbalance}</strong>
                  </div>
                  <div className="row mb-2">
                    <div className="col-md-4">
                      <label
                        htmlFor="purchaseOrderNo"
                        className="form-label"
                      >
                        Sales Order No{" "}
                        <span
                          style={{
                            color: "red",
                            fontWeight: "bold",
                          }}
                        >
                          *
                        </span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="saleOrderNo"
                        placeholder="Enter Sales Order No"
                        value={formsaleOrderNo}
                        onChange={(e) =>
                          setFormsaleOrderNo(e.target.value)
                        }
                        required
                        disabled
                      />
                    </div>
                    <div className="col-md-4">
                      <label
                        htmlFor="productName"
                        className="form-label"
                      >
                        Product Name{" "}
                        <span
                          style={{
                            color: "red",
                            fontWeight: "bold",
                          }}
                        >
                          *
                        </span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="productName"
                        placeholder="Enter Product Name"
                        value={formProductName}
                        onChange={(e) =>
                          setFormProductName(e.target.value)
                        }
                        required
                        disabled
                      />
                    </div>
                    <div className="col-md-4">
                      <label
                        htmlFor="productType"
                        className="form-label"
                      >
                        Product Type
                      </label>
                      <select
                        className="form-select"
                        id="productType"
                        value={productType}
                        required
                        onChange={(e) =>
                          setProductType(e.target.value)
                        }
                        disabled={!productTypes.length}
                      >
                        <option value="">Select Product Type</option>
                        {productTypes.map((type, index) => (
                          <option key={index} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-md-6">
                      <label htmlFor="vehicleNo" className="form-label">
                      Vehicle No{" "}
                        <span
                          style={{
                            color: "red",
                            fontWeight: "bold",
                          }}
                        >
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
                          onClick={handleAddVehicle}
                          style={{
                            display: "block",
                            textDecoration: "none",
                            color: "black",
                          }}
                        >
                          Add <FontAwesomeIcon icon={faTruck} />
                        </div>
                      </button>
                      <Select
                        options={vehicleNumbers}
                        value={vehicleNo}
                        onChange={setVehicleNo}
                        id="vehicleNo"
                        placeholder="Select Vehicle No"
                        isSearchable
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label
                        htmlFor="transporterName"
                        className="form-label"
                      >
                        Transporter Name{" "}
                        <span
                          style={{
                            color: "red",
                            fontWeight: "bold",
                          }}
                        >
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
                      <select
                        className="form-select"
                        id="transporterName"
                        value={transporterName}
                        onChange={(e) =>
                          setTransporterName(e.target.value)
                        }
                        required
                      >
                        <option value="">Select Transporter Name</option>
                        {transporters.map((transporter, index) => (
                          <option key={index} value={transporter}>
                            {transporter}
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
                      <FontAwesomeIcon
                        icon={faEraser}
                        className="me-1"
                      />
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
                      <FontAwesomeIcon
                        icon={faSave}
                        className="me-1"
                      />
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
  title="Select Follow-on Order"
  open={isFollowOnModalVisible}
  onOk={handleFollowOnModalOk}
  onCancel={handleFollowOnModalCancel}
>
  <AntSelect
    style={{ width: "100%" }}
    placeholder="Select a follow-on order"
    onChange={handleFollowOnOrderSelect}
    value={selectedFollowOnOrder}
  >
    {followOnOrders.map((order) => (
      <Option
        key={order.saleOrderNo}
        value={order.saleOrderNo}
      >
        {order.saleOrderNo} - Balance: {order.balanceQuantity}
        {productType === "Lumps" && ` - Lumps Balance: ${order.lumps}`}
        {productType === "Fines" && ` - Fines Balance: ${order.fines}`}
      </Option>
    ))}
  </AntSelect>
</Modal>

    </SideBar6>
  );
}

export default ProcessOrder;