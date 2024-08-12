import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faEraser,
  faRectangleXmark,
} from "@fortawesome/free-solid-svg-icons";
import SideBar3 from "../../../../SideBar/SideBar3";
import { useMediaQuery } from "react-responsive";
import { Chart, ArcElement } from "chart.js/auto";
import styled from "styled-components";
import { Modal } from "antd";

// Import Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";

const MainContent = styled.div`
  min-height: calc(
    100vh - 80vh
  ); /* Adjust the value (56px) as needed for your navbar height */
  display: flex;
  flex-direction: column;
`;

const TransFormMainDiv = styled.div`
  flex-grow: 1;
  overflow-y: auto;
`;

const StyledButton = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    color: #333; /* Change to desired hover color */
  }
`;

const QualityOutboundDetails = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAtLeastOneParameterFilled, setIsAtLeastOneParameterFilled] =
    useState(false);

  const [parameters, setParameters] = useState({});
  const [formData, setFormData] = useState({
    date: "",
    in: "",
    out: "",
    vehicleNo: "",
    transporterName: "",
    transactionType: "",
    ticketNo: "",
    tpNo: "",
    poNo: "",
    challanNo: "",
    supplierOrCustomerName: "",
    supplierOrCustomerAddress: "",
    materialName: "",
    materialType: "",
    // Initialize all parameter fields with empty strings
    ...Object.keys(parameters).reduce((acc, paramName) => {
      acc[paramName] = "";
      return acc;
    }, {}),
  });

  const [isFormValid, setIsFormValid] = useState(false); // Initialize isFormValid as false
  const userId = sessionStorage.getItem("userId");
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const specialParameters = ['carbon', 'sulphur', '-1mm', '%Non-Mag'];
  const checkFormValidity = () => {
    const atLeastOneParameterFilled = Object.keys(parameters).some(
      (parameterName) => {
        return formData[parameterName] && formData[parameterName].trim() !== "";
      }
    );
    setIsAtLeastOneParameterFilled(atLeastOneParameterFilled);
  };

  // In the useEffect hook
  useEffect(() => {
    checkFormValidity();
  }, [formData, parameters]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlData = {
      date: urlParams.get("date"),
      inTime: urlParams.get("inTime"),
      outTime: urlParams.get("outTime"),
      vehicleNo: urlParams.get("vehicleNo"),
      transporterName: urlParams.get("transporterName"),
      transactionType: urlParams.get("transactionType"),
      ticketNo: urlParams.get("ticketNo"),
      tpNo: urlParams.get("tpNo"),
      poNo: urlParams.get("poNo"),
      challanNo: urlParams.get("challanNo"),
      supplierOrCustomerName: urlParams.get("supplierOrCustomerName"),
      supplierOrCustomerAddress: urlParams.get("supplierOrCustomerAddress"),
      materialName: urlParams.get("materialName"),
      materialType: urlParams.get("materialType"),
    };

    setFormData(urlData);

    const fetchParameters = async () => {
      try {
        let response;
        if (urlData.transactionType === "Inbound") {
          response = await fetch(
            `http://localhost:8080/api/v1/materials/parameters?materialName=${urlData.materialName}&supplierName=${urlData.supplierOrCustomerName}&supplierAddress=${urlData.supplierOrCustomerAddress}&userId=${userId}`
          );
        } else {
          response = await fetch(
            `http://localhost:8080/api/v1/products/parameters?productName=${urlData.materialName}&userId=${userId}`
          );
        }
        const data = await response.json();
        if (data.length > 0 && data[0].parameters) {
          const ranges = data[0].parameters.reduce((acc, parameter) => {
            if (parameter.parameterName.toLowerCase() === 'size') {
              acc[parameter.parameterName] = {
                rangeFrom: parameter.rangeFrom,
                rangeTo: parameter.rangeTo,
                displayValue: `${parameter.rangeFrom}-${parameter.rangeTo}`
              };
            } else {
              acc[parameter.parameterName] = {
                rangeFrom: parameter.rangeFrom,
                rangeTo: parameter.rangeTo
              };
            }
            return acc;
          }, {});
          setParameters(ranges);
          
          // Set the 'Size' parameter in formData
          if (ranges['Size']) {
            setFormData(prevData => ({
              ...prevData,
              Size: ranges['Size'].displayValue
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching parameter ranges:", error);
      }
    };
  
    if (urlData.materialName && urlData.materialType) {
      fetchParameters();
    }
  }, []);



  const handleSave = async () => {
    let data = Object.keys(parameters).reduce((acc, parameterName) => {
      if (formData[parameterName] && formData[parameterName].trim() !== "") {
        acc[parameterName] = formData[parameterName].trim();
      }
      return acc;
    }, {});
  
    console.log("Form data being sent:", data);
  
    if (Object.keys(data).length === 0) {
      setIsModalVisible(true);
      return;
    }
  
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/qualities/${formData.ticketNo}?userId=${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include",
        }
      );
  
      if (response.ok) {
        console.log("Data saved successfully");
        setIsSuccessModalVisible(true);
      } else {
        console.error("Error saving data:", response.status);
        setIsModalVisible(true);
      }
    } catch (error) {
      console.error("Error saving data:", error);
      setIsModalVisible(true);
    }
  };

  
  const handleSuccessOk = () => {
    setIsSuccessModalVisible(false);
    navigate("/quality-dashboard"); // Replace '/home' with the actual path to your home page
  };
  const handleOk = () => {
    setIsModalVisible(false);
  };

  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const isTablet = useMediaQuery({
    query: "(min-width: 768px) and (max-width: 1023px)",
  });
  const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" });

  const currentDateTime = new Date().toLocaleString();

  const [material, setMaterial] = useState("Select");

  useEffect(() => {
    Chart.register(ArcElement);
  }, []);

  const handleMaterialChange = (event) => {
    setMaterial(event.target.value);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => {
      const newFormData = {
        ...prevFormData,
        [name]: value,
      };
      return newFormData;
    });
    checkFormValidity();
  };

  useEffect(() => {
    // Any side effect code can be placed here
    // console.log("Updated state:", formData);
  }, [formData]);

  const generateFieldNameWithRange = (parameterName) => {
    if (parameterName.toLowerCase() === 'size') {
      return 'Size';
    }
    const parameter = parameters[parameterName];
    if (!parameter) return `${parameterName}`;
    const { rangeFrom, rangeTo } = parameter;
    return `${parameterName} (${rangeFrom}-${rangeTo})`;
  };

  const handleKeyPress = (event) => {
    // Allow only numeric characters and certain special characters like dot (.) and minus (-)
    const allowedCharacters = /[0-9.-]/;
    if (!allowedCharacters.test(event.key)) {
      event.preventDefault();
    }
  };
