import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faTruck, faPrint, faVideo, faFileAlt, faSignOut } from "@fortawesome/free-solid-svg-icons";
import './Camera.css';
import Header from "../../Pages/header"; // Import Header component
import Sidebar from "../../Pages/Sidebar"; // Import Sidebar component

const Camera = () => {
  const navigate = useNavigate();
  const [ticketNo, setTicketNo] = useState('');
  const [vehicleNo, setVehicleNo] = useState('');
  const [dateTime, setDateTime] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/capture', { state: { ticketNo, vehicleNo, dateTime } });
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
        Camera
      </h3>
    </div>
      <Sidebar /> {/* Use Sidebar component */}

      <div className="d-flex justify-content-center mt-5">
        <div style={{ marginTop: '30px' }} className="max-w-4xl">
          <div className="bg-gray-100 min-vh-100 d-flex flex-column justify-content-start">
            <div className="max-w-md bg-white p-3 p-md-5 rounded shadow mx-auto mt-5">
              <h2 className="text-center mb-4">Image Retrieval Portal</h2>
              <form onSubmit={handleSubmit} className="d-flex flex-column align-items-center">
                <div className="mb-3 w-100">
                  <input
                    type="text"
                    placeholder="Search Ticket No..."
                    value={ticketNo}
                    onChange={(e) => setTicketNo(e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="mb-3 w-100">
                  <input
                    type="text"
                    placeholder="Vehicle No"
                    value={vehicleNo}
                    onChange={(e) => setVehicleNo(e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="mb-3 d-flex w-100">
                  <input
                    type="date"
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                    className="form-control rounded-start"
                  />
                  <input
                    type="time"
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                    className="form-control rounded-end"
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Camera;
