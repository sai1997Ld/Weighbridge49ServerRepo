import { useState, useEffect } from "react";
import axios from "axios";
import { Row, Col, Button, Select } from "antd";

import { useNavigate } from "react-router-dom";
import Sidebar6 from "../../SideBar/Sidebar6";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRectangleXmark,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import * as XLSX from "xlsx";

const { Option } = Select;

const SalesCustomReport = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [weighments, setWeighments] = useState([]);
  const [filteredWeighments, setFilteredWeighments] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState([]);
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [selectedChallans, setSelectedChallans] = useState([]);
  const [allMaterials, setAllMaterials] = useState([]);
  const [allSuppliers, setAllSuppliers] = useState([]);
  const [allVehicles, setAllVehicles] = useState([]);
  const [allChallans, setAllChallans] = useState([]);

  const navigate = useNavigate();
 

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

 const userId = sessionStorage.getItem("userId");

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
          setFilteredWeighments(response.data);
          const materials = response.data.map(
            (material) => material.materialName
          );
          setAllMaterials([...new Set(materials)]);
          const suppliers = response.data.map(
            (material) => material.supplierOrCustomer
          );
          setAllSuppliers([...new Set(suppliers)]);
          const vehicles = response.data.flatMap((material) =>
            material.weighbridgeResponse2List.map(
              (response) => response.vehicleNo
            )
          );
          setAllVehicles([...new Set(vehicles)]);
          const challans = response.data.flatMap((material) =>
            material.weighbridgeResponse2List.map((response) => response.tpNo)
          );
          setAllChallans([...new Set(challans)]);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  };

  useEffect(() => {
    if (userId) {
      fetchData(startDate, endDate);
    }
  }, [userId, startDate, endDate]);

  const filterData = () => {
    let filtered = weighments;
    if (selectedMaterials.length > 0) {
      filtered = filtered.filter((material) =>
        selectedMaterials.includes(material.materialName)
      );
    }
    if (selectedSuppliers.length > 0) {
      filtered = filtered.filter((material) =>
        selectedSuppliers.includes(material.supplierOrCustomer)
      );
    }
    if (selectedVehicles.length > 0) {
      filtered = filtered.filter((material) =>
        material.weighbridgeResponse2List.some((response) =>
          selectedVehicles.includes(response.vehicleNo)
        )
      );
    }
    if (selectedChallans.length > 0) {
      filtered = filtered.filter((material) =>
        material.weighbridgeResponse2List.some((response) =>
          selectedChallans.includes(response.tpNo)
        )
      );
    }
    setFilteredWeighments(filtered);
  };

  useEffect(() => {
    filterData();
  }, [
    selectedMaterials,
    selectedSuppliers,
    selectedVehicles,
    selectedChallans,
    weighments,
  ]);

  
  const downloadExcel = () => {
    const fileName = "Customized_Report.xlsx";

    const data = filteredWeighments.flatMap((material) =>
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
    XLSX.utils.book_append_sheet(wb, ws, "Customized Report");

    XLSX.writeFile(wb, fileName);
  };

  const handleMaterialChange = (selectedItems) => {
    setSelectedMaterials(selectedItems);
  };

  const handleSupplierChange = (selectedItems) => {
    setSelectedSuppliers(selectedItems);
  };

  const handleVehicleChange = (selectedItems) => {
    setSelectedVehicles(selectedItems);
  };

  const handleChallanChange = (selectedItems) => {
    setSelectedChallans(selectedItems);
  };

  return (
    <Sidebar6>
      <div className="container-fluid mt-0">
        <div className="mb-3 mt-1 text-center">
        <div className="d-flex justify-content-between align-items-center">
              <h2 className="text-center mx-auto">Custom Transaction Report</h2>
   
              <FontAwesomeIcon icon={faRectangleXmark} style={{float: "right", fontSize: "1.5em", color: "red", cursor: "pointer"}}  className="mb-2" onClick={() => navigate(-1)}/>
 
        </div>

          <Row gutter={[16, 16]} justify="start" align="top">
            <Col xs={24} sm={12} md={6} style={{ display: "flex", justifyContent: "start", alignItems: "center" }}>
              <label htmlFor="startDate">Start Date: </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                className="form-control form-control-sm"
                style={{ width: "120px" }}
                value={startDate}
                onChange={handleStartDateChange}
              />
            </Col>
            <Col xs={24} sm={12} md={6} style={{ display: "flex", justifyContent: "start", alignItems: "center" }}>
              <label htmlFor="endDate">End Date:</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                className="form-control form-control-sm"
                style={{ width: "120px" }}
                value={endDate}
                onChange={handleEndDateChange}
              />
            </Col>
            <Button style={{ backgroundColor: "#0077b6", color: "white" }} icon={<FontAwesomeIcon icon={faDownload} />} onClick={downloadExcel}>
              Download
            </Button>
          </Row>
        </div>

        <Row gutter={[16, 16]} justify="start"  style={{ boxShadow:"4px" }}>
          <Col xs={24} sm={12} md={6}>
            <div className="mb-3 mt-3">
              <h5>Filter by Material or Product</h5>
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="Select materials"
                value={selectedMaterials}
                onChange={handleMaterialChange}
              >
                {allMaterials.map((material) => (
                  <Option key={material} value={material}>
                    {material}
                  </Option>
                ))}
              </Select>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div className="mb-3 mt-3">
              <h5>Filter by Supplier or Customer</h5>
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="Select suppliers or customers"
                value={selectedSuppliers}
                onChange={handleSupplierChange}
              >
                {allSuppliers.map((supplier) => (
                  <Option key={supplier} value={supplier}>
                    {supplier}
                  </Option>
                ))}
              </Select>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div className="mb-3 mt-3">
              <h5>Filter by Vehicle Number</h5>
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="Select vehicles"
                value={selectedVehicles}
                onChange={handleVehicleChange}
              >
                {allVehicles.map((vehicle) => (
                  <Option key={vehicle} value={vehicle}>
                    {vehicle}
                  </Option>
                ))}
              </Select>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div className="mb-3 mt-3">
              <h5>Filter by TP No</h5>
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="Select challans"
                value={selectedChallans}
                onChange={handleChallanChange}
              >
                {allChallans.map((challan) => (
                  <Option key={challan} value={challan}>
                    {challan}
                  </Option>
                ))}
              </Select>
            </div>
          </Col>
        </Row>

        {filteredWeighments.map((material, index) => (
          <div key={index} className="table-responsive">
            <h5>
              {material.materialName} &nbsp; {material.supplierOrCustomer}
            </h5>
            <table className="ant-table table table-striped">
              <thead className="ant-table-thead">
                <tr className="ant-table-row">
                  <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white", textAlign: "center", borderRadius:"3px"}}>Date</th>
                  <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white", textAlign: "center", borderRadius:"3px"}}>Vehicle</th>
                  <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white", textAlign: "center", borderRadius:"3px"}}>CH.No</th>
                  <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white", textAlign: "center", borderRadius:"3px"}}>CH_Date</th>
                  <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white", textAlign: "center", borderRadius:"3px"}}>CH_Qty</th>
                  <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white", textAlign: "center", borderRadius:"3px"}}>Weigh_Qty</th>
                  <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white", textAlign: "center", borderRadius:"3px"}}>Differences</th>
                </tr>
              </thead>
              <tbody>
                {material.weighbridgeResponse2List.map((response, idx) => (
                  <tr key={idx} className="ant-table-row">
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
                <tr className="ant-table-row">
                  <td
                    colSpan="4"
                    className="ant-table-cell"
                    style={{ fontWeight: "bold" }}
                  ></td>
                  <td className="ant-table-cell" style={{ fontWeight: "bold" , textAlign:"center"}}>
                    {material.ch_SumQty}
                  </td>
                  <td className="ant-table-cell" style={{ fontWeight: "bold" , textAlign:"center"}}>
                    {material.weight_SumQty}
                  </td>
                  <td className="ant-table-cell" style={{ fontWeight: "bold" , textAlign:"center"}}>
                    {material.shtExcess_SumQty}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </Sidebar6>
  );
};

export default SalesCustomReport;