//   const StyledInput = styled.input`
//   &.form-control.is-invalid {
//     border-color: #dc3545;
//     background-color: #fff;
//   }

//   &.form-control.is-invalid:focus {
//     border-color: #dc3545;
//     box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
//   }
// `;

const renderFieldWithBox = (
  fieldName,
  propertyName,
  isReadOnly = false,
  isRequired = false
) => {
  const value = formData[propertyName] !== null ? formData[propertyName] : "";

  const parameter = parameters[propertyName];
  const rangeFrom = parameter ? parseFloat(parameter.rangeFrom) : null;
  const rangeTo = parameter ? parseFloat(parameter.rangeTo) : null;

  let inputStyle = isReadOnly
    ? { borderColor: "#ced4da", backgroundColor: "rgb(239, 239, 239)" }
    : {};

  const isSpecialParameter = specialParameters.some(param =>
    propertyName.toLowerCase().includes(param.toLowerCase())
  );

  if (!isReadOnly && !isNaN(rangeFrom) && !isNaN(rangeTo) && value !== "") {
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      if (isSpecialParameter || propertyName.toLowerCase() === 'size') {
        if (numericValue >= rangeFrom && numericValue <= rangeTo) {
          inputStyle = {
            ...inputStyle,
            borderColor: "#28a745",
            backgroundColor: "#fff",
            boxShadow: "0 0 0 0.2rem rgba(40, 167, 69, 0.25)"
          };
        } else {
          inputStyle = {
            ...inputStyle,
            borderColor: "#dc3545",
            backgroundColor: "#fff",
            boxShadow: "0 0 0 0.2rem rgba(220, 53, 69, 0.25)"
          };
        }
      } else {
        if (numericValue >= rangeFrom) {
          inputStyle = {
            ...inputStyle,
            borderColor: "#28a745",
            backgroundColor: "#fff",
            boxShadow: "0 0 0 0.2rem rgba(40, 167, 69, 0.25)"
          };
        } else {
          inputStyle = {
            ...inputStyle,
            borderColor: "#dc3545",
            backgroundColor: "#fff",
            boxShadow: "0 0 0 0.2rem rgba(220, 53, 69, 0.25)"
          };
        }
      }
    }
  }

  return (
    <div className="col-md-3 mb-3">
      <label
        htmlFor={propertyName}
        className="form-label"
        style={{ marginBottom: "0" }}
      >
        {generateFieldNameWithRange(propertyName)}:
      </label>
      <input
        type="text"
        name={propertyName}
        autoComplete="off"
        value={value}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        required={isRequired}
        readOnly={isReadOnly}
        style={inputStyle}
        className="form-control"
        id={propertyName}
      />
    </div>
  );
};

  const handleClear = () => {
    setFormData((prevFormData) => {
      const newFormData = { ...prevFormData };
      Object.keys(parameters).forEach((parameterName) => {
        if (parameterName.toLowerCase() !== 'size') {
          newFormData[parameterName] = "";
        }
      });
      return newFormData;
    });
  };
  const goBack = () => {
    navigate(-1);
  };

  return (
    <SideBar3>
      <div className="d-flex">
        <div
          className="flex-grow-1"
          style={{ marginTop: "1rem", marginBottom: "1rem" }}
        >
          <button
            className="close-button"
            onClick={goBack}
            style={{
              position: "absolute",
              marginRight: 10,
              backgroundColor: "transparent",
              color: "#f11212",
              border: "none",
              cursor: "pointer",
              fontSize: 30,
              outline: "none",
            }}
          >
            <FontAwesomeIcon icon={faRectangleXmark} />
          </button>
          <h2
            className="text-center p-2 mb-0"
            style={{ fontFamily: "Arial", fontSize: "clamp(12px, 4vw, 30px)" }}
          >
            Quality Outbound Transaction Details
          </h2>
          <MainContent>
            <TransFormMainDiv>
              <div className="container-fluid overflow-hidden">
                <div className="d-flex justify-content-between align-items-center mb-2 ml-6"></div>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="card mb-3 p-2 border shadow-lg">
                      <div className="card-body">
                        <div className="row">
                          {renderFieldWithBox("TicketNo", "ticketNo", true)}
                          {renderFieldWithBox("Date", "date", true)}
                          {renderFieldWithBox(
                            "Vehicle Number",
                            "vehicleNo",
                            true
                          )}
                          {renderFieldWithBox(
                            "Transporter",
                            "transporterName",
                            true
                          )}
                          {renderFieldWithBox("Tp No", "tpNo", true)}
                          {renderFieldWithBox("Po No", "poNo", true)}
                          {renderFieldWithBox("Challan No", "challanNo", true)}
                          {renderFieldWithBox("Product", "materialName", true)}
                          {renderFieldWithBox(
                            "Product Type",
                            "materialType",
                            true
                          )}
                          {formData.transactionType === "Outbound" && (
                            <>
                              {renderFieldWithBox(
                                "Customer",
                                "supplierOrCustomerName",
                                true
                              )}
                              {renderFieldWithBox(
                                "Customer Address",
                                "supplierOrCustomerAddress",
                                true
                              )}
                            </>
                          )}
                          {renderFieldWithBox(
                            "Transaction Type",
                            "transactionType",
                            true
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="card mb-3 p-3 border shadow-lg">
                      <div className="card-body">
                        <div className="row">
                          {Object.keys(parameters).map((parameterName) => (
                            <React.Fragment key={parameterName}>
                              {renderFieldWithBox(
                                parameterName,
                                parameterName,
                                false,
                                true
                              )}
                            </React.Fragment>
                          ))}
                          <div className="col-md-12 col-sm-12 d-flex justify-content-end">
                            <button
                              type="button"
                              className="btn btn-danger me-4 btn-hover"
                              style={{
                                backgroundColor: "white",
                                color: "#d63031",
                                border: "1px solid #cccccc",
                                width: "100px",
                              }}
                              onClick={handleClear}
                            >
                              <FontAwesomeIcon
                                icon={faEraser}
                                className="me-1"
                              />{" "}
                              Clear
                            </button>
                            <button
                              type="button"
                              className="btn btn-success-1 btn-hover"
                              style={{
                                backgroundColor: "white",
                                color: "#008060",
                                width: "100px",
                                border: "1px solid #cccccc",
                              }}
                              onClick={handleSave}
                              disabled={!isAtLeastOneParameterFilled}
                            >
                              <FontAwesomeIcon icon={faSave} className="me-1" />{" "}
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TransFormMainDiv>
          </MainContent>
        </div>
      </div>
      <Modal
        title="Success"
        open={isSuccessModalVisible}
        onOk={handleSuccessOk}
        onCancel={handleSuccessOk}
        okText="OK"
      >
        <p>Data saved successfully.</p>
      </Modal>
      <Modal
        title="Error"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleOk}
        okText="OK"
      >
        <p>Please provide input for at least one field in order to save.</p>
      </Modal>
    </SideBar3>
  );
};
export default QualityOutboundDetails;