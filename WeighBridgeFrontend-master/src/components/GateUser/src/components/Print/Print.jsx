import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import './Print.css';
import { Chart, ArcElement } from "chart.js/auto";

import SideBar2 from "../../../../SideBar/SideBar2";

function Print() {
  const [formData, setFormData] = useState({
    date: "",
    inTime: "",
    ticketNo: "",
    poNo: "",
    challanNo: "",
    driverDLNo: "",
    driverName: "",
    supplier: "",
    supplierAddress: "",
    product: "",
    department: "",
    transporter: "",
    eWayBillNo: "",
  });
  const [printSuccess, setPrintSuccess] = useState(false);
  const [printClear, setPrintClear] = useState(false);

   
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePrint = (e) => {
    e.preventDefault();
    // You can handle form submission here
    console.log(formData);
    setPrintSuccess(true); // Set print success message to true
    // Clear the success message after 3 seconds
    setTimeout(() => {
      setPrintSuccess(false);
    }, 3000);
  };

  const handleClear = () => {
    setPrintClear(true); // Set print Clear message to true
    // Clear the Clear message after 3 seconds
    setTimeout(() => {
      setPrintClear(false);
    }, 3000);
  };

  return (
    <>
      

      <SideBar2 
      />

      <div className="QualityPrintMainContent" style={{ marginTop: "90px" }}>
        <div className="card">
          <div className="card-body">
            <h2 className="text-center mb-4">Print Details</h2>
            <div className="row justify-content-center">
              <div className="col-md-2 mb-3">
                <label htmlFor="date" className="form-label font-weight-bold">
                  Date:
                </label>
                <input
                  type="text"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="form-control"
                />
                <label htmlFor="inTime" className="form-label font-weight-bold">
                  In Time:
                </label>
                <input
                  type="text"
                  id="inTime"
                  name="inTime"
                  value={formData.inTime}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="col-md-8 mb-3">
                {/* Empty div for spacing */}
              </div>
              <div className="col-md-2 mb-3">
                <label htmlFor="ticketNo" className="form-label font-weight-bold">
                  Ticket No:
                </label>
                <input
                  type="text"
                  id="ticketNo"
                  name="ticketNo"
                  value={formData.ticketNo}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
                <label htmlFor="poNo" className="form-label font-weight-bold">
                  PO No:
                </label>
                <input
                  type="text"
                  id="poNo"
                  name="poNo"
                  value={formData.poNo}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
                <label htmlFor="challanNo" className="form-label font-weight-bold">
                  Challan No:
                </label>
                <input
                  type="text"
                  id="challanNo"
                  name="challanNo"
                  value={formData.challanNo}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-md-2 mb-3">
                <label htmlFor="supplier" className="form-label font-weight-bold">
                  Supplier:
                </label>
                <input
                  type="text"
                  id="supplier"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
                <label htmlFor="supplierAddress" className="form-label font-weight-bold">
                  Supplier Address:
                </label>
                <input
                  type="text"
                  id="supplierAddress"
                  name="supplierAddress"
                  value={formData.supplierAddress}
                  onChange={handleChange}
                  className="form-control"
                />
                <label htmlFor="driverDLNo" className="form-label font-weight-bold">
                  Driver DL No:
                </label>
                <input
                  type="text"
                  id="driverDLNo"
                  name="driverDLNo"
                  value={formData.driverDLNo}
                  onChange={handleChange}
                  className="form-control"
                />
                <label htmlFor="driverName" className="form-label font-weight-bold">
                  Driver Name:
                </label>
                <input
                  type="text"
                  id="driverName"
                  name="driverName"
                  value={formData.driverName}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="col-md-2 mb-3">
                <label htmlFor="material" className="form-label font-weight-bold">
                  Material:
                </label>
                <input
                  type="text"
                  id="material"
                  name="material"
                  value={formData.material}
                  onChange={handleChange}
                  className="form-control"
                />
                <label htmlFor="department" className="form-label font-weight-bold">
                  Department:
                </label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="form-control"
                />
                <label htmlFor="transporter" className="form-label font-weight-bold">
                  Transporter:
                </label>
                <input
                  type="text"
                  id="transporter"
                  name="transporter"
                  value={formData.transporter}
                  onChange={handleChange}
                  className="form-control"
                />
                <label htmlFor="eWayBillNo" className="form-label font-weight-bold">
                  E-WayBillNo:
                </label>
                <input
                  type="text"
                  id="eWayBillNo"
                  name="eWayBillNo"
                  value={formData.eWayBillNo}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="col-md-2 mb-3">
                <label htmlFor="tpNetWeight" className="form-label font-weight-bold">
                  TP Net Weight:
                </label>
                <input
                  type="text"
                  id="tpNetWeight"
                  name="tpNetWeight"
                  value={formData.tpNetWeight}
                  onChange={handleChange}
                  className="form-control"
                />
                <label htmlFor="rcFitnessUpto" className="form-label font-weight-bold">
                  Rc Fitness Upto:
                </label>
                <input
                  type="text"
                  id="rcFitnessUpto"
                  name="rcFitnessUpto"
                  value={formData.rcFitnessUpto}
                  onChange={handleChange}
                  className="form-control"
                />
                <label htmlFor="vehicleType" className="form-label font-weight-bold">
                  Vehicle Type:
                </label>
                <input
                  type="text"
                  id="vehicleType"
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  className="form-control"
                />
                <label htmlFor="noOfWheels" className="form-label font-weight-bold">
                  No Of Wheels:
                </label>
                <input
                  type="text"
                  id="noOfWheels"
                  name="noOfWheels"
                  value={formData.noOfWheels}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-md-4 text-center">
                {printSuccess && (
                  <div className="alert alert-success" role="alert">
                    Print Successfully Done!
                  </div>
                )}
                {printClear && (
                  <div className="alert alert-success" role="alert">
                    Print Successfully Clearled!
                  </div>
                )}
                <button type="button" className="btn btn-primary mx-2" onClick={handlePrint}>Print</button>
                <button type="button" className="btn btn-secondary mx-2" onClick={handleClear}>Clear</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Print;
