import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SideBar2 from "../../../../SideBar/SideBar2";
import { Row, Col, Button } from "antd";
import { Typography } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRectangleXmark,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import * as XLSX from "xlsx";

const DailyReport = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [weighments, setWeighments] = useState([]);
  const { Text } = Typography;
  const navigate = useNavigate();

  useEffect(() => {
    // Set the default date to today's date
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
  }, []);

  const [userId, setUserId] = useState("");

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    setUserId(userId);
  }, []);

  useEffect(() => {
    if (userId) {
      if (selectedDate) {
        fetchData(selectedDate);
      }
    }
  }, [userId, selectedDate]);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const fetchData = (startDate) => {
    axios
      .get(
        `http://49.249.180.125:8080/api/v1/weighment/report?startDate=${startDate}&userId=${userId}`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        setWeighments(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const goBack = () => {
    navigate(-1);
  };

  const downloadExcel = () => {
    const fileName = "Daily_Report.xlsx";

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
        "In Time": response?.inTime?.split(" ")[1],
        "Out Time": response?.outTime?.split(" ")[1],
      }))
    );

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Daily Report");

    // Save the file
    XLSX.writeFile(wb, fileName);
  };

  return (
    <SideBar2>
      <div className="container-fluid mt-0">
        <div className="mb-3 mt-1 text-center">
          <button className="close-button" onClick={goBack}>
            <FontAwesomeIcon icon={faRectangleXmark} />
          </button>
          <h2 style={{ fontFamily: "Arial", marginBottom: "0px !important" }}>
            Daily Transaction Report
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
              <label htmlFor="datePicker">Select Date:</label>
              <input
                type="date"
                id="date"
                name="date"
                className="form-control form-control-sm"
                style={{ width: "120px" }}
                value={selectedDate}
                onChange={handleDateChange}
              />
            </Col>
            <Button
              style={{ backgroundColor: "#0077b6", color: "white" }}
              icon={<FontAwesomeIcon icon={faDownload} />}
              onClick={downloadExcel}
            >
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
                      textAlign: "center",
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
                      textAlign: "center",
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
                      textAlign: "center",
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
                      textAlign: "center",
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
                      textAlign: "center",
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
                      textAlign: "center",
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
                      textAlign: "center",
                    }}
                  >
                    Differences
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
                    In Time
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
                    Out Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {material.weighbridgeResponse2List.map((response, idx) => (
                  <tr key={idx}>
                    <td
                      className="ant-table-cell"
                      style={{ textAlign: "center" }}
                    >
                      {response.transactionDate}
                    </td>
                    <td
                      className="ant-table-cell"
                      style={{ textAlign: "center" }}
                    >
                      {response.vehicleNo}
                    </td>
                    <td
                      className="ant-table-cell"
                      style={{ textAlign: "center" }}
                    >
                      {response.tpNo}
                    </td>
                    <td
                      className="ant-table-cell"
                      style={{ textAlign: "center" }}
                    >
                      {response.challanDate}
                    </td>
                    <td
                      className="ant-table-cell"
                      style={{ textAlign: "center" }}
                    >
                      {response.supplyConsignmentWeight}
                    </td>
                    <td
                      className="ant-table-cell"
                      style={{ textAlign: "center" }}
                    >
                      {response.weighQuantity}
                    </td>
                    <td
                      className="ant-table-cell"
                      style={{ textAlign: "center" }}
                    >
                      {response.excessQty}
                    </td>
                    <td
                      className="ant-table-cell"
                      style={{ textAlign: "center" }}
                    >
                      {response?.inTime?.split(" ")[1]}
                    </td>
                    <td
                      className="ant-table-cell"
                      style={{ textAlign: "center" }}
                    >
                      {response?.outTime?.split(" ")[1]}
                    </td>
                  </tr>
                ))}
                {/* Summary row */}
                <tr>
                  <td
                    colSpan="4"
                    className="ant-table-cell"
                    style={{ textAlign: "center", fontWeight: "bold" }}
                  ></td>
                  <td
                    className="ant-table-cell"
                    style={{ textAlign: "center", fontWeight: "bold" }}
                  >
                    {material.ch_SumQty}
                  </td>
                  <td
                    className="ant-table-cell"
                    style={{ textAlign: "center", fontWeight: "bold" }}
                  >
                    {material.weight_SumQty}
                  </td>
                  <td
                    className="ant-table-cell"
                    style={{ textAlign: "center", fontWeight: "bold" }}
                  >
                    {material.shtExcess_SumQty}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </SideBar2>
  );
};

export default DailyReport;
