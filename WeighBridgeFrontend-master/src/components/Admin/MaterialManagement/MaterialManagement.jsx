import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "./MaterialManagement.css";
import SideBar from "../../SideBar/SideBar";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faEraser, faHome } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Select from "react-select";

function MaterialManagement() {
  const [supplierName, setSupplierName] = useState("");
  const [supplierAddresses, setSupplierAddresses] = useState([]);
const [selectedAddress, setSelectedAddress] = useState("");
  const [supplierNames, setSupplierNames] = useState([]);
  const [materialName, setMaterialName] = useState("");
  const [materialName2, setMaterialName2] = useState("");
  const [materialTypeName, setMaterialTypeName] = useState("");
  const [materialNames, setMaterialNames] = useState([]);
  const [materialTypeNames, setMaterialTypeNames] = useState([]);
  const [showNameInput, setShowNameInput] = useState(false);
  const [showTypeInput, setShowTypeInput] = useState(false);
  const [userInputName, setUserInputName] = useState("");
  const [userInputType, setUserInputType] = useState("");
  const [parameters, setParameters] = useState([
    { parameterName: "", rangeFrom: 0, rangeTo: 0 },
  ]);

  useEffect(() => {
    fetchMaterialNames();
    fetchSupplierNames("");
  }, []);

  const userId = sessionStorage.getItem("userId");

  const fetchMaterialNames = () => {
    fetch("http://localhost:8080/api/v1/materials/names")
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to fetch material names.");
        }
      })
      .then((data) => {
        setMaterialNames(data);
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

  const fetchMaterialTypeNames = (name) => {
    fetch(`http://localhost:8080/api/v1/materials/${name}/types`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to fetch material types.");
        }
      })
      .then((data) => {
        setMaterialTypeNames(data);
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

  const handleClear = () => {
    setMaterialName("");
    setMaterialTypeName("");
    setMaterialTypeNames([]);
    setShowNameInput(false);
    setShowTypeInput(false);
    setUserInputName("");
    setUserInputType("");
  };

  const handleClear2 = () => {
    setSupplierName("");
    setSupplierAddresses([]);
    setSelectedAddress("");
    setMaterialName2("");
    setParameters([{ parameterName: "", rangeFrom: 0, rangeTo: 0 }]);
  };

  const handleSave = () => {
    let finalMaterialName = materialName;
    let finalMaterialTypeName;

    if (showNameInput && userInputName.trim() !== "") {
      finalMaterialName = userInputName.trim();
    } else if (materialName.trim() === "" || materialTypeName.trim() === "") {
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

    if (showTypeInput && userInputType.trim() !== "") {
      finalMaterialTypeName = userInputType.trim();
    } else if (!showTypeInput && materialTypeName.trim() !== "") {
      finalMaterialTypeName = materialTypeName.trim();
    }

    const materialData = {
      materialName: finalMaterialName,
      materialTypeName: finalMaterialTypeName,
    };

    fetch(`http://localhost:8080/api/v1/materials/withType?userId=${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(materialData),
      credentials: "include",
    })
      .then(async (response) => {
        if (response.ok) {
          return response.text(); // Assume the success response is text
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
        }).then(() => {
          handleClear();
          fetchMaterialNames();
        });
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

  const handleSaveParameters = () => {
    if (
      supplierName.trim() === "" ||
      selectedAddress.trim() === "" ||
      materialName2.trim() === "" ||
      parameters.some((param) => param.parameterName.trim() === "")
    ) {
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

    const materialData = {
      materialName: materialName2.trim(),
      supplierName: supplierName.trim(),
      supplierAddress: selectedAddress.trim(),
      parameters: parameters.map((param) => ({
        parameterName: param.parameterName.trim(),
        rangeFrom: param.rangeFrom,
        rangeTo: param.rangeTo,
      })),
    };

    fetch("http://localhost:8080/api/v1/materials", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(materialData),
      credentials: "include",
    })
      .then(async (response) => {
        if (response.ok) {
          return response.text(); // Assume the success response is text
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
        }).then(() => {
          handleClear2();
          fetchMaterialNames();
          fetchSupplierNames("");
        });
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

  const fetchSupplierNames = () => {
    fetch("http://localhost:8080/api/v1/supplier/get/list")
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to fetch supplier names.");
        }
      })
      .then((data) => {
        setSupplierNames(data);
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
  const fetchSupplierAddress = (supplierName) => {
    fetch(`http://localhost:8080/api/v1/supplier/get/${supplierName}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to fetch supplier address.");
        }
      })
      .then((data) => {
        setSupplierAddresses(data);
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

  useEffect(() => {
    if (supplierName) {
      fetchSupplierAddress(supplierName);
    }
  }, [supplierName]);

  const handleSelectChange = (event) => {
    const { value } = event.target;
    setMaterialName(value);
    setShowNameInput(value === "add a material");
    if (value !== "add a material") {
      fetchMaterialTypeNames(value);
    } else {
      setMaterialTypeNames([]);
      setMaterialTypeName("");
    }
  };

  const handleTypeSelectChange = (event) => {
    const { value } = event.target;
    setMaterialTypeName(value);
    setShowTypeInput(value === "add a type");
  };

  const handleNameInputChange = (event) => {
    setUserInputName(event.target.value);
  };

  const handleTypeInputChange = (event) => {
    setUserInputType(event.target.value);
    setMaterialTypeName(event.target.value);
  };
  const handleParameterChange = (index, event) => {
    const { name, value } = event.target;
    const updatedParameters = [...parameters];
    updatedParameters[index][name] = value;
    setParameters(updatedParameters);
  };

  const handleAddParameter = () => {
    setParameters([
      ...parameters,
      { parameterName: "", rangeFrom: 0, rangeTo: 0 },
    ]);
  };

  const handleRemoveParameter = (index) => {
    const updatedParameters = [...parameters];
    updatedParameters.splice(index, 1);
    setParameters(updatedParameters);
  };

  return (
    <SideBar>
      <div className="material-management">
        <div className="material-management-main-content container-fluid">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="text-center mx-auto">Material Registration</h2>
            <Link to={"/admin-dashboard"}>
              <FontAwesomeIcon
                icon={faHome}
                style={{ float: "right", fontSize: "1.5em" }}
                className="mb-2"
              />
            </Link>
          </div>
          <div
            className="material-card-container-2 card"
            style={{
              boxShadow:
                "0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)",
            }}
          >
            <h6
              className="card-header text-start"
              style={{ backgroundColor: "#0077b6", color: "white" }}
            >
              <strong style={{ fontFamily: "monospace" }}>Add Material</strong>
            </h6>
            <div className="card-body p-4">
              <form>
  <p style={{ color: "red" }}>
                      Please fill all * marked fields.
                    </p>
                <div className="row mb-2">
                  <div className="col-md-6">
                    <label htmlFor="materialName" className="form-label">
                      Material Name{" "}
                      <span style={{ color: "red", fontWeight: "bold" }}>
                        *
                      </span>
                    </label>
                    {showNameInput ? (
                      <input
                        type="text"
                        className="form-control"
                        id="materialName"
                        value={userInputName}
                        onChange={handleNameInputChange}
                        required
                        placeholder="Enter Material Name"
                        autoFocus
                      />
                    ) : (
                      <select
                        className="form-select"
                        id="materialName"
                        value={materialName}
                        onChange={handleSelectChange}
                        required
                      >
                        <option value="">Select Material Name</option>
                        {materialNames.map((name, index) => (
                          <option key={index} value={name}>
                            {name}
                          </option>
                        ))}
                        <option value="add a material">Add Material</option>
                      </select>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="materialTypeName" className="form-label">
                      Material Type{" "}
                    </label>
                    {showTypeInput ? (
                      <input
                        type="text"
                        className="form-control"
                        id="materialTypeName"
                        value={userInputType}
                        onChange={handleTypeInputChange}
                        placeholder="Enter Material Type"
                        autoFocus
                      />
                    ) : (
                      <div>
                        {materialTypeNames.length > 0 ? (
                          <select
                            className="form-select"
                            id="materialTypeName"
                            value={materialTypeName}
                            onChange={handleTypeSelectChange}
                          >
                            <option value="">Select Material Type</option>
                            {materialTypeNames.map((type, index) => (
                              <option key={index} value={type}>
                                {type}
                              </option>
                            ))}
                            <option value="add a type">Add Type</option>
                          </select>
                        ) : (
                          <input
                            type="text"
                            className="form-control"
                            id="materialTypeName"
                            value={userInputType}
                            onChange={handleTypeInputChange}
                          />
                        )}
                      </div>
                    )}
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
                      width: "100px",
                      border: "1px solid #cccccc",
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
          <div
            className="material-card-container card mt-5"
            style={{
              boxShadow:
                "0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)",
            }}
          >
            <h6
              className="card-header text-start"
              style={{ backgroundColor: "#0077b6", color: "white" }}
            >
              <strong style={{ fontFamily: "monospace" }}>Add Parameter</strong>
            </h6>
            <div className="card-body p-4">
              <form>
  <p style={{ color: "red" }}>
                      Please fill all * marked fields.
                    </p>
                <div className="row mb-2">
                  <div className="col-md-4">
                    <label htmlFor="supplierName" className="form-label">
                      Supplier Name{" "}
                      <span style={{ color: "red", fontWeight: "bold" }}>
                        *
                      </span>
                    </label>
                    <Select
                      id="supplierName"
                      value={
                        supplierName
                          ? { value: supplierName, label: supplierName }
                          : null
                      }
                      onChange={(selectedOption) =>
                        setSupplierName(selectedOption.label)
                      } // use label
                      options={supplierNames.map((name) => ({
                        value: name,
                        label: name,
                      }))}
                      isSearchable
                      isRequired
                      placeholder="Select Supplier Name"
                    />
                  </div>
                  <div className="col-md-4">
  <label htmlFor="supplierAddress" className="form-label">
    Supplier Address{" "}
    <span style={{ color: "red", fontWeight: "bold" }}>*</span>
  </label>
  <Select
  id="supplierAddress"
  value={
    selectedAddress
      ? { value: selectedAddress, label: selectedAddress }
      : null
  }
  onChange={(selectedOption) => setSelectedAddress(selectedOption ? selectedOption.value : "")}
  options={supplierAddresses.map((address) => ({
    value: address,
    label: address,
  }))}
  isSearchable
  isRequired
  placeholder="Select Supplier Address"
/>
</div>  
                  <div className="col-md-4">
                    <label htmlFor="materialName" className="form-label">
                      Material Name{" "}
                      <span style={{ color: "red", fontWeight: "bold" }}>
                        *
                      </span>
                    </label>
                    {showNameInput ? (
                      <input
                        type="text"
                        className="form-control"
                        id="materialName"
                        value={userInputName}
                        onChange={handleNameInputChange}
                        required
                        placeholder="Enter Material Name"
                        autoFocus
                      />
                    ) : (
                      <select
                        className="form-select"
                        id="materialName2"
                        value={materialName2}
                        onChange={(e) => setMaterialName2(e.target.value)}
                        required
                      >
                        <option value="">Select Material Name</option>
                        {materialNames.map((name, index) => (
                          <option key={index} value={name}>
                            {name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
                {/* <div className="row mb-2">
                  
                  <div className="col-md-6">
                    <label htmlFor="materialTypeName" className="form-label">
                      Material Type{" "}
                    </label>
                    {showTypeInput ? (
                      <input
                        type="text"
                        className="form-control"
                        id="materialTypeName"
                        value={userInputType}
                        onChange={handleTypeInputChange}
                        placeholder="Enter Material Type"
                        autoFocus
                      />
                    ) : (
                      <div>
                        {materialTypeNames.length > 0 ? (
                          <select
                            className="form-select"
                            id="materialTypeName"
                            value={materialTypeName}
                            onChange={handleTypeSelectChange}
                          >
                            <option value="">Select Material Type</option>
                            {materialTypeNames.map((type, index) => (
                              <option key={index} value={type}>
                                {type}
                              </option>
                            ))}
                            <option value="add a type">Add Type</option>
                          </select>
                        ) : (
                          <input
                            type="text"
                            className="form-control"
                            id="materialTypeName"
                            value={userInputType}
                            onChange={handleTypeInputChange}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div> */}
                {parameters.map((parameter, index) => (
                  <div className="row mb-2" key={index}>
                    <div className="col-md-4">
                      <label
                        htmlFor={`parameterName${index}`}
                        className="form-label"
                      >
                        Parameter Name{" "}
                        <span style={{ color: "red", fontWeight: "bold" }}>
                          *
                        </span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id={`parameterName${index}`}
                        name="parameterName"
                        value={parameter.parameterName}
                        onChange={(e) => handleParameterChange(index, e)}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label
                        htmlFor={`rangeFrom${index}`}
                        className="form-label"
                      >
                        Min{" "}
                        <span style={{ color: "red", fontWeight: "bold" }}>
                          *
                        </span>
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id={`rangeFrom${index}`}
                        name="rangeFrom"
                        value={parameter.rangeFrom}
                        onChange={(e) => {
                          const newValue = Math.max(
                            0,
                            parseFloat(e.target.value, 10)
                          );
                          setParameters(
                            parameters.map((param, i) =>
                              i === index
                                ? { ...param, rangeFrom: newValue }
                                : param
                            )
                          );
                        }}
                        required
                      />
                    </div>
                    <div className="col-md-3">
                      <label htmlFor={`rangeTo${index}`} className="form-label">
                        Max{" "}
                        <span style={{ color: "red", fontWeight: "bold" }}>
                          *
                        </span>
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id={`rangeTo${index}`}
                        name="rangeTo"
                        value={parameter.rangeTo}
                        onChange={(e) => {
                          const newValue = Math.max(
                            0,
                            parseFloat(e.target.value, 10)
                          );
                          setParameters(
                            parameters.map((param, i) =>
                              i === index
                                ? { ...param, rangeTo: newValue }
                                : param
                            )
                          );
                        }}
                        required
                      />
                    </div>
                    <div className="col-md-1 d-flex align-items-center">
                      {index > 0 && (
                        <RemoveIcon
                          style={{ cursor: "pointer", color: "red" }}
                          onClick={() => handleRemoveParameter(index)}
                        />
                      )}
                      <AddIcon
                        style={{
                          cursor: "pointer",
                          marginLeft: "0.5rem",
                          color: "green",
                        }}
                        onClick={handleAddParameter}
                      />
                    </div>
                  </div>
                ))}
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
                    onClick={handleClear2}
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
                      width: "100px",
                      border: "1px solid #cccccc",
                    }}
                    onClick={handleSaveParameters}
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
    </SideBar>
  );
}

export default MaterialManagement;
