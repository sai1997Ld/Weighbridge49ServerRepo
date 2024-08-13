import { useState, useEffect, lazy, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPrint,
  faFileWord,
  faPencilAlt,
  faTruck,
} from "@fortawesome/free-solid-svg-icons";
import SideBar2 from "../../../../SideBar/SideBar2";
import "./VehicleEntry.css";
import {
  Button,
  Input,
  Select,
  DatePicker,
  Menu,
  Dropdown,
  Pagination,
} from "antd";
import { FilterOutlined } from "@ant-design/icons";
import moment from "moment";
import axios from "axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Typography } from "antd";
import styled from "styled-components";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { defaultApiUrl } from "../../../../../Constants";
import { useReactToPrint } from "react-to-print";
import TicketComponentGU from "./TicketComponentGU";


const GateUserExitModal = lazy(() => import("../Modals/GateUserExitModal"));

const { Option } = Select;
const api = axios.create({
  baseURL: "http://49.249.180.125:8080/api/v1/gate",

  headers: {
    "Content-Type": "application/json",
  },

  withCredentials: true,
});

const VehicleEntry = () => {
  const [selectedDate, setSelectedDate] = useState(moment());
  const [message, setMessage] = useState("");

  const [searchOption, setSearchOption] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [totalPage, setTotalPage] = useState(0);
  const [ticketData, setTicketData] = useState(null);

  const [vehicleEntryDetails, setVehicleEntryDetails] = useState([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const componentRef = useRef();

  const itemsPerPage = 5;
  const [totalEntries, setTotalEntries] = useState(0);
  const [materialOptions, setMaterialOptions] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedTransactionType, setSelectedTransactionType] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const { Text } = Typography;
  const [inboundPending, setInboundPending] = useState(null);
  const [outboundPending, setOutboundPending] = useState(null);
  const [Completed, setCompleted] = useState(null);
  const [isExitModalVisible, setIsExitModalVisible] = useState(false);
  const [ticketNo, setTicketNo] = useState(null);

  const disabledFutureDate = (current) => {
    return current && current > moment().endOf("day");
  };

  // To add session userid in frontend

  const userId = sessionStorage.getItem("userId");

  const handleSearchOptionChange = (value) => {
    setSearchOption(value);
    setSearchValue("");
  };
  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page - 1);
  };

  const handleSearch = async (pageNumber = 0) => {
    if (!searchValue) {
      message.error("Please enter a search value");
      return;
    }

    let apiUrl = `${api.defaults.baseURL}/transactions/ongoing?userId=${userId}&page=${pageNumber}`;

    // Build the URL based on the selected search option
    switch (searchOption) {
      case "ticketNo":
        apiUrl += `&ticketNo=${searchValue}`;
        break;
      case "date":
        apiUrl += `&date=${searchValue}`;
        break;
      case "vehicleNo":
        apiUrl += `&vehicleNo=${searchValue}`;
        break;
      case "supplier":
        apiUrl += `&supplierName=${searchValue}`;
        break;
      case "address":
        apiUrl += `&address=${searchValue}`;
        break;
      default:
        break;
    }

    try {
      const response = await api.get(apiUrl); //Use api.get instead of axios.get
      console.log(response.data);
      // You can handle the response data here, such as setting it to state to display it
      setVehicleEntryDetails(response.data.transactions); // Update the vehicleEntryDetails state with the fetched data
      setTotalPage(response?.data?.totalPages);
      setTotalEntries(response?.data?.totalElements);
    } catch (error) {
      console.error("Error fetching data:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        message.error(error.response.data.message);
      } else {
        message.error("Failed to fetch data. Please try again.");
      }
    }
  };

  // Code for Filltered Data:

  // Function to fetch material options from the API
  const fetchMaterialOptions = async () => {
    try {
      const response = await fetch(
        `http://49.249.180.125:8080/api/v1/gate/fetch-ProductsOrMaterials?userId=${userId}`,
        {
          credentials: "include", // Include credentials option here
        }
      );
      const data = await response.json();
      setMaterialOptions(data);
    } catch (error) {
      console.error("Error fetching material options:", error);
    }
  };

  // Fetch material options when the component mounts
  useEffect(() => {
    fetchMaterialOptions();
  }, []);

  // Function to handle material filter selection
  const handleMaterialFilter = (e) => {
    console.log("Selected filter:", e.key);
    const [filterType, filterValue] = e.key.split("-");
    if (filterType === "material") {
      setSelectedMaterial(filterValue);
      // Apply filter based on material only
      // applyFilter(vehicleEntryDetails, filterValue, selectedTransactionType);
    } else if (filterType === "transaction") {
      setSelectedTransactionType(filterValue);
    }
  };

  // Menu for material and transaction type filters
  const menu = (
    <Menu onClick={handleMaterialFilter}>
      <Menu.SubMenu key="1" title="Product/Material">
        {materialOptions.map((option, index) => (
          <Menu.Item key={`material-${option}`}>{option}</Menu.Item>
        ))}
      </Menu.SubMenu>
      <Menu.SubMenu key="2" title="Transaction Type">
        <Menu.Item key="transaction-inbound">Inbound</Menu.Item>
        <Menu.Item key="transaction-outbound">Outbound</Menu.Item>
      </Menu.SubMenu>
    </Menu>
  );



  const filterData = async (material, transactionType) => {
    try {
      let apiUrl = `${defaultApiUrl}/gate/transactions/ongoing?userId=${userId}&page=${currentPage}&`;

      switch (searchOption) {
        case "ticketNo":
          apiUrl += `&ticketNo=${searchValue}`;
          break;
        case "date":
          apiUrl += `&date=${searchValue}`;
          break;
        case "vehicleNo":
          apiUrl += `&vehicleNo=${searchValue}`;
          break;
        case "supplier":
          apiUrl += `&supplierName=${searchValue}`;
          break;
        case "address":
          apiUrl += `&address=${searchValue}`;
          break;
        default:
          break;
      }

      if (material) {
        apiUrl = apiUrl + `&materialName=${material}`;
      }
      if (transactionType) {
        apiUrl = apiUrl + `&transactionType=${transactionType}`;
      }
      const response = await fetch(apiUrl, {
        credentials: "include", // Include credentials option here
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setVehicleEntryDetails(data.transactions);
      setTotalPage(data.totalPages);
      setTotalEntries(data.totalElements);
      
    } catch (error) {
      console.error("Error fetching vehicle entry details:", error);
    }
  };


  useEffect(() => {
    setCurrentPage(0);
  }, [selectedMaterial, selectedTransactionType]);

  useEffect(() => {
    console.log({ currentPage });
    if (currentPage !== null) {
      if (searchValue && (selectedMaterial || selectedTransactionType)) {
        filterData(selectedMaterial, selectedTransactionType);
      } else if (searchValue) {
        handleSearch(currentPage);
      } else if (selectedMaterial || selectedTransactionType) {
        filterData(selectedMaterial, selectedTransactionType);
      } else fetchData(currentPage);
    }
  }, [selectedMaterial, selectedTransactionType, currentPage]);

  const fetchData = (pageNumber) => {
    console.log({ pageNumber });
    if (pageNumber !== undefined || pageNumber !== null) {
      fetch(
        `http://49.249.180.125:8080/api/v1/gate?page=${pageNumber}&userId=${userId}`,
        {
          credentials: "include",
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setVehicleEntryDetails(data.transactions);
          setTotalPage(data.totalPages);
          setTotalEntries(data.totalElements);
          console.log("total Page " + data.totalPages);
          //API for InboundPending Status
          return axios.get(
            `http://49.249.180.125:8080/api/v1/gate/count/Inbound?userId=${userId}`,
            {
              withCredentials: true,
            }
          );
        })
        .then((secondResponse) => {
          setInboundPending(secondResponse.data); // Set the inbound pending data
          console.log("Data from the second API:", secondResponse.data);
          //API for OutboundPending Status
          return axios.get(
            `http://49.249.180.125:8080/api/v1/gate/count/Outbound?userId=${userId}`,
            {
              withCredentials: true,
            }
          );
        })
        .then((thirdResponse) => {
          setOutboundPending(thirdResponse.data);
          console.log("Data from the third API:", thirdResponse.data);
          //API for Completed Status
          return axios.get(
            `http://49.249.180.125:8080/api/v1/gate/count/Complete?userId=${userId}`,
            {
              withCredentials: true,
            }
          );
        })
        .then((fourthResponse) => {
          setCompleted(fourthResponse.data);
          console.log("Data from the fourth API:", fourthResponse.data);
        })
        .catch((error) => {
          console.error("Error fetching vehicle entry details:", error);
        });
    }
  };

  //  code Of Edit API:
  const handleEdit = async (ticketNo) => {
    // Make the API call using Axios with credentials
    const role = JSON.parse(await sessionStorage.getItem("roles"))[0];
    axios
      .get(
        `http://49.249.180.125:8080/api/v1/gate/edit/${ticketNo}?userId=${userId}&role=${role}`,
        {
          withCredentials: true, // Include credentials with the request
        }
      )
      .then((response) => {
        // If the API call is successful
        // Extract data from the response
        const responseData = response.data;

        // Now, navigate to the UpdateGateEntry page
        // Pass the responseData to the page for pre-filling the fields
        navigate("/UpdateGateEntry", { state: { data: responseData } });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        // Handle any errors here
      });
  };

  // const handleQualityReportDownload = async (ticketNo) => {
  //   try {
  //     const response = await fetch(
  //       `http://49.249.180.125:8080/api/v1/qualities/report-response/${ticketNo}?userId=${userId}`
  //     );
  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }
  //     const data = await response.json();
  //     console.log(data);
  //     const doc = new jsPDF();

  //     const text = data.companyName;
  //     const textWidth = doc.getTextWidth(text);
  //     const pageWidth = doc.internal.pageSize.getWidth();
  //     const x = (pageWidth - textWidth) / 2;
  //     doc.setFontSize(18);
  //     doc.text(text, x, 22);

  //     doc.setFontSize(12);
  //     doc.setTextColor(100);
  //     const subtitle1 = data.companyAddress;
  //     const formatDate = (date) => {
  //       const d = new Date(date);
  //       let day = d.getDate();
  //       let month = d.getMonth() + 1;
  //       const year = d.getFullYear();

  //       if (day < 10) {
  //         day = "0" + day;
  //       }
  //       if (month < 10) {
  //         month = "0" + month;
  //       }
  //       return `${day}-${month}-${year}`;
  //     };
  //     const subtitle2 = `Generated on: ${formatDate(new Date())}`;
  //     const subtitleWidth1 = doc.getTextWidth(subtitle1);
  //     const subtitleWidth2 = doc.getTextWidth(subtitle2);
  //     const subtitleX1 = (pageWidth - subtitleWidth1) / 2;
  //     const subtitleX2 = (pageWidth - subtitleWidth2) / 2;
  //     doc.text(subtitle1, subtitleX1, 32);
  //     doc.text(subtitle2, subtitleX2, 38);

  //     // Add the additional details before the table
  //     const details = [
  //       `Ticket No: ${data.ticketNo}`,
  //       `Date: ${data.date}`,
  //       `Vehicle No: ${data.vehicleNo}`,
  //       `Material/Product: ${data.materialOrProduct}`,
  //       `Material/Product Type: ${data.materialTypeOrProductType}`,
  //       `Supplier/Customer Name: ${data.supplierOrCustomerName}`,
  //       `Supplier/Customer Address: ${data.supplierOrCustomerAddress}`,
  //       `Transaction Type: ${data.transactionType}`,
  //     ];

  //     doc.setFontSize(14);
  //     let yPosition = 50; // Initial Y position for the details
  //     details.forEach((detail) => {
  //       doc.text(detail, 20, yPosition);
  //       yPosition += 10; // Increment Y position for each detail line
  //     });

  //     // Move the table start position down to avoid overlapping with details
  //     yPosition += 10;

  //     const filteredEntries = Object.entries(data.qualityParameters).filter(
  //       ([key, value]) => value !== null && value !== undefined && value !== ""
  //     );

  //     const tableBody = filteredEntries.map(([key, value]) => [key, value]);
  //     doc.autoTable({
  //       startY: yPosition,
  //       head: [["Field", "Value"]],
  //       body: tableBody,
  //     });

  //     doc.save("quality_report.pdf");
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     alert("Failed to download the quality report. Please try again later.");
  //   }
  // };

  const handlePrint = async (ticketNo) => {
    const apiUrl = `http://49.249.180.125:8080/api/v1/gate/print/${ticketNo}`;
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
    <SideBar2>
      <div
        style={{
          fontFamily: "Arial",
          color: "#333",
          "--table-border-radius": "30px",
        }}
      >
        <div className="container-fluid mt-0">
          <div
            className="d-flex justify-content-between align-items-center"
            style={{ marginTop: "1rem", marginBottom: "1rem" }}
          >
            <div style={{ flex: "1" }}>
              <DatePicker
                // value={date}
                // onChange={handleDateChange}
                value={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                disabledDate={disabledFutureDate}
                format="DD-MM-YYYY"
                style={{
                  borderRadius: "5px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              />
            </div>
            <div style={{ flex: "1", textAlign: "center" }}>
              <h2
                style={{
                  fontFamily: "Arial",
                  marginBottom: "0px",
                  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
                }}
              >
                Gate User In/Out Transactions
              </h2>
            </div>
            <div style={{ flex: "1" }}></div> {/* To balance the layout */}
          </div>
          <div className="d-flex justify-content-center mb-3">
            <div
              className="d-flex align-items-center"
              style={{ marginLeft: "auto", marginRight: "auto" }}
            >
              <Select
                placeholder="Select a search option"
                style={{ width: "200px" }}
                onChange={handleSearchOptionChange}
                // suffixIcon={<SearchOutlined />}
              >
                <Option value="ticketNo">Search by Ticket No</Option>
                <Option value="vehicleNo">Search by Vehicle No</Option>
                <Option value="supplier">Search by Supplier</Option>
                {/* <Option value="address">Search by Supplier's Address</Option> */}
              </Select>
              {searchOption && (
                <Input
                  placeholder={`Enter ${searchOption}`}
                  style={{ width: "200px" }}
                  value={searchValue}
                  onChange={handleInputChange}
                  onPressEnter={() => {
                    handleSearch(0), setCurrentPage(0);
                  }} // Optionally allow search on Enter key press
                />
              )}
            </div>
            <div className=" d-flex justify-content-end">
              <Dropdown overlay={menu} onSelect={handleMaterialFilter}>
                <Button icon={<FilterOutlined />}>Filter</Button>
              </Dropdown>
            </div>
          </div>
          <div>
            <TransactionUpdatesContainer>
              <TransactionUpdateBox bgColor="#BDBDBD">
                {/* <PendingIcon /> */}
                <FontAwesomeIcon icon={faTruck} flip="horizontal" />
                <Text>
                  Inbound Pending:
                  <span style={{ fontWeight: "bold" }}>
                    {" "}
                    {inboundPending}{" "}
                  </span>{" "}
                </Text>
              </TransactionUpdateBox>
              <TransactionUpdateBox bgColor="#9FC0EF">
                {/* <PendingIcon /> */}
                <FontAwesomeIcon icon={faTruck} />
                <Text>
                  Outbound Pending:{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {" "}
                    {outboundPending}{" "}
                  </span>{" "}
                </Text>
              </TransactionUpdateBox>
              <TransactionUpdateBox bgColor="#6FBE88">
                <DoneAllIcon />
                <Text>
                  Completed Transactions:{" "}
                  <span style={{ fontWeight: "bold" }}> {Completed} </span>{" "}
                </Text>
              </TransactionUpdateBox>
            </TransactionUpdatesContainer>
          </div>

          <div
            className=" table-responsive"
            style={{
              overflowX: "auto",
              maxWidth: "100%",
              borderRadius: "10px",
            }}
          >
            <div>
              <table
                className=" ant-table table table-striped"
                style={{ width: "100%" }}
              >
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
                      In Time/Date
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
                      Out Time/Date
                    </th>
                    {/* <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}>Transporter Name</th> */}
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
                      Supplier&apos;s /Customer&apos;s Address
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
                      TP No.
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
                      PO No.
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
                      Challan No.
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
                      TP Net weight(Ton)
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
                    {/* <th
                      className="ant-table-cell"
                      style={{
                        whiteSpace: "nowrap",
                        color: "white",
                        backgroundColor: "#0077b6",
                        borderRight: "1px solid white",
                      }}
                    >
                      Quality Report{" "}
                    </th> */}
                    <th
                      className="ant-table-cell"
                      style={{
                        whiteSpace: "nowrap",
                        color: "white",
                        backgroundColor: "#0077b6",
                        borderRight: "1px solid white",
                      }}
                    >
                      {" "}
                      Action{" "}
                    </th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {/* {filteredData.map((entry) => { */}
                  {vehicleEntryDetails.map((entry) => {
                    const isEditDisabled = entry.transactionType === "Outbound";

                    return (
                      <tr key={entry.id}>
                        <td
                          className="ant-table-cell"
                          style={{ textAlign: "center" }}
                        >
                          <button
                            className="btn btn-info btn-md"
                            style={{ padding: "3px 6px" }}
                            onClick={() => {
                              handlePrint(entry.ticketNo);
                            }}
                          >
                            <FontAwesomeIcon icon={faPrint} />
                          </button>
                          &nbsp;&nbsp;
                          {entry.ticketNo}
                          <div style={{ display: "none" }}>
                          <TicketComponentGU
                            ref={componentRef}
                            ticketData={ticketData}
                          />
                        </div>
                        </td>

                        <td
                          className="ant-table-cell"
                          style={{ whiteSpace: "nowrap", textAlign: "center" }}
                        >
                          {entry.vehicleNo}
                        </td>
                        <td
                          className="ant-table-cell"
                          style={{ whiteSpace: "nowrap", textAlign: "center" }}
                        >
                          {entry.vehicleIn}
                        </td>
                        <td
                          className="ant-table-cell"
                          style={{ whiteSpace: "nowrap", textAlign: "center" }}
                        >
                          {entry.vehicleOut}
                        </td>

                        <td
                          className="ant-table-cell"
                          style={{ whiteSpace: "nowrap", textAlign: "center" }}
                        >
                          {entry.transactionType === "Inbound"
                            ? entry.supplier
                            : entry.customer}
                        </td>
                        <td
                          className="ant-table-cell"
                          style={{ whiteSpace: "nowrap", textAlign: "center" }}
                        >
                          {entry.transactionType === "Inbound"
                            ? entry.supplierAddress
                            : entry.customerAddress}
                        </td>
                        <td
                          className="ant-table-cell"
                          style={{ whiteSpace: "nowrap", textAlign: "center" }}
                        >
                          {entry.material}
                        </td>
                        <td
                          className="ant-table-cell"
                          style={{ whiteSpace: "nowrap", textAlign: "center" }}
                        >
                          {entry.tpNo}
                        </td>
                        <td
                          className="ant-table-cell"
                          style={{ whiteSpace: "nowrap", textAlign: "center" }}
                        >
                          {entry.poNo}
                        </td>
                        <td
                          className="ant-table-cell"
                          style={{ whiteSpace: "nowrap", textAlign: "center" }}
                        >
                          {entry.challanNo}
                        </td>
                        <td
                          className="ant-table-cell"
                          style={{ whiteSpace: "nowrap", textAlign: "center" }}
                        >
                          {entry.tpNetWeight}
                        </td>

                        <td
                          className="ant-table-cell"
                          style={{ whiteSpace: "nowrap", textAlign: "center" }}
                        >
                          {entry.transactionType}
                        </td>

                        {/* <td
                          className="ant-table-cell"
                          style={{ whiteSpace: "nowrap", textAlign: "center" }}
                        >
                          <button
                            className="btn btn-success btn-sm"
                            style={{ padding: "3px 6px" }}
                            onClick={() =>
                              handleQualityReportDownload(entry.ticketNo)
                            }
                            // disabled={!entry.qualityParameters}
                            disabled={!entry.quality}
                          >
                            <FontAwesomeIcon icon={faFileWord} />
                          </button>
                        </td> */}
                        <td
                          className="ant-table-cell"
                          style={{ whiteSpace: "nowrap", textAlign: "center" }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Button
                              style={{ margin: "0 5px" }}
                              onClick={() => handleEdit(entry.ticketNo)}
                              disabled={isEditDisabled}
                            >
                              <FontAwesomeIcon
                                icon={faPencilAlt}
                                style={{ color: "orange" }}
                                className="edit-icon"
                              />
                            </Button>
                            <Button
                              style={{ margin: "0 5px" }}
                              onClick={() => {
                                setIsExitModalVisible(true);
                                setTicketNo(entry.ticketNo);
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faTruck}
                                style={{ color: "red" }}
                                className="action-icon"
                              />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <GateUserExitModal
        modalOpen={isExitModalVisible}
        toggleModal={() => setIsExitModalVisible(!isExitModalVisible)}
        ticketNo={ticketNo}
      />
      <div className="d-flex justify-content-center mt-3 mb-3">
        <Pagination
          current={currentPage + 1}
          total={totalEntries}
          pageSize={itemsPerPage}
          showSizeChanger={false}
          showQuickJumper
          showTotal={(total, range) =>
            `Showing ${range[0]}-${range[1]} of ${total} entries`
          }
          onChange={handlePageChange}
        />
      </div>
    </SideBar2>
  );
};

export default VehicleEntry;
