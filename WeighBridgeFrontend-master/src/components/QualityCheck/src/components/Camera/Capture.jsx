import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faTruck, faPrint, faVideo, faFileAlt, faSignOut } from "@fortawesome/free-solid-svg-icons";
import Header from "../../Pages/header"; // Import Header component
import Sidebar from "../../Pages/Sidebar"; // Import Sidebar component

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

  const handleHome = () => {
    // Define your handleHome function logic here
  };

  return (
    <>
      <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      zIndex: 1000, // Ensure the header is above other content
    //   backgroundColor: "#333" // Example background color
    }} className="home-header d-flex justify-content-center">
      <h3 className="home-header-title text-4xl text-center text-uppercase text-white mt-3 d-flex justify-content-center align-items-center flex-wrap">
        Captured Images
      </h3>
    </div>
      <Sidebar /> {/* Use Sidebar component */}

      <div className="d-flex justify-content-center mt-3">
        <div className="max-w-4xl">
          <h2 className="text-center mb-4">Captured Images</h2>
          <div className="text-center mb-4">
            <p className="mb-2"><strong>Ticket No:</strong> {ticketNo}</p>
            <p className="mb-2"><strong>Vehicle No:</strong> {vehicleNo}</p>
            <p className="mb-2"><strong>Date & Time:</strong> {dateTime}</p>
          </div>
          <div className="row justify-content-center mb-4">
            <div className="col-md-5 mb-4">
              <div className="border p-3">
                <h6 className="text-lg font-bold mb-3">Driver Photo with Truck</h6>
                <img src={images.driverView} alt="Driver with Truck" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
            <div className="col-md-5 mb-4">
              <div className="border p-3">
                <h6 className="text-lg font-bold mb-3">Helper Photo with Truck</h6>
                <img src={images.helperView} alt="Helper with Truck" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
            <div className="col-md-5 mb-4">
              <div className="border p-3">
                <h6 className="text-lg font-bold mb-3">Photo with Officer 1</h6>
                <img src={images.officerPhoto1} alt="Officer 1" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
            <div className="col-md-5 mb-4">
              <div className="border p-3">
                <h6 className="text-lg font-bold mb-3">Photo with Officer 2</h6>
                <img src={images.officerPhoto2} alt="Officer 2" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
            <div className="col-md-5 mb-4">
              <div className="border p-3">
                <h6 className="text-lg font-bold mb-3">Top View of the Vehicle</h6>
                <img src={images.topView} alt="Top View" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
            <div className="col-md-5 mb-4">
              <div className="border p-3">
                <h6 className="text-lg font-bold mb-3">Side View of the Vehicle</h6>
                <img src={images.sideView} alt="Side View" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Capture;
