import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import SideBar3 from "../../../../SideBar/SideBar3";
import "./QualityHomePage.css";
import * as XLSX from "xlsx";
import { Link } from "react-router-dom";
import { Chart, ArcElement } from "chart.js/auto";
import { useMediaQuery } from 'react-responsive';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileArrowDown, faBackwardStep, faForwardStep, faBackwardFast, faForwardFast } from '@fortawesome/free-solid-svg-icons';


function QualityHomePage() {

    const toggleSidebar = () => {
        setIsSidebarExpanded(!isSidebarExpanded);
      };

    
   
  const chartRef = useRef(null);
  const chartRef2 = useRef(null);
  const homeMainContentRef = useRef(null);


  
  
  return (
    <div>
      <SideBar3 
      />
      </div>
      
  );
}

export default QualityHomePage

