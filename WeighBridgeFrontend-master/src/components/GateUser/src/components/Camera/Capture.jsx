import React, { useState, useEffect, useRef } from "react";
import { useLocation, Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Chart, ArcElement } from "chart.js/auto";

import SideBar2 from "../../../../SideBar/SideBar2";

const Capture = () => {
  const location = useLocation();
  const { ticketNo, vehicleNo, dateTime } = location.state || {};

  const images = {
    driverView: '',
    helperView: '',
    officerPhoto1: '',
    officerPhoto2: '',
    topView: '',
    sideView: ''
  };

  const boxStyle = {
    width: '200px',
    height: '200px',
    margin: '0 10px'
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  };

  const handleHome = () => {
    // Define your handleHome function logic here
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

  return (
    <>
      <div>
    

    <SideBar2
      isSidebarExpanded={isSidebarExpanded}
      toggleSidebar={toggleSidebar}
    />
	
	</div>

      <div className="d-flex justify-content-center mt-3"> {/* Adjusted margin-top here */}
        <div className="max-w-4xl">
        <h2 className="text-center mb-4">Captured Images</h2>
        <div className="d-flex justify-content-center mb-4">
          <div className="text-center">
            <p>Ticket No: {ticketNo}</p>
            <p>Vehicle No: {vehicleNo}</p>
            <p>Date & Time: {dateTime}</p>
          </div>
        </div>
        <div className="d-flex flex-column align-items-center">
          <div className="d-flex mb-4">
            <div className="me-4 border p-2" style={boxStyle}>
              <h6 className="text-lg font-bold">Driver Photo with Truck</h6>
              <img src={images.driverView} alt="Driver with Truck" style={imageStyle} />
            </div>
            <div className="border p-2" style={boxStyle}>
              <h6 className="text-lg font-bold">Helper Photo with Truck</h6>
              <img src={images.helperView} alt="Helper with Truck" style={imageStyle} />
            </div>
          </div>
          <div className="d-flex mb-4">
            <div className="me-4 border p-2" style={boxStyle}>
              <h6 className="text-lg font-bold">Photo with Officer 1</h6>
              <img src={images.officerPhoto1} alt="Officer 1" style={imageStyle} />
            </div>
            <div className="border p-2" style={boxStyle}>
              <h6 className="text-lg font-bold">Photo with Officer 2</h6>
              <img src={images.officerPhoto2} alt="Officer 2" style={imageStyle} />
            </div>
          </div>
          <div className="d-flex mb-4">
            <div className="me-4 border p-2" style={boxStyle}>
              <h6 className="text-lg font-bold">Top View of the Vehicle</h6>
              <img src={images.topView} alt="Top View" style={imageStyle} />
            </div>
            <div className="border p-2" style={boxStyle}>
              <h6 className="text-lg font-bold">Side View of the Vehicle</h6>
              <img src={images.sideView} alt="Side View" style={imageStyle} />
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default Capture;
