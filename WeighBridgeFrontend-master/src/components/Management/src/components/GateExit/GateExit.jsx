import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { Chart, ArcElement } from "chart.js/auto";
import Swal from 'sweetalert2';
import { Button, Input, Select, DatePicker, Menu, Dropdown, Pagination } from "antd";
import { FilterOutlined } from '@ant-design/icons';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Typography } from "antd";
import styled from "styled-components";
import SideBar4 from "../../../../SideBar/SideBar4";
import moment from "moment";
import DoneAllIcon from '@mui/icons-material/DoneAll';
import PendingIcon from '@mui/icons-material/Pending';




const { Option } = Select;
const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1/gate',
  headers: {
    'Content-Type': 'application/json',
  },

  withCredentials: true,
});



const ManagementGateExit = ({ onConfirmTicket = () => { } }) => {
  const [currentDate, setCurrentDate] = useState();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [searchOption, setSearchOption] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [totalPage, setTotalPage] = useState(0);
  const [date, setDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [systemOutTime, setSystemOutTime] = useState('');
  const [vehicleEntryDetails, setVehicleEntryDetails] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [startPageNumber, setStartPageNumber] = useState(1);
  const itemsPerPage = 7;
  const [totalEntries, setTotalEntries] = useState(0);
  const [reportStatuses, setReportStatuses] = useState({}); // function for quality report 
  const [materialOptions, setMaterialOptions] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedTransactionType, setSelectedTransactionType] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const { Text } = Typography;
  const [inboundPending, setInboundPending] = useState(null);

  const [outboundPending, setOutboundPending] = useState(null);

  const [Completed, setCompleted] = useState(null);

  // const [isEditDisabled, setIsEditDisabled] = useState(false);



  const disabledFutureDate = (current) => {
    return current && current > moment().endOf("day");
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


  // Code for Date:

  // useEffect(() => {
  //   const today = new Date();
  //   const formattedDate = today.toISOString().split("T")[0];
  //   setCurrentDate(formattedDate);
  // }, []);


  // useEffect(() => {
  //   const today = new Date().toISOString().split('T')[0];
  //   setSelectedDate(today);
  // }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date && date.isValid()) {
      console.log("The date is valid:", date);
      fetchData(currentPage, date);
    } else {
      console.log("No date selected, fetching all transactions");
      fetchData(currentPage, null);
    }
  };

  // Code for Searching:

  // const handleSearch = (value) => {
  //   setSearchQuery(value);
  //   setCurrentPage(0); // Reset to the first page when searching
  //   console.log(value); 
  // };
  const handleSearchOptionChange = (value) => {
    setSearchOption(value);
    setSearchValue(''); // Reset the search value when the option changes
  };
  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearch = async () => {
    if (!searchValue) {
      message.error('Please enter a search value');
      return;
    }
  
    const selectedCompany = sessionStorage.getItem('company');
    const selectedSiteName = sessionStorage.getItem('site');
  
    if (!selectedCompany) {
      console.error('Company not selected');
      return;
    }
  
    let apiUrl = `http://localhost:8080/api/v1/management/transactions/ongoing?vehicleStatus=completed&companyName=${encodeURIComponent(selectedCompany)}`;
  
    if (selectedSiteName) {
      apiUrl += `&siteName=${encodeURIComponent(selectedSiteName)}`;
    }
  
    // Add the search parameter based on the selected option
    if (searchOption === 'ticketNo') {
      apiUrl += `&ticketNo=${encodeURIComponent(searchValue)}`;
    } else if (searchOption === 'vehicleNo') {
      apiUrl += `&vehicleNo=${encodeURIComponent(searchValue)}`;
    }
  
    try {
      const response = await api.get(apiUrl);
      console.log(response.data);
      setVehicleEntryDetails(response.data.transactions);
      setTotalPage(response.data.totalPages);
      setTotalEntries(response.data.totalElements);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response && error.response.data && error.response.data.message) {
        message.error(error.response.data.message);
      } else {
        message.error('Failed to fetch data. Please try again.');
      }
    }
  };
  // Code for Filltered Data:



  // Function to fetch material options from the API
  const fetchMaterialOptions = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/gate/fetch-ProductsOrMaterials", {
        credentials: "include" // Include credentials option here
      });
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
    console.log('Selected filter:', e.key);
    const [filterType, filterValue] = e.key.split('-');
    if (filterType === 'material') {
      setSelectedMaterial(filterValue);
      // Apply filter based on material only
      fetchData(currentPage, selectedDate, filterValue, selectedTransactionType); 
    } else if (filterType === 'transaction') {
      setSelectedTransactionType(filterValue);
      // Apply filter based on transaction type only
      fetchData(currentPage, selectedDate, selectedMaterial, filterValue);
    }
  };
  

  useEffect(() => {
    if (currentPage !== null) {
      fetchData(currentPage, selectedDate, selectedMaterial, selectedTransactionType);
    }
  }, [currentPage, selectedDate, selectedMaterial, selectedTransactionType]);
  
  useEffect(() => {
    fetchData(0); // Initial fetch with page 0 and no date
  }, []);

  
  // Menu for material and transaction type filters
  const menu = (
    <Menu onClick={handleMaterialFilter}>
      <Menu.SubMenu key="1" title="Product/Material">
        {materialOptions.map((option) => (
          <Menu.Item key={`material-${option}`}>{option}</Menu.Item>
        ))}
      </Menu.SubMenu>
      <Menu.SubMenu key="2" title="Transaction Type">
        <Menu.Item key="transaction-inbound">Inbound</Menu.Item>
        <Menu.Item key="transaction-outbound">Outbound</Menu.Item>
      </Menu.SubMenu>
    </Menu>
  );

  
  // API for Pagination:

  useEffect(() => {
    // Initial fetch
    fetch("http://localhost:8080/api/v1/management/transactions/ongoing?vehicleStatus=completed&transactionType=inbound&companyName=${company}&siteName=${site},${site}", {
      credentials: "include"
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setVehicleEntryDetails(data.transactions);
        setTotalPage(data.totalPages);
        setTotalEntries(data.totalElements); // Make sure this line is present
        console.log("total Page " + data.totalPages);

        // Set the current page to 0 to trigger the paginated fetch
        // setCurrentPage(0);
        // Apply initial filter
        // applyFilter(data.transactions, selectedMaterial, selectedTransactionType);
      })
      .catch(error => {
        console.error('Error fetching vehicle entry details:', error);
      });
    fetchData();
  }, []);

  // useEffect(() => {
  //   applyFilter(vehicleEntryDetails, selectedMaterial, selectedTransactionType);
  // }, [vehicleEntryDetails, selectedMaterial, selectedTransactionType]);


  useEffect(() => {
    if (currentPage !== null) {
      fetchData(currentPage, selectedDate, selectedMaterial);
    }
  }, [currentPage, selectedDate, selectedMaterial]);

  useEffect(() => {
    fetchData(0); // Initial fetch with page 0 and no date
  }, []);

  const fetchData = (pageNumber, date = selectedDate, material = selectedMaterial, transactionType = selectedTransactionType) => {
    const selectedCompany = sessionStorage.getItem('company');
    const selectedSiteName = sessionStorage.getItem('site');
  
    if (!selectedCompany) {
      console.error('Company not selected');
      return;
    }
  
    let apiUrl = `http://localhost:8080/api/v1/management/transactions/ongoing?vehicleStatus=completed&companyName=${selectedCompany}`;
  
    if (selectedSiteName) {
      apiUrl += `&siteName=${selectedSiteName}`;
    }
  
    apiUrl += `&page=${pageNumber}`;
  
    if (date && date.isValid()) {
      const formattedDate = date.format('YYYY-MM-DD');
      apiUrl += `&date=${formattedDate}`;
    }
  
    if (material) {
      apiUrl += `&materialName=${encodeURIComponent(material)}`;
    }
  
    if (transactionType) {
      apiUrl += `&transactionType=${transactionType}`;
    }
  
    fetch(apiUrl, {
      credentials: "include"
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setVehicleEntryDetails(data.transactions);
        setTotalPage(data.totalPages);
        setTotalEntries(data.totalElements);
        console.log("total Page " + data.totalPages);
      })
      .then((secondResponse) => {
        setInboundPending(secondResponse.data); // Set the inbound pending data
        console.log("Data from the second API:", secondResponse.data);
      })
      .then((thirdResponse) => {
        setOutboundPending(thirdResponse.data);
        console.log("Data from the third API:", thirdResponse.data);
      })
      .then((fourthResponse) => {
        setCompleted(fourthResponse.data);
        console.log("Data from the fourth API:", fourthResponse.data);
      })
      .catch(error => {
        console.error('Error fetching vehicle entry details:', error);
      });
  };
  


  const pageCount = totalPage;

  const chartRef = useRef(null);
  const chartRef2 = useRef(null);
  const homeMainContentRef = useRef(null);

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



  

 

  return (
    <SideBar4>
      <div style={{ fontFamily: "Arial", color: "#333", "--table-border-radius": "30px" }}>
        <div className="container-fluid mt-0">
          <div className="d-flex justify-content-between align-items-center" style={{ marginTop: "1rem", marginBottom: "1rem" }}>
            <div className="d-flex justify-content-between align-items-center w-100">
              <div style={{ flex: "2" }}>
              <DatePicker
  value={selectedDate}
  onChange={handleDateChange}
  disabledDate={disabledFutureDate}
  format="DD-MM-YYYY"
  style={{
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  }}
  allowClear={true} // This allows the user to clear the date
/>
              </div>
              <div style={{ flex: "15", textAlign: "center" }}>
                <h2 style={{ fontFamily: "Arial", marginBottom: "0px", textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)" }}>
                Processed Transactions
                </h2>
              </div>
              <div style={{ flex: "1", textAlign: "right" }}>
                <Link to="/management-dashboard">
                  <FontAwesomeIcon icon={faHome} style={{ fontSize: '1.5em' }} />
                </Link>
              </div>
            </div>




            <div style={{ flex: "1" }}></div> {/* To balance the layout */}
          </div>
          <div className="d-flex justify-content-center mb-3">
            <div className="d-flex align-items-center" style={{ marginLeft: "auto", marginRight: "auto" }}>
              <Select
                placeholder="Select a search option"
                style={{ width: "200px" }}
                onChange={handleSearchOptionChange}
              // suffixIcon={<SearchOutlined />}
              >

                <Option value="ticketNo">Search by Ticket No</Option>
                <Option value="vehicleNo">Search by Vehicle No</Option>
              </Select>
              {searchOption && (
                <Input
                  placeholder={`Enter ${searchOption}`}
                  style={{ width: "200px", }}
                  value={searchValue}
                  onChange={handleInputChange}
                  onPressEnter={handleSearch} // Optionally allow search on Enter key press
                />
              )}
            </div>
            <div className=" d-flex justify-content-end">
              <Dropdown overlay={menu} onSelect={handleMaterialFilter}>
                <Button icon={<FilterOutlined />}>Filter</Button>
              </Dropdown>
            </div>
          </div>


          <div className=" table-responsive" style={{ overflowX: "auto", maxWidth: "100%", borderRadius: "10px" }}>
            <div >
              <table className=" ant-table table table-striped" style={{ width: "100%" }} >
                <thead className="ant-table-thead" >
                  <tr className="ant-table-row">
                    <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}>Ticket No.</th>
                    <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}>Vehicle No.</th>
                    <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}>In Time/Date</th>
                    <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}>Out Time/Date</th>
                    <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}>Transporter Name</th>
                    <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}>Supplier/Customer</th>
                    <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}>Supplier's /Customer's Address</th>
                    <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}>Material/Product</th>
                    <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}>Gross weight</th>
                    <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}>Tare weight</th>
                    <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}>Net weight</th>
                    <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}>TP No.</th>
                    <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}>TP Net weight(Ton)</th>
                    <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}>PO No.</th>
                    <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}>Challan No.</th>
                    {/* <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}>Transaction Status </th> */}
                    <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}>Transaction Type</th>
                    {/* <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}>Quality Report </th> */}
                    {/* <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}>OUT</th> */}
                  </tr>
                </thead>
                <tbody className="text-center">
                  {vehicleEntryDetails.map((entry) => (
                    <tr key={entry.id}>
                      <td className="ant-table-cell" style={{ textAlign: "center" }} >{entry.ticketNo}</td>
                      <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}> {entry.vehicleNo} </td>
                      <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}> {entry.vehicleIn} </td>
                      <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}> {entry.vehicleOut}</td>
                      <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}> {entry.transporter}</td>
                      <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}> {entry.transactionType === 'Inbound' ? entry.supplier : entry.customer}</td>
                      <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}> {entry.transactionType === 'Inbound' ? entry.supplierAddress : entry.customerAddress}</td>
                      <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}> {entry.material}</td>
                      <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}> {entry.grossWeight}</td>
                      <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}> {entry.tareWeight}</td>
                      <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}> {entry.netWeight}</td>
                      <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}> {entry.tpNo}</td>
                      <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}> {entry.tpNetWeight}</td>
                      <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}> {entry.poNo}</td>
                      <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}> {entry.challanNo}</td>
                      {/* <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}> {entry.transactionStatus}</td> */}
                      <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}>{entry.transactionType}</td>

                      {/* <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                          <button className="btn btn-success btn-sm" style={{ padding: "3px 6px" }}
                            onClick={() => handleQualityReportDownload(entry.ticketNo)}
                            disabled={!entry.quality}
                          >
                            <FontAwesomeIcon icon={faFileWord} />
                          </button> 
                        </td>*/}
                      {/* <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                        <button className="image-button" onClick={() => handleVehicleExit(entry.ticketNo)}>
                          <div className="image-container" style={{ border: 'none' }}>
                            <img src={OutTimeVehicle} alt="Out" className="time-image" />
                          </div>
                        </button>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-center mt-3">

      <Pagination
  current={currentPage + 1}
  total={totalEntries} // Use totalEntries instead of filteredData.length
  pageSize={itemsPerPage}
  showSizeChanger={false}
  showQuickJumper
  showTotal={(total, range) => ` Showing ${range[0]}-${range[1]} of ${total} entries`}
  onChange={(page) => setCurrentPage(page - 1)}
  style={{ marginBottom: '20px' }}
/>
</div>
    </SideBar4>
  );
};

export default ManagementGateExit;
