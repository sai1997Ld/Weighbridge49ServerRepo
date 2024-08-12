import { useState } from "react";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faEraser, faHome } from "@fortawesome/free-solid-svg-icons";
import SideBar from "../../SideBar/SideBar";
import "./RoleManagement.css";
import { Link } from "react-router-dom";

function RoleManagement() {
  const [roleName, setRoleName] = useState("");

  const handleClear = () => {
    setRoleName("");
  };

  const userId = sessionStorage.getItem("userId");

  const handleSave = () => {
    if (roleName.trim() === "") {
      Swal.fire({
        title: "Please enter a role name.",
        icon: "warning",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "btn btn-warning",
        },
      });
      return;
    }

    const roleData = {
      roleName,
    };

    fetch(`http://localhost:8080/api/v1/roles?userId=${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(roleData),
      credentials: "include",
    })
      .then(async (response) => {
        if (response.ok) {
          return response.text();
        } else {
          const error = await response.json();
          throw new Error(error.message);
        }
      })
      .then((data) => {
        console.log("Response from the API:", data);
        Swal.fire({
          title: "Role created successfully.",
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "btn btn-success",
          },
        });
        setRoleName("");
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

  return (
    <SideBar>
      <div className="role-management">
        <div className="role-management-main-content container-fluid ">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="text-center mx-auto">Role Registration</h2>
            <Link to={"/admin-dashboard"}>
              <FontAwesomeIcon
                icon={faHome}
                style={{ float: "right", fontSize: "1.5em" }}
                className="mb-2"
              />
            </Link>
          </div>
          <div className="role-container d-flex justify-content-center">
            <div
              className="role-card-container card"
              style={{
                boxShadow:
                  "0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)",
                width: "500px",
              }}
            >
              <div className="card-body p-4">
                <form>
  <p style={{ color: "red", justifyContent: "center" , display: "flex"}}>
                      Please fill all * marked fields.
                    </p>
                  <div className="row mb-3 justify-content-center">
                    <div className="col-md-8">
                      <label htmlFor="roleName" className="form-label">
                        Role Name{" "}
                        <span style={{ color: "red", fontWeight: "bold" }}>
                          *
                        </span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="roleName"
                        placeholder="Enter Role Name"
                        value={roleName}
                        onChange={(e) => setRoleName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="d-flex justify-content-center mt-3">
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
                      <FontAwesomeIcon icon={faEraser} className="me-1" />
                      Clear
                    </button>
                    <button
                      type="button"
                      className="btn btn-success-1 btn-hover"
                      style={{
                        backgroundColor: "white",
                        color: "black",

                        border: "1px solid #cccccc",
                        width: "100px",
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
    </SideBar>
  );
}

export default RoleManagement;
