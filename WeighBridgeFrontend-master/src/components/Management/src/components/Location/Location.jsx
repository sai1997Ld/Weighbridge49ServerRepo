import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import Sidebar4 from "../../../../SideBar/SideBar4";

function ManagementLocation() {
  const chartRef = useRef(null);
  const chartRef2 = useRef(null);
  const [showNotification, setShowNotification] = useState(false);
  const [highlightColor, setHighlightColor] = useState("blue");

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

  return (
    <Sidebar4>
      <div
        className="home-page"
        style={{ position: "relative", height: "100vh" }}
      >
        <div
          style={{
            flex: "1",
            textAlign: "right",
            position: "absolute",
            top: "10px",
            right: "10px",
          }}
        >
          <Link to="/management-dashboard">
            <FontAwesomeIcon icon={faHome} style={{ fontSize: "1.5em" }} />
          </Link>
        </div>
        <div className="home-logo-container-1 container-fluid"></div>
        <div
          className="home-main-content"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <div
            style={{
              padding: "20px",
              fontSize: "1.5em",
              color: "white",
              backgroundColor: highlightColor,
              border: `2px solid ${highlightColor}`,
              borderRadius: "10px",
              textAlign: "center",
              marginTop: "-200px", // Adjust this value to move the box up
            }}
          >
            Work in Progress
          </div>
        </div>
      </div>
    </Sidebar4>
  );
}

export default ManagementLocation;
