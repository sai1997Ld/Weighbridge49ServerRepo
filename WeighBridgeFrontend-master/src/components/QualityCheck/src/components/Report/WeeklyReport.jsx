import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import "./WeeklyReport.css";
import * as XLSX from "xlsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Header from "../../Pages/header"; // Import Header component
import Sidebar from "../../Pages/Sidebar"; // Import Sidebar component

import {
  faHome,
  faTruck,
  faPrint,
  faVideo,
  faFileAlt,
  faSignOut,
} from "@fortawesome/free-solid-svg-icons";

function WeeklyReport() {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;
  const [selectedWeek, setSelectedWeek] = useState("");
  const [data] = useState([
    {
      week: "2024-04-01 to 2024-04-07",
      supplier: "ABC Mining Co.",
      customer: "Global Manufacturers",
      inTime: "09:00 AM",
      material: "Bauxite",
      netWeight: 5000,
      outTime: "04:30 PM",
    },
    {
      week: "2024-04-01 to 2024-04-07",
      supplier: "MCL",
      customer: "Kasi Vishwanath",
      inTime: "11:00 AM",
      material: "Coal",
      netWeight: 3500,
      outTime: "02:15 PM",
    },
  ]);
  const navigate = useNavigate();

  const handlehome = () => {
    navigate("/home");
  };

  const handleWeekChange = (event) => {
    setSelectedWeek(event.target.value);
    setCurrentPage(0);
  };

  const getCurrentWeek = () => {
    const now = new Date();
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const weekEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 6);
    const startYear = weekStart.getFullYear();
    const startMonth = String(weekStart.getMonth() + 1).padStart(2, "0");
    const startDay = String(weekStart.getDate()).padStart(2, "0");
    const endYear = weekEnd.getFullYear();
    const endMonth = String(weekEnd.getMonth() + 1).padStart(2, "0");
    const endDay = String(weekEnd.getDate()).padStart(2, "0");
    return `${startYear}-${startMonth}-${startDay} to ${endYear}-${endMonth}-${endDay}`;
  };

  useEffect(() => {
    setSelectedWeek(getCurrentWeek());
  }, []);

  const filteredData = selectedWeek
    ? data.filter((item) => item.week === selectedWeek)
    : data;

  const offset = currentPage * itemsPerPage;
  const currentItems = filteredData.slice(offset, offset + itemsPerPage);

  const pageCount = Math.ceil(filteredData.length / itemsPerPage) || 1;

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleDownload = () => {
    const ws = XLSX.utils.json_to_sheet(currentItems);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "WeeklyReport");
    XLSX.writeFile(wb, "weekly_report.xlsx");
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
        Weekly Report
      </h3>
    </div>
      <Sidebar /> {/* Use Sidebar component */}
      <div className="weekly-report-main-content">
        <div className="weekly-report-date d-flex">
          <label htmlFor="week" className="mt-1">
            &nbsp;Week:&nbsp;
          </label>
          <input
            type="week"
            id="week"
            name="week"
            className="form-control w-auto"
            value={selectedWeek}
            onChange={handleWeekChange}
            max={getCurrentWeek()}
          />
        </div>
        <div className="weekly-report-table table-responsive-xl table-responsive-md table-responsive-lg table-responsive-sm table-responsive-xxl mt-3">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th scope="col">Sl No.</th>
                <th scope="col">Supplier</th>
                <th scope="col">Customer</th>
                <th scope="col">In Time</th>
                <th scope="col">Material</th>
                <th scope="col">Net Weight</th>
                <th scope="col">Out Time</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.supplier}</td>
                  <td>{item.customer}</td>
                  <td>{item.inTime}</td>
                  <td>{item.material}</td>
                  <td>{item.netWeight}</td>
                  <td>{item.outTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pageCount > 1 && (
          <ReactPaginate
            previousLabel={"← Previous"}
            nextLabel={"Next →"}
            pageCount={pageCount}
            onPageChange={handlePageChange}
            containerClassName={"pagination justify-content-center"}
            previousLinkClassName={"page-link"}
            nextLinkClassName={"page-link"}
            disabledClassName={"disabled"}
            activeClassName={"active"}
            pageClassName={"d-none"}
            breakClassName={"d-none"}
            pageLinkClassName={"d-none"}
            marginPagesDisplayed={0}
            breakLabel={null}
          />
        )}
        <div className="text-center mt-1">
          <button
            className="btn btn-primary download-btn"
            onClick={handleDownload}
          >
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
}

export default WeeklyReport;
