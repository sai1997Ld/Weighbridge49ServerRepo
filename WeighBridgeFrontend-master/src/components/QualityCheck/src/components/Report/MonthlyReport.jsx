import { useState, useEffect, useMemo } from "react";
import ReactPaginate from "react-paginate";
import "./MonthlyReport.css"; // You can create this CSS file for styling
import * as XLSX from "xlsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import {
  faHome,
  faFileAlt,
  faVideo,
  faMapMarked,
  faExchangeAlt,
  faTruck,
  faSignOut,
} from "@fortawesome/free-solid-svg-icons";

function MonthlyReport() {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const navigate = useNavigate();

  const handlehome = () => {
    navigate("/home");
  };

  const data = useMemo(
    () => [
      {
        date: "2024-03-01",
        ticketNo: 1,
        truckNo: "00 02 Al 1860",
        product: "Coal",
        poNo: 120012,
        tpNo: "21T-11000000076981",
        grossWt: 3265,
        tareWt: 1936,
        netWt: 1329,
      },
      {
        date: "2024-03-02",
        ticketNo: 2,
        truckNo: "00 14 OD 1334",
        product: "Dolomite",
        poNo: 16123456,
        tpNo: "21T-11000000076982",
        grossWt: 3265,
        tareWt: 1935,
        netWt: 1330,
      },
      {
        date: "2024-03-03",
        ticketNo: 3,
        truckNo: "00 14 OD 1334",
        product: "Iron Ore",
        poNo: 16123456,
        tpNo: "21T-11000000076982",
        grossWt: 3265,
        tareWt: 1935,
        netWt: 1330,
      },
      {
        date: "2024-04-04",
        ticketNo: 4,
        truckNo: "00 14 OD 1334",
        product: "Bricks",
        poNo: 16123456,
        tpNo: "21T-11000000076982",
        grossWt: 3265,
        tareWt: 1935,
        netWt: 1330,
      },
    ],
    []
  );

  useEffect(() => {
    const now = new Date();
    const month = now.getMonth() + 1; // Month is 0 indexed
    const year = now.getFullYear();
    setSelectedMonth(month);
    setSelectedYear(year);
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const itemDate = new Date(item.date);
      return (
        itemDate.getMonth() + 1 === selectedMonth &&
        itemDate.getFullYear() === selectedYear
      );
    });
  }, [data, selectedMonth, selectedYear]);

  const offset = currentPage * itemsPerPage;
  const currentItems = filteredData.slice(offset, offset + itemsPerPage);

  const pageCount = Math.ceil(filteredData.length / itemsPerPage) || 1;

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleDownload = () => {
    const monthName = new Date(selectedYear, selectedMonth - 1, 1)
      .toLocaleString("default", { month: "long" })
      .toLowerCase();
    const fileName = `${monthName}_${selectedYear}.xlsx`;

    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "MonthlyReport");
    XLSX.writeFile(wb, fileName);
  };

  return (
    <div>
      <div className="report-header d-flex justify-content-between align-items-center">
        <div></div>
        <h3 className="report-header-title text-center mt-3">Monthly Report</h3>
        <FontAwesomeIcon
          icon={faHome}
          className="daily_report_icon mt-2 "
          onClick={handlehome}
        />
      </div>
      <div className="home-sidebar d-flex flex-column text-center">
        <Link to="/vehicle-entry" className="sidebar-item">
          <FontAwesomeIcon icon={faTruck} className="sidebar-icon" />
          <span className="sidebar-item-text">Vehicle Entered</span>
        </Link>
        <Link to="/live-location" className="sidebar-item">
          <FontAwesomeIcon icon={faMapMarked} className="sidebar-icon" />
          <span className="sidebar-item-text">Live Location</span>
        </Link>
        <Link to="/live-transaction" className="sidebar-item">
          <FontAwesomeIcon icon={faExchangeAlt} className="sidebar-icon" />
          <span className="sidebar-item-text">Live Transaction</span>
        </Link>
        <Link to="/camera" className="sidebar-item">
          <FontAwesomeIcon icon={faVideo} className="sidebar-icon" />
          <span className="sidebar-item-text">Camera</span>
        </Link>
        <Link to="/report" className="sidebar-item">
          <FontAwesomeIcon icon={faFileAlt} className="sidebar-icon rp-icon" />
          <span className="sidebar-item-text">Reports</span>
        </Link>
        <Link to="/" className="sidebar-item">
          <FontAwesomeIcon icon={faSignOut} className="sidebar-icon" />
          <span className="sidebar-item-text">Logout</span>
        </Link>
      </div>
      <div className="daily-report-main-content">
        <div className="monthly-report-date d-flex flex-column align-items-start ml-3 mt-3">
          <div className="mb-3 d-flex">
            <label htmlFor="month" className="mb-0 mr-3 fw-bold mt-1">
              &nbsp;Month:
            </label>
            <input
              type="month"
              id="month"
              name="month"
              className="form-control"
              value={`${selectedYear}-${selectedMonth
                .toString()
                .padStart(2, "0")}`}
              onChange={(e) => {
                const [year, month] = e.target.value.split("-");
                setSelectedMonth(parseInt(month));
                setSelectedYear(parseInt(year));
              }}
              style={{ marginLeft: "5px" }}
            />
          </div>
        </div>
        <div className="monthly-report-table table-responsive-xl mt-3">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Ticket no.</th>
                <th scope="col">Truck no.</th>
                <th scope="col">Product</th>
                <th scope="col">Po no.</th>
                <th scope="col">TP no.</th>
                <th scope="col">Gross Wt.</th>
                <th scope="col">Tare Wt.</th>
                <th scope="col">Net Wt.</th>
              </tr>
            </thead>

            <tbody>
              {currentItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.date}</td>
                  <td>{item.ticketNo}</td>
                  <td>{item.truckNo}</td>
                  <td>{item.product}</td>
                  <td>{item.poNo}</td>
                  <td>{item.tpNo}</td>
                  <td>{item.grossWt}</td>
                  <td>{item.tareWt}</td>
                  <td>{item.netWt}</td>
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
            // Custom styling to hide the page count
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

        {/* <div className="mt-5 mb-3 d-flex justify-content-center gap-5 button-container fixed-bottom">
        <button className="icon-button" onClick={handlehome}>
          <FontAwesomeIcon icon={faHome} size="lg" />
          <span className="ms-1">Home</span>
        </button>
        <button className="icon-button" onClick={handleback}>
          <FontAwesomeIcon icon={faBackward} size="lg" />
          <span className="ms-1">Back</span>
        </button>
        <button className="icon-button" onClick={handleSignOut}>
          <FontAwesomeIcon icon={faPowerOff} size="lg" />
          <span className="ms-1">Sign Out</span>
        </button>
      </div> */}
      </div>
    </div>
  );
}

export default MonthlyReport;
