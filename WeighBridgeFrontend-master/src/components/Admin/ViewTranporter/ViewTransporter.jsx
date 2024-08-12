import { useState, useEffect } from "react";
import { Table, Button, Input, Tag, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faTruck,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import SideBar from "../../SideBar/SideBar";
import "./ViewTransporter.css";
import { Link } from "react-router-dom";

const { Search } = Input;

const ViewTransporter = () => {
  const [transporters, setTransporters] = useState([]);
  const [transporterIdFilter, setTransporterIdFilter] = useState("");
  const navigate = useNavigate();

  const fetchTransporterData = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/transporter/details"
      );
      const data = await response.json();
      setTransporters(data);
    } catch (error) {
      console.error("Error fetching transporters:", error);
    }
  };

  const fetchTransporterById = async () => {
    try {
      if (transporterIdFilter.trim() === "") {
        fetchTransporterData(); // Fetch all transporters if search field is empty
        return;
      }
      const response = await fetch(
        `http://localhost:8080/api/v1/transporter/${transporterIdFilter}`
      );
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(
          errorResponse.message || "Failed to fetch transporter data"
        );
      }
      const transporterData = await response.json();
      setTransporters([transporterData]); // Update transporters state with fetched transporter data
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleEdit = (transporter) => {
    navigate("/update-transporter", { state: transporter });
  };

  const handleActivate = async (transporterId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to activate this transporter.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, activate it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `http://localhost:8080/api/v1/transporter/${transporterId}/activate`,
            {
              method: "PUT",
            }
          );
          if (response.ok) {
            Swal.fire(
              "Activated!",
              "The transporter is active now.",
              "success"
            );
            fetchTransporterData();
          } else {
            Swal.fire("Failed", "Failed to activate transporter", "error");
          }
        } catch (error) {
          Swal.fire(
            "Error",
            "An error occurred while activating the transporter.",
            "error"
          );
          console.error("Error activating transporter:", error);
        }
      }
    });
  };

  const handleDeactivate = async (transporterId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to deactivate this transporter.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, deactivate it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `http://localhost:8080/api/v1/transporter/${transporterId}/deactivate`,
            {
              method: "DELETE",
            }
          );
          if (response.ok) {
            Swal.fire(
              "Deactivated!",
              "The transporter is inactive now.",
              "success"
            );
            fetchTransporterData();
          } else {
            Swal.fire("Failed", "Failed to deactivate transporter", "error");
          }
        } catch (error) {
          Swal.fire(
            "Error",
            "An error occurred while deactivating the transporter.",
            "error"
          );
          console.error("Error deactivating transporter:", error);
        }
      }
    });
  };

  useEffect(() => {
    fetchTransporterData();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Transporter Name",
      dataIndex: "transporterName",
      key: "transporterName",
    },
    {
      title: "Email",
      dataIndex: "transporterEmailId",
      key: "transporterEmailId",
    },
    {
      title: "Contact No",
      dataIndex: "transporterContactNo",
      key: "transporterContactNo",
    },
    {
      title: "Address",
      dataIndex: "transporterAddress",
      key: "transporterAddress",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Active", value: "ACTIVE" },
        { text: "Inactive", value: "INACTIVE" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (text) => (
        <Tag color={text === "ACTIVE" ? "green" : "red"}>{text}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div className="action-buttons">
          {record.status === "ACTIVE" ? (
            <>
              <Tooltip title="Delete">
                <Button
                  onClick={() => handleDeactivate(record.id)}
                  style={{ marginRight: "8px" }}
                >
                  <FontAwesomeIcon
                    icon={faTruck}
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
            <Button onClick={() => handleActivate(record.id)}>
              <FontAwesomeIcon
                icon={faTruck}
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
      <div className="view-transporter-page container-fluid">
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="text-center mx-auto">Manage Transporter</h2>
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
            placeholder="Search Transporter ID"
            value={transporterIdFilter}
            onChange={(e) => setTransporterIdFilter(e.target.value)}
            style={{ width: 200 }}
            onSearch={fetchTransporterById}
          />
        </div>
        <div className="table-responsive">
          <Table
            dataSource={transporters}
            columns={columns}
            rowKey="id"
            className="transporter-table mt-3 custom-table"
          />
        </div>
      </div>
    </SideBar>
  );
};

export default ViewTransporter;
