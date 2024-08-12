// SalesDisplay.jsx
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Table } from "antd";
import SideBar6 from "../../SideBar/Sidebar6";
import "./SalesDisplay.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { faHome } from "@fortawesome/free-solid-svg-icons";

const SalesDisplay = () => {
  const [salesProcessData, setSalesProcessData] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const saleOrderNo = new URLSearchParams(location.search).get("saleOrderNo");
    if (saleOrderNo) {
      fetch(
        `http://localhost:8080/api/v1/salesProcess/bySaleOrderNo/View?saleOrderNo=${saleOrderNo}`
      )
        .then((response) => response.json())
        .then((data) => setSalesProcessData(data))
        .catch((error) =>
          console.error("Error fetching sales process data:", error)
        );
    }
  }, [location.search]);

  const columns = [
    {
      title: "Sale Pass No",
      dataIndex: "salePassNo",
      key: "salePassNo",
    },
    // {
    //   title: "Consignment Weight",
    //   dataIndex: "consignmentWeight",
    //   key: "consignmentWeight",
    // },
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Product Type",
      dataIndex: "productType",
      key: "productType",
    },
    {
      title: "Transporter Name",
      dataIndex: "transporterName",
      key: "transporterName",
    },
    {
      title: "Vehicle No",
      dataIndex: "vehicleNo",
      key: "vehicleNo",
    },
  ];

  return (
    <SideBar6>
      <div className="sales-display-page container-fluid">
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="text-center mx-auto">Sales Pass Details</h2>
          <Link to={"/sales-dashboard"}>
            <FontAwesomeIcon
              icon={faHome}
              style={{ float: "right", fontSize: "1.5em" }}
              className="mb-2"
            />
          </Link>
        </div>
        <div className="table-responsive">
          <Table
            dataSource={salesProcessData}
            columns={columns}
            rowKey="salePassNo"
            className="user-table mt-3 custom-table"
          />
        </div>
      </div>
    </SideBar6>
  );
};

export default SalesDisplay;
