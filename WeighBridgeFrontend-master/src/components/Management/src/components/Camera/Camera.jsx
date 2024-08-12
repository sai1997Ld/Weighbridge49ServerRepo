import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import Link along with useNavigate
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Chart, ArcElement } from "chart.js/auto";
import SideBar4 from "../../../../SideBar/SideBar4";
import { faHome } from "@fortawesome/free-solid-svg-icons";

const ManagementCamera = () => {
  const navigate = useNavigate();
  const [ticketNo, setTicketNo] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [highlightColor, setHighlightColor] = useState("blue");

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

  useEffect(() => {
    const colors = ["blue", "green", "red"];
    let colorIndex = 0;

    const intervalId = setInterval(() => {
      colorIndex = (colorIndex + 1) % colors.length;
      setHighlightColor(colors[colorIndex]);
    }, 1000); // Change color every second

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/capture", { state: { ticketNo, vehicleNo, dateTime } });
  };

  const handleHome = () => {
    // Define your handleHome function logic here
  };

  return (
    <>
      <SideBar4>
        <div style={{ flex: "1", textAlign: "right" }}>
          <Link to="/management-dashboard">
            <FontAwesomeIcon icon={faHome} style={{ fontSize: "1.5em" }} />
          </Link>
        </div>
        <div
          className="work-in-progress"
          style={{
            fontSize: "1.5em",
            color: highlightColor,
            textAlign: "center",
          }}
        >
          Work in Progress
        </div>
        <div className="d-flex justify-content-center mt-5">
          {" "}
          {/* Adjusted margin-top here */}
          <div style={{ marginTop: "30px" }} className="max-w-4xl">
            <div className="bg-gray-100 min-vh-100 d-flex flex-column justify-content-start">
              <div className="max-w-md bg-white p-3 p-md-5 rounded shadow mx-auto mt-5">
                <h2 className="text-center mb-4">Image Retrieval Portal</h2>
                <form
                  onSubmit={handleSubmit}
                  className="d-flex flex-column align-items-center"
                >
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
                  <button type="submit" className="btn btn-primary" disabled>
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </SideBar4>
    </>
  );
};

export default ManagementCamera;
