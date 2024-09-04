import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEraser, faSave, faHome, faRectangleXmark } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import Select from "react-select";
import "./CameraMaster.css";
import SideBar from "../../SideBar/SideBar";
import { Link, useLocation, useNavigate } from "react-router-dom";

const CameraMaster = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [cameraId, setCameraId] = useState(null);
  const [company, setCompany] = useState("");
  const [site, setSite] = useState("");
  const [user, setUser] = useState(null);
  const [topCameraUrl, setTopCameraUrl] = useState("");
  const [bottomCameraUrl, setBottomCameraUrl] = useState("");
  const [leftCameraUrl, setLeftCameraUrl] = useState("");
  const [rightCameraUrl, setRightCameraUrl] = useState("");
  const [frontCameraUrl, setFrontCameraUrl] = useState("");
  const [backCameraUrl, setBackCameraUrl] = useState("");
  const [companies, setCompanies] = useState([]);
  const [sites, setSites] = useState([]);

  const userOptions = [
    { value: "GATE_USER", label: "GATE_USER" },
    { value: "WEIGHBRIDGE_OPERATOR", label: "WEIGHBRIDGE_OPERATOR" },
  ];

  useEffect(() => {
    fetchCompanies();
    if (location.state && location.state.editMode) {
      setEditMode(true);
      setCameraId(location.state.cameraId);
      fetchCameraDetails(location.state.cameraId);
    }
  }, [location]);

  const fetchCompanies = () => {
    fetch("http://49.249.180.125:8080/api/v1/company/names")
      .then((response) => response.json())
      .then((data) => {
        console.log("Company List:", data);
        setCompanies(data);
      })
      .catch((error) => {
        console.error("Error fetching company list:", error);
      });
  };

  const fetchCameraDetails = async (id) => {
    try {
      const response = await fetch(
        `http://49.249.180.125:8080/api/v1/camera/getById/${id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch camera details");
      }
      const data = await response.json();
      setCompany(data.companyName);
      setSite(data.siteName);
      setUser({ value: data.role, label: data.role });
      setTopCameraUrl(data.topCamUrl1);
      setBottomCameraUrl(data.bottomCamUrl2);
      setLeftCameraUrl(data.leftCamUrl5);
      setRightCameraUrl(data.RightCamUrl6);
      setFrontCameraUrl(data.frontCamUrl3);
      setBackCameraUrl(data.backCamUrl4);
      fetchSites(data.companyName);
    } catch (error) {
      console.error("Error fetching camera details:", error);
      Swal.fire("Error", "Failed to fetch camera details", "error");
    }
  };

  const handleCompanyChange = (e) => {
    setCompany(e.target.value);
    fetchSites(e.target.value);
  };

  const fetchSites = (companyName) => {
    fetch(`http://49.249.180.125:8080/api/v1/sites/company/${companyName}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Site List:", data);
        const formattedSites = data.map((site) => ({
          site: `${site.siteName}, ${site.siteAddress}`,
        }));
        setSites(formattedSites);
      })
      .catch((error) => {
        console.error("Error fetching site list:", error);
      });
  };

  const handleClear = () => {
    setCompany("");
    setSite("");
    setUser(null);
    setTopCameraUrl("");
    setBottomCameraUrl("");
    setLeftCameraUrl("");
    setRightCameraUrl("");
    setFrontCameraUrl("");
    setBackCameraUrl("");
  };

  const handleSave = () => {
    if (company.trim() === "" || site.trim() === "" || !user) {
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

    const cameraData = {
      companyName: company,
      siteName: site,
      role: user.value,
      topCamUrl1: topCameraUrl,
      bottomCamUrl2: bottomCameraUrl,
      frontCamUrl3: frontCameraUrl,
      backCamUrl4: backCameraUrl,
      leftCamUrl5: leftCameraUrl,
      rightCamUrl6: rightCameraUrl,
    };

    console.log("Payload sent to the API:", cameraData);

    const url = editMode
      ? `http://49.249.180.125:8080/api/v1/camera/updateByCamId/${cameraId}?userId=${sessionStorage.getItem(
          "userId"
        )}`
      : `http://49.249.180.125:8080/api/v1/camera/cameraMaster?userId=${sessionStorage.getItem(
          "userId"
        )}`;

    const method = editMode ? "PUT" : "POST";

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cameraData),
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
          title: data,
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "btn btn-success",
          },
        });
        if (editMode) {
          navigate("/view-camera");
        } else {
          handleClear();
        }
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
      <div className="camera-master">
        <div className="create-main-content container-fluid">
          <>
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="text-center mx-auto">
                {editMode ? "Update Camera" : "Camera Registration"}
              </h2>
              {editMode ? (
                <FontAwesomeIcon
                  icon={faRectangleXmark}
                  style={{ float: "right", fontSize: "1.5em", color: "red", cursor: "pointer" }}
                  onClick={() => navigate(-1)}
                  className="mb-2"
                />
              ) : (
                <Link to={"/admin-dashboard"}>
                  <FontAwesomeIcon
                    icon={faHome}
                    style={{ float: "right", fontSize: "1.5em" }}
                    className="mb-2"
                  />
                </Link>
              )}
            </div>
            <div className="camera-master-container">
              <div
                className="card camera-master-form"
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
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label htmlFor="company" className="form-label">
                          Company Name
                          <span style={{ color: "red", fontWeight: "bold" }}>
                            {" "}
                            *
                          </span>
                        </label>
                        <select
                          className="form-select"
                          id="company"
                          value={company}
                          onChange={handleCompanyChange}
                          required
                        >
                          <option value="">Select Company Name</option>
                          {companies.map((c, index) => (
                            <option key={index} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="site" className="form-label">
                          Site Name
                          <span style={{ color: "red", fontWeight: "bold" }}>
                            {" "}
                            *
                          </span>
                        </label>
                        <select
                          className="form-select"
                          id="site"
                          value={site}
                          onChange={(e) => setSite(e.target.value)}
                          required
                        >
                          <option value="">Select Site Name</option>
                          {sites.map((s, index) => (
                            <option key={index} value={s.site}>
                              {s.site}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="user" className="form-label">
                          User
                          <span style={{ color: "red", fontWeight: "bold" }}>
                            {" "}
                            *
                          </span>
                        </label>
                        <Select
                          value={user}
                          onChange={(selectedOption) => setUser(selectedOption)}
                          options={userOptions}
                          isSearchable
                          placeholder="Select User"
                        />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label htmlFor="topCameraUrl" className="form-label">
                          Top Camera URL
                        </label>
                        <input
                          type="url"
                          className="form-control"
                          id="topCameraUrl"
                          placeholder="Enter Top Camera URL"
                          value={topCameraUrl}
                          onChange={(e) => setTopCameraUrl(e.target.value)}
                        />
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="bottomCameraUrl" className="form-label">
                          Bottom Camera URL
                        </label>
                        <input
                          type="url"
                          className="form-control"
                          id="bottomCameraUrl"
                          placeholder="Enter Bottom Camera URL"
                          value={bottomCameraUrl}
                          onChange={(e) => setBottomCameraUrl(e.target.value)}
                        />
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="leftCameraUrl" className="form-label">
                          Left Camera URL
                        </label>
                        <input
                          type="url"
                          className="form-control"
                          id="leftCameraUrl"
                          placeholder="Enter Left Camera URL"
                          value={leftCameraUrl}
                          onChange={(e) => setLeftCameraUrl(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label htmlFor="rightCameraUrl" className="form-label">
                          Right Camera URL
                        </label>
                        <input
                          type="url"
                          className="form-control"
                          id="rightCameraUrl"
                          placeholder="Enter Right Camera URL"
                          value={rightCameraUrl}
                          onChange={(e) => setRightCameraUrl(e.target.value)}
                        />
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="frontCameraUrl" className="form-label">
                          Front Camera URL
                        </label>
                        <input
                          type="url"
                          className="form-control"
                          id="frontCameraUrl"
                          placeholder="Enter Front Camera URL"
                          value={frontCameraUrl}
                          onChange={(e) => setFrontCameraUrl(e.target.value)}
                        />
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="backCameraUrl" className="form-label">
                          Back Camera URL
                        </label>
                        <input
                          type="url"
                          className="form-control"
                          id="backCameraUrl"
                          placeholder="Enter Back Camera URL"
                          value={backCameraUrl}
                          onChange={(e) => setBackCameraUrl(e.target.value)}
                        />
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
          </>
        </div>
      </div>
    </SideBar>
  );
};

export default CameraMaster;
