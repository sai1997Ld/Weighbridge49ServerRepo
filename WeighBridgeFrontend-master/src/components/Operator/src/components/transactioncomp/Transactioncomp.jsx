import React, { useState, useEffect, useRef, useCallback } from "react";
import "./Transactioncomp.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import axios from "axios";
import { faPrint, faFileWord } from "@fortawesome/free-solid-svg-icons";

import { jsPDF } from "jspdf";
import "jspdf-autotable";

import SideBar5 from "../../../../SideBar/SideBar5";
import { Button, Dropdown } from "antd";

import { SearchOutlined } from "@ant-design/icons";
import { Select, Input, Pagination } from "antd";
import { Row, Col } from "antd";
import TicketComponent from "./PrintCompleted";
import { useReactToPrint } from "react-to-print";

import { CircularProgress, circularProgressClasses } from "@mui/material";

const OperatorTransaction2 = () => {
  const [currentDate, setCurrentDate] = useState(getFormattedDate());
  const navigate = useNavigate();
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [weighments, setWeighments] = useState([]);
  const [pager, setPager] = useState(0);
  const [searchOption, setSearchOption] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [ticketData, setTicketData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const componentRef = useRef();

  const [searchPageNumber, setSearchPageNumber] = useState(0);
  const [totalSearchPages, setTotalSearchPages] = useState(0);
  const [searchWeighments, setSearchWeighments] = useState([]);
  const [searchPager, setSearchPager] = useState(0);
  const [allMaterials, setAllMaterials] = useState([]);

  function getFormattedDate() {
    const date = new Date();
    const year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  const goToTransForm = (ticketNo, transactionType) => {
    if (transactionType === "Inbound") {
      navigate(
        `/OperatorCompletedTransactionFromInbound/?ticketNumber=${ticketNo}&truckStatus=ENTRY`
      );
    } else {
      navigate(
        `/OperatorCompletedTransactionFromOutbound/?ticketNumber=${ticketNo}&truckStatus=EXIT`
      );
    }
  };

  const itemsPerPage = 5;

  const [userId, setUserId] = useState("");

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    setUserId(userId);
  }, []);
  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const response = await axios.get(
        `http://49.249.180.125:8080/api/v1/materials/names`,
        {
          withCredentials: true,
        }
      );
      setAllMaterials(response.data);
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  const fetchData = (pageNumber) => {
    axios
      .get(
        `http://49.249.180.125:8080/api/v1/weighment/getCompletedTransaction?page=${pageNumber}&userId=${userId}`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        setWeighments(response.data.weighmentTransactionResponses);
        setTotalPages(response.data.totalPages);
        setPager(response.data.totalElements);

        setIsLoading(false);
        const materials = response.data.map(
          (transaction) => transaction.materialName
        );
        setAllMaterials([...new Set(materials)]);
      })
      .catch((error) => {
        console.error("Error fetching weighments:", error);
      });
  };

  useEffect(() => {
    if (userId) {
      fetchData(pageNumber);
      const interval = setInterval(() => {
        fetchData(pageNumber);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [userId, pageNumber]);

  const api = axios.create({
    baseURL: "http://49.249.180.125:8080/search/v1/Api",
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  const handleSearchOptionChange = (value) => {
    setSearchOption(value);
    setSearchValue("");
    setSearchPageNumber(0); // Reset the search value when the option changes
  };

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  const reload = () => {
    navigate(0);
  };

  const handleSearch = async (searchPageNumber = 0) => {
    if (searchValue === "") {
      reload();
      fetchData(searchPageNumber);

      setSearchWeighments([]);
      return;
    }
    let apiUrl = `${api.defaults.baseURL}/serachApi`;

    switch (searchOption) {
      case "ticketNo":
        apiUrl += `?ticketNo=${searchValue}&page=${searchPageNumber}&userId=${userId}`;
        break;

      case "vehicleNo":
        apiUrl += `?vehicleNo=${searchValue}&page=${searchPageNumber}&userId=${userId}`;
        break;

      case "transactionType":
        apiUrl += `?transactionType=${searchValue}&page=${searchPageNumber}&userId=${userId}`;
        break;

      case "materialName":
        apiUrl += `?materialName=${searchValue}&page=${searchPageNumber}&userId=${userId}`;
    }

    try {
      const response = await api.get(apiUrl);

      if (response.status === 200) {
        const responseData = response.data;
        console.log("Response data:", responseData);
        setSearchWeighments(responseData.weighmentTransactionResponses);
        setTotalSearchPages(responseData.totalPages);
        setSearchPager(responseData.totalElements);
      } else {
        console.error(
          "Error: Received unexpected response status:",
          response.status
        );
      }
    } catch (error) {
      if (error.response) {
        console.error("Error data:", error.response.data);
        console.error("Error status:", error.response.status);
        console.error("Error headers:", error.response.headers);
      } else if (error.request) {
        console.error("Error request:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      console.error("Error config:", error.config);
    }
  };

  const debounce = (func, delay) => {
    let debounceTimer;
    return function (...args) {
      const context = this;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
  };

  const debouncedSearch = useCallback(
    debounce((page) => handleSearch(page), 500),
    [searchValue, searchOption]
  );

  useEffect(() => {
    if (userId) {
      if (
        (searchOption === "vehicleNo" ||
          searchOption === "ticketNo" ||
          searchOption === "transactionType" ||
          searchOption === "materialName") &&
        searchValue
      ) {
        debouncedSearch(searchPageNumber);
      }
    }
  }, [userId, searchValue, searchOption, searchPageNumber, debouncedSearch]);

  //print
  const handlePrint = async (ticketNo) => {
    const apiUrl = `http://49.249.180.125:8080/api/v1/weighment/getPrintTicketWise/${ticketNo}`;
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        const ticketData = response.data;
        setTicketData(ticketData);
      } else {
        console.error("Error: Received unexpected response status");
      }
    } catch (error) {
      if (error.response) {
        console.error("Error data:", error.response.data);
        console.error("Error status:", error.response.status);
        console.error("Error headers:", error.response.headers);
      } else if (error.request) {
        console.error("Error request:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      console.error("Error config:", error.config);
    }
  };

  const handlePrintClick = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    if (ticketData) {
      handlePrintClick();
    }
  }, [ticketData]);

  const handleQualityReportDownload = async (ticketNo) => {
    try {
      const response = await fetch(
        `http://49.249.180.125:8080/api/v1/qualities/report-response/${ticketNo}?userId=${userId}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log(data);

      const doc = new jsPDF();

      const text = data.companyName;
      const textWidth = doc.getTextWidth(text);
      const pageWidth = doc.internal.pageSize.getWidth();
      const x = (pageWidth - textWidth) / 2;
      doc.setFontSize(18);
      doc.text(text, x, 22);

      doc.setFontSize(12);
      doc.setTextColor(100);
      const subtitle1 = data.companyAddress;
      const formatDate = (date) => {
        const d = new Date(date);
        let day = d.getDate();
        let month = d.getMonth() + 1;
        const year = d.getFullYear();

        if (day < 10) {
          day = "0" + day;
        }
        if (month < 10) {
          month = "0" + month;
        }
        return `${day}-${month}-${year}`;
      };
      const subtitle2 = `Generated on: ${formatDate(new Date())}`;
      const subtitleWidth1 = doc.getTextWidth(subtitle1);
      const subtitleWidth2 = doc.getTextWidth(subtitle2);
      const subtitleX1 = (pageWidth - subtitleWidth1) / 2;
      const subtitleX2 = (pageWidth - subtitleWidth2) / 2;
      doc.text(subtitle1, subtitleX1, 32);
      doc.text(subtitle2, subtitleX2, 38);

      // Add the additional details before the table
      const details = [
        `Ticket No: ${data.ticketNo}`,
        `Date: ${data.date}`,
        `Vehicle No: ${data.vehicleNo}`,
        `Material/Product: ${data.materialOrProduct}`,
        `Material/Product Type: ${data.materialTypeOrProductType}`,
        `Supplier/Customer Name: ${data.supplierOrCustomerName}`,
        `Supplier/Customer Address: ${data.supplierOrCustomerAddress}`,
        `Transaction Type: ${data.transactionType}`,
      ];

      doc.setFontSize(14);
      let yPosition = 50; // Initial Y position for the details
      details.forEach((detail) => {
        doc.text(detail, 20, yPosition);
        yPosition += 10; // Increment Y position for each detail line
      });

      // Move the table start position down to avoid overlapping with details
      yPosition += 10;

      const filteredEntries = Object.entries(data.qualityParameters).filter(
        ([key, value]) => value !== null && value !== undefined && value !== ""
      );

      const tableBody = filteredEntries.map(([key, value]) => [key, value]);
      doc.autoTable({
        startY: yPosition,
        head: [["Field", "Value"]],
        body: tableBody,
      });

      doc.save("quality_report.pdf");
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to download the quality report. Please try again later.");
    }
  };

  return (
    <SideBar5>
      <div
        className="container-fluid"
        style={{
          fontFamily: "Arial",
          color: "#333",
          "--table-border-radius": "30px",
        }}
      >
        <div className="container-fluid mt-0">
          <div className="mb-3 mt-3 text-center">
            <h2 style={{ fontFamily: "Arial", marginBottom: "0px !important" }}>
              Completed Transaction
            </h2>
            <Row gutter={[16, 16]} justify="space-between" align="top">
              <Col
                xs={24}
                sm={12}
                md={6}
                style={{
                  display: "flex",
                  justifyContent: "start",
                  alignItems: "center",
                }}
              >
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="form-control form-control-sm"
                  style={{ width: "110px" }}
                  value={currentDate}
                  disabled
                />
              </Col>

              <Col
                xs={24}
                sm={12}
                md={6}
                style={{
                  display: "flex",
                  justifyContent: "start",
                  alignItems: "center",
                }}
              >
                <div className="d-flex" style={{ alignItems: "center" }}>
                  <div className="mr-2">
                    <Select
                      value={searchOption}
                      onChange={handleSearchOptionChange}
                      style={{ width: "100%" }}
                    >
                      <Select.Option value="">Select Option </Select.Option>
                      <Select.Option value="ticketNo">Ticket No</Select.Option>
                      <Select.Option value="vehicleNo">
                        Vehicle No
                      </Select.Option>
                      <Select.Option value="transactionType">
                        Transaction Type
                      </Select.Option>
                      <Select.Option value="materialName">
                        Material Name
                      </Select.Option>
                    </Select>
                  </div>
                  <div style={{ width: "100%", marginLeft: "5%" }}>
                    {searchOption === "transactionType" ? (
                      <Select
                        value={searchValue}
                        onChange={(value) => {
                          setSearchValue(value);
                          setSearchPageNumber(0);
                        }}
                        style={{ width: "100%" }}
                      >
                        <Select.Option value="">
                          Select Transaction Type
                        </Select.Option>
                        <Select.Option value="Inbound">Inbound</Select.Option>
                        <Select.Option value="Outbound">Outbound</Select.Option>
                      </Select>
                    ) : searchOption === "materialName" ? (
                      <Select
                        value={searchValue}
                        onChange={(value) => {
                          setSearchValue(value);
                          setSearchPageNumber(0);
                        }}
                        style={{ width: "100%" }}
                      >
                        <Select.Option value="">
                          Select Material Name
                        </Select.Option>
                        {allMaterials.map((material) => (
                          <Select.Option key={material} value={material}>
                            {material}
                          </Select.Option>
                        ))}
                      </Select>
                    ) : (
                      <Input
                        value={searchValue}
                        onChange={handleInputChange}
                        style={{ width: "100%" }}
                        suffix={<SearchOutlined />}
                      />
                    )}
                  </div>
                </div>
              </Col>
              {/* <Col
                xs={24}
                sm={12}
                md={6}
                style={{
                  display: "flex",
                  justifyContent: "start",
                  alignItems: "center",
                }}
              >
                <Dropdown overlay={menu} onSelect={handleMaterialFilter}>
                  <Button icon={<FilterOutlined />}>Filter</Button>
                </Dropdown>
              </Col> */}
            </Row>
          </div>
        </div>

        <div className="table-responsive" style={{ borderRadius: "10px" }}>
          <div>
            {isLoading ? (
              <div class="d-flex justify-content-center">
                <div class="spinner-border text-primary" role="status">
                  <span class="sr-only"></span>
                </div>
              </div>
            ) : (
              <table className="ant-table table table-striped">
                <thead className="ant-table-thead">
                  <tr className="ant-table-row">
                    <th
                      className="ant-table-cell"
                      style={{
                        whiteSpace: "nowrap",
                        color: "white",
                        backgroundColor: "#0077b6",
                        borderRight: "1px solid white",
                        textAlign: "center",
                      }}
                    >
                      Ticket No.
                    </th>
                    <th
                      className="ant-table-cell"
                      style={{
                        whiteSpace: "nowrap",
                        color: "white",
                        backgroundColor: "#0077b6",
                        borderRight: "1px solid white",
                        textAlign: "center",
                      }}
                    >
                      Transaction Type
                    </th>
                    <th
                      className="ant-table-cell"
                      style={{
                        whiteSpace: "nowrap",
                        color: "white",
                        backgroundColor: "#0077b6",
                        borderRight: "1px solid white",
                        textAlign: "center",
                      }}
                    >
                      Vehicle No.
                    </th>
                    <th
                      className="ant-table-cell"
                      style={{
                        whiteSpace: "nowrap",
                        color: "white",
                        backgroundColor: "#0077b6",
                        borderRight: "1px solid white",
                        textAlign: "center",
                      }}
                    >
                      Transporter
                    </th>
                    <th
                      className="ant-table-cell"
                      style={{
                        whiteSpace: "nowrap",
                        color: "white",
                        backgroundColor: "#0077b6",
                        borderRight: "1px solid white",
                        textAlign: "center",
                      }}
                    >
                      Supplier/Customer
                    </th>
                    <th
                      className="ant-table-cell"
                      style={{
                        whiteSpace: "nowrap",
                        color: "white",
                        backgroundColor: "#0077b6",
                        borderRight: "1px solid white",
                        textAlign: "center",
                      }}
                    >
                      Gross Wt.
                    </th>
                    <th
                      className="ant-table-cell"
                      style={{
                        whiteSpace: "nowrap",
                        color: "white",
                        backgroundColor: "#0077b6",
                        borderRight: "1px solid white",
                        textAlign: "center",
                      }}
                    >
                      Tare Wt.
                    </th>
                    <th
                      className="ant-table-cell"
                      style={{
                        whiteSpace: "nowrap",
                        color: "white",
                        backgroundColor: "#0077b6",
                        borderRight: "1px solid white",
                        textAlign: "center",
                      }}
                    >
                      Net Wt.
                    </th>
                    <th
                      className="ant-table-cell"
                      style={{
                        whiteSpace: "nowrap",
                        color: "white",
                        backgroundColor: "#0077b6",
                        borderRight: "1px solid white",
                        textAlign: "center",
                      }}
                    >
                      Material/Product
                    </th>
                    <th
                      className="ant-table-cell"
                      style={{
                        whiteSpace: "nowrap",
                        color: "white",
                        backgroundColor: "#0077b6",
                        borderRight: "1px solid white",
                        textAlign: "center",
                      }}
                    >
                      Type
                    </th>
                    <th
                      className="ant-table-cell"
                      style={{
                        whiteSpace: "nowrap",
                        color: "white",
                        backgroundColor: "#0077b6",
                        borderRight: "1px solid white",
                        textAlign: "center",
                      }}
                    >
                      Print
                    </th>
                    <th
                      className="ant-table-cell"
                      style={{
                        whiteSpace: "nowrap",
                        color: "white",
                        backgroundColor: "#0077b6",
                        borderRight: "1px solid white",
                        textAlign: "center",
                      }}
                    >
                      Quality Report
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {searchValue
                    ? searchWeighments.map((weighment) => (
                        <tr key={weighment.id}>
                          <td
                            className="ant-table-cell"
                            style={{ textAlign: "center" }}
                          >
                            <Button
                              onClick={() => {
                                goToTransForm(
                                  weighment.ticketNo,
                                  weighment.transactionType,
                                  weighment.grossWeight,
                                  weighment.tareWeight
                                );
                              }}
                              style={{ background: "#88CCFA" }}
                            >
                              {weighment.ticketNo}
                            </Button>
                          </td>
                          <td
                            className="ant-table-cell"
                            style={{
                              whiteSpace: "nowrap",
                              textAlign: "center",
                            }}
                          >
                            {weighment.transactionType}
                          </td>
                          <td
                            className="ant-table-cell"
                            style={{
                              whiteSpace: "nowrap",
                              textAlign: "center",
                            }}
                          >
                            {weighment.vehicleNo}
                          </td>
                          <td
                            className="ant-table-cell"
                            style={{
                              whiteSpace: "nowrap",
                              textAlign: "center",
                            }}
                          >
                            {weighment.transporterName}
                          </td>
                          <td
                            className="ant-table-cell"
                            style={{
                              whiteSpace: "nowrap",
                              textAlign: "center",
                            }}
                          >
                            {weighment.supplierName || weighment.customerName}
                          </td>
                          <td
                            className="ant-table-cell"
                            style={{
                              whiteSpace: "nowrap",
                              textAlign: "center",
                            }}
                          >
                            {weighment.grossWeight}
                          </td>
                          <td
                            className="ant-table-cell"
                            style={{
                              whiteSpace: "nowrap",
                              textAlign: "center",
                            }}
                          >
                            {weighment.tareWeight}
                          </td>
                          <td
                            className="ant-table-cell"
                            style={{
                              whiteSpace: "nowrap",
                              textAlign: "center",
                            }}
                          >
                            {weighment.netWeight}
                          </td>
                          <td
                            className="ant-table-cell"
                            style={{
                              whiteSpace: "nowrap",
                              textAlign: "center",
                            }}
                          >
                            {weighment.materialName || weighment.productName}
                          </td>
                          <td
                            className="ant-table-cell"
                            style={{
                              whiteSpace: "nowrap",
                              textAlign: "center",
                            }}
                          >
                            {weighment.materialType || weighment.productType}
                          </td>

                          <td
                            className="ant-table-cell"
                            style={{
                              whiteSpace: "nowrap",
                              textAlign: "center",
                            }}
                          >
                            <button
                              className="btn btn-success btn-sm"
                              style={{ padding: "3px 6px" }}
                              onClick={() => {
                                handlePrint(weighment.ticketNo);
                              }}
                            >
                              <FontAwesomeIcon icon={faPrint} />
                            </button>
                            <div style={{ display: "none" }}>
                              <TicketComponent
                                ref={componentRef}
                                ticketData={ticketData}
                              />
                            </div>
                          </td>
                          <td
                            className="ant-table-cell"
                            style={{
                              whiteSpace: "nowrap",
                              textAlign: "center",
                            }}
                          >
                            <button
                              className="btn btn-success btn-sm"
                              style={{ padding: "3px 6px" }}
                              onClick={() =>
                                handleQualityReportDownload(weighment.ticketNo)
                              }
                              // disabled={!entry.qualityParameters}
                              // disabled={!entry.quality}
                            >
                              <FontAwesomeIcon icon={faFileWord} />
                            </button>
                          </td>
                        </tr>
                      ))
                    : weighments.map((weighment) => (
                        <tr key={weighment.id}>
                          <td
                            className="ant-table-cell"
                            style={{ textAlign: "center" }}
                          >
                            <Button
                              onClick={() => {
                                goToTransForm(
                                  weighment.ticketNo,
                                  weighment.transactionType,
                                  weighment.grossWeight,
                                  weighment.tareWeight
                                );
                              }}
                              style={{ background: "#88CCFA" }}
                            >
                              {weighment.ticketNo}
                            </Button>
                          </td>
                          <td
                            className="ant-table-cell"
                            style={{
                              whiteSpace: "nowrap",
                              textAlign: "center",
                            }}
                          >
                            {weighment.transactionType}
                          </td>
                          <td
                            className="ant-table-cell"
                            style={{
                              whiteSpace: "nowrap",
                              textAlign: "center",
                            }}
                          >
                            {weighment.vehicleNo}
                          </td>
                          <td
                            className="ant-table-cell"
                            style={{
                              whiteSpace: "nowrap",
                              textAlign: "center",
                            }}
                          >
                            {weighment.transporterName}
                          </td>
                          <td
                            className="ant-table-cell"
                            style={{
                              whiteSpace: "nowrap",
                              textAlign: "center",
                            }}
                          >
                            {weighment.supplierName || weighment.customerName}
                          </td>
                          <td
                            className="ant-table-cell"
                            style={{
                              whiteSpace: "nowrap",
                              textAlign: "center",
                            }}
                          >
                            {weighment.grossWeight}
                          </td>
                          <td
                            className="ant-table-cell"
                            style={{
                              whiteSpace: "nowrap",
                              textAlign: "center",
                            }}
                          >
                            {weighment.tareWeight}
                          </td>
                          <td
                            className="ant-table-cell"
                            style={{
                              whiteSpace: "nowrap",
                              textAlign: "center",
                            }}
                          >
                            {weighment.netWeight}
                          </td>
                          <td
                            className="ant-table-cell"
                            style={{
                              whiteSpace: "nowrap",
                              textAlign: "center",
                            }}
                          >
                            {weighment.materialName || weighment.productName}
                          </td>
                          <td
                            className="ant-table-cell"
                            style={{
                              whiteSpace: "nowrap",
                              textAlign: "center",
                            }}
                          >
                            {weighment.materialType || weighment.productType}
                          </td>

                          <td
                            className="ant-table-cell"
                            style={{
                              whiteSpace: "nowrap",
                              textAlign: "center",
                            }}
                          >
                            <button
                              className="btn btn-success btn-sm"
                              style={{ padding: "3px 6px" }}
                              onClick={() => {
                                handlePrint(weighment.ticketNo);
                              }}
                            >
                              <FontAwesomeIcon icon={faPrint} />
                            </button>
                            <div style={{ display: "none" }}>
                              <TicketComponent
                                ref={componentRef}
                                ticketData={ticketData}
                              />
                            </div>
                          </td>
                          <td
                            className="ant-table-cell"
                            style={{
                              whiteSpace: "nowrap",
                              textAlign: "center",
                            }}
                          >
                            <button
                              className="btn btn-success btn-sm"
                              style={{ padding: "3px 6px" }}
                              onClick={() =>
                                handleQualityReportDownload(weighment.ticketNo)
                              }
                              // disabled={!entry.qualityParameters}
                              // disabled={!entry.quality}
                            >
                              <FontAwesomeIcon icon={faFileWord} />
                            </button>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="d-flex justify-content-center mt-3">
          <Pagination
            current={(searchOption ? searchPageNumber : pageNumber) + 1}
            total={searchOption ? searchPager : pager}
            pageSize={itemsPerPage}
            showSizeChanger={false}
            showQuickJumper
            showTotal={(total, range) =>
              `Showing ${range[0]}-${range[1]} of ${total} entries`
            }
            onChange={(page) => {
              if (searchOption) {
                setSearchPageNumber(page - 1);
              } else {
                setPageNumber(page - 1);
              }
            }}
          />
        </div>
      </div>
      <div style={{ display: "none" }}>
        <TicketComponent ref={componentRef} data={ticketData} />
      </div>
    </SideBar5>
  );
};

export default OperatorTransaction2;
