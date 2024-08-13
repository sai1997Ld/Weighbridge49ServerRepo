import { useState, useEffect, useRef, useCallback } from "react";
import "./Ongoing_Transaction.css";
import { useNavigate, Link} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { faTruck, faHome} from "@fortawesome/free-solid-svg-icons";
import SideBar6 from "../../SideBar/Sidebar6";
import { Button } from "antd";
import { Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Select, Input, Pagination } from "antd";
import { Row, Col } from "antd";
import TicketComponent from "../../Operator/src/components/transaction/TicketPrintComponent";
import { useReactToPrint } from "react-to-print";
import styled from "styled-components";

import 'jspdf-autotable';

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


const Ongoing_Transaction = () => {
  const [currentDate, setCurrentDate] = useState(getFormattedDate());
  const navigate = useNavigate();
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [weighments, setWeighments] = useState([]);
  const [pager, setPager] = useState(0);
  const [searchOption, setSearchOption] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [ticketData, setTicketData] = useState(null);
  const componentRef = useRef();

  const [pendingTareInbound, setPendingTareInbound] = useState(0);
  const [pendingTareOutbound, setPendingTareOutbound] = useState(0);
  const [pendingGrossInbound, setPendingGrossInbound] = useState(0);
  const [pendingGrossOutbound, setPendingGrossOutbound] = useState(0);
  const { Text } = Typography;

  const [searchPageNumber, setSearchPageNumber] = useState(0);
  const [totalSearchPages, setTotalSearchPages] = useState(0);
  const [searchWeighments, setSearchWeighments] = useState([]);
  const [searchPager, setSearchPager] = useState(0);
  const [allMaterials, setAllMaterials] = useState([]);

  const [userId, setUserId] = useState("");



  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    setUserId(userId);
  }, []);

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
        `/OperatorTransactionFromInbound/?ticketNumber=${ticketNo}&truckStatus=ENTRY`
      );
    } else {
      navigate(
        `/OperatorTransactionFromOutbound/?ticketNumber=${ticketNo}&truckStatus=ENTRY`
      );
    }
  };

  const itemsPerPage = 5;
  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const response = await axios.get(
        `http://49.249.180.125:8080/api/v1/materials`,
        {
          withCredentials: true,
        }
      );
      const materials = response.data.map((material) => material.materialName);
      setAllMaterials([...new Set(materials)]);
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  const fetchData = (pageNumber) => {
    axios
      .get(
        `http://49.249.180.125:8080/api/v1/weighment/getAll?page=${pageNumber}&userId=${userId}`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        setWeighments(response.data.weighmentTransactionResponses);
        setTotalPages(response.data.totalPages);
        setPager(response.data.totalElements);

        return axios.get(
          `http://49.249.180.125:8080/api/v1/status/PendingTare/Outbound?userId=${userId}`,
          {
            withCredentials: true,
          }
        );
      })
      .then((secondResponse) => {
        setPendingTareOutbound(secondResponse.data);
        console.log("Data from the second API:", secondResponse.data);

        return axios.get(
          `http://49.249.180.125:8080/api/v1/status/pendingGross/Outbound?userId=${userId}`,
          {
            withCredentials: true,
          }
        );
      })
      .then((thirdResponse) => {
        setPendingGrossOutbound(thirdResponse.data);
        console.log("Data from the third API:", thirdResponse.data);

        return axios.get(
          `http://49.249.180.125:8080/api/v1/status/pendingTare/Inbound?userId=${userId}`,
          {
            withCredentials: true,
          }
        );
      })
      .then((fourthResponse) => {
        setPendingTareInbound(fourthResponse.data);
        console.log("Data from the fourth API:", fourthResponse.data);

        return axios.get(
          `http://49.249.180.125:8080/api/v1/status/pendingGross/Inbound?userId=${userId}`,
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
    if (userId) {
      fetchData(pageNumber);
      const interval = setInterval(() => {
        fetchData(pageNumber);
      }, 50000);
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
    setSearchPageNumber(0);
    // Reset the search value when the option changes
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
    let apiUrl = `${api.defaults.baseURL}/serachApi/Inprocess`;

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
        break;
        
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


  const handlePrintClick = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    if (ticketData) {
      handlePrintClick();
    }
  }, [ticketData]);


  return (
    <SideBar6>
      <div
        className="container-fluid "
        style={{
          fontFamily: "Arial",
          color: "#333",
          "--table-border-radius": "30px",
        }}
      >
        <div className="container-fluid mt-0">
          <div className="mb-3 mt-1 text-center">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="text-center mx-auto">Transaction Dashboard</h2>
            <Link to={"/sales-dashboard"}>
              <FontAwesomeIcon
                icon={faHome}
                style={{ float: "right", fontSize: "1.5em" }}
                className="mb-2"
              />
            </Link>
          </div>
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
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", float: "right" }}>
                  <div>
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
            </Row>
          </div>
        </div>
        <div>
          <TransactionUpdatesContainer>
            <TransactionUpdateBox bgColor="#BDBDBD">
              <Text>
                <FontAwesomeIcon
                  icon={faTruck}
                  style={{ paddingRight: "5px" }}
                />
                Inbound Pending Tare Weight: <b>{pendingTareInbound}</b>
              </Text>
            </TransactionUpdateBox>
            <TransactionUpdateBox bgColor="#88CCFA">
              <Text>
                <FontAwesomeIcon
                  icon={faTruck}
                  style={{ paddingRight: "5px" }}
                />
                Inbound Pending Gross Weight: <b>{pendingGrossInbound}</b>
              </Text>
            </TransactionUpdateBox>
            <TransactionUpdateBox bgColor="#BDBDBD">
              <Text>
                <FontAwesomeIcon
                  icon={faTruck}
                  flip="horizontal"
                  style={{ paddingLeft: "5px" }}
                />
                Outbound Pending Tare Weight: <b>{pendingTareOutbound}</b>
              </Text>
            </TransactionUpdateBox>
            <TransactionUpdateBox bgColor="#88CCFA">
              <Text>
                <FontAwesomeIcon
                  icon={faTruck}
                  style={{ paddingLeft: "5px" }}
                  flip="horizontal"
                />
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
                    Vehicle In
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
                    Vehicle Out
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
                          {weighment.grossWeight}
                        </td>
                        <td
                          className="ant-table-cell"
                          style={{ whiteSpace: "nowrap", textAlign: "center" }}
                        >
                          {weighment.tareWeight}
                        </td>
                        <td
                          className="ant-table-cell"
                          style={{ whiteSpace: "nowrap", textAlign: "center" }}
                        >
                          {weighment.netWeight}
                        </td>
                        <td
                          className="ant-table-cell"
                          style={{ whiteSpace: "nowrap", textAlign: "center" }}
                        >
                          {weighment.materialName || weighment.productName}
                        </td>

                       
                        
                        <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                          {weighment.vehicleIn}
                        </td>
                        <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                          {weighment.vehicleOut}
                        </td>
                       
                        
                       

                      </tr>
                    ))
                  : weighments.map((weighment) => (
                      <tr key={weighment.id}>
                        <td
                          className="ant-table-cell"
                          style={{ textAlign: "center" }}
                        >
                          {/* <Button
                            onClick={() => {
                              goToTransForm(
                                weighment.ticketNo,
                                weighment.transactionType,
                                weighment.grossWeight,
                                weighment.tareWeight
                              );
                            }}
                            style={{ background: "#88CCFA" }}
                          > */}
                            {weighment.ticketNo}
                          {/* </Button> */}
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
                          {weighment.grossWeight}
                        </td>
                        <td
                          className="ant-table-cell"
                          style={{ whiteSpace: "nowrap", textAlign: "center" }}
                        >
                          {weighment.tareWeight}
                        </td>
                        <td
                          className="ant-table-cell"
                          style={{ whiteSpace: "nowrap", textAlign: "center" }}
                        >
                          {weighment.netWeight}
                        </td>
                        <td
                          className="ant-table-cell"
                          style={{ whiteSpace: "nowrap", textAlign: "center" }}
                        >
                          {weighment.materialName || weighment.productName}
                        </td>

                        <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                          {weighment.vehicleIn}
                        </td>
                        <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                          {weighment.vehicleOut}
                        </td>
                       
                       
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="d-flex justify-content-center mt-3">
        <Pagination
          current={(searchOption ? searchPageNumber : pageNumber) + 1}
          total={searchOption ? searchPager : pager}
          pageSize={itemsPerPage}
          showSizeChanger={false}
          showQuickJumper
          showTotal={(total, range) => `Showing ${range[0]}-${range[1]} of ${total} entries`}
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
    </SideBar6>
  );
};

export default Ongoing_Transaction;
