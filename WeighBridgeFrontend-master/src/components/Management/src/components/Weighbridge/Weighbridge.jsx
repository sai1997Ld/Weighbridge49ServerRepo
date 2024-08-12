import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileWord } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import {
  faSearch,
  faPrint,
  faTruck,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import { Chart, ArcElement } from "chart.js/auto";
import { Button } from "antd";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { SearchOutlined } from "@ant-design/icons";
import { Input, InputNumber, DatePicker } from "antd";
import { Row, Col } from "antd";
import styled from "styled-components";
import { Modal, Typography } from "antd";
import SideBar4 from "../../../../SideBar/SideBar4";

const ManagementWeighbridge = () => {
  const [currentDate, setCurrentDate] = useState(getFormattedDate());
  const navigate = useNavigate();
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [weighments, setWeighments] = useState([]);
  const [pager, setPager] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingTareInbound, setPendingTareInbound] = useState(0);
  const [pendingTareOutbound, setPendingTareOutbound] = useState(0);
  const [pendingGrossInbound, setPendingGrossInbound] = useState(0);
  const [pendingGrossOutbound, setPendingGrossOutbound] = useState(0);
  const { Text } = Typography;

  function getFormattedDate() {
    const date = new Date();
    const year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  const goToTransForm = (ticketNo, transactionType) => {
    if (transactionType === "Inbound") {
      navigate(`/OperatorTransactionFromInbound/?ticketNumber=${ticketNo}`);
    } else {
      navigate(`/OperatorTransactionFromOutbound/?ticketNumber=${ticketNo}`);
    }
  };

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const chartRef = useRef(null);
  const chartRef2 = useRef(null);
  const homeMainContentRef = useRef(null);

  const itemsPerPage = 5;

  // const handlePageChange = ({ selected }) => {
  //   setPageNumber(selected);
  // };

  // Function to fetch data from the API
  const fetchData = (pageNumber) => {
    axios
      .get(`http://localhost:8080/api/v1/weighment/getAll?page=${pageNumber}`, {
        withCredentials: true,
      })
      .then((response) => {
        setWeighments(response.data.weighmentTransactionResponses);
        setTotalPages(response.data.totalPages);
        setPager(response.data.totalElements);

        return axios.get(
          "http://localhost:8080/api/v1/status/PendingTare/Outbound",
          {
            withCredentials: true,
          }
        );
      })
      .then((secondResponse) => {
        setPendingTareOutbound(secondResponse.data);
        console.log("Data from the second API:", secondResponse.data);

        return axios.get(
          "http://localhost:8080/api/v1/status/pendingGross/Outbound",
          {
            withCredentials: true,
          }
        );
      })
      .then((thirdResponse) => {
        setPendingGrossOutbound(thirdResponse.data);
        console.log("Data from the third API:", thirdResponse.data);

        return axios.get(
          "http://localhost:8080/api/v1/status/pendingTare/Inbound",
          {
            withCredentials: true,
          }
        );
      })
      .then((fourthResponse) => {
        setPendingTareInbound(fourthResponse.data);
        console.log("Data from the fourth API:", fourthResponse.data);

        return axios.get(
          "http://localhost:8080/api/v1/status/pendingGross/Inbound",
          {
            withCredentials: true,
          }
        );
      })
      .then((fifthResponse) => {
        setPendingGrossInbound(fifthResponse.data);
        console.log("Data from the fourth API:", fifthResponse.data);
      })

      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    fetchData(pageNumber);
  }, [pageNumber]);

  useEffect(() => {
    Chart.register(ArcElement);

    const resizeObserver = new ResizeObserver(() => {
      if (
        homeMainContentRef.current &&
        chartRef.current?.chartInstance &&
        chartRef2.current?.chartInstance
      ) {
        chartRef.current.chartInstance.resize();
        chartRef2.current.chartInstance.resize();
      }
    });

    if (homeMainContentRef.current) {
      resizeObserver.observe(homeMainContentRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const handlePrintDownload = async (ticketNo) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/weighment/getPrintTicketWise/${ticketNo}`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log(data);
      const doc = new jsPDF();
      const text = data.companyName;
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      const pageWidth = doc.internal.pageSize.getWidth();
      const textWidth = doc.getTextWidth(text);
      const x = (pageWidth - textWidth) / 2;
      doc.text(text, x, 22);

      doc.setFontSize(12);
      doc.setTextColor(100);
      const subtitle1 = data.companyAddress;
      const subtitleWidth1 = doc.getTextWidth(subtitle1);
      const subtitleX1 = (pageWidth - subtitleWidth1) / 2;
      doc.text(subtitle1, subtitleX1, 32);

      doc.setLineWidth(1.5);
      doc.line(20, 36, pageWidth - 20, 36);

      const details = [
        `Ticket No: ${data.ticketNo}`,
        `Date: ${data.date}`,
        `Vehicle No: ${data.vehicleNo}`,
        `${data.transactionType === "inbound" ? "Material" : "Product"}: ${
          data.materialOrProduct
        }`,
        `${
          data.transactionType === "inbound" ? "Material Type" : "Product Type"
        }: ${data.materialTypeOrProductType}`,
        `${
          data.transactionType === "inbound" ? "Supplier Name" : "Customer Name"
        }: ${data.supplierOrCustomerName}`,
        `${
          data.transactionType === "inbound"
            ? "Supplier Address"
            : "Customer Address"
        }: ${data.supplierOrCustomerAddress}`,
        `Transaction Type: ${data.transactionType}`,
      ];
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      let y = 50;
      details.forEach((detail) => {
        doc.text(detail, 20, y);
        y += 10;
      });

      doc.save(`${data.ticketNo}_Print.pdf`);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to download the quality report. Please try again later.");
    }
  };

  //Handle Search
  const handleSearch = async (event) => {
    const ticketNo = event.target.value.trim();
    setSearchQuery(ticketNo);

    // If the ticket number is empty, clear the weighments and return
    if (ticketNo === "") {
      window.location.reload();

      setWeighments([]);
      return;
    }

    const url = `http://localhost:8080/search/v1/Api/searchApi/${ticketNo}`;

    try {
      const response = await axios.get(url, { withCredentials: true });

      if (response.status === 200) {
        const responseData = response.data;
        console.log("Response data:", responseData); // Log the response data
        if (Array.isArray(responseData)) {
          setWeighments(responseData);
        } else {
          // Handle single transaction object
          setWeighments([responseData]); // Wrap the object in an array
        }
      } else {
        console.error(
          "Error: Received unexpected response status:",
          response.status
        );
      }
    } catch (error) {
      console.error(
        "There has been a problem with your axios operation:",
        error
      );
    }
  };
  const TransactionUpdatesContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #f5f5f5;
    border-radius: 8px;
    padding: 0.5rem;
    margin-bottom: 1rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);

    @media (max-width: 768px) {
      flex-wrap: wrap;
    }
  `;

  const TransactionUpdateBox = styled.div`
    background-color: ${(props) => props.bgColor};
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    flex: 1;
    text-align: center;
    margin: 0 0.25rem;
    color: ${(props) => (props.bgColor === "#4CAF50" ? "#ffffff" : "#333333")};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    position: relative;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      pointer-events: none;
    }

    @media (max-width: 768px) {
      flex: 0 0 calc(50% - 0.5rem);
      margin-bottom: 0.5rem;
    }
  `;

  return (
    <SideBar4>
      <div
        style={{
          fontFamily: "Arial",
          color: "#333",
          "--table-border-radius": "30px",
        }}
      >
        <div className="container-fluid mt-0">
          <div className="mb-3 text-center" style={{ position: "relative" }}>
            <h2 style={{ fontFamily: "Arial", marginBottom: "0px !important" }}>
              Transaction Dashboard
            </h2>
            <div style={{ position: "absolute", right: "0", top: "0" }}>
              <Link to="/management-dashboard">
                <FontAwesomeIcon
                  icon={faHome}
                  style={{ fontSize: "1.5em" }}
                  className="mb-3"
                />
              </Link>
            </div>

            <Row gutter={[16, 16]} justify="start" align="top">
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
                  justifyContent: "end",
                  alignItems: "center",
                }}
              >
                <Input
                  placeholder="Search by Ticket No"
                  value={searchQuery}
                  onChange={handleSearch}
                  style={{ width: "200px" }}
                  suffix={<SearchOutlined />}
                />
              </Col>
            </Row>
          </div>

          <div>
            <TransactionUpdatesContainer>
              <TransactionUpdateBox bgColor="#BDBDBD">
                <Text>
                  Inbound Pending Tare Weight: <b>{pendingTareInbound}</b>
                </Text>
              </TransactionUpdateBox>
              <TransactionUpdateBox bgColor="#36A2EB">
                <Text>
                  Inbound Pending Gross Weight: <b>{pendingGrossInbound}</b>
                </Text>
              </TransactionUpdateBox>
              <TransactionUpdateBox bgColor="#BDBDBD">
                <Text>
                  Outbound Pending Tare Weight: <b>{pendingTareOutbound}</b>
                </Text>
              </TransactionUpdateBox>
              <TransactionUpdateBox bgColor="#36A2EB">
                <Text>
                  Outbound Pending Gross Weight: <b>{pendingGrossOutbound}</b>
                </Text>
              </TransactionUpdateBox>
            </TransactionUpdatesContainer>
          </div>

          <div className="table-responsive" style={{ borderRadius: "10px" }}>
            <div>
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
                      }}
                    >
                      &nbsp;&nbsp;&nbsp;Transporter
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </th>
                    <th
                      className="ant-table-cell"
                      style={{
                        whiteSpace: "nowrap",
                        color: "white",
                        backgroundColor: "#0077b6",
                        borderRight: "1px solid white",
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
                      }}
                    >
                      Print
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {weighments.map((weighment) => (
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
                        style={{ whiteSpace: "nowrap", textAlign: "center" }}
                      >
                        {weighment.transactionType}
                      </td>
                      <td
                        className="ant-table-cell"
                        style={{ whiteSpace: "nowrap", textAlign: "center" }}
                      >
                        {weighment.vehicleNo}
                      </td>
                      <td
                        className="ant-table-cell"
                        style={{ whiteSpace: "nowrap", textAlign: "center" }}
                      >
                        {weighment.transporterName}
                      </td>
                      <td
                        className="ant-table-cell"
                        style={{ whiteSpace: "nowrap", textAlign: "center" }}
                      >
                        {weighment.supplierName || weighment.customerName}
                      </td>
                      <td
                        className="ant-table-cell"
                        style={{ whiteSpace: "nowrap", textAlign: "center" }}
                      >
                        {weighment.grossWeight.split("/")[0]}
                      </td>
                      <td
                        className="ant-table-cell"
                        style={{ whiteSpace: "nowrap", textAlign: "center" }}
                      >
                        {weighment.tareWeight.split("/")[0]}
                      </td>
                      <td
                        className="ant-table-cell"
                        style={{ whiteSpace: "nowrap", textAlign: "center" }}
                      >
                        {weighment.netWeight.split("/")[0]}
                      </td>
                      <td
                        className="ant-table-cell"
                        style={{ whiteSpace: "nowrap", textAlign: "center" }}
                      >
                        {weighment.materialName}
                      </td>

                      <td
                        className="ant-table-cell"
                        style={{ whiteSpace: "nowrap", textAlign: "center" }}
                      >
                        {/* <button
                          className="btn btn-success btn-sm"
                          style={{ padding: "3px 6px" }}
                          onClick={() => {
                            handleQualityReportDownload(weighment.ticketNo);
                          }}
                        >
                          <FontAwesomeIcon icon={faFileWord} />
                        </button> */}
                        <button
                          className="btn btn-success btn-sm"
                          style={{ padding: "3px 6px" }}
                          onClick={() => {
                            handlePrintDownload(weighment.ticketNo);
                          }}
                        >
                          <FontAwesomeIcon icon={faPrint} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3 ml-2">
            <span>
              Showing {pageNumber * itemsPerPage + 1} to{" "}
              {Math.min(
                (pageNumber + 1) * itemsPerPage,
                pageNumber * itemsPerPage + weighments.length
              )}{" "}
              of {pager} entries
            </span>
            <div className="ml-auto">
              <button
                className="btn btn-outline-primary btn-sm me-2"
                style={{
                  color: "#0077B6",
                  borderColor: "#0077B6",
                  marginRight: "2px",
                }}
                onClick={() => setPageNumber(Math.max(0, pageNumber - 5))}
                disabled={pageNumber === 0}
              >
                &lt;&lt;
              </button>
              <button
                className="btn btn-outline-primary btn-sm me-2"
                style={{
                  color: "#0077B6",
                  borderColor: "#0077B6",
                  marginRight: "2px",
                }}
                onClick={() => setPageNumber(pageNumber - 1)}
                disabled={pageNumber === 0}
              >
                &lt;
              </button>

              {Array.from({ length: 3 }, (_, index) => {
                const pageIndex = pageNumber + index;
                if (pageIndex >= totalPages) return null;
                return (
                  <button
                    key={pageIndex}
                    className={`btn btn-outline-primary btn-sm me-2 ${
                      pageIndex === pageNumber ? "active" : ""
                    }`}
                    style={{
                      color: pageIndex === pageNumber ? "#fff" : "#0077B6",
                      backgroundColor:
                        pageIndex === pageNumber ? "#0077B6" : "transparent",
                      borderColor: "#0077B6",
                      marginRight: "2px",
                    }}
                    onClick={() => setPageNumber(pageIndex)}
                  >
                    {pageIndex + 1}
                  </button>
                );
              })}
              {pageNumber + 3 < totalPages && <span>...</span>}
              {pageNumber + 3 < totalPages && (
                <button
                  className={`btn btn-outline-primary btn-sm me-2 ${
                    pageNumber === totalPages - 1 ? "active" : ""
                  }`}
                  style={{
                    color: pageNumber === totalPages - 1 ? "#fff" : "#0077B6",
                    backgroundColor:
                      pageNumber === totalPages - 1 ? "#0077B6" : "transparent",
                    borderColor: "#0077B6",
                    marginRight: "2px",
                  }}
                  onClick={() => setPageNumber(totalPages - 1)}
                >
                  {totalPages}
                </button>
              )}
              <button
                className="btn btn-outline-primary btn-sm me-2"
                style={{
                  color: "#0077B6",
                  borderColor: "#0077B6",
                  marginRight: "2px",
                }}
                onClick={() => setPageNumber(pageNumber + 1)}
                disabled={pageNumber === totalPages - 1}
              >
                &gt;
              </button>
              <button
                className="btn btn-outline-primary btn-sm"
                style={{
                  color: "#0077B6",
                  borderColor: "#0077B6",
                  marginRight: "2px",
                }}
                onClick={() =>
                  setPageNumber(Math.min(totalPages - 1, pageNumber + 5))
                }
                disabled={pageNumber === totalPages - 1}
              >
                &gt;&gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </SideBar4>
  );
};

export default ManagementWeighbridge;
