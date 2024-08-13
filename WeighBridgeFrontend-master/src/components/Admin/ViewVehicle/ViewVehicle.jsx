import { useState, useEffect } from "react";
import { Table, Input, Button, Tooltip, Tag, Pagination } from "antd";
import SideBar from "../../SideBar/SideBar";
import "./ViewVehicle.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUserCheck,
  faUserXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const { Search } = Input;

const ViewVehicle = () => {
  const [vehicles, setVehicles] = useState([]);
  const [vehicleNoFilter, setVehicleNoFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchVehicles();
  }, [currentPage, pageSize]);

  const fetchVehicles = async () => {
    try {
      const response = await fetch(
        `http://49.249.180.125:8080/api/v1/vehicles?page=${
          currentPage - 1
        }&size=${pageSize}`
      );
      const data = await response.json();
      setVehicles(data.transactions);
      setTotalElements(data.totalElements);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  const fetchVehicleByNo = async () => {
    try {
      if (vehicleNoFilter.trim() === "") {
        fetchVehicles();
        return;
      }
      const response = await fetch(
        `http://49.249.180.125:8080/api/v1/vehicles/${vehicleNoFilter}`
      );
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(
          errorResponse.message || "Failed to fetch vehicle data"
        );
      }
      const vehicleData = await response.json();
      setVehicles([vehicleData]);
      setTotalElements(1);
      setTotalPages(1);
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  
  const handleActivate = async (vehicleId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to activate this vehicle.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, activate it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `http://49.249.180.125:8080/api/v1/vehicles/${vehicleId}/activate`,
            {
              method: "PUT",
            }
          );
          if (response.ok) {
            Swal.fire("Activated!", "The vehicle is active now.", "success");
            fetchVehicles();
          } else {
            Swal.fire("Failed", "Failed to activate vehicle", "error");
          }
        } catch (error) {
          Swal.fire(
            "Error",
            "An error occurred while activating the vehicle.",
            "error"
          );
          console.error("Error activating vehicle:", error);
        }
      }
    });
  };

  const handleDeactivate = async (vehicleId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to deactivate this vehicle.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, deactivate it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `http://49.249.180.125:8080/api/v1/vehicles/${vehicleId}/deactivate`,
            {
              method: "DELETE",
            }
          );
          if (response.ok) {
            Swal.fire(
              "Deactivated!",
              "The vehicle is inactive now.",
              "success"
            );
            fetchVehicles();
          } else {
            Swal.fire("Failed", "Failed to deactivate vehicle", "error");
          }
        } catch (error) {
          Swal.fire(
            "Error",
            "An error occurred while deactivating the vehicle.",
            "error"
          );
          console.error("Error deactivating vehicle:", error);
        }
      }
    });
  };


  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const columns = [
    {
      title: "Vehicle Number",
      dataIndex: "vehicleNo",
      key: "vehicleNo",
    },
    {
      title: "Transporter",
      dataIndex: "transporter",
      key: "transporter",
      render: (transporter) => (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {transporter.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ),
    },
    {
      title: "Vehicle Type",
      dataIndex: "vehicleType",
      key: "vehicleType",
    },
    {
      title: "Vehicle Manufacturer",
      dataIndex: "vehicleManufacturer",
      key: "vehicleManufacturer",
    },
    {
      title: "Load Capacity",
      dataIndex: "loadCapacity",
      key: "loadCapacity",
    },
    {
      title: "Fitness Up to",
      dataIndex: "fitnessUpto",
      key: "fitnessUpto",
    },
    {
      title: "Vehicle Status",
      dataIndex: "vehicleStatus",
      key: "vehicleStatus",
      render: (text) => (
        <Tag color={text === "ACTIVE" ? "green" : "red"}>{text}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div className="action-buttons">
          {record.vehicleStatus === "ACTIVE" ? (
            <>
              <Tooltip title="Deactivate">
                <Button
                  onClick={() => handleDeactivate(record.id)}
                  style={{ marginRight: "8px" }}
                >
                  <FontAwesomeIcon
                    icon={faUserXmark}
                    style={{ color: "red" }}
                    className="action-icon delete-icon"
                  />
                </Button>
              </Tooltip>
            </>
          ) : (
            <Tooltip title="Activate">
              <Button onClick={() => handleActivate(record.id)}>
                <FontAwesomeIcon
                  icon={faUserCheck}
                  style={{ color: "green" }}
                  className="action-icon activate-icon"
                />
              </Button>
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  return (
    <SideBar>
      <div className="view-vehicle-page container-fluid">
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="text-center mx-auto">View Vehicle</h2>
          <Link to={"/admin-dashboard"}>
            <FontAwesomeIcon
              icon={faHome}
              style={{ float: "right", fontSize: "1.5em" }}
              className="mb-2"
            />
          </Link>
        </div>
        <div className="filters d-flex justify-content-between gap-2">
          <Search
            placeholder="Search Vehicle Number"
            value={vehicleNoFilter}
            onChange={(e) => setVehicleNoFilter(e.target.value)}
            style={{ width: 200 }}
            onSearch={fetchVehicleByNo}
          />
        </div>
        <div className="table-responsive">
          <Table
            dataSource={vehicles}
            columns={columns}
            rowKey="id"
            className="user-table mt-3 custom-table"
            pagination={false}
          />
        </div>
        <div className="pagination-container d-flex justify-content-center mt-3 flex-wrap">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalElements}
            showSizeChanger
            showQuickJumper
            onChange={handlePageChange}
            showTotal={(total, range) =>
              `Showing ${range[0]}-${range[1]} of ${total}`
            }
          />
        </div>
      </div>
    </SideBar>
  );
};

export default ViewVehicle;