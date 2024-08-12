import { lazy, Suspense } from "react";


import SideBar2 from "../../../../SideBar/SideBar2.jsx";
import { Spin } from "antd";

import "./VehicleEntryDetails.css";

const VehicleEntryInboundDetails = lazy(() =>
  import("./VehicleEntryInboundDetails.jsx")
);

function VehicleEntryDetails() {


  //Code for close icon
  
  return (
    <SideBar2>
      <Suspense
        fallback={
          <div className="d-flex justify-content-center align-items-center w-100 h-100">
            <Spin size="large" className="custom-spin-container" />
          </div>
        }
      >
        {/* <button
          className="close-button"
          onClick={goBack}
          style={{
            position: "absolute",
            marginRight: 10,
            backgroundColor: "transparent",
            color: "#f11212",
            border: "none",
            cursor: "pointer",
            fontSize: 30,
            outline: "none",
          }}
        >
          <FontAwesomeIcon icon={faRectangleXmark} />
        </button> */}
        <VehicleEntryInboundDetails />
      </Suspense>
    </SideBar2>
  );
}

export default VehicleEntryDetails;
