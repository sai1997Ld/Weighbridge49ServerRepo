// Report.jsx
import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileAlt,
  faChartBar,
  faCalendar,
  faUsers,
  faRectangleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Chart, ArcElement } from "chart.js/auto";
import "./Report.css";
import { useNavigate } from "react-router-dom";
 
import SideBar2 from "../../../../SideBar/SideBar2";
 
function GateUserReport() {
  const navigate = useNavigate();
 
  const handleDailyReport = () => {
    navigate('/DailyReport');
  };
 
  const handleWeeklyReport = () => {
    navigate("/WeeklyReport");
  };
 
  const handleMonthlyReport = () => {
    navigate("/MonthlyReport");
  };
 
  const handleCustomizedReport = () => {
    navigate("/CustomizedReport");
  };
 
  const chartRef = useRef(null);
  const chartRef2 = useRef(null);
  const homeMainContentRef = useRef(null);
 
  useEffect(() => {
    Chart.register(ArcElement);
 
    const resizeObserver = new ResizeObserver(() => {
      if (
        homeMainContentRef.current &&
        chartRef.current?.chartInstance &&
        chartRef2.current?.chartInstance
      ) {
        chartRef.current.chartInstance.resize();
        chartRef2.current.chartInstance.resize();
      }
    });
 
    if (homeMainContentRef.current) {
      resizeObserver.observe(homeMainContentRef.current);
    }
 
    return () => {
      resizeObserver.disconnect();
    };
  }, []);
 
  const closeForm = () => {
    navigate("/VehicleEntry");
  };
 
  return (
 
    <SideBar2>
      <div className="close" onClick={closeForm}>
        <FontAwesomeIcon icon={faRectangleXmark} />
      </div>
 
      <div className="report-wrapper-op box-shadow-lg">
        <div className="report-container-op">
          <div className="report-content-op">
            <div className="report-item-op" onClick={handleDailyReport}>
              <div
                className="report-item-icon-op d-flex justify-content-center align-items-center"
 
              >
                <FontAwesomeIcon
                  icon={faFileAlt}
                  size="1x"
 
                />
              </div>
              <span >Daily Report</span>
            </div>
            <div className="report-item-op" onClick={handleWeeklyReport}>
              <div
                className="report-item-icon-op"
 
              >
                <FontAwesomeIcon
                  icon={faChartBar}
                  size="1x"
 
                />
              </div>
              <span >Weekly Report</span>
            </div>
            <div className="report-item-op" onClick={handleMonthlyReport}>
              <div
                className="report-item-icon-op"
 
              >
                <FontAwesomeIcon
                  icon={faCalendar}
                  size="1x"
 
                />
              </div>
              <span >Monthly Report</span>
            </div>
            <div className="report-item-op" onClick={handleCustomizedReport}>
              <div
                className="report-item-icon-op"
 
              >
                <FontAwesomeIcon
                  icon={faUsers}
                  size="1x"
 
                />
              </div>
              <span >Customized Report</span>
            </div>
          </div>
        </div>
      </div>
    </SideBar2>
  );
}
 
export default GateUserReport;
 
