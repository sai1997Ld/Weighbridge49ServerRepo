import { useState, useEffect } from "react";
import { Table } from "antd";
import SideBar from "../../SideBar/SideBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./ViewCompany.css";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const ViewCompany = () => {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/company")
      .then((response) => response.json())
      .then((data) => setCompanies(data))
      .catch((error) => console.error("Error fetching companies:", error));
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "companyId",
      key: "companyId",
    },
    {
      title: "Company Name",
      dataIndex: "companyName",
      key: "companyName",
    },
    {
      title: "Email",
      dataIndex: "companyEmail",
      key: "companyEmail",
    },
    {
      title: "Contact No",
      dataIndex: "companyContactNo",
      key: "companyContactNo",
    },
    {
      title: "Address",
      dataIndex: "companyAddress",
      key: "companyAddress",
    },
    {
      title: "Status",
      dataIndex: "companyStatus",
      key: "companyStatus",
    },
    {
      title: "Sites",
      dataIndex: "sites",
      key: "sites",
      render: (sites) => (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {sites.map((site) => (
            <li key={site.siteId}>
              {site.siteName} - {site.siteAddress}
            </li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <SideBar>
      <div className="view-company-page container-fluid">
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="text-center mx-auto">View Company</h2>
          <Link to={"/admin-dashboard"}>
            <FontAwesomeIcon
              icon={faHome}
              style={{ float: "right", fontSize: "1.5em" }}
              className="mb-2"
            />
          </Link>
        </div>
        <div className="table-responsive">
          <Table
            dataSource={companies}
            columns={columns}
            rowKey="companyId"
            className="company-table mt-3 custom-table"
          />
        </div>
      </div>
    </SideBar>
  );
};

export default ViewCompany;
