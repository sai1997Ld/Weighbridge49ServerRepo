import { useState, useEffect } from "react";
import { Table, Button, Input, Tag, Tooltip } from "antd";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faUserCheck,
  faUserXmark,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import SideBar from "../../SideBar/SideBar";
import "./ViewSupplier.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const { Search } = Input;

const ViewSupplier = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [supplierIdFilter, setSupplierIdFilter] = useState("");
  const navigate = useNavigate();

  const fetchSupplierData = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/supplier");
      const data = await response.json();
      setSuppliers(data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  const fetchSupplierById = async () => {
    try {
      if (supplierIdFilter.trim() === "") {
        fetchSupplierData(); // Fetch all suppliers if search field is empty
        return;
      }
      const response = await fetch(
        `http://localhost:8080/api/v1/supplier/get/id/${supplierIdFilter}`
      );
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(
          errorResponse.message || "Failed to fetch supplier data"
        );
      }
      const supplierData = await response.json();
      setSuppliers([supplierData]); // Update suppliers state with fetched supplier data
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleEdit = (supplier) => {
    navigate("/update-supplier", { state: supplier });
  };

  const handleActivate = async (supplierId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to activate this supplier.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, activate it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `http://localhost:8080/api/v1/supplier/active/${supplierId}`,
            {
              method: "PUT",
            }
          );
          if (response.ok) {
            Swal.fire("Activated!", "The supplier is active now.", "success");
            fetchSupplierData();
          } else {
            Swal.fire("Failed", "Failed to activate supplier", "error");
          }
        } catch (error) {
          Swal.fire(
            "Error",
            "An error occurred while activating the supplier.",
            "error"
          );
          console.error("Error activating supplier:", error);
        }
      }
    });
  };

  const handleDeactivate = async (supplierId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to deactivate this supplier.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, deactivate it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `http://localhost:8080/api/v1/supplier/delete/${supplierId}`,
            {
              method: "DELETE",
            }
          );
          if (response.ok) {
            Swal.fire(
              "Deactivated!",
              "The supplier is inactive now.",
              "success"
            );
            fetchSupplierData();
          } else {
            Swal.fire("Failed", "Failed to deactivate supplier", "error");
          }
        } catch (error) {
          Swal.fire(
            "Error",
            "An error occurred while deactivating the supplier.",
            "error"
          );
          console.error("Error deactivating supplier:", error);
        }
      }
    });
  };

  useEffect(() => {
    fetchSupplierData();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "supplierId",
      key: "supplierId",
    },
    {
      title: "Name",
      dataIndex: "supplierName",
      key: "supplierName",
    },
    {
      title: "Email",
      dataIndex: "supplierEmail",
      key: "supplierEmail",
    },
    {
      title: "Contact No",
      dataIndex: "supplierContactNo",
      key: "supplierContactNo",
    },
    {
      title: "Address Line 1",
      dataIndex: "supplierAddressLine1",
      key: "supplierAddressLine1",
    },
    {
      title: "Address Line 2",
      dataIndex: "supplierAddressLine2",
      key: "supplierAddressLine2",
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
      dataIndex: "supplierStatus",
      key: "supplierStatus",
      filters: [
        { text: "Active", value: "ACTIVE" },
        { text: "Inactive", value: "INACTIVE" },
      ],
      onFilter: (value, record) => record.supplierStatus === value,
      render: (text) => (
        <Tag color={text === "ACTIVE" ? "green" : "red"}>{text}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div className="action-buttons">
          {record.supplierStatus === "ACTIVE" ? (
            <>
              <Tooltip title="Delete">
                <Button
                  onClick={() => handleDeactivate(record.supplierId)}
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
            <Button onClick={() => handleActivate(record.supplierId)}>
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
      <div className="view-supplier-page container-fluid">
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="text-center mx-auto">Manage Supplier</h2>
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
            placeholder="Search Supplier ID"
            value={supplierIdFilter}
            onChange={(e) => setSupplierIdFilter(e.target.value)}
            style={{ width: 200 }}
            onSearch={fetchSupplierById}
          />
        </div>
        <div className="table-responsive">
          <Table
            dataSource={suppliers}
            columns={columns}
            rowKey="supplierId"
            className="user-table mt-3 custom-table"
          />
        </div>
      </div>
    </SideBar>
  );
};

export default ViewSupplier;
