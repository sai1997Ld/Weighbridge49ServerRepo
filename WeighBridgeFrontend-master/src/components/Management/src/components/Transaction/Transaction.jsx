import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Link } from "react-router-dom";
import { faBellSlash, faSearch, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { Chart, registerables } from 'chart.js/auto';
import Sidebar4 from "../../../../SideBar/SideBar4";


function ManagementTransaction() {
  const chartRef = useRef(null);
  const chartRef2 = useRef(null);
  const [showNotification, setShowNotification] = useState(false);
   

  const toggleNotification = () => {
    setShowNotification(!showNotification);
  };


  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (chartRef.current && chartRef2.current) {
        chartRef.current.resize();
        chartRef2.current.resize();
      }
    });
  
    const homeMainContent = document.querySelector(".home-main-content");
    if (homeMainContent) {
      resizeObserver.observe(homeMainContent);
    }
  
    return () => {
      resizeObserver.disconnect();
    };
  }, [chartRef.current, chartRef2.current]);
  

  return (
      <Sidebar4>
        <div className="home-page">
        <div className="home-logo-container-1 container-fluid">
        </div>
        <div className="home-main-content">
          <div className="card p-3 mb-3 home home-card mt-3">
            <label className="fw-bold home-label">Company:</label>
            <select className="form-select w-100">
              <option value="Vikram Pvt Ltd">Vikram Pvt Ltd</option>
              <option value="Highlander">Highlander</option>
              <option value="Rider">Rider</option>
            </select>
            <label className="fw-bold mt-3 home-label">Site:</label>
            <select className="form-select w-100">
              <option>Bhubaneswar</option>
              <option value="Roulkela">Roulkela</option>
              <option value="Aska">Aska</option>
              <option value="Puri">Puri</option>
            </select>
          </div>
          </div>
      </div>
      </Sidebar4>
  );
}

export default ManagementTransaction;
