import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Bar, Line, Pie } from "react-chartjs-2";
import { faSearch, faBellSlash, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import Sidebar4 from "../../../../SideBar/SideBar4";
import { Card, Typography, Box, Grid } from "@mui/material";
import { useMediaQuery } from 'react-responsive';

function Home() {
  const chartRef = useRef(null);
  const chartRef2 = useRef(null);
  const [showNotification, setShowNotification] = useState(false);
  const [loading, setLoading] = useState(true);
  const isSmallScreen = useMediaQuery({ maxWidth: 767 });


  const toggleNotification = () => {
    setShowNotification(!showNotification);
  };

  useEffect(() => {
    const homeMainContent = document.querySelector(".home-main-content");
    if (homeMainContent) {
      const resizeObserver = new ResizeObserver(() => {
        if (chartRef.current?.chartInstance && chartRef2.current?.chartInstance) {
          chartRef.current.chartInstance.resize();
          chartRef2.current.chartInstance.resize();
        }
      });

      resizeObserver.observe(homeMainContent);
      setTimeout(() => {
        setLoading(false);
      }, 2000);
      return () => {
        resizeObserver.disconnect();
      };
    }
  }, []);

  // Inside the event handler function
const handleCompanySelection = (companyName, siteName) => {
  // Update your state or perform any necessary operations
  
  // Store the selected company name and site name in session storage
  sessionStorage.setItem('selectedCompany', companyName);
  sessionStorage.setItem('selectedSite', siteName);
};

  return (
    <Sidebar4>
      <Box display="flex" justifyContent="space-between" alignItems="center" p={isSmallScreen ? 2 : 3}>
      <Grid container justifyContent="center" alignItems="center" spacing={isSmallScreen ? 2 : 3}>
  <Grid item xs={12}>
    <h2 style={{ textAlign: 'center', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>Management Dashboard</h2>
  </Grid>
</Grid>


          <FontAwesomeIcon icon={faSearch} style={{ fontSize: isSmallScreen ? '1rem' : '1.2rem', marginRight: '0.5rem' }} />
          <FontAwesomeIcon icon={faBellSlash} onClick={toggleNotification} style={{ fontSize: isSmallScreen ? '1rem' : '1.2rem', marginRight: '0.5rem' }} />
          <FontAwesomeIcon icon={faUserCircle} style={{ fontSize: isSmallScreen ? '1rem' : '1.2rem' }} />
        
      </Box>
      <Grid container spacing={isSmallScreen ? 2 : 3} className="home-main-content">
        <Grid item xs={12} md={6}>
        <Card sx={{ ml: isSmallScreen ? '1rem' : '2rem', p: isSmallScreen ? '1rem' : '1rem 3rem', mb: 3, boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', borderRadius: '10px', marginTop: '-2rem', height: 'auto', bgcolor: '#F5F5F5' }}>

            <Box sx={{ display: 'flex', flexDirection: isSmallScreen ? 'column' : 'row', alignItems: 'center', mb: '1rem' }}>
              <Box sx={{ flex: '1', mr: isSmallScreen ? 0 : '1rem', mb: isSmallScreen ? '1rem' : 0 }}>
                <label className="fw-bold" style={{ fontSize: '0.8rem' }}>Company:</label>
                <select className="form-select" style={{ fontSize: '0.8rem' }}>
                  <option value="Vikram Pvt Ltd">Vikram Pvt Ltd</option>
                  <option value="Highlander">Highlander</option>
                  <option value="Rider">Rider</option>
                </select>
              </Box>
              <Box sx={{ flex: '1' }}>
                <label className="fw-bold" style={{ fontSize: '0.8rem' }}>Site:</label>
                <select className="form-select" style={{ fontSize: '0.8rem' }}>
                  <option>Bhubaneswar</option>
                  <option value="Roulkela">Roulkela</option>
                  <option value="Aska">Aska</option>
                  <option value="Puri">Puri</option>
                </select>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: isSmallScreen ? 'column' : 'row', alignItems: 'center' }}>
              <Box sx={{ flex: '1', mr: isSmallScreen ? 0 : '1rem', mb: isSmallScreen ? '1rem' : 0 }}>
                <label className="fw-bold" style={{ fontSize: '0.8rem' }}>Select From Date:</label>
                <input type="date" className="form-control" style={{ fontSize: '0.8rem' }} />
              </Box>
              <Box sx={{ flex: '1' }}>
                <label className="fw-bold" style={{ fontSize: '0.8rem' }}>Select To Date:</label>
                <input type="date" className="form-control" style={{ fontSize: '0.8rem' }} />
              </Box>
            </Box>
          </Card>
          <Card sx={{ ml: isSmallScreen ? '1rem' : '2rem', p: isSmallScreen ? '1rem' : '1rem 3rem', mb: 3, boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', borderRadius: '10px', marginTop: '1rem', height: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', bgcolor: '#F5F5F5' }}>
  <Bar
    data={{
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Coal",
          data: [12, 19, 3, 5, 2, 3, 45],
          backgroundColor: "#181418",
        },
        {
          label: "Iron Ore",
          data: [12, 9, 3, 5, 2, 3, 5],
          backgroundColor: "#CED4DA",
        },
        {
          label: "Dolomite",
          data: [12, 19, 3, 5, 2, 3, 45],
          backgroundColor: "#F7BB88",
        },
        {
          label: "Sponge Iron",
          data: [8, 10, 4, 6, 3, 4, 25],
          backgroundColor: "#87A49A",
        },
      ],
    }}
    options={{
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return value + " tonnes";
            },
          },
        },
      },
    }}
    ref={chartRef}
  />
  <Typography align="center" variant="body2" style={{ marginBottom: '1.5rem' }}>
    Number of materials received
  </Typography>
