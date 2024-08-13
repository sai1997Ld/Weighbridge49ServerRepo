import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SideBar3 from "../../../../SideBar/SideBar3";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";
import { Input, InputNumber, DatePicker, Select } from "antd";
import moment from "moment";
import { Button, Dropdown, Menu, Pagination } from "antd";
import { FilterOutlined, DownOutlined } from "@ant-design/icons";
import EditNoteIcon from "@mui/icons-material/EditNote";
import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";
import { Modal, Typography } from "antd";
import { Stack } from "@mui/material";
import PendingIcon from '@mui/icons-material/Pending';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { StyleSheetManager } from 'styled-components';
import isPropValid from '@emotion/is-prop-valid';





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

const TransactionUpdateBox = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'bgColor'
})`
  background-color: ${(props) => props.$bgColor};
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  flex: 1;
  text-align: center;
  margin: 0 0.25rem;
  color: ${(props) => (props.bgColor === "#4CAF50" ? "#ffffff" : "#333333")};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  position: relative;
  width: 160px; /* Fixed width for the boxes */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

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


// Styled component for the table
const StyledTable = styled.table`
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;



function QualityCheck() {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("select"); // State for search type
  const [selectedDate, setSelectedDate] = useState(moment());
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [selectedTransactionType, setSelectedTransactionType] = useState("");
  const navigate = useNavigate();
  const [filteredData, setFilteredData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [transactionType, setTransactionType] = useState("inbound"); // Default to 'inbound', adjust as necessary
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalPending, setTotalPending] = useState(0);
  const [inboundPending, setInboundPending] = useState(0);
  const [outboundPending, setOutboundPending] = useState(0);
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [inboundCompleted, setInboundCompleted] = useState(0);
  const [outboundCompleted, setOutboundCompleted] = useState(0);
  const [showInboundConfirmation, setShowInboundConfirmation] = useState(false);
  const [transactionToRemove, setTransactionToRemove] = useState("");
  const userId  =  sessionStorage  .  getItem("userId");

  const disabledFutureDate = (current) => {
    return current && current > moment().endOf("day");
  };

  
  const fetchData = async () => {
    try {
      const response = await fetch(
        `http://49.249.180.125:8080/api/v1/qualities/getAllTransaction?userId=${userId}`,
        {
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setAllData(data);
          setFilteredData(data);
        } else {
          console.error("Unexpected data format:", data);
        }
      } else {
        console.error("Failed to fetch all transactions:", response.status);
      }
    } catch (error) {
      console.error("Error fetching all transactions:", error);
    }
  };

  useEffect(() => {
    // Fetch data immediately when the component mounts
    fetchData();
  
    // Set up an interval to fetch data every 30 seconds
    const intervalId = setInterval(() => {
      fetchData();
    }, 30000); // 30000 milliseconds = 30 seconds
  
    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [userId]); // Add userId to the dependency array if it can change


  const fetchPendingCounts = async () => {
    try {
      const totalPendingResponse = await fetch(
        `http://49.249.180.125:8080/api/v1/qualities/total/pending?userId=${userId}`,
        { credentials: "include" }      
      );
      const inboundPendingResponse = await fetch(
        `http://49.249.180.125:8080/api/v1/qualities/inbound/pending?userId=${userId}`,
        { credentials: "include" }
      );
      const outboundPendingResponse = await fetch(
        `http://49.249.180.125:8080/api/v1/qualities/outbound/pending?userId=${userId}`,
        { credentials: "include" }
      );

      if (
        totalPendingResponse.ok &&
        inboundPendingResponse.ok &&
        outboundPendingResponse.ok
      ) {
        const totalPendingCount = await totalPendingResponse.json();
        const inboundPendingCount = await inboundPendingResponse.json();
        const outboundPendingCount = await outboundPendingResponse.json();

        setTotalPending(totalPendingCount);
        setInboundPending(inboundPendingCount);
        setOutboundPending(outboundPendingCount);
      } else {
        console.error(
          "Failed to fetch pending counts:",
          totalPendingResponse.status,
          inboundPendingResponse.status,
          outboundPendingResponse.status
        );
      }
    } catch (error) {
      console.error("Error fetching pending counts:", error);
    }
  };

  const fetchCompletedCounts = async () => {
    try {
      const totalCompletedResponse = await fetch(
        `http://49.249.180.125:8080/api/v1/qualities/total-qct-completed-size?userId=${userId}`,
        { credentials: "include" }
      );
      const inboundCompletedResponse = await fetch(
        `http://49.249.180.125:8080/api/v1/qualities/inbound-qct-completed-size?userId=${userId}`,
        { credentials: "include" }
      );
      const outboundCompletedResponse = await fetch(
        `http://49.249.180.125:8080/api/v1/qualities/outbound-qct-completed-size?userId=${userId}`,
        { credentials: "include" }
      );

      if (
        totalCompletedResponse.ok &&
        inboundCompletedResponse.ok &&
        outboundCompletedResponse.ok
      ) {
        const totalCompletedCount = await totalCompletedResponse.json();
        const inboundCompletedCount = await inboundCompletedResponse.json();
        const outboundCompletedCount = await outboundCompletedResponse.json();

        setTotalCompleted(totalCompletedCount);
        setInboundCompleted(inboundCompletedCount);
        setOutboundCompleted(outboundCompletedCount);
      } else {
        console.error(
          "Failed to fetch completed counts:",
          totalCompletedResponse.status,
          inboundCompletedResponse.status,
          outboundCompletedResponse.status
        );
      }
    } catch (error) {
      console.error("Error fetching completed counts:", error);
    }
  };


  useEffect(() => {
    fetchPendingCounts();
    fetchCompletedCounts();
  }, []);


  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };



  // useEffect(() => {
  //   const fetchData = async () => {
  //     const data = await fetchAllTransactions();
  //     setAllData(data);
  //     setFilteredData(data);
  //   };

  //   fetchData();
  // }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredData(allData);
    }
  }, [searchQuery, allData]);


  const homeMainContentRef = useRef(null);

  const fetchMaterialOptions = async () => {
    try {
      const response = await fetch(
        `http://49.249.180.125:8080/api/v1/qualities/fetch-ProductsOrMaterials?userId=${userId}`,
        {
          credentials: "include",
        }
      );
      if (response.ok) {
        const materialData = await response.json();
        if (Array.isArray(materialData)) {
          setMaterialOptions(materialData);
        } else {
          console.error("Material data is not an array:", materialData);
          setMaterialOptions([]);
        }
      } else {
        console.error("Failed to fetch material options:", response.status);
      }
    } catch (error) {
      console.error("Error fetching material options:", error);
    }
  };

  const [materialOptions, setMaterialOptions] = useState([]);

  useEffect(() => {
    fetchMaterialOptions();
  }, []);

  const fetchInboundTransactions = async () => {
    try {
      const response = await fetch(
        `http://49.249.180.125:8080/api/v1/qualities/fetch-InboundTransaction?userId=${userId}`,
        {
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setFilteredData(data);
        setAllData(data);
      } else {
        console.error("Failed to fetch inbound transactions:", response.status);
      }
    } catch (error) {
      console.error("Error fetching inbound transactions:", error);
    }
  };

  const fetchOutboundTransactions = async () => {
    try {
      const response = await fetch(
        `http://49.249.180.125:8080/api/v1/qualities/fetch-OutboundTransaction?userId=${userId}`,
        {
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setFilteredData(data);
        setAllData(data);
      } else {
        console.error("Failed to fetch outbound transactions:", response.status);
      }
    } catch (error) {
      console.error("Error fetching outbound transactions:", error);
    }
  };

  const handleMaterialFilter = ({ key }) => {
    if (key.startsWith("material-")) {
      const selectedIndex = parseInt(key.split("-")[1], 10);
      setSelectedMaterial(materialOptions[selectedIndex]);
      setCurrentPage(0);
      const filtered = allData.filter((item) =>
        (selectedTransactionType === "" ||
          item.transactionType.toLowerCase() ===
          selectedTransactionType.toLowerCase()) &&
        (materialOptions[selectedIndex] === "" ||
          item.materialName.toLowerCase() === materialOptions[selectedIndex].toLowerCase())
      );
      setFilteredData(filtered);
    } else if (key === "transaction-inbound") {
      setSelectedTransactionType("Inbound");
      setCurrentPage(0);
      fetchInboundTransactions();
    } else if (key === "transaction-outbound") {
      setSelectedTransactionType("Outbound");
      setCurrentPage(0);
      fetchOutboundTransactions();
    }
  };


  const menu = {
    items: [
      {
        key: '1',
        label: 'Product/Material',
        children: materialOptions.map((option, index) => ({
          key: `material-${index}`,
          label: option,
        })),
      },
      {
        key: '2',
        label: 'Transaction Type',
        children: [
          {
            key: 'transaction-inbound',
            label: 'Inbound',
          },
          {
            key: 'transaction-outbound',
            label: 'Outbound',
          },
        ],
      },
    ],
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handlehome = () => {
    navigate("/home");
  };



  const handleTicketClick = (ticketNumber, transactionType) => {
    const item = allData.find((item) => item.ticketNo === ticketNumber);
    if (item) {
      const queryString = new URLSearchParams(item).toString();
      if (transactionType.toLowerCase() === "inbound") {
        navigate("/QualityInboundDetails?" + queryString);
      } else if (transactionType.toLowerCase() === "outbound") {
        navigate("/QualityOutboundDetails?" + queryString);
      }
    }
  };



  const pageCount = Math.ceil(filteredData.length / itemsPerPage);

  const removeTransaction = async (ticketNumber) => {
    try {
      const response = await fetch(`http://49.249.180.125:8080/api/v1/qualities/${ticketNumber}?userId=${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        console.log(`Transaction with ticket number ${ticketNumber} removed successfully`);

        // Update state to remove the transaction from the list
        setAllData((prevData) => prevData.filter((item) => item.ticketNo !== ticketNumber));
        setFilteredData((prevData) => prevData.filter((item) => item.ticketNo !== ticketNumber));
      } else {
        console.error("Failed to remove transaction:", response.status);
      }
    } catch (error) {
      console.error("Error removing transaction:", error);
    }
  };

  const handleRemoveTransaction = async (ticketNumber, transactionType) => {
    if (transactionType === "Outbound") {
      showModal();
      return;
    }
  
    if (transactionType === "Inbound") {
      setTransactionToRemove(ticketNumber); // Store the ticketNumber
      setShowInboundConfirmation(true);
      return;
    }
  
    // Find the correct ticketNumber from the filteredData array
    const itemToRemove = filteredData.find((item) => item.ticketNo === ticketNumber);
  
    if (itemToRemove) {
      console.log(`Removing transaction with ticket number ${itemToRemove.ticketNo}`);
      await removeTransaction(itemToRemove.ticketNo);
  
      // Re-fetch the counts
      fetchPendingCounts();
      fetchCompletedCounts();
    } else {
      console.log(`Transaction with ticket number ${ticketNumber} not found.`);
    }
  };

  const InboundConfirmationModal = ({ isOpen, onConfirm, onCancel }) => {
    return (
      <Modal open={isOpen} onOk={onConfirm} onCancel={onCancel} title="Confirmation">
        <p>Are you sure you want to skip this inbound transaction?</p>
      </Modal>
    );
  };




  const handleSearch = async () => {
    if (searchQuery === "") {
      setFilteredData(allData);
      return;
    }

    if (searchType === "ticketNo") {
      try {
        const response = await fetch(
          `http://49.249.180.125:8080/api/v1/qualities/searchByTicketNo/${searchQuery}?checkQualityCompleted=false&userId=${userId}`,
          {
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setFilteredData(data);
          } else {
            // Wrap the single object in an array
            setFilteredData([data]);
          }
        } else {
          console.error("Failed to search by ticket number:", response.status);
          setFilteredData([]);
        }
      } catch (error) {
        console.error("Error searching by ticket number:", error);
        setFilteredData([]);
      }
    } else if (searchType === "vehicleNo") {
      try {
        const response = await fetch(
          `http://49.249.180.125:8080/api/v1/qualities/searchByVehicleNo/${searchQuery}?userId=${userId}`,
          {
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          setFilteredData(data);
        } else {
          console.error("Failed to search by vehicle number:", response.status);
        }
      } catch (error) {
        console.error("Error searching by vehicle number:", error);
      }
    } else if (searchType === "supplier") {
      try {
        const response = await fetch(
          `http://49.249.180.125:8080/api/v1/qualities/searchBySupplierOrCustomer?supplierOrCustomerName=${searchQuery}&userId=${userId}`,
          {
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          setFilteredData(data);
        } else {
          console.error("Failed to search by supplier name:", response.status);
        }
      } catch (error) {
        console.error("Error searching by supplier name:", error);
      }
    } else if (searchType === "supplierAddress") {
      try {
        const response = await fetch(
          `http://49.249.180.125:8080/api/v1/qualities/searchBySupplierOrCustomer?supplierOrCustomerAddress=${searchQuery}&userId=${userId}`,
          {
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          setFilteredData(data);
        } else {
          console.error("Failed to search by supplier address:", response.status);
        }
      } catch (error) {
        console.error("Error searching by supplier address:", error);
      }
    }
  };


  return (
    <StyleSheetManager shouldForwardProp={isPropValid}>
    <SideBar3>
      <div
        style={{ height: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', fontFamily: "Arial", color: "#333", "--table-border-radius": "30px" }}
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
                View Transaction
              </h2>
            </div>
            <div style={{ flex: "1" }}></div>
          </div>

          <div className="row justify-content-center mb-3">
            <div className="col-12 col-md-3 d-flex align-items-center mb-2 mb-md-0">
              Show
              <>
                <InputNumber
                  min={1}
                  value={itemsPerPage}
                  onChange={(value) => setItemsPerPage(value)}
                  style={{
                    width: "60px",
                    marginLeft: "5px",
                    borderRadius: "5px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  }}
                />
                &nbsp;entries
              </>

            </div>
            <div className="col-12 col-md-6 mb-2 mb-md-0">
              <div style={{ display: "flex", alignItems: "center" }}>
                <Select
                  value={searchType}
                  onChange={(value) => setSearchType(value)}
                  style={{ width: 150, marginRight: "8px" }} // Increase width
                >
                  <Select.Option value="select">Select</Select.Option>
                  <Select.Option value="ticketNo">Ticket No</Select.Option>
                  <Select.Option value="vehicleNo">Vehicle No</Select.Option>
                  <Select.Option value="supplier">Supplier</Select.Option>
                  <Select.Option value="supplierAddress">Supplier Address</Select.Option>
                </Select>
                <Input.Search
                  placeholder="Search by Ticket No, Vehicle No, Supplier, or Address"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onSearch={handleSearch}
                  style={{ flex: 1, width: 200 }} // Decrease width
                />
              </div>

            </div>
            <div className="col-12 col-md-3 d-flex justify-content-end">
            <Dropdown overlay={<Menu items={menu.items} onClick={handleMaterialFilter} />}>
  <Button icon={<FilterOutlined />}>
    Filter <DownOutlined />
  </Button>
</Dropdown>
            </div>
          </div>

          <TransactionUpdatesContainer>
          <TransactionUpdateBox $bgColor="#CACDD1">
              <Stack direction="row" alignItems="center" spacing={1}>
                <PendingIcon />
                <Typography variant="body1" color="textSecondary">
                  Inbound Pending: {inboundPending}
                </Typography>
              </Stack>
            </TransactionUpdateBox>
            <TransactionUpdateBox bgColor="#9FC0EF">
              <Stack direction="row" alignItems="center" spacing={1}>
                <CheckCircleIcon />
                <Typography variant="body1" color="textSecondary">
                  Inbound Completed: {inboundCompleted}
                </Typography>
              </Stack>
            </TransactionUpdateBox>
            <TransactionUpdateBox bgColor="#CACDD1">
              <Stack direction="row" alignItems="center" spacing={1}>
                <PendingIcon />
                <Typography variant="body1" color="textSecondary">
                  Outbound Pending: {outboundPending}
                </Typography>
              </Stack>
            </TransactionUpdateBox>
            <TransactionUpdateBox bgColor="#9FC0EF">
              <Stack direction="row" alignItems="center" spacing={0}>
                <CheckCircleIcon />
                <Typography variant="body1" color="textSecondary">
                  Outbound Completed: {outboundCompleted}
                </Typography>
              </Stack>
            </TransactionUpdateBox>
            <TransactionUpdateBox bgColor="#91CEC6">
              <Stack direction="row" alignItems="center" spacing={1}>
                <PendingIcon />
                <Typography variant="body1" color="textSecondary">
                  Total Pending: {totalPending}
                </Typography>
              </Stack>
            </TransactionUpdateBox>
            <TransactionUpdateBox bgColor="#6FBE88">
              <Stack direction="row" alignItems="center" spacing={1}>
                <DoneAllIcon />
                <Typography variant="body1" color="textSecondary">
                  Total Completed: {totalCompleted}
                </Typography>
              </Stack>
            </TransactionUpdateBox>
          </TransactionUpdatesContainer>




          <div
            className="table-responsive"
            style={{
              overflowX: "auto",
              maxWidth: "100%",
              borderRadius: "10px",
              maxHeight: "500px",
            }}
          >
            <div style={{ maxHeight: "394px", overflowY: "auto" }}>
              <StyledTable
                className="ant-table table table-striped"
                style={{ marginBottom: 0 }}
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
                      Ticket No
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
                      Vehicle No
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
                      Product/Material
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
                      Product/MaterialType
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
                      Supplier/CustomerAddress
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
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(filteredData) &&
                    filteredData
                      .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
                      .map((item, index) => (
                        <tr key={index}>
                          <td
                            className="ant-table-cell"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            {item.ticketNo}
                          </td>
                          <td
                            className="ant-table-cell"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            {item.vehicleNo}
                          </td>
                          <td
                            className="ant-table-cell"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            {item.materialName}
                          </td>
                          <td
                            className="ant-table-cell"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            {item.materialType}
                          </td>
                          <td
                            className="ant-table-cell"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            {item.supplierOrCustomerName}
                          </td>
                          <td
                            className="ant-table-cell"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            {item.supplierOrCustomerAddress}
                          </td>
                          <td
                            className="ant-table-cell"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            {item.transactionType}
                          </td>
                          <td className="ant-table-cell" style={{ whiteSpace: "nowrap" }}>
                            <EditNoteIcon
                              style={{ color: "green", cursor: "pointer" }}
                              onClick={() => handleTicketClick(item.ticketNo, item.transactionType)}
                            />

                            {transactionType === "inbound" && (
                              <PlaylistRemoveIcon
                                style={{ color: "red", cursor: "pointer", marginLeft: "8px" }}
                                onClick={() => handleRemoveTransaction(item.ticketNo, item.transactionType)}
                              />
                            )}
                          </td>
                        </tr>
                      ))}
                </tbody>
              </StyledTable>
            </div>
          </div>

          <div className="d-flex justify-content-center mt-3">

        <Pagination
          current={currentPage + 1}
          total={filteredData.length}
          pageSize={itemsPerPage}
          showSizeChanger={false}
          showQuickJumper
          showTotal={(total, range) => ` Showing ${range[0]}-${range[1]} of ${total} entries`}
          onChange={(page) => setCurrentPage(page - 1)}
          style={{ marginBottom: '20px' }}
        />
      </div>
        </div>
      </div>
      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        title="Error"
      >
        <p>Quality parameter for Outbound must be filled.</p>
      </Modal>
      <InboundConfirmationModal
  isOpen={showInboundConfirmation}
  onConfirm={async () => {
    const itemToRemove = filteredData.find((item) => item.ticketNo === transactionToRemove);
    if (itemToRemove) {
      await removeTransaction(itemToRemove.ticketNo);
      fetchPendingCounts();
      fetchCompletedCounts();
    }
    setShowInboundConfirmation(false);
    setTransactionToRemove(""); // Reset the transactionToRemove state
  }}
  onCancel={() => {
    setShowInboundConfirmation(false);
    setTransactionToRemove(""); // Reset the transactionToRemove state
  }}
/>
    </SideBar3>
    </StyleSheetManager>
  );
}
export default QualityCheck;
