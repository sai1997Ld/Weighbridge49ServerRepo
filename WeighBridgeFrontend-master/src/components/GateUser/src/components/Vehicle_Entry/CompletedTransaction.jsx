import  { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint} from "@fortawesome/free-solid-svg-icons";
import SideBar2 from "../../../../SideBar/SideBar2";
import "./CompletedTransaction.css";
import {

  Input,
  Select,
  DatePicker,
  Pagination,
} from "antd";

import moment from "moment";
import axios from "axios";
import "jspdf-autotable";
import { useReactToPrint } from "react-to-print";
import TicketComponentGU from "./TicketComponentGU";

const { Option } = Select;
const api = axios.create({
  baseURL: "http://localhost:8080/api/v1/gate",
  headers: {
    "Content-Type": "application/json",
  },

  withCredentials: true,
});

const CompletedTransaction = () => {
  const [selectedDate, setSelectedDate] = useState(moment());
  const [searchOption, setSearchOption] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [totalPage, setTotalPage] = useState(0);
  const [message, setMessage] = useState("");
  const [vehicleEntryDetails, setVehicleEntryDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;
  const [totalEntries, setTotalEntries] = useState(0);
  const disabledFutureDate = (current) => {
    return current && current > moment().endOf("day");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page - 1);
  };

  const componentRef = useRef();
  const [ticketData, setTicketData] = useState(null);



  const userId = sessionStorage.getItem("userId");



  const handleSearchOptionChange = (value) => {
    setSearchOption(value);
    setSearchValue(""); // Reset the search value when the option changes
  };
  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearch = async (pageNumber = 0) => {
    if (!searchValue) {
      message.error("Please enter a search value");
      return;
    }

    let apiUrl = `${api.defaults.baseURL}/transactions/completed?userId=${userId}&page=${pageNumber}`;

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
      
      setVehicleEntryDetails(response.data.transactions); // Update the vehicleEntryDetails state with the fetched data
      setTotalPage(response.data.totalPages);
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


  useEffect(() => {
    
    fetch(
      `http://localhost:8080/api/v1/gate/completedDashboard?userId=${userId}`,
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
        console.log("total Page " + data.totalPages);


        setCurrentPage(0);
      })
      .catch((error) => {
        console.error("Error fetching vehicle entry details:", error);
      });
  }, []);



  useEffect(() => {
    if (currentPage !== null) {
      if (searchValue) {
        handleSearch(currentPage);
      } else fetchData(currentPage);
    }
  }, [currentPage]);

  const fetchData = (pageNumber) => {
    fetch(
      `http://localhost:8080/api/v1/gate/completedDashboard?page=${pageNumber}&userId=${userId}`,
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
      })
      .catch((error) => {
        console.error("Error fetching vehicle entry details:", error);
      });
  };


  const handlePrint = async (ticketNo) => {
    const apiUrl = `http://localhost:8080/api/v1/gate/print/${ticketNo}`;
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
                Completed Transactions
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
                  onPressEnter={() => handleSearch(0)} // Optionally allow search on Enter key press
                />
              )}
            </div>
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
                    <th
                      className="ant-table-cell"
                      style={{
                        whiteSpace: "nowrap",
                        color: "white",
                        backgroundColor: "#0077b6",
                        borderRight: "1px solid white",
                      }}
                    >
                      Transporter Name
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
                      TP Net weight(Ton){" "}
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
                      {" "}
                      Print{" "}
                    </th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {vehicleEntryDetails.map((entry) => (
                    <tr key={entry.ticketNo}>
                      <td
                        className="ant-table-cell"
                        style={{ textAlign: "center" }}
                      >
                        {entry.ticketNo}
                      </td>
                      <td
                        className="ant-table-cell"
                        style={{ whiteSpace: "nowrap", textAlign: "center" }}
                      >
                        {" "}
                        {entry.vehicleNo}{" "}
                      </td>
                      <td
                        className="ant-table-cell"
                        style={{ whiteSpace: "nowrap", textAlign: "center" }}
                      >
                        {" "}
                        {entry.vehicleIn}{" "}
                      </td>
                      <td
                        className="ant-table-cell"
                        style={{ whiteSpace: "nowrap", textAlign: "center" }}
                      >
                        {" "}
                        {entry.vehicleOut}{" "}
                      </td>
                      <td
                        className="ant-table-cell"
                        style={{ whiteSpace: "nowrap", textAlign: "center" }}
                      >
                        {" "}
                        {entry.transporter}{" "}
                      </td>
                      <td
                        className="ant-table-cell"
                        style={{ whiteSpace: "nowrap", textAlign: "center" }}
                      >
                        {" "}
                        {entry.transactionType === "Inbound"
                          ? entry.supplier
                          : entry.customer}
                      </td>
                      <td
                        className="ant-table-cell"
                        style={{ whiteSpace: "nowrap", textAlign: "center" }}
                      >
                        {" "}
                        {entry.transactionType === "Inbound"
                          ? entry.supplierAddress
                          : entry.customerAddress}
                      </td>
                      <td
                        className="ant-table-cell"
                        style={{ whiteSpace: "nowrap", textAlign: "center" }}
                      >
                        {" "}
                        {entry.material}{" "}
                      </td>
                      <td
                        className="ant-table-cell"
                        style={{ whiteSpace: "nowrap", textAlign: "center" }}
                      >
                        {" "}
                        {entry.tpNo}{" "}
                      </td>
                      <td
                        className="ant-table-cell"
                        style={{ whiteSpace: "nowrap", textAlign: "center" }}
                      >
                        {" "}
                        {entry.tpNetWeight}{" "}
                      </td>
                      <td
                        className="ant-table-cell"
                        style={{ whiteSpace: "nowrap", textAlign: "center" }}
                      >
                        {" "}
                        {entry.poNo}{" "}
                      </td>
                      <td
                        className="ant-table-cell"
                        style={{ whiteSpace: "nowrap", textAlign: "center" }}
                      >
                        {" "}
                        {entry.challanNo}{" "}
                      </td>
                      <td
                        className="ant-table-cell"
                        style={{ whiteSpace: "nowrap", textAlign: "center" }}
                      >
                        {" "}
                        {entry.transactionType}
                      </td>
                      <td
                        className="ant-table-cell"
                        style={{ whiteSpace: "nowrap", textAlign: "center" }}
                      >
                        <button
                          className="btn btn-success btn-sm"
                          style={{ padding: "3px 6px" }}
                          onClick={() => {
                            handlePrint(entry.ticketNo);
                          }}
                        >
                          <FontAwesomeIcon icon={faPrint} />
                        </button>
                        <div style={{ display: "none" }}>
                          <TicketComponentGU
                            ref={componentRef}
                            ticketData={ticketData}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-center mt-3">
      <Pagination
        current={currentPage + 1}
        total={totalEntries}
        pageSize={itemsPerPage}
        showSizeChanger={false}
        showQuickJumper
        showTotal={(total, range) => `Showing ${range[0]}-${range[1]} of ${total} entries`}
        onChange={handlePageChange}
      />
    </div>
    </SideBar2>
  );
};

export default CompletedTransaction;
