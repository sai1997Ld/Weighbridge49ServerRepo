
// vehicle Entry.jsx for in bound


import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import Rough from '../Rough/Rough';
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import OutTime_truck from "../../assets/OutTime_truck.png";
import { Link } from "react-router-dom";
import { Chart, ArcElement } from "chart.js/auto";
// import Header from "../../../../Header/Header";
import SideBar2 from "../../../../SideBar/SideBar2";
import "./VehicleEntry.css";
import Swal from 'sweetalert2';


const VehicleEntry = ({ onConfirmTicket = () => { } }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [systemOutTime, setSystemOutTime] = useState('');
  const [vehicleEntryDetails, setVehicleEntryDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(5); // Number of entries per page
  const navigate = useNavigate();



  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  }, []);

  useEffect(() => {
    fetch("http://49.249.180.125:8080/api/v1/gate", {
      credentials: "include"
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setVehicleEntryDetails(data);
      })
      .catch(error => {
        console.error('Error fetching vehicle entry details:', error);
      });
  }, []);

  // const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const chartRef = useRef(null);
  const chartRef2 = useRef(null);
  const homeMainContentRef = useRef(null);

  // const toggleSidebar = () => {
  //   setIsSidebarExpanded(!isSidebarExpanded);
  // };

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

  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleConfirm = () => {
    const details = {
      ticketType: selectedOption,
      inTimeDate: selectedDate,
      outTimeDate: selectedDate // Assuming both in and out time/date are same for now
    };
    onConfirmTicket(details);

    if (selectedOption === 'inbound') {
      navigate('/VehicleEntryDetails');
    }

    setSelectedOption('');
    setSelectedDate('');
    closePopup();
  };



  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = vehicleEntryDetails.slice(indexOfFirstEntry, indexOfLastEntry);


  const paginateBackwardDouble = () => {
    setCurrentPage(1); // Set current page to 1 when "<<"" button is clicked
  };

  const paginateBackward = () => {
    setCurrentPage(currentPage - 1);
  };
  const paginateForward = () => {
    setCurrentPage(currentPage + 1);
  };

  const paginateForwardDouble = () => {
    setCurrentPage(totalPages); // Set current page to the total number of pages when ">>"" button is clicked
  };


  // const getSystemOutTime = () => {

  // };

  const handleVehicleExit = () => {
    // Display message in a Swal modal
    Swal.fire({
      icon: 'error',
      title: 'Vehicle cannot exit until TareWeight is measured',
      showConfirmButton: false,
      timer: 3000 // Auto close after 3 seconds
    });
  };

  const entriesCount = vehicleEntryDetails.length;
  const showingFrom = indexOfFirstEntry + 1;
  const showingTo = Math.min(indexOfLastEntry, entriesCount);

  const totalPages = Math.ceil(vehicleEntryDetails.length / entriesPerPage);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <span key={i} style={{ margin: '0 5px' }}>
          <button
            onClick={() => setCurrentPage(i)}
            className={`page-number-button ${currentPage === i ? "active" : ""}`}
            style={{ borderRadius: '5px', borderWidth: '1px' }} // Add border radius style here

          >
            {i}
          </button>
        </span>
      );
    }
    return pageNumbers;
  };

  return (

    <SideBar2>
      <div className="vehicleEntry-main">
        {/* <Header toggleSidebar={toggleSidebar} />
        <FontAwesomeIcon icon={faPlus} />

        <SideBar2
          isSidebarExpanded={isSidebarExpanded}
          toggleSidebar={toggleSidebar}
        /> */}

        <div className="container" >
          <div className="container mx-auto px-4 py-8" style={{ marginTop: '20px', marginLeft: '20px' }}>
            <h2 className="text-center mb-6"> Gate User Transaction Details </h2>
          </div>
          <div className=" d-flex align-items-center mb-3">
            {/* <label htmlFor="datePicker"> Date:</label> */}
          {/* <input
            type="date"
            id="datePicker"
            value={selectedDate}
            onChange={handleDateChange}
            className="form-control mb-3"
            style={{ width: '150px' }}
          /> */}
            {/* Show current time instead of date picker */}
            <input
              type="text"
              value={selectedDate}
              readOnly // Make input read-only
              className="form-control "
              style={{ width: '110px', marginLeft: '20px' }}
            />
          </div>
          <div className="vehicle-table-container mx-auto px-4 py-8" > {/* Add overflowX style for horizontal scrollbar */}
            <div className="vehicle-table table-responsive-xl table-responsive-md table-responsive-lg table-responsive-sm table-responsive-xxl mt-3 VehicleEntrytable ">
              <table className="vehicle-table table-bordered table-striped" style={{ marginBottom: '10px', marginRight: '50px' }}> {/* Add margin bottom to the table */}
                <thead className="text-center">
                  {/* Table headers */}

                  <tr>
                    <th scope="col" style={{ width: '5%', padding: '5px', margin: '5px ' }}>Ticket No.</th>
                    <th scope="col" style={{ width: '8%', padding: '5px', margin: '5px' }}>Vehicle No.</th>
                    <th scope="col" style={{ width: '10%', padding: '5px', margin: '5px' }}>In Time/Date</th>
                    <th scope="col" style={{ width: '10%', padding: '5px', margin: '5px' }}>Out Time/Date</th>
                    <th scope="col" style={{ width: '7%', padding: '5px', margin: '5px' }}>Vehicle Type</th>
                    <th scope="col" style={{ width: '7%', padding: '5px', margin: '5px' }}>No. of Wheels</th>
                    <th scope="col" style={{ width: '8%', padding: '5px', margin: '5px' }}>Transporter</th>
                    <th scope="col" style={{ width: '8%', padding: '5px', margin: '5px' }}>Supplier</th>
                    <th scope="col" style={{ width: '10%', padding: '5px', margin: '5px' }}>Supplier&apos;s Address</th>
                    <th scope="col" style={{ width: '8%', padding: '5px', margin: '5px' }}>Material</th>
                    <th scope="col" style={{ width: '5%', padding: '5px', margin: '5px' }}>TP No.</th>
                    <th scope="col" style={{ width: '5%', padding: '5px', margin: '5px' }}>TP Net weight</th>
                    <th scope="col" style={{ width: '5%', padding: '5px', margin: '5px' }}>PO No.</th>
                    <th scope="col" style={{ width: '5%', padding: '5px', margin: '5px' }}>Challan No.</th>
                    <th scope="col" style={{ width: '8%', padding: '5px', margin: '5px' }}>Transaction Type</th>
                    <th scope="col" style={{ width: '5%', padding: '5px', margin: '5px' }}>OUT</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {/* Render current entries with alternate row background */}
                  {currentEntries.map((entry, index) => (
                    <tr key={entry.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                      {/* Render table rows */}
                      <td>{entry.ticketNo}</td>
                      <td>{entry.vehicleNo}</td>
                      <td>{entry.vehicleIn}</td>
                      <td>{entry.vehicleOut}</td>
                      <td>{entry.vehicleType}</td>
                      <td>{entry.vehicleWheelsNo}</td>
                      <td>{entry.transporter}</td>
                      <td>{entry.supplier}</td>
                      <td>{entry.supplierAddress}</td>
                      <td>{entry.material}</td>
                      <td>{entry.tpNo}</td>
                      <td>{entry.tpNetWeight}</td>
                      <td>{entry.poNo}</td>
                      <td>{entry.challanNo}</td>
                      <td>{entry.transactionType}</td>
                      <td>
                        <button className="image-button" onClick={handleVehicleExit}>
                          <div className="image-container" style={{ border: 'none' }} >
                            <img src={OutTime_truck} alt="Out" className="time-image" />
                          </div>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Add some space between the table and pagination section */}
          <div style={{ marginTop: '30px', marginRight: '30px', marginLeft: '20px' }}>
            <div className="row justify-content-between mb-2">
              <div className="col-auto ">
                <p>
                  Showing <span style={{ color: 'red' }}>{showingFrom}</span> to{' '}
                  <span style={{ color: 'red' }}>{showingTo}</span> of{' '}
                  <span style={{ color: 'blue' }}>{entriesCount}</span> entries
                </p>
              </div>
              <div className="col-auto">
                <div className="pagination">
                  <button
                    className='backword-double-button'
                    onClick={paginateBackwardDouble} disabled={currentPage === 1}
                    style={{ borderRadius: '5px', borderWidth: '1px' }}>{"<<"}
                  </button>
                  <span style={{ margin: '0 5px' }}></span>
                  <button
                    className='backword-button'
                    onClick={paginateBackward} disabled={currentPage === 1}
                    style={{ borderRadius: '5px', borderWidth: '1px' }}>{"<"}
                  </button>
                  <span style={{ margin: '0 5px' }}></span>
                  {renderPageNumbers()}
                  <span style={{ margin: '0 5px' }}></span> {/* Add more space between the buttons */}
                  <button
                    className='forward-button'
                    onClick={paginateForward} disabled={indexOfLastEntry >= vehicleEntryDetails.length}
                    style={{ borderRadius: '5px', borderWidth: '1px' }}>{">"}
                  </button>
                  <span style={{ margin: '0 5px' }}></span>
                  <button
                    className='forward-double-button'
                    onClick={paginateForwardDouble} disabled={indexOfLastEntry >= vehicleEntryDetails.length}
                    style={{ borderRadius: '5px', borderWidth: '1px' }}>{">>"}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </SideBar2>
  );
};
// const TicketInputBox = ({ placeholder, width }) => {
//   return (
//     <td>
//       <input
//         className="form-control"
//         type="text"
//         placeholder={placeholder}
//         style={{ width: width }}
//       />
//     </td>
//   );
// };
export default VehicleEntry;