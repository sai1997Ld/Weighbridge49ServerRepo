import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar2 from "../../../../SideBar/SideBar2";
import "./SalesDetails.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRectangleXmark } from "@fortawesome/free-solid-svg-icons";

const SalesDetails = ({ onConfirmTicket = () => { } }) => {
    const [selectedDate, setSelectedDate] = useState('');
    const [vehicleEntryDetails, setVehicleEntryDetails] = useState([]);
    const [totalPage, setTotalPage] = useState(0);
    const [totalEntries, setTotalEntries] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const entriesPerPage = 20; // set the correct entries per page
    const navigate = useNavigate();

    // To add session userid in frontend
    const userId = sessionStorage.getItem("userId");

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setSelectedDate(today);
    }, []);

    useEffect(() => {
        fetchData(0);
    }, []);

    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage]);

    const fetchData = (pageNumber) => {
        fetch(`http://localhost:8080/api/v1/sales/getAllVehicleDetails?page=${pageNumber}&userId=${userId}`, {
            credentials: "include"
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setVehicleEntryDetails(data.sales);
                setTotalPage(data.totalPage);
                setTotalEntries(data.totalElement);
                console.log("Total Pages: " + data.totalPage);
            })
            .catch(error => {
                console.error('Error fetching vehicle entry details:', error);
            });
    };

    const handleVehicleClick = (salePassNo) => {
        navigate(`/VehicleEntry-Outbound/?sales=${salePassNo}`);
    };



    return (
        <SideBar2>
            <div style={{ fontFamily: "Arial", color: "#333", "--table-border-radius": "30px" }}>
                <div className="container-fluid mt-0">
                    <div className="mb-3 text-center">
                    <div className="d-flex justify-content-between align-items-center mt-3">
              <h2 className="text-center mx-auto">Outbound Details</h2>
   
              <FontAwesomeIcon icon={faRectangleXmark} style={{float: "right", fontSize: "1.5em", color: "red", cursor: "pointer"}}  className="mb-2" onClick={() => navigate(-1)}/>
 
        </div>
                    </div>
                    <div className="table-responsive" style={{ overflowX: "auto", maxWidth: "100%", borderRadius: "10px" }}>
                        <table className="ant-table table table-striped" style={{ width: "100%" }}>
                            <thead className="ant-table-thead">
                                <tr className="ant-table-row">
                                    <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}> Vehicle No. </th>
                                    <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}> PO No. </th>
                                    <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}> Sale Order No. </th>
                                    <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}> Sale Pass No. </th>
                                    <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}> Transporter Name </th>
                                    <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}> Customer Name </th>
                                    <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}> Customer Address </th>
                                    <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}> Product Name </th>
                                    <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}> Product Type </th>
                                    <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}> Quantity (MT) </th>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                {vehicleEntryDetails.map((entry, index) => (
                                    <tr key={`${entry.vehicleNo}${index}`}>
                                        <td className="ant-table-cell">
                                            <button onClick={() => handleVehicleClick(entry.salePassNo)} style={{ background: "#88CCFA", minWidth: "70px", whiteSpace: "nowrap", }}>{entry.vehicleNo}</button>
                                        </td>
                                        <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}> {entry.purchaseOrderNo}</td>
                                        <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}> {entry.saleOrderNo}</td>
                                        <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}> {entry.salePassNo}</td>
                                        <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}> {entry.transporterName}</td>
                                        <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}> {entry.customerName}</td>
                                        <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}> {entry.customerAddress}</td>
                                        <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}> {entry.productName}</td>
                                        <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}> {entry.productType}</td>
                                        <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}> {entry.consignmentWeight}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {/* Code for Pagination: */}
            <div className="d-flex justify-content-between align-items-center mt-3 ml-2">
               

                <span>
                    Showing {Math.min((currentPage * entriesPerPage) + 1, totalEntries)} to{" "}
                    {Math.min((currentPage + 1) * entriesPerPage, totalEntries)} of{" "}
                    {totalEntries} entries
                </span>
                <div className="ml-auto">
                    <button
                        className="btn btn-outline-primary btn-sm me-2"
                        style={{
                            color: "#0077B6",
                            borderColor: "#0077B6",
                            marginRight: "2px",
                        }}
                        onClick={() => setCurrentPage(Math.max(0, currentPage - 5))}
                        disabled={currentPage === 0}
                    >
                        &lt;&lt;
                    </button>
                    <button
                        className="btn btn-outline-primary btn-sm me-2"
                        style={{
                            color: "#0077B6",
                            borderColor: "#0077B6",
                            marginRight: "2px",
                        }}
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 0}
                    >
                        &lt;
                    </button>

                    {Array.from({ length: 3 }, (_, index) => {
                        const pageNumber = currentPage + index;
                        if (pageNumber >= totalPage) return null;
                        return (
                            <button
                                key={pageNumber}
                                className={`btn btn-outline-primary btn-sm me-2 ${currentPage === pageNumber ? "active" : ""
                                    }`}
                                style={{
                                    color: currentPage === pageNumber ? "#fff" : "#0077B6",
                                    backgroundColor:
                                        currentPage === pageNumber ? "#0077B6" : "transparent",
                                    borderColor: "#0077B6",
                                    marginRight: "2px",
                                }}
                                onClick={() => setCurrentPage(pageNumber)}
                            >
                                {pageNumber + 1}
                            </button>
                        );
                    })}
                    {currentPage + 3 < totalPage && <span>...</span>}
                    {currentPage + 3 < totalPage && (
                        <button
                            className={`btn btn-outline-primary btn-sm me-2 ${currentPage === totalPage - 1 ? "active" : ""
                                }`}
                            style={{
                                color: currentPage === totalPage - 1 ? "#fff" : "#0077B6",
                                backgroundColor:
                                    currentPage === totalPage - 1 ? "#0077B6" : "transparent",
                                borderColor: "#0077B6",
                                marginRight: "2px",
                            }}
                            onClick={() => setCurrentPage(totalPage - 1)}
                        >
                            {totalPage}
                        </button>
                    )}
                    <button
                        className="btn btn-outline-primary btn-sm me-2"
                        style={{
                            color: "#0077B6",
                            borderColor: "#0077B6",
                            marginRight: "2px",
                        }}
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPage - 1}
                    >
                        &gt;
                    </button>
                    <button
                        className="btn btn-outline-primary btn-sm"
                        style={{
                            color: "#0077B6",
                            borderColor: "#0077B6",
                            marginRight: "2px",
                        }}
                        onClick={() =>
                            setCurrentPage(Math.min(totalPage - 1, currentPage + 5))
                        }
                        disabled={currentPage === totalPage - 1}
                    >
                        &gt;&gt;
                    </button>
                </div>
            </div>
        </SideBar2>
    );
};

export default SalesDetails;
