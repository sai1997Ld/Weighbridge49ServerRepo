
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileAlt,
  faChartBar,
  faCalendar,
  faUsers,
  faHome,
} from "@fortawesome/free-solid-svg-icons";

import { useNavigate } from "react-router-dom";
import SideBar6 from "../../SideBar/Sidebar6";
import "./SalesReport.css";

import { Link } from "react-router-dom";

function SalesReport() {
  const navigate = useNavigate();

  const handleDailyReport = () => {
    navigate("/SalesDailyReport");
  };

  const handleWeeklyReport = () => {
    navigate("/SalesWeeklyReport");
  };

  const handleMonthlyReport = () => {
    navigate("/SalesMonthlyReport");
  };

  const handleCustomizedReport = () => {
    navigate("/SalesCustomReport");
  };


  return (
    <SideBar6>
      <div
        style={{
          fontFamily: "Arial",
          color: "#333",
          "--table-border-radius": "30px",
        }}
      >
        <div className="d-flex justify-content-between align-items-center w-100"></div>
        <div style={{ flex: "2", textAlign: "right" }}>
          <Link to="/sales-dashboard">
            <FontAwesomeIcon icon={faHome} style={{ fontSize: "1.5em" }} />
          </Link>
        </div>
      </div>

      <div className="report-wrapper-mr box-shadow-lg">
        <div className="report-container-mr">
          <div className="report-content-mr">
            <div className="report-item-mr" onClick={handleDailyReport}>
              <div className="report-item-icon-mr d-flex justify-content-center align-items-center">
                <FontAwesomeIcon icon={faFileAlt} size="1x" />
              </div>
              <span>Daily Report</span>
            </div>
            <div className="report-item-mr" onClick={handleWeeklyReport}>
              <div className="report-item-icon-mr">
                <FontAwesomeIcon icon={faChartBar} size="1x" />
              </div>
              <span>Weekly Report</span>
            </div>
            <div className="report-item-mr" onClick={handleMonthlyReport}>
              <div className="report-item-icon-mr">
                <FontAwesomeIcon icon={faCalendar} size="1x" />
              </div>
              <span>Monthly Report</span>
            </div>
            <div className="report-item-mr" onClick={handleCustomizedReport}>
              <div className="report-item-icon-mr">
                <FontAwesomeIcon icon={faUsers} size="1x" />
              </div>
              <span>Customized Report</span>
            </div>
          </div>
        </div>
      </div>
    </SideBar6>
  );
}

export default SalesReport;
