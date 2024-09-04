import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Row, Col , Button} from "antd";
import { Typography, notification } from "antd";
import moment from "moment";
import SideBar5 from "../../../../SideBar/SideBar5";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRectangleXmark , faDownload} from "@fortawesome/free-solid-svg-icons";
import * as XLSX from "xlsx";

const { Text } = Typography;

const MonthlyReport = () => {
  const [startDate, setStartDate] = useState(
    moment().startOf("month").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(
    moment().endOf("month").format("YYYY-MM-DD")
  );
  const [weighments, setWeighments] = useState([]);
  const navigate = useNavigate();

  const handleMonthChange = (event) => {
    const month = event.target.value;
    const start = moment(month).startOf("month").format("YYYY-MM-DD");
    const end = moment(month).endOf("month").format("YYYY-MM-DD");
    setStartDate(start);
    setEndDate(end);
  };
  const [userId, setUserId] = useState('');

  useEffect(() =>{
    const userId = sessionStorage.getItem('userId');
    setUserId(userId);
  }, []);

  useEffect(() => {
    if(userId){
    fetchData(startDate, endDate);
  }
  }, [userId,startDate, endDate]);

 

  const fetchData = (start, end) => {
    if (start && end) {
      axios
        .get(
          `http://49.249.180.125:8080/api/v1/weighment/report?startDate=${start}&endDate=${end}&userId=${userId}`,
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          setWeighments(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          notification.error({
            message: "Error",
            description: "There was an error fetching the report. Please try again later.",
          });
        });
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  const downloadExcel = () => {
    const fileName = "Monthly_Report.xlsx";

    // Prepare data for Excel export
    const data = weighments.flatMap((material) =>
      material.weighbridgeResponse2List.map((response) => ({
        Material: material.materialName,
        SupplierOrCustomer: material.supplierOrCustomer,
        Date: response.transactionDate,
        Vehicle: response.vehicleNo,
        CH_No: response.tpNo,
        CH_Date: response.challanDate,
        CH_Qty: response.supplyConsignmentWeight,
        Weigh_Qty: response.weighQuantity,
        Differences: response.excessQty,
      }))
    );

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Monthly Report");

    // Save the file
    XLSX.writeFile(wb, fileName);
  };
  return (
    <SideBar5>
      <div className="container-fluid">
        <div className="mb-3 mt-1 text-center">
          <button className="close-button" onClick={goBack}>
            <FontAwesomeIcon icon={faRectangleXmark} />
          </button>
          <h2 style={{ fontFamily: "Arial", marginBottom: "0px !important" }}>
            Monthly Transaction Report
          </h2>
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
              <label htmlFor="month">Select Month:</label>
              <input
                type="month"
                id="month"
                name="month"
                className="form-control form-control-sm"
                style={{ width: "120px" }}
                value={moment(startDate).format("YYYY-MM")}
                onChange={handleMonthChange}
              />
            </Col>
            <Button style={{backgroundColor: "#0077b6",color:"white"}} icon={<FontAwesomeIcon icon={faDownload} />} onClick={downloadExcel}>
            Download
          </Button> 
          </Row>
        </div>

        {weighments.map((material, index) => (
          <div key={index} className="table-responsive">
            <h5>
              {material.materialName} &nbsp; {material.supplierOrCustomer}
            </h5>
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
                      textAlign:"center",
                      borderRadius:"3px"
                    }}
                  >
                    Date
                  </th>
                  <th
                    className="ant-table-cell"
                    style={{
                      whiteSpace: "nowrap",
                      color: "white",
                      backgroundColor: "#0077b6",
                      borderRight: "1px solid white",
                      textAlign:"center",
                      borderRadius:"3px"
                    }}
                  >
                    Vehicle
                  </th>
                  <th
                    className="ant-table-cell"
                    style={{
                      whiteSpace: "nowrap",
                      color: "white",
                      backgroundColor: "#0077b6",
                      borderRight: "1px solid white",
                      textAlign:"center",
                      borderRadius:"3px"
                    }}
                  >
                    CH.No
                  </th>
                  <th
                    className="ant-table-cell"
                    style={{
                      whiteSpace: "nowrap",
                      color: "white",
                      backgroundColor: "#0077b6",
                      borderRight: "1px solid white",
                      textAlign:"center",
                      borderRadius:"3px"
                    }}
                  >
                    CH_Date
                  </th>
                  <th
                    className="ant-table-cell"
                    style={{
                      whiteSpace: "nowrap",
                      color: "white",
                      backgroundColor: "#0077b6",
                      borderRight: "1px solid white",
                      textAlign:"center",
                      borderRadius:"3px"
                    }}
                  >
                    CH_Qty
                  </th>
                  <th
                    className="ant-table-cell"
                    style={{
                      whiteSpace: "nowrap",
                      color: "white",
                      backgroundColor: "#0077b6",
                      borderRight: "1px solid white",
                      textAlign:"center",
                      borderRadius:"3px"
                    }}
                  >
                    Weigh_Qty
                  </th>
                  <th
                    className="ant-table-cell"
                    style={{
                      whiteSpace: "nowrap",
                      color: "white",
                      backgroundColor: "#0077b6",
                      borderRight: "1px solid white",
                      textAlign:"center",
                      borderRadius:"3px"
                    }}
                  >
                    Differences
                  </th>
                </tr>
              </thead>
              <tbody>
                {material.weighbridgeResponse2List.map((response, idx) => (
                  <tr key={idx}>
                    <td className="ant-table-cell" style={{textAlign:"center"}}>
                      {response.transactionDate}
                    </td>
                    <td className="ant-table-cell" style={{textAlign:"center"}}>{response.vehicleNo}</td>
                    <td className="ant-table-cell" style={{textAlign:"center"}}>{response.tpNo}</td>
                    <td className="ant-table-cell" style={{textAlign:"center"}}>{response.challanDate}</td>
                    <td className="ant-table-cell" style={{textAlign:"center"}}>
                      {response.supplyConsignmentWeight}
                    </td>
                    <td className="ant-table-cell" style={{textAlign:"center"}}>{response.weighQuantity}</td>
                    <td className="ant-table-cell" style={{textAlign:"center"}}>{response.excessQty}</td>
                  </tr>
                ))}
                  <tr>
                  <td colSpan="4" className="ant-table-cell" style={{ textAlign: "center", fontWeight: "bold"}}></td>
                  <td className="ant-table-cell" style={{ textAlign: "center", fontWeight: "bold" }}>{material.ch_SumQty}</td>
                  <td className="ant-table-cell" style={{ textAlign: "center", fontWeight: "bold" }}>{material.weight_SumQty}</td>
                  <td className="ant-table-cell" style={{ textAlign: "center", fontWeight: "bold" }}>{material.shtExcess_SumQty}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </SideBar5>
  );
};

export default MonthlyReport;
