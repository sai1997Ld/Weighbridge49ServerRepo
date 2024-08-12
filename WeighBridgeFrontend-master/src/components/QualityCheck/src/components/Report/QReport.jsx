import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArrowDown, faFileArrowUp } from "@fortawesome/free-solid-svg-icons";
import { Chart, ArcElement } from "chart.js/auto";
import SideBar3 from "../../../../SideBar/SideBar3";
import styled from 'styled-components';
import "bootstrap/dist/css/bootstrap.min.css";

const StyledTable = styled.table`
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const QualityReport = () => {
  const [ticketNumber, setTicketNumber] = useState("1");
  const [truckNumber, setTruckNumber] = useState("HR38Z1951");
  const [inTimeValue, setInTimeValue] = useState("16:25");
  const [outTimeValue, setOutTimeValue] = useState("21:45");
  const [productValue, setProductValue] = useState("SPONGE IRON");
  const [poNumber, setPoNumber] = useState("97/3");
  const [chalanNumber, setChalanNumber] = useState("");
  const [file, setFile] = useState(null);
  const [isFileInserted, setIsFileInserted] = useState(false);

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
    setIsFileInserted(true);
  };

  const handleFileDownload = () => {
    if (file) {
      const url = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
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
    <SideBar3>
      <div style={{ fontFamily: "Arial", color: "#333" }}>
        <div className="quality-report-main-content" ref={homeMainContentRef}>
          <h2 className="quality-report-heading" style={{ fontFamily: "Arial", textAlign: "center", textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)" }}>Quality Report</h2>
          <div className="quality-report-table-responsive" style={{ overflowX: "auto", maxWidth: "100%", borderRadius: "10px" }}>
            <StyledTable className="quality-report-table table table-striped">
              <thead className="ant-table-thead">
                <tr className="ant-table-row">
                  <th
                    className="ant-table-cell"
                    style={{
                      whiteSpace: "nowrap",
                      color: "white",
                      backgroundColor: "#0077b6",
                      borderRight: "1px solid white",
                    }}
                  >
                    Ticket No
                  </th>
                  <th
                    className="ant-table-cell"
                    style={{
                      whiteSpace: "nowrap",
                      color: "white",
                      backgroundColor: "#0077b6",
                      borderRight: "1px solid white",
                    }}
                  >
                    Truck No
                  </th>
                  <th
                    className="ant-table-cell"
                    style={{
                      whiteSpace: "nowrap",
                      color: "white",
                      backgroundColor: "#0077b6",
                      borderRight: "1px solid white",
                    }}
                  >
                    In Time
                  </th>
                  <th
                    className="ant-table-cell"
                    style={{
                      whiteSpace: "nowrap",
                      color: "white",
                      backgroundColor: "#0077b6",
                      borderRight: "1px solid white",
                    }}
                  >
                    Out Time
                  </th>
                  <th
                    className="ant-table-cell"
                    style={{
                      whiteSpace: "nowrap",
                      color: "white",
                      backgroundColor: "#0077b6",
                      borderRight: "1px solid white",
                    }}
                  >
                    Product
                  </th>
                  <th
                    className="ant-table-cell"
                    style={{
                      whiteSpace: "nowrap",
                      color: "white",
                      backgroundColor: "#0077b6",
                      borderRight: "1px solid white",
                    }}
                  >
                    PO No
                  </th>
                  <th
                    className="ant-table-cell"
                    style={{
                      whiteSpace: "nowrap",
                      color: "white",
                      backgroundColor: "#0077b6",
                      borderRight: "1px solid white",
                    }}
                  >
                    Chalan No
                  </th>
                  <th
                    className="ant-table-cell"
                    style={{
                      whiteSpace: "nowrap",
                      color: "white",
                      backgroundColor: "#0077b6",
                      borderRight: "1px solid white",
                    }}
                  >
                    Upload
                  </th>
                  <th
                    className="ant-table-cell"
                    style={{
                      whiteSpace: "nowrap",
                      color: "white",
                      backgroundColor: "#0077b6",
                      borderRight: "1px solid white",
                    }}
                  >
                    Download
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="ant-table-cell">
                    <input
                      type="text"
                      className="quality-report-input-box ticket-number"
                      value={ticketNumber}
                      onChange={(e) => setTicketNumber(e.target.value)}
                      readOnly
                      style={{ width: "100%", border: "none", backgroundColor: "transparent" }}
                    />
                  </td>
                  <td className="ant-table-cell">
                    <input
                      type="text"
                      className="quality-report-input-box truck-number"
                      value={truckNumber}
                      onChange={(e) => setTruckNumber(e.target.value)}
                      readOnly
                      style={{ width: "100%", border: "none", backgroundColor: "transparent" }}
                    />
                  </td>
                  <td className="ant-table-cell">
                    <input
                      type="text"
                      className="quality-report-input-box"
                      value={inTimeValue}
                      onChange={(e) => setInTimeValue(e.target.value)}
                      readOnly
                      style={{ width: "100%", border: "none", backgroundColor: "transparent" }}
                    />
                  </td>
                  <td className="ant-table-cell">
                    <input
                      type="text"
                      className="quality-report-input-box"
                      value={outTimeValue}
                      onChange={(e) => setOutTimeValue(e.target.value)}
                      readOnly
                      style={{ width: "100%", border: "none", backgroundColor: "transparent" }}
                    />
                  </td>
                  <td className="ant-table-cell">
                    <input
                      type="text"
                      className="quality-report-input-box"
                      value={productValue}
                      onChange={(e) => setProductValue(e.target.value)}
                      readOnly
                      style={{ width: "100%", border: "none", backgroundColor: "transparent" }}
                    />
                  </td>
                  <td className="ant-table-cell">
                    <input
                      type="text"
                      className="quality-report-input-box"
                      value={poNumber}
                      onChange={(e) => setPoNumber(e.target.value)}
                      readOnly
                      style={{ width: "100%", border: "none", backgroundColor: "transparent" }}
                    />
                  </td>
                  <td className="ant-table-cell">
                    <input
                      type="text"
                      className="quality-report-input-box"
                      value={chalanNumber}
                      onChange={(e) => setChalanNumber(e.target.value)}
                      readOnly
                      style={{ width: "100%", border: "none", backgroundColor: "transparent" }}
                    />
                  </td>
                  <td className="ant-table-cell">
                    <button
                      onClick={() => document.getElementById('fileInput').click()}
                      className="quality-report-btn quality-report-upload-btn"
                      style={{ backgroundColor: "#88CCFA", border: "none", padding: "5px 10px" }}
                    >
                      <FontAwesomeIcon icon={faFileArrowUp} />
                    </button>
                    <input
                      type="file"
                      id="fileInput"
                      className="form-control-file"
                      accept=".pdf"
                      style={{ display: 'none' }}
                      onChange={handleFileUpload}
                    />
                  </td>
                  <td className="ant-table-cell">
                    <button
                      onClick={handleFileDownload}
                      disabled={!isFileInserted}
                      className="quality-report-btn quality-report-download-btn"
                      style={{ backgroundColor: "#88CCFA", border: "none", padding: "5px 10px" }}
                    >
                      <FontAwesomeIcon icon={faFileArrowDown} />
                    </button>
                  </td>
                </tr>
              </tbody>
            </StyledTable>
          </div>
        </div>
      </div>
    </SideBar3>
  );
};

export default QualityReport;