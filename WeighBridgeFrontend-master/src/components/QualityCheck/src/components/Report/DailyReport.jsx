import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import "./DailyReport.css";
import * as XLSX from "xlsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Header from "../../Pages/header"; // Import Header component
import Sidebar from "../../Pages/Sidebar"; // Import Sidebar component

import {
  faHome,
  faFileAlt,
  faVideo,
  faPrint,
  faTruck,
  faSignOut,
} from "@fortawesome/free-solid-svg-icons";

function DailyReport() {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;
  const [selectedDate, setSelectedDate] = useState("");
  const navigate = useNavigate();

  const handlehome = () => {
    navigate("/home");
  };

  const data = [
    {
      Date: "2024-04-02",
      "Ticket no.": 1,
      "Truck no.": "00 02 Al 1860",
      Supplier: "MCL",
      Material: "Coal",
      Product: "",
      "Po no.": "",
      "TP no.": "21T-11000000076982",
      "Gross Wt.": 3265,
      "Tare Wt.": 1935,
      "Ch_Wt.": 1330,
      "Net Wt.": 1330,
      Excess: 0,
      Status: "Inbound",
    },
    {
      Date: "2024-04-02",
      "Ticket no.": 2,
      "Truck no.": "00 14 OD 1334",
      Supplier: "MCL",
      Material: "Dolomite",
      Product: "",
      "Po no.": "",
      "TP no.": "21T-11000000076782",
      "Gross Wt.": 3265,
      "Tare Wt.": 1935,
      "Ch_Wt.": 1332,
      "Net Wt.": 1333,
      Excess: 1,
      Status: "Inbound",
    },
  ];

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    setCurrentPage(0);
  };

  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    setSelectedDate(getCurrentDate());
  }, []);

  const filteredData = selectedDate
    ? data.filter((item) => item.Date === selectedDate)
    : data;

  const offset = currentPage * itemsPerPage;
  const currentItems = filteredData.slice(offset, offset + itemsPerPage);

  const pageCount = Math.ceil(filteredData.length / itemsPerPage) || 1;

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleDownload = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DailyReport");
    XLSX.writeFile(wb, "daily_report.xlsx");
  };

  return (
    <div>
      <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      zIndex: 1000, // Ensure the header is above other content
    //   backgroundColor: "#333" // Example background color
    }} className="home-header d-flex justify-content-center">
      <h3 className="home-header-title text-4xl text-center text-uppercase text-white mt-3 d-flex justify-content-center align-items-center flex-wrap">
        Daily Report
      </h3>
    </div>
      <Sidebar /> {/* Use Sidebar component */}
      <div className="daily-report-main-content">
        <div className="daily-report-date d-flex">
          <label htmlFor="date" className="mt-1">
            &nbsp;Date:&nbsp;
          </label>
          <input
            type="date"
            id="date"
            name="date"
            className="form-control w-auto"
            value={selectedDate}
            onChange={handleDateChange}
            max={getCurrentDate()}
          />
        </div>
        <div className="dail-report-table table-responsive-xl table-responsive-md table-responsive-lg table-responsive-sm table-responsive-xxl mt-3">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Ticket no.</th>
                <th scope="col">Truck no.</th>
                <th scope="col">Supplier</th>
                <th scope="col">Material</th>
                <th scope="col">Product</th>
                <th scope="col">Po no.</th>
                <th scope="col">TP no.</th>
                <th scope="col">Gross Wt.</th>
                <th scope="col">Tare Wt.</th>
                <th scope="col">Ch_Wt.</th>
                <th scope="col">Net Wt.</th>
                <th scope="col">Excess</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.Date}</td>
                  <td>{item["Ticket no."]}</td>
                  <td>{item["Truck no."]}</td>
                  <td>{item.Supplier}</td>
                  <td>{item.Material}</td>
                  <td>{item.Product}</td>
                  <td>{item["Po no."]}</td>
                  <td>{item["TP no."]}</td>
                  <td>{item["Gross Wt."]}</td>
                  <td>{item["Tare Wt."]}</td>
                  <td>{item["Ch_Wt."]}</td>
                  <td>{item["Net Wt."]}</td>
                  <td>{item.Excess}</td>
                  <td>{item.Status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination-download-container">
          <div className="pagination-container mt-3">
            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              pageCount={pageCount}
              onPageChange={handlePageChange}
              containerClassName={"pagination-buttons"}
              previousLinkClassName={"previous-button"}
              nextLinkClassName={"next-button"}
              disabledClassName={"pagination-disabled"}
              activeClassName={"pagination-active"}
            />
          </div>
          <div className="download-btn-container text-center mt-3">
            <button
              className="btn btn-primary download-btn"
              onClick={handleDownload}
            >
              Download Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DailyReport;
