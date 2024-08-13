import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import SideBar from "../../SideBar/SideBar";
import "./SiteManagement.css";
import { faSave, faEraser, faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from "react-select";
import { Link } from "react-router-dom";

function SiteManagement() {
  const [companyName, setCompanyName] = useState("");
  const [siteName, setSiteName] = useState("");
  const [siteAddress, setSiteAddress] = useState("");
  const [companies, setCompanies] = useState([]);

  const userId = sessionStorage.getItem("userId");
  const handleClear = () => {
    setCompanyName("");
    setSiteName("");
    setSiteAddress("");
  };

  useEffect(() => {
    fetch("http://49.249.180.125:8080/api/v1/company")
      .then((response) => response.json())
      .then((data) => setCompanies(data))
      .catch((error) => console.error("Error fetching companies:", error));
  }, []);

  const handleSave = () => {
    if (
      companyName.trim() === "" ||
      siteName.trim() === "" ||
      siteAddress.trim() === ""
    ) {
      Swal.fire({
        title: "Please fill in all fields.",
        icon: "warning",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "btn btn-warning",
        },
      });
      return;
    }

    const siteData = {
      companyName,
      siteName,
      siteAddress,
    };

    fetch(`http://49.249.180.125:8080/api/v1/sites?userId=${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(siteData),
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
        // console.log("Response from the API:", data);
        Swal.fire({
          title: data,
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "btn btn-success",
          },
        });
        setCompanyName("");
        setSiteName("");
        setSiteAddress("");
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
      <div className="site-management">
        <div className="site-management-main-content container-fluid">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="text-center mx-auto">Site Registration</h2>
            <Link to={"/admin-dashboard"}>
              <FontAwesomeIcon
                icon={faHome}
                style={{ float: "right", fontSize: "1.5em" }}
                className="mb-2"
              />
            </Link>
          </div>
          <div className="site-container d-flex justify-content-center">
            <div
              className="site-card-container card d-flex justify-content-center"
              style={{
                boxShadow:
                  "0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)",
                width: "500px",
              }}
            >
              <div className="card-body p-4">
                <form>
  <p style={{ color: "red", justifyContent: "center" , display: "flex" }}>
                      Please fill all * marked fields.
                    </p>
                  <div className="row mb-3 justify-content-center">
                    <div className="col-md-8">
                      <label htmlFor="companyName" className="form-label">
                        Company Name{" "}
                        <span style={{ color: "red", fontWeight: "bold" }}>
                          *
                        </span>
                      </label>
                      <Select
                        options={companies.map((company) => ({
                          value: company.companyName,
                          label: company.companyName,
                        }))}
                        value={
                          companyName
                            ? { value: companyName, label: companyName }
                            : null
                        }
                        onChange={(selectedOption) =>
                          setCompanyName(
                            selectedOption ? selectedOption.value : ""
                          )
                        }
                        placeholder="Select a company"
                        isSearchable
                        required
                      />
                    </div>
                  </div>
                  <div className="row mb-3 justify-content-center">
                    <div className="col-md-8">
                      <label htmlFor="siteName" className="form-label">
                        Site Name{" "}
                        <span style={{ color: "red", fontWeight: "bold" }}>
                          *
                        </span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="siteName"
                        placeholder="Enter Site Name"
                        value={siteName}
                        onChange={(e) => setSiteName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="row mb-3 justify-content-center">
                    <div className="col-md-8">
                      <label htmlFor="siteAddress" className="form-label">
                        Site Address{" "}
                        <span style={{ color: "red", fontWeight: "bold" }}>
                          *
                        </span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="siteAddress"
                        placeholder="Enter Site Address"
                        value={siteAddress}
                        onChange={(e) => setSiteAddress(e.target.value)}
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

                        // transition: "transform 0.3s ease-in-out",
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

                        // transition: "transform 0.3s ease-in-out",
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

export default SiteManagement;