</Card>


          
<Card sx={{ ml: isSmallScreen ? '1rem' : '2rem', p: isSmallScreen ? '1rem' : '1rem 3rem', mb: 3, boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', borderRadius: '10px', marginTop: '-1rem', bgcolor: '#F5F5F5' }}>
            <Line
              data={{
                labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                datasets: [
                {
                label: 'Inbound',
                data: [12, 19, 3, 5, 2],
                color: '#4CAF50',
                },
                {
                label: 'Outbound',
                data: [12, 9, 3, 5, 2, 3, 5],
                color: '#FF6347',
                },
                ],
                }}
                xField="labels"
                yField="data"
                seriesField="name"
                yAxis={{ label: { formatter: (v) => `${v} trucks` } }}
                point={{ size: 5, shape: 'diamond' }}
                />
                <Typography align="center" variant="body2">
          Number of Trucks
        </Typography>
      </Card>
    </Grid>

    <Grid item xs={12} md={6}>
    <Card sx={{ mr: isSmallScreen ? '1rem' : '2rem', p: isSmallScreen ? '0.5rem' : '1rem 2rem', mb: 3, boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', borderRadius: '10px', marginTop: '-2rem', bgcolor: '#F5F5F5' }}>
        <Typography variant="h5" align="center" gutterBottom style={{ marginBottom: '0.2rem', marginTop: '0.2rem', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
          Quantity Dashboard
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: isSmallScreen ? 'center' : 'space-between', mt: 1, flexDirection: isSmallScreen ? 'column' : 'row' }}>

        <Box
  sx={{
    position: 'relative',
    overflow: 'visible',
    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
    borderRadius: '10px',
    width: isSmallScreen ? '100%' : '62%',
    height: isSmallScreen ? 'auto' : '180px',
    '::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      width: '5px',
      backgroundColor: '#FF6384',
      borderRadius: '10px 0 0 10px',
    },
    mb: isSmallScreen ? '1rem' : 0,
  }}
>
  <div style={{ marginLeft: isSmallScreen ? 0 : '-20px', marginTop: isSmallScreen ? 0 : '-38px' }}>
    <Pie
      data={{
        labels: ["Coal", "Iron Ore", "Dolomite"],
        datasets: [
          {
            data: [30, 20, 50],
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
          },
        ],
      }}
      options={{
        plugins: {
          legend: {
            display: true,
            position: 'left',
          },
          title: {
            display: true,
            text: 'Inbound',
            position: 'top',
          },
        },
        layout: {
          padding: isSmallScreen ? 16 : 18,
        },
      }}
      width={isSmallScreen ? 120 : 180}
      height={isSmallScreen ? 120 : 180}
    />
  </div>
</Box>

<Box
  sx={{
    position: 'relative',
    overflow: 'visible',
    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
    borderRadius: '10px',
    width: isSmallScreen ? '100%' : '62%',
    height: isSmallScreen ? 'auto' : '180px',
    '::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      width: '5px',
      backgroundColor: '#FF6384',
      borderRadius: '10px 0 0 10px',
    },
    mb: isSmallScreen ? '1rem' : 0,
  }}
>
  <div style={{ marginLeft: isSmallScreen ? 0 : '-10px', marginTop: isSmallScreen ? 0 : '-32px' }}>
    <Pie
      data={{
        labels: ["Sponge Iron", "Dolochar"],
        datasets: [
          {
            data: [70, 30],
            backgroundColor: ["#FF6384", "#36A2EB"],
          },
        ],
      }}
      options={{
        plugins: {
          legend: {
            display: true,
            position: 'left',
          },
          title: {
            display: true,
            text: 'Outbound',
            position: 'top',
          },
        },
        layout: {
          padding: isSmallScreen ? 16 : 10,
        },
      }}
      width={isSmallScreen ? 120 : 180}
      height={isSmallScreen ? 120 : 180}
    />
  </div>
</Box>


        </Box>
      </Card>

      <Card sx={{ mr: isSmallScreen ? '1rem' : '2rem', p: isSmallScreen ? '0.5rem' : '1rem 2rem', mb: 3, boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', borderRadius: '10px', marginTop: '-1rem', bgcolor: '#F5F5F5' }}>
        <Typography variant="h5" align="center" gutterBottom style={{ marginBottom: '0.2rem', marginTop: '-0.7rem', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
          Quality Dashboard
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: isSmallScreen ? 'center' : 'space-between', mt: 1, flexDirection: isSmallScreen ? 'column' : 'row' }}>
          
        <Box
  sx={{
    position: 'relative',
    overflow: 'visible',
    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
    borderRadius: '10px',
    width: isSmallScreen ? '100%' : '60%',
    height: isSmallScreen ? 'auto' : '180px',
    '::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      width: '5px',
      backgroundColor: '#FF6384',
      borderRadius: '10px 0 0 10px',
    },
    mb: isSmallScreen ? '1rem' : 0,
  }}
>
  <div style={{ marginLeft: isSmallScreen ? 0 : '-10px', marginTop: isSmallScreen ? 0 : '-30px' }}>
    <Pie
      data={{
        labels: ["Coal(Good)", "Coal(Bad)", "IronOre(Good)", "IronOre(Bad)", "Dolomite(Good)", "Dolomite(Bad)"],
        datasets: [
          {
             data: [40, 20, 30, 20, 50, 10],
                      backgroundColor: [
                        "#4BC0C0",
                        "rgba(75, 192, 192, 0.5)",
                        "#FF6384",
                        "rgba(255, 99, 132, 0.5)",
                        "#FF9F40",
                        "rgba(255, 159, 64, 0.5)",
                      ],
          },
        ],
      }}
      options={{
        plugins: {
          legend: {
            display: true,
            position: 'left',
          },
          title: {
            display: true,
            text: 'Inbound',
            position: 'top',
          },
        },
        layout: {
          padding: isSmallScreen ? 16 : 10,
        },
      }}
      width={isSmallScreen ? 120 : 180}
      height={isSmallScreen ? 120 : 180}
    />
  </div>
</Box>

<Box
  sx={{
    position: 'relative',
    overflow: 'visible',
    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
    borderRadius: '10px',
    width: isSmallScreen ? '100%' : '60%',
    height: isSmallScreen ? 'auto' : '180px',
    '::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      width: '5px',
      backgroundColor: '#FF6384',
      borderRadius: '10px 0 0 10px',
    },
    mb: isSmallScreen ? '1rem' : 0,
  }}
>
  <div style={{ marginLeft: isSmallScreen ? 0 : '-10px', marginTop: isSmallScreen ? 0 : '-30px' }}>
    <Pie
      data={{
        labels: ["Sponge Iron (Good)", "Sponge Iron (Bad)", "Dolochar (Good)", "Dolochar (Bad)"],
        datasets: [
          {
             data: [35, 35, 15, 15],
                      backgroundColor: [
                        "#4BC0C0",
                        "rgba(75, 192, 192, 0.5)",
                        "#FF6384",
                        "rgba(255, 99, 132, 0.5)",
                      ],
          },
        ],
      }}
      options={{
        plugins: {
          legend: {
            display: true,
            position: 'left',
          },
          title: {
            display: true,
            text: 'Outbound',
            position: 'top',
          },
        },
        layout: {
          padding: isSmallScreen ? 16 : 10,
        },
      }}
      width={isSmallScreen ? 120 : 180}
      height={isSmallScreen ? 120 : 180}
    />
  </div>
</Box>

        </Box>
      </Card>

      <Card sx={{ mr: isSmallScreen ? '1rem' : '2rem', p: isSmallScreen ? '0.5rem' : '1rem 2rem', mb:3, boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', borderRadius: '10px', marginTop: '-1rem', bgcolor: '#F5F5F5' }}>
        <Typography variant="h5" align="center" gutterBottom style={{ marginBottom: '0.2rem', marginTop: '0.2rem', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
          Live Transactions Dashboard
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: isSmallScreen ? 'center' : 'space-between', mt: 2, flexDirection: isSmallScreen ? 'column' : 'row' }}>

         <Box
  sx={{
    position: 'relative',
    overflow: 'visible',
    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
    borderRadius: '10px',
    width: isSmallScreen ? '100%' : '260px',
    height: isSmallScreen ? 'auto' : '180px',
    '::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      width: '5px',
      backgroundColor: '#FF6384',
      borderRadius: '10px 0 0 10px',
    },
    mb: isSmallScreen ? '1rem' : 0,
  }}
>
  <div style={{ marginLeft: isSmallScreen ? 0 : '-10px', marginTop: isSmallScreen ? 0 : '-32px' }}>
    <Pie
      data={{
        labels: ["Vehicles Entered", "Tare Weighed", "Gross Weighed", "Quality Completed"],
        datasets: [
                    {
                      data: [25, 20, 30, 25],
                      backgroundColor: ["#4CAF50", "#FF6384", "#36A2EB", "#FFCE56"],
                    },
                  ],
      }}
      options={{
        plugins: {
          legend: {
            display: true,
            position: 'left',
          },
          title: {
            display: true,
            text: 'Inbound',
            position: 'top',
          },
        },
        layout: {
          padding: isSmallScreen ? 16 : 5,
        },
      }}
      width={isSmallScreen ? 120 : 180}
      height={isSmallScreen ? 120 : 180}
    />
  </div>
</Box>


<Box
  sx={{
    position: 'relative',
    overflow: 'visible',
    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
    borderRadius: '10px',
    width: isSmallScreen ? '100%' : '260px',
    height: isSmallScreen ? 'auto' : '180px',
    '::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      width: '5px',
      backgroundColor: '#FF6384',
      borderRadius: '10px 0 0 10px',
    },
    mb: isSmallScreen ? '1rem' : 0,
  }}
>
  <div style={{ marginLeft: isSmallScreen ? 0 : '-10px', marginTop: isSmallScreen ? 0 : '-32px' }}>
    <Pie
       data={{
                  labels: ["Vehicles Exited", "Tare Weighed", "Gross Weighed", "Quality Completed"],
                  datasets: [
                    {
                      data: [30, 15, 25, 30],
                      backgroundColor: ["#FF6347", "#4CAF50", "#36A2EB", "#FFCE56"],
                    },
                  ],
                }}
      options={{
        plugins: {
          legend: {
            display: true,
            position: 'left',
          },
          title: {
            display: true,
            text: 'Outbound',
            position: 'top',
          },
        },
        layout: {
          padding: isSmallScreen ? 16 : 5,
        },
      }}
      width={isSmallScreen ? 120 : 180}
      height={isSmallScreen ? 120 : 180}
    />
  </div>
</Box>

        </Box>
      </Card>
    </Grid>
  </Grid>
</Sidebar4>
);
}
export default Home;