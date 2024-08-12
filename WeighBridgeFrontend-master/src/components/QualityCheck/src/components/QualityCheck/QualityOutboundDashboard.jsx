import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import SideBar3 from "../../../../SideBar/SideBar3";

import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";
import { Input, InputNumber, DatePicker, Select, Pagination } from "antd";

import moment from "moment";
import { Button, Dropdown, Menu } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import EditNoteIcon from "@mui/icons-material/EditNote";
import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";

// Styled component for the table
const StyledTable = styled.table`
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;



function QualityOutboundTransaction() {
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
  const userId = sessionStorage.getItem("userId");


  const disabledFutureDate = (current) => {
    return current && current > moment().endOf("day");
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAllTransactions();
      // Filter only inbound transactions
      const inboundData = data.filter(item => item.transactionType.toLowerCase() === 'outbound');
      setAllData(inboundData);
      setFilteredData(inboundData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredData(allData);
    }
  }, [searchQuery, allData]);




  const fetchAllTransactions = async () => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/v1/qualities/getAllTransaction?userId=${userId}`,
      {
        credentials: "include",
      }
    );
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data)) {
        return data;
      } else {
        console.error("Unexpected data format:", data);
        return [];
      }
    } else {
      console.error("Failed to fetch all transactions:", response.status);
      return [];
    }
  } catch (error) {
    console.error("Error fetching all transactions:", error);
    return [];
  }
};

  const fetchMaterialOptions = async () => {
    try {

      const productResponse = await fetch(
        `http://localhost:8080/api/v1/qualities/products?userId=${userId}`,
        {
          credentials: "include",
        }
      );

      if (productResponse.ok) {
        const productData = await productResponse.json();
        const combinedOptions = [...productData];
        setMaterialOptions(combinedOptions);
      } else {
        console.error(
          "Failed to fetch product options:",
          productResponse.status
        );
      }
    } catch (error) {
      console.error("Error fetching  product options:", error);
    }
  };

  const [materialOptions, setMaterialOptions] = useState([]);

  useEffect(() => {
    fetchMaterialOptions();
  }, []);

  const fetchInboundTransactions = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/qualities/fetch-InboundTransaction?userId=${userId}`,
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
        `http://localhost:8080/api/v1/qualities/fetch-OutboundTransaction?userId=${userId}`,
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


  const menu = (
    <Menu onClick={handleMaterialFilter}>
      <Menu.SubMenu key="1" title="Product">
        {materialOptions.map((option, index) => (
          <Menu.Item key={`material-${index}`}>{option}</Menu.Item>
        ))}
      </Menu.SubMenu>
    </Menu>
  );

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
      const response = await fetch(`http://localhost:8080/api/v1/qualities/${ticketNumber}?userId=${userId}`, {
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

  const handleRemoveTransaction = (ticketNumber, transactionType) => {
    if (transactionType === "Outbound") {
      console.log("Cannot remove Outbound transactions.");
      return;
    }

    console.log(`Removing transaction with ticket number ${ticketNumber}`);
    removeTransaction(ticketNumber);
  };


  const handleSearch = async () => {
    if (searchQuery === "") {
      setFilteredData(allData);
      return;
    }

    if (searchType === "ticketNo") {
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/qualities/searchByTicketNo/${searchQuery}?checkQualityCompleted=false&userId=${userId}`,
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
          `http://localhost:8080/api/v1/qualities/searchByVehicleNo/${searchQuery}?userId=${userId}`,
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
    } else if (searchType === "customer") {
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/qualities/searchBySupplierOrCustomer?supplierOrCustomerName=${searchQuery}&userId=${userId}`,
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
    } else if (searchType === "customerAddress") {
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/qualities/searchBySupplierOrCustomer?supplierOrCustomerAddress=${searchQuery}&userId=${userId}`,
          {
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          setFilteredData(data);
        } else {
          console.error("Failed to search by customer address:", response.status);
        }
      } catch (error) {
        console.error("Error searching by customer address:", error);
      }
    }
  };

  return (
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
                Outbound Transaction
              </h2>
            </div>
            <div style={{ flex: "1" }}></div>
          </div>

          <div className="row justify-content-center mb-3">
            <div className="col-12 col-md-3 d-flex align-items-center mb-2 mb-md-0">
              Show
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
                  <Select.Option value="customer">Customer</Select.Option>
                  <Select.Option value="customerAddress">Customer Address</Select.Option>
                </Select>
                <Input.Search
                  placeholder="Search by Ticket No, Vehicle No, Customer, or Customer Address"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onSearch={handleSearch}
                  style={{ flex: 1, width: 200 }} // Decrease width
                />
              </div>

            </div>
            <div className="col-12 col-md-3 d-flex justify-content-end">
              <Dropdown overlay={menu} onSelect={handleMaterialFilter}>
                <Button icon={<FilterOutlined />}>Filter</Button>
              </Dropdown>
            </div>
          </div>

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
                      Product
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
                      ProductType
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
                      Customer
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
                      CustomerAddress
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
                            {item.transactionType === "inbound" && (
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
          {/* Pagination */}
        
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

    </SideBar3>
  );
}
export default QualityOutboundTransaction;