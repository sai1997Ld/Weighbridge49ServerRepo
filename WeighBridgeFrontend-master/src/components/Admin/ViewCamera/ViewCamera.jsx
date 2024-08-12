import { useState, useEffect } from "react";
import { Table, Button, Input, Tooltip } from "antd";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faTrash,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import SideBar from "../../SideBar/SideBar";
import "./ViewCamera.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const { Search } = Input;

const ViewCamera = () => {
  const [cameras, setCameras] = useState([]);
  const [cameraIdFilter, setCameraIdFilter] = useState("");
  const navigate = useNavigate();

  const handleEdit = (camera) => {
    navigate("/CameraMaster", {
      state: { cameraId: camera.cameraId, editMode: true },
    });
  };

  const fetchCameraData = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/camera/getCameraDetails"
      );
      const data = await response.json();
      setCameras(data);
    } catch (error) {
      console.error("Error fetching cameras:", error);
    }
  };

  const fetchCameraById = async () => {
    try {
      if (cameraIdFilter.trim() === "") {
        fetchCameraData(); // Fetch all cameras if search field is empty
        return;
      }
      const response = await fetch(
        `http://localhost:8080/api/v1/camera/getById/${cameraIdFilter}`
      );
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Failed to fetch camera data");
      }
      const cameraData = await response.json();
      setCameras([cameraData]); // Update cameras state with fetched camera data
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleDelete = async (cameraId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this camera.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `http://localhost:8080/api/v1/camera/deleteById/${cameraId}?userId=${sessionStorage.getItem(
              "userId"
            )}`,
            {
              method: "DELETE",
            }
          );
          if (response.ok) {
            Swal.fire("Deleted!", "The camera has been deleted.", "success");
            fetchCameraData();
          } else {
            Swal.fire("Failed", "Failed to delete camera", "error");
          }
        } catch (error) {
          Swal.fire(
            "Error",
            "An error occurred while deleting the camera.",
            "error"
          );
          console.error("Error deleting camera:", error);
        }
      }
    });
  };

  useEffect(() => {
    fetchCameraData();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "cameraId",
      key: "cameraId",
    },
    {
      title: "Company",
      dataIndex: "companyName",
      key: "companyName",
    },
    {
      title: "Site",
      dataIndex: "siteName",
      key: "siteName",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },

    {
      title: "Front",
      dataIndex: "frontCamUrl3",
      key: "frontCamUrl3",
    },
    {
      title: "Back",
      dataIndex: "backCamUrl4",
      key: "backCamUrl4",
    },
    {
      title: "Left",
      dataIndex: "leftCamUrl5",
      key: "leftCamUrl5",
    },
    {
      title: "Right",
      dataIndex: "rightCamUrl6",
      key: "rightCamUrl6",
    },
    {
      title: "Top",
      dataIndex: "topCamUrl1",
      key: "topCamUrl1",
    },
    {
      title: "Bottom",
      dataIndex: "bottomCamUrl2",
      key: "bottomCamUrl2",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div className="action-buttons">
          <Tooltip title="Edit">
            <Button
              onClick={() => handleEdit(record)}
              style={{ marginRight: "8px" }}
            >
              <FontAwesomeIcon
                icon={faPencilAlt}
                style={{ color: "orange" }}
                className="action-icon"
              />
            </Button>
          </Tooltip>
          <Tooltip title="Delete">
            <Button onClick={() => handleDelete(record.cameraId)}>
              <FontAwesomeIcon
                icon={faTrash}
                style={{ color: "red" }}
                className="action-icon"
              />
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <SideBar>
      <div className="view-camera-page container-fluid">
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="text-center mx-auto">Manage Cameras</h2>
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
            placeholder="Search Camera ID"
            value={cameraIdFilter}
            onChange={(e) => setCameraIdFilter(e.target.value)}
            style={{ width: 200 }}
            onSearch={fetchCameraById}
          />
        </div>
        <div className="table-responsive">
          <Table
            dataSource={cameras}
            columns={columns}
            rowKey="cameraId"
            className="camera-table mt-3 custom-table"
          />
        </div>
      </div>
    </SideBar>
  );
};

export default ViewCamera;
