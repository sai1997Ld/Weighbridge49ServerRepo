import { useState, useEffect } from 'react';
import Select from "react-select";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, PointElement } from 'chart.js';

import { Line, Bar } from 'react-chartjs-2';
import axios from 'axios';
import Swal from "sweetalert2";
import SideBar4 from '../SideBar/SideBar4';
import moment from 'moment/moment';


ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, PointElement);



function HomePage5() {
  const [company, setCompany] = useState(sessionStorage.getItem('company') || "");
  const [site, setSite] = useState(sessionStorage.getItem('site') || "");
  const [companies, setCompanies] = useState([]);
  const [sites, setSites] = useState([""]);
  const [startDate, setStartDate] = useState(sessionStorage.getItem('startDate') || "");
  const [endDate, setEndDate] = useState(sessionStorage.getItem('endDate') || "");
  const [supplierName, setSupplierName] = useState(sessionStorage.getItem('supplierName') || "");
  const [supplierAddresses, setSupplierAddresses] = useState([]);
const [supplierAddress, setSupplierAddress] = useState(sessionStorage.getItem('supplierAddress') || "");
  const [supplierNames, setSupplierNames] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Inbound',
        data: [],
        borderColor: 'green',
        fill: false,
      },
      {
        label: 'Outbound',
        data: [],
        borderColor: 'red',
        fill: false,
      },
    ],
  });
  const [inboundBarData, setInboundBarData] = useState({
    labels: [],
    datasets: [],
  });
  const [outboundBarData, setOutboundBarData] = useState({
    labels: [],
    datasets: [],
  });
  const [materialProductData, setMaterialProductData] = useState({
    labels: [],
    datasets: [],
  });
  const [materialProductQualityData, setMaterialProductQualityData] = useState({
    labels: [],
    datasets: [],
  });
  const [moisturePercentageData, setMoisturePercentageData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    sessionStorage.setItem('company', company);
    sessionStorage.setItem('site', site);
    sessionStorage.setItem('startDate', startDate);
    sessionStorage.setItem('endDate', endDate);
    sessionStorage.setItem('supplierName', supplierName);
    sessionStorage.setItem('supplierAddress', supplierAddress);
  }, [company, site, startDate, endDate, supplierName, supplierAddress]);

  useEffect(() => {
    fetchSupplierNames("");
  }, []);

  useEffect(() => {
    const fetchMoisturePercentageData = async () => {
      try {
        const payload = {
          companyName: company,
          siteName: site,
          materialName: "Coal", // Fixed material name
          supplierName: supplierName,
          supplierAddress: supplierAddress,
          fromDate: startDate,
          toDate: endDate,
        };

        const response = await axios.post('http://localhost:8080/api/v1/management/moisture-percentage', payload);
        const data = response.data.moisturePercentageData;

        // Process data for bar chart
        const labels = data.map(item => item.transactionDate);
        const moisturePercentages = data.map(item => item.moisturePercentage);

        setMoisturePercentageData({
          labels: labels,
          datasets: [
            {
              label: 'Moisture Percentage (%)',
              data: moisturePercentages,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching moisture percentage data:', error);
      }
    };

    if (company && site && startDate && endDate && supplierName && supplierAddress) {
      fetchMoisturePercentageData();
    }
  }, [company, site, startDate, endDate, supplierName, supplierAddress]);

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/company/names")
      .then((response) => response.json())
      .then((data) => {
        console.log("Company List:", data);
        setCompanies(data);
      })
      .catch((error) => {
        console.error("Error fetching company list:", error);
      });
  }, []);

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/sites/company/${company}`);
        if (!response.ok) {
          throw new Error("Failed to fetch site list.");
        }
        const data = await response.json();
        const formattedSites = data.map((site) => ({
          site: `${site.siteName},${site.siteAddress}`,
        }));
        setSites(formattedSites);
      } catch (error) {
        console.error("Error fetching site list:", error);
      }
    };

    if (company) {
      fetchSites();
    }
  }, [company]);

  const handleCompanyChange = (e) => {
    setCompany(e.target.value);
  };

  const fetchSupplierNames = () => {
    fetch("http://localhost:8080/api/v1/supplier/get/list")
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to fetch supplier names.");
        }
      })
      .then((data) => {
        setSupplierNames(data);
      })
      .catch((error) => {
        Swal.fire({
          title: "Error",
          text: error.message,
          icon: "error",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "btn btn-danger",
          },
        });
      });
  };

  const fetchSupplierAddress = (supplierName) => {
    fetch(`http://localhost:8080/api/v1/supplier/get/${supplierName}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to fetch supplier address.");
        }
      })
      .then((data) => {
        setSupplierAddresses(data); 
        // setSupplierAddress(data[0]); 
      })
      .catch((error) => {
        Swal.fire({
          title: "Error",
          text: error.message,
          icon: "error",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "btn btn-danger",
          },
        });
      });
  };
  
  useEffect(() => {
    if (supplierName) {
      fetchSupplierAddress(supplierName);
    }
  }, [supplierName]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const payload = {
          fromDate: moment(startDate).format('DD-MM-YYYY'),
          toDate: moment(endDate).format('DD-MM-YYYY'),
          companyName: company,
          siteName: site,
        };

        const [lineResponse, inboundResponse, outboundResponse, materialProductResponse, materialProductQualityResponse] = await Promise.all([
          axios.post('http://localhost:8080/api/v1/management/gate-dash', payload),
          axios.post('http://localhost:8080/api/v1/management/getQtyByGraph?transactionType=Inbound', payload),
          axios.post('http://localhost:8080/api/v1/management/getQtyByGraph?transactionType=Outbound', payload),
          axios.post('http://localhost:8080/api/v1/management/material-product', payload),
          axios.post('http://localhost:8080/api/v1/management/material-product/qualities', payload),
        ]);

        const lineData = lineResponse.data;
        const inboundData = inboundResponse.data;
        const outboundData = outboundResponse.data;
        const materialProductData = materialProductResponse.data.materialProductData;
        const materialProductQualityData = materialProductQualityResponse.data.materialProductQualityData;

        const labels = lineData.map((item) => item.transactionDate);
        const inboundCounts = lineData.map((item) => item.inboundCount);
        const outboundCounts = lineData.map((item) => item.outboundCount);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Inbound',
              data: inboundCounts,
              borderColor: '#4CAF50',
              fill: false,
            },
            {
              label: 'Outbound',
              data: outboundCounts,
              borderColor: '#FF6347',
              fill: false,
            },
          ],
        });

        const processBarData = (data) => {
          const materials = [...new Set(data.map((item) => item.materialName))];
          const dates = [...new Set(data.map((item) => item.transactionDate))];

          const datasets = materials.map((material) => ({
            label: material,
            data: dates.map((date) => {
              const item = data.find(
                (d) => d.transactionDate === date && d.materialName === material
              );
              return item ? item.totalQuantity : 0;
            }),
            backgroundColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
          }));

          return { labels: dates, datasets };
        };

        setInboundBarData(processBarData(inboundData));
        setOutboundBarData(processBarData(outboundData));

        const materials = Object.keys(materialProductData[0].materialData);
        const dates = materialProductData.map(item => item.transactionDate);

        const datasets = materials.map(material => ({
          label: material,
          data: materialProductData.map(item => item.materialData[material]),
          backgroundColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
        }));

        setMaterialProductData({ labels: dates, datasets });

        const processQualityBarData = (data) => {
          const dates = data.map(item => item.transactionDate);
          const allMaterials = [...new Set(data.flatMap(item => item.qualityData.map(q => q.materialOrProductName)))];

          const getRandomColor = () => {
            const r = Math.floor(Math.random() * 256);
            const g = Math.floor(Math.random() * 256);
            const b = Math.floor(Math.random() * 256);
            return `rgb(${r}, ${g}, ${b})`;
          };

          const datasets = allMaterials.flatMap((material) => {
            const goodDataset = {
              label: `${material} - Good`,
              data: dates.map((date) => {
                const item = data.find(d => d.transactionDate === date);
                const materialData = item ? item.qualityData.find(q => q.materialOrProductName === material) : null;
                return materialData ? materialData.goodPercentage : 0;
              }),
              backgroundColor: getRandomColor(),
            };

            const badDataset = {
              label: `${material} - Bad`,
              data: dates.map((date) => {
                const item = data.find(d => d.transactionDate === date);
                const materialData = item ? item.qualityData.find(q => q.materialOrProductName === material) : null;
                return materialData ? materialData.badPercentage : 0;
              }),
              backgroundColor: getRandomColor(),
            };

            return [goodDataset, badDataset];
          });

          return { labels: dates, datasets };
        };

        setMaterialProductQualityData(processQualityBarData(materialProductQualityData));

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (company && site && startDate && endDate) {
      fetchData();
    }
  }, [company, site, startDate, endDate]);

  return (
    <SideBar4>
      <div className="home-page">
        <div className="main-content container-fluid">
          <h2 className="text-center mx-auto">Management Dashboard</h2>
          <div className="row">
            <div className="col-md-12 col-sm-12 mb-3">
  <div className="form-container">
    <div className="card" style={{ boxShadow: "0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)", width: "100%" }}>
      <div className="card-body p-4">
        <form>
          <p style={{ color: "red" }}>Please fill all * marked fields.</p>
          <div className="row mb-3">
            <div className="col-md-3 col-sm-6">
              <label htmlFor="company" className="form-label">
                Company Name<span style={{ color: "red", fontWeight: "bold" }}> *</span>
              </label>
              <select
                className="form-select"
                id="company"
                value={company}
                onChange={handleCompanyChange}
                required
              >
                <option value="">Select Company Name</option>
                {companies.map((c, index) => (
                  <option key={index} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3 col-sm-6">
              <label htmlFor="site" className="form-label">
                Site Name<span style={{ color: "red", fontWeight: "bold" }}> *</span>
              </label>
              <select
                className="form-select"
                id="site"
                value={site}
                onChange={(e) => setSite(e.target.value)}
                required
              >
                <option value="">Select Site Name</option>
                {sites.map((s, index) => (
                  <option key={index} value={s.site}>{s.site}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3 col-sm-6">
              <label htmlFor="startDate" className="form-label">
                Start Date<span style={{ color: "red", fontWeight: "bold" }}> *</span>
              </label>
              <input
                type="date"
                className="form-control"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="col-md-3 col-sm-6">
              <label htmlFor="endDate" className="form-label">
                End Date<span style={{ color: "red", fontWeight: "bold" }}> *</span>
              </label>
              <input
                type="date"
                className="form-control"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
              
           
            
            <div className="col-md-6 col-sm-12 mb-3">
              <div className="card" style={{ boxShadow: "0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)", height: "100%", position: "relative", overflow: "hidden" }}>
                <div className='card-body' >
                  {chartData.labels.length > 0 && (
                    <Line
                      data={chartData}
                      options={{
                        responsive: true,
                        scales: {
                          x: {
                            title: {
                              display: true,
                              text: 'Date',
                            },
                          },
                          y: {
                            title: {
                              display: true,
                              text: 'Truck Count',
                            },
                            min: 0,
                          },
                        },
                      }}
                    />
                  )}
                  <div style={{ textAlign: 'center', marginBottom:"5px",  fontWeight: 'bold', fontFamily: 'monospace' }}>Number of Trucks</div>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 col-sm-12 mb-3">
              <div className="card" style={{ boxShadow: "0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)", height: "100%", position: "relative", overflow: "hidden" }}>
                <div className="card-body">
                  {inboundBarData.labels.length > 0 && (
                    <Bar
                      data={inboundBarData}
                      options={{
                        responsive: true,
                        scales: {
                          x: {
                            title: {
                              display: true,
                              text: 'Date',
                            },
                          },
                          y: {
                            title: {
                              display: true,
                              text: 'Quantity',
                            },
                            min: 0,
                          },
                        },
                      }}
                    />
                  )}
                  <div style={{ textAlign: 'center', marginBottom:"5px",  fontWeight: 'bold', fontFamily: 'monospace' }}>Inbound Quantity by Material</div>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-sm-12 mb-3">
              <div className="card" style={{ boxShadow: "0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)", height: "100%", position: "relative", overflow: "hidden" }}>
                <div className="card-body">
                  {outboundBarData.labels.length > 0 && (
                    <Bar
                      data={outboundBarData}
                      options={{
                        responsive: true,
                        scales: {
                          x: {
                            title: {
                              display: true,
                              text: 'Date',
                            },
                          },
                          y: {
                            title: {
                              display: true,
                              text: 'Quantity',
                            },
                            min: 0,
                          },
                        },
                      }}
                    />
                  )}
                  <div style={{ textAlign: 'center', marginBottom:"5px",  fontWeight: 'bold', fontFamily: 'monospace' }}>Outbound Quantity by Product</div>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-sm-12 mb-3">
              <div className="card" style={{ boxShadow: "0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)", height: "100%", position: "relative", overflow: "hidden" }}>
                <div className="card-body">
                  {materialProductData.labels.length > 0 && (
                    <Bar
                      data={materialProductData}
                      options={{
                        responsive: true,
                        scales: {
                          x: {
                            title: {
                              display: true,
                              text: 'Date',
                            },
                          },
                          y: {
                            title: {
                              display: true,
                              text: 'Quantity',
                            },
                            min: 0,
                          },
                        },
                      }}
                    />
                  )}
                  <div style={{ textAlign: 'center', marginBottom:"5px",  fontWeight: 'bold', fontFamily: 'monospace' }}>Material-Product Quantity</div>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 col-sm-12 mb-3">
              <div className="card" style={{ boxShadow: "0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)", height: "100%", position: "relative", overflow: "hidden" }}>
                <div className="card-body">
                  {materialProductQualityData.labels.length > 0 && (
                    <Bar
                      data={materialProductQualityData}
                      options={{
                        responsive: true,
                        scales: {
                          x: {
                            title: {
                              display: true,
                              text: 'Date',
                            },
                          },
                          y: {
                            title: {
                              display: true,
                              text: 'Percentage (%)',
                            },
                            min: 0,
                            max: 100,
                          },
                        },
                      }}
                    />
                  )}
                  <div style={{ textAlign: 'center', marginBottom:"5px",  fontWeight: 'bold', fontFamily: 'monospace' }}>Material-Product Quality</div>
                </div>
              </div>
            </div>

         

            <div className="col-md-6 col-sm-12 mb-3">
  <div className="card" style={{ boxShadow: "0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)", height: "100%", position: "relative", overflow: "hidden" }}>
    <div className="card-body">
      <div className="row mb-3">
        <div className="col-md-6">
          <label htmlFor="supplierName" className="form-label">
            Supplier Name<span style={{ color: "red", fontWeight: "bold" }}> *</span>
          </label>
          <Select
            id="supplierName"
            value={supplierName ? { value: supplierName, label: supplierName } : null}
            onChange={(selectedOption) => setSupplierName(selectedOption.label)}
            options={supplierNames.map((name) => ({ value: name, label: name }))}
            isSearchable
            isRequired
            placeholder="Select Supplier Name"
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="supplierAddressLine1" className="form-label">
            Supplier Address<span style={{ color: "red", fontWeight: "bold" }}> *</span>
          </label>
          <Select
    id="supplierAddress"
    value={supplierAddress ? { value: supplierAddress, label: supplierAddress } : null}
    onChange={(selectedOption) => setSupplierAddress(selectedOption.label)}
    options={supplierAddresses.map((address) => ({ value: address, label: address }))}
    isSearchable
    isRequired
    placeholder="Select Supplier Address"
  />
        </div>
      </div>
      {moisturePercentageData.labels.length > 0 && (
        <Bar
          data={moisturePercentageData}
          options={{
            responsive: true,
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Date',
                },
              },
              y: {
                title: {
                  display: true,
                  text: 'Moisture Percentage (%)',
                },
                min: 0,
                max: 100,
              },
            },
          }}
        />
      )}
      <div style={{ textAlign: 'center', marginBottom:"5px", fontWeight: 'bold', fontFamily: 'monospace' }}>Moisture Percentage (%) of Coal</div>
    </div>
  </div>
</div>
        </div>
      </div>
      </div>
    </SideBar4>
  );
}

export default HomePage5