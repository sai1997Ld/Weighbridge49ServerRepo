import { useState, useEffect } from "react";
import { Table, Button, Input, Tag, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faUserCheck,
  faUserXmark,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import SideBar from "../../SideBar/SideBar";
import "./ViewCustomer.css";
import { Link } from "react-router-dom";

const { Search } = Input;

const ViewCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [customerIdFilter, setCustomerIdFilter] = useState("");
  const navigate = useNavigate();

  const fetchCustomerData = async () => {
    try {
      const response = await fetch("http://49.249.180.125:8080/api/v1/customers");
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const fetchCustomerById = async () => {
    try {
      if (customerIdFilter.trim() === "") {
        fetchCustomerData(); // Fetch all customers if search field is empty
        return;
      }
      const response = await fetch(
        `http://49.249.180.125:8080/api/v1/customers/get/id/${customerIdFilter}`
      );
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(
          errorResponse.message || "Failed to fetch customer data"
        );
      }
      const customerData = await response.json();
      setCustomers([customerData]); // Update customers state with fetched customer data
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleEdit = (customer) => {
    navigate("/update-customer", { state: customer });
  };

  const handleActivate = async (customerId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to activate this customer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, activate it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `http://49.249.180.125:8080/api/v1/customers/active/${customerId}`,
            {
              method: "PUT",
            }
          );
          if (response.ok) {
            Swal.fire("Activated!", "The customer is active now.", "success");
            fetchCustomerData();
          } else {
            Swal.fire("Failed", "Failed to activate customer", "error");
          }
        } catch (error) {
          Swal.fire(
            "Error",
            "An error occurred while activating the customer.",
            "error"
          );
          console.error("Error activating customer:", error);
        }
      }
    });
  };

  const handleDeactivate = async (customerId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to deactivate this customer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, deactivate it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `http://49.249.180.125:8080/api/v1/customers/delete/${customerId}`,
            {
              method: "DELETE",
            }
          );
          if (response.ok) {
            Swal.fire(
              "Deactivated!",
              "The customer is inactive now.",
              "success"
            );
            fetchCustomerData();
          } else {
            Swal.fire("Failed", "Failed to deactivate customer", "error");
          }
        } catch (error) {
          Swal.fire(
            "Error",
            "An error occurred while deactivating the customer.",
            "error"
          );
          console.error("Error deactivating customer:", error);
        }
      }
    });
  };

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "customerId",
      key: "customerId",
    },
    {
      title: "Name",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Email",
      dataIndex: "customerEmail",
      key: "customerEmail",
    },
    {
      title: "Contact No",
      dataIndex: "customerContactNo",
      key: "customerContactNo",
    },
    {
      title: "Address Line 1",
      dataIndex: "customerAddressLine1",
      key: "customerAddressLine1",
    },
    {
      title: "Address Line 2",
      dataIndex: "customerAddressLine2",
      key: "customerAddressLine2",
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
    },
    {
      title: "ZIP",
      dataIndex: "zip",
      key: "zip",
    },
    {
      title: "Status",
      dataIndex: "customerStatus",
      key: "customerStatus",
      filters: [
        { text: "Active", value: "ACTIVE" },
        { text: "Inactive", value: "INACTIVE" },
      ],
      onFilter: (value, record) => record.customerStatus === value,
      render: (text) => (
        <Tag color={text === "ACTIVE" ? "green" : "red"}>{text}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div className="action-buttons">
          {record.customerStatus === "ACTIVE" ? (
            <>
              <Tooltip title="Delete">
                <Button
                  onClick={() => handleDeactivate(record.customerId)}
                  style={{ marginRight: "8px" }}
                >
                  <FontAwesomeIcon
                    icon={faUserXmark}
                    style={{ color: "red" }}
                    className="action-icon"
                  />
                </Button>
              </Tooltip>
              <Tooltip title="Edit">
                <Button onClick={() => handleEdit(record)}>
                  <FontAwesomeIcon
                    icon={faPencilAlt}
                    style={{ color: "orange" }}
                    className="action-icon"
                  />
                </Button>
              </Tooltip>
            </>
          ) : (
            <Button onClick={() => handleActivate(record.customerId)}>
              <FontAwesomeIcon
                icon={faUserCheck}
                style={{ color: "green" }}
                className="action-icon"
              />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <SideBar>
      <div className="view-customer-page container-fluid">
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="text-center mx-auto">Manage Customer</h2>
          <Link to={"/admin-dashboard"}>
            <FontAwesomeIcon
              icon={faHome}
              style={{ float: "right", fontSize: "1.5em" }}
              className="mb-2"
            />
          </Link>
        </div>
        <div className="filters">
          <Search
            placeholder="Search Customer ID"
            value={customerIdFilter}
            onChange={(e) => setCustomerIdFilter(e.target.value)}
            style={{ width: 200 }}
            onSearch={fetchCustomerById}
          />
        </div>
        <div className="table-responsive">
          <Table
            dataSource={customers}
            columns={columns}
            rowKey="customerId"
            className="user-table mt-3 custom-table"
          />
        </div>
      </div>
    </SideBar>
  );
};

export default ViewCustomer;
