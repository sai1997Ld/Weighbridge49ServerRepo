import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faUserCheck,
  faUserXmark,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import "./ManageUser.css";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Table, Tag, Button, Input, Pagination, Tooltip } from "antd"; // Import Tooltip
import Swal from "sweetalert2";
import SideBar from "../../SideBar/SideBar";
import "antd/dist/reset.css";

const { Column } = Table;
const { Search } = Input;

function ManageUser() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [userIdFilter, setUserIdFilter] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const status = location.state;

  const handleEdit = (user) => {
    navigate("/update-user", { state: user });
  };

  const handleDelete = async (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to inactivate this user.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, inactivate it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `http://localhost:8080/api/v1/users/${userId}/deactivate?user=${sessionStorage.getItem(
              "userId"
            )}`,
            {
              method: "DELETE",
            }
          );
          if (response.ok) {
            Swal.fire("Deactivated!", "The user is inactive now.", "success");
            fetchUserData();
          } else {
            Swal.fire("Failed", "Failed to inactivate user", "error");
          }
        } catch (error) {
          Swal.fire(
            "Error",
            "An error occurred while deleting the user.",
            "error"
          );
          console.error("Error deleting user:", error);
        }
      }
    });
  };

  const handleActivate = async (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to activate this user.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, activate it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `http://localhost:8080/api/v1/users/${userId}/activate?user=${sessionStorage.getItem(
              "userId"
            )}`,
            {
              method: "PUT",
            }
          );
          if (response.ok) {
            Swal.fire("Activated!", "The user is active now.", "success");
            fetchUserData();
          } else {
            Swal.fire("Failed", "Failed to activate user", "error");
          }
        } catch (error) {
          Swal.fire(
            "Error",
            "An error occurred while activating the user.",
            "error"
          );
          console.error("Error activating user:", error);
        }
      }
    });
  };

  const fetchUserData = async () => {
    try {
      let url = `http://localhost:8080/api/v1/users?page=${
        currentPage - 1
      }&size=${pageSize}`;
      if (status) {
        url = `http://localhost:8080/api/v1/users/userStatus?userStatus=${status}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      if (status) {
        setUsers(data);
        setTotalPages(1);
        setTotalElements(data.length);
      } else {
        setUsers(data.users);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchUserById = async () => {
    try {
      if (userIdFilter.trim() === "") {
        fetchUserData();
        return;
      }
      const response = await fetch(
        `http://localhost:8080/api/v1/users/${userIdFilter}`
      );
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Failed to fetch user data");
      }
      const userData = await response.json();
      setUsers([userData]);
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [currentPage, pageSize]);

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  return (
    <SideBar>
      <div className="ViewUser">
        <div className="view-user-content">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="text-center mx-auto">Manage User</h2>
            <Link to={"/admin-dashboard"}>
              <FontAwesomeIcon
                icon={faHome}
                style={{ float: "right", fontSize: "1.5em" }}
                className="mb-2"
              />
            </Link>
          </div>
          <div className="maintain-user-container container-fluid">
            <div className="filters d-flex justify-content-between gap-2">
              <Search
                placeholder="Search User ID"
                value={userIdFilter}
                onChange={(e) => setUserIdFilter(e.target.value)}
                style={{ width: 200 }}
                onSearch={fetchUserById}
              />
            </div>
            <div className="table-responsive">
              <Table
                dataSource={users}
                pagination={false}
                rowKey={(user) => user.userId}
                className="user-table mt-3 custom-table"
              >
                <Column title="User ID" dataIndex="userId" key="userId" />
                <Column
                  title="Username"
                  key="username"
                  render={(text, record) => (
                    <span>
                      {record.firstName}{" "}
                      {record.middleName && record.middleName + " "}
                      {record.lastName}
                    </span>
                  )}
                />
                <Column
                  title="Role"
                  dataIndex="role"
                  key="role"
                  render={(roles) => (
                    <>
                      {roles.map((role) => {
                        let color = "";
                        switch (role) {
                          case "ADMIN":
                            color = "blue";
                            break;
                          case "GATE_USER":
                            color = "green";
                            break;
                          case "WEIGHBRIDGE_OPERATOR":
                            color = "orange";
                            break;
                          case "QUALITY_USER":
                            color = "purple";
                            break;
                          case "MANAGEMENT":
                            color = "cyan";
                            break;
                          case "SALE_USER":
                            color = "geekblue";
                            break;
                          default:
                            color = "default";
                        }
                        return (
                          <Tag color={color} key={role}>
                            {role}
                          </Tag>
                        );
                      })}
                    </>
                  )}
                />
                <Column title="Email" dataIndex="emailId" key="emailId" />
                <Column
                  title="Contact No"
                  dataIndex="contactNo"
                  key="contactNo"
                />
                <Column title="Company" dataIndex="company" key="company" />
                <Column title="Company Site" dataIndex="site" key="site" />
                <Column
                  title="Status"
                  dataIndex="status"
                  key="status"
                  filters={
                    status
                      ? null
                      : [
                          { text: "Active", value: "ACTIVE" },
                          { text: "Inactive", value: "INACTIVE" },
                        ]
                  }
                  onFilter={(value, record) => record.status === value}
                  render={(text) => (
                    <Tag color={text === "ACTIVE" ? "green" : "red"}>
                      {text}
                    </Tag>
                  )}
                />
                <Column
                  title="Action"
                  key="action"
                  render={(text, record) => (
                    <div className="action-buttons">
                      {record.status === "ACTIVE" ? (
                        <>
                          <Tooltip title="Delete">
                            <Button
                              onClick={() => handleDelete(record.userId)}
                              style={{ marginRight: "8px" }}
                            >
                              <FontAwesomeIcon
                                icon={faUserXmark}
                                style={{ color: "red" }}
                                className="action-icon delete-icon"
                              />
                            </Button>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <Button onClick={() => handleEdit(record)}>
                              <FontAwesomeIcon
                                icon={faPencilAlt}
                                style={{ color: "orange" }}
                                className="action-icon activate-icon"
                              />
                            </Button>
                          </Tooltip>
                        </>
                      ) : (
                        <Tooltip title="Activate">
                          <Button onClick={() => handleActivate(record.userId)}>
                            <FontAwesomeIcon
                              icon={faUserCheck}
                              style={{ color: "green" }}
                              className="action-icon activate-icon"
                            />
                          </Button>
                        </Tooltip>
                      )}
                    </div>
                  )}
                />
              </Table>
            </div>
            {!status && (
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
            )}
          </div>
        </div>
      </div>
    </SideBar>
  );
}

export default ManageUser;
