import { useState } from "react";
import "sweetalert2/dist/sweetalert2.min.css";
import "./Sidebar.css";
import {
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  ListItemButton,
  Typography,
  Box,
  useMediaQuery,
  Popover,
  Divider,
  Avatar,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  Person,
  DirectionsCar,
  Dashboard as DashboardIcon,
  Menu as MenuIcon,
  Build,
  BusinessCenter,
  Store,
  VideoCallRounded,
  Commute,
  Group,
  ExitToApp,
  Home,
  Handyman,
  ProductionQuantityLimits,
  PowerSettingsNewOutlined,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const SideBar = ({ children }) => {
  const [openStates, setOpenStates] = useState({
    user: false,
    company: false,
    transport: false,
    vehicle: false,
    supplier: false,
    customer: false,
    material: false,
    product: false,
    camera: false,
  });
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const isLargeScreen = useMediaQuery("(min-width:768px)");

  const toggleOpen = (key) => {
    setOpenStates((prev) => ({ ...prev, [key]: !prev[key] }));
    setSelectedItem(openStates[key] ? null : key);
  };

  const handleItemClick = (item) => setSelectedItem(item);
  const toggleSideBar = () => setIsSideBarOpen(!isSideBarOpen);
  const handleUserProfileClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const userName = sessionStorage.getItem("userName");
  const roles = JSON.parse(sessionStorage.getItem("roles"));
  const userId = sessionStorage.getItem("userId");

  const open = Boolean(anchorEl);

  const handleSignOut = () => {
    sessionStorage.clear();
    window.location.href = "/";
    if (window.history && window.history.pushState) {
      window.history.replaceState(null, null, "/");
      window.history.pushState(null, null, "/");
      window.onpopstate = () => window.history.go(1);
    }
  };

  const handleSignOut2 = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to sign out.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, sign out",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        handleSignOut();
      }
    });
  };

  return (
    <>
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          backgroundColor: "rgb(14, 23, 38)",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px",
          }}
        >
          <IconButton onClick={toggleSideBar}>
            <MenuIcon sx={{ color: "white" }} />
          </IconButton>
          {isLargeScreen && (
            <Typography
              variant={isLargeScreen ? "h6" : "h5"}
              sx={{ color: "white" }}
            >
              Weighbridge Management System
            </Typography>
          )}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="body1"
              sx={{
                color: "white",
                marginRight: "8px",
                fontFamily: "monospace",
              }}
            >
              {userName.split(" ")[0]}
            </Typography>
            <Avatar
              onClick={handleUserProfileClick}
              sx={{ backgroundColor: "#3e8ee6", color: "white" }}
            >
              {userName
                ? `${userName.split(" ")[0][0]}${
                    userName.split(" ")[1] ? userName.split(" ")[1][0] : ""
                  }`
                : ""}
            </Avatar>
          </Box>
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            sx={{
              "& .MuiPaper-root": {
                backgroundColor: "#394253",
                overflow: "visible",
                marginTop: "10px",
                marginX: "10px",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "#394253",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
          >
            <Box
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar
                sx={{
                  color: "black",
                  width: 56,
                  height: 56,
                  margin: "auto",
                  mb: 2,
                }}
              >
                <Person />
              </Avatar>
              <Typography
                variant="h6"
                sx={{ color: "white", textAlign: "center", mb: 1 }}
              >
                {userName}
              </Typography>
              <Typography
                sx={{
                  color: "white",
                  textAlign: "center",
                  mb: 1,
                  fontWeight: "bold",
                }}
              >
                User ID: {userId}
              </Typography>
              <Divider sx={{ backgroundColor: "white", mb: 1 }} />
              <Typography
                sx={{ color: "white", textAlign: "center", fontWeight: "bold" }}
              >
                Roles: {roles.join(", ")}
              </Typography>
              <IconButton color="error" onClick={handleSignOut} sx={{ mt: 2 }}>
                <PowerSettingsNewOutlined />
              </IconButton>
            </Box>
          </Popover>
        </Box>
      </Box>
      <Drawer
        variant="temporary"
        open={isSideBarOpen}
        onClose={toggleSideBar}
        sx={{
          width: 240,
          flexShrink: 0,
          zIndex: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            position: "fixed",
            boxSizing: "border-box",
            backgroundColor: "rgb(228, 232, 237)",
          },
        }}
      >
        <List sx={{ marginTop: "65px" }}>
          <ListItemButton
            component={Link}
            to="/admin-dashboard"
            onClick={() => handleItemClick("dashboard")}
            selected={selectedItem === "dashboard"}
            sx={{
              "&.Mui-selected, &:hover": {
                backgroundColor: "#3e8ee6",
                color: "white",
              },
              "&.Mui-selected:hover": {
                backgroundColor: "#2c74d1",
                color: "white",
              },
            }}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>

          {/* User Management */}
          <ListItemButton
            onClick={() => toggleOpen("user")}
            selected={selectedItem === "user"}
            sx={{
              "&.Mui-selected, &:hover": {
                backgroundColor: "#3e8ee6",
                color: "white",
              },
              "&.Mui-selected:hover": {
                backgroundColor: "#2c74d1",
                color: "white",
              },
            }}
          >
            <ListItemIcon>
              <Person />
            </ListItemIcon>
            <ListItemText primary="User Management" />
            {openStates.user ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openStates.user} timeout="auto" unmountOnExit>
            <List
              component="div"
              disablePadding
              sx={{ paddingLeft: "55px", listStyleType: "disc" }}
            >
              <ListItemButton
                component={Link}
                to="/create-user"
                onClick={() => handleItemClick("createUser")}
                selected={selectedItem === "createUser"}
                sx={{
                  "&.Mui-selected, &:hover": {
                    color: "#3e8ee6",
                  },
                  "&.Mui-selected:hover": {
                    color: "#2c74d1",
                  },
                  display: "list-item",
                }}
              >
                <ListItemText primary="Add User" />
              </ListItemButton>
              <ListItemButton
                component={Link}
                to="/manage-user"
                onClick={() => handleItemClick("maintainUser")}
                selected={selectedItem === "maintainUser"}
                sx={{
                  "&.Mui-selected, &:hover": {
                    color: "#3e8ee6",
                  },
                  "&.Mui-selected:hover": {
                    color: "#2c74d1",
                  },
                  display: "list-item",
                }}
              >
                <ListItemText primary="Manage User" />
              </ListItemButton>
            </List>
          </Collapse>

          {/* Role Management */}
          <ListItemButton
            component={Link}
            to="/role-management"
            selected={selectedItem === "role"}
            sx={{
              "&.Mui-selected, &:hover": {
                backgroundColor: "#3e8ee6",
                color: "white",
              },
              "&.Mui-selected:hover": {
                backgroundColor: "#2c74d1",
                color: "white",
              },
            }}
          >
            <ListItemIcon>
              <Build />
            </ListItemIcon>
            <ListItemText primary="Role Management" />
          </ListItemButton>

          {/* Company Management */}
          <ListItemButton
            onClick={() => toggleOpen("company")}
            selected={selectedItem === "company"}
            sx={{
              "&.Mui-selected, &:hover": {
                backgroundColor: "#3e8ee6",
                color: "white",
              },
              "&.Mui-selected:hover": {
                backgroundColor: "#2c74d1",
                color: "white",
              },
            }}
          >
            <ListItemIcon>
              <BusinessCenter />
            </ListItemIcon>
            <ListItemText primary="Company Management" />
            {openStates.company ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openStates.company} timeout="auto" unmountOnExit>
            <List
              component="div"
              disablePadding
              sx={{ paddingLeft: "55px", listStyleType: "disc" }}
            >
              <ListItemButton
                component={Link}
                to="/company-management"
                onClick={() => handleItemClick("createCompany")}
                selected={selectedItem === "createCompany"}
                sx={{
                  "&.Mui-selected, &:hover": {
                    color: "#3e8ee6",
                  },
                  "&.Mui-selected:hover": {
                    color: "#2c74d1",
                  },
                  display: "list-item",
                }}
              >
                <ListItemText primary="Add Company" />
              </ListItemButton>
              <ListItemButton
                component={Link}
                to="/view-company"
                onClick={() => handleItemClick("maintainCompany")}
                selected={selectedItem === "maintainCompany"}
                sx={{
                  "&.Mui-selected, &:hover": {
                    color: "#3e8ee6",
                  },
                  "&.Mui-selected:hover": {
                    color: "#2c74d1",
                  },
                  display: "list-item",
                }}
              >
                <ListItemText primary="View Company" />
              </ListItemButton>
            </List>
          </Collapse>

          {/* Site Management */}
          <ListItemButton
            component={Link}
            to="/site-management"
            onClick={() => handleItemClick("siteManagement")}
            selected={selectedItem === "siteManagement"}
            sx={{
              "&.Mui-selected, &:hover": {
                backgroundColor: "#3e8ee6",
                color: "white",
              },
              "&.Mui-selected:hover": {
                backgroundColor: "#2c74d1",
                color: "white",
              },
            }}
          >
            <ListItemIcon>
              <Home />
            </ListItemIcon>
            <ListItemText primary="Site Management" />
          </ListItemButton>

          {/* Transporter Management */}
          <ListItemButton
            onClick={() => toggleOpen("transport")}
            selected={selectedItem === "transport"}
            sx={{
              "&.Mui-selected, &:hover": {
                backgroundColor: "#3e8ee6",
                color: "white",
              },
              "&.Mui-selected:hover": {
                backgroundColor: "#2c74d1",
                color: "white",
              },
            }}
          >
            <ListItemIcon>
              <Commute />
            </ListItemIcon>
            <ListItemText primary="Transporter Management" />
            {openStates.transport ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openStates.transport} timeout="auto" unmountOnExit>
            <List
              component="div"
              disablePadding
              sx={{ paddingLeft: "55px", listStyleType: "disc" }}
            >
              <ListItemButton
                component={Link}
                to="/transporter"
                onClick={() => handleItemClick("createTransport")}
                selected={selectedItem === "createTransport"}
                sx={{
                  "&.Mui-selected, &:hover": {
                    color: "#3e8ee6",
                  },
                  "&.Mui-selected:hover": {
                    color: "#2c74d1",
                  },
                  display: "list-item",
                }}
              >
                <ListItemText primary="Add Transporter" />
              </ListItemButton>
              <ListItemButton
                component={Link}
                to="/view-transporter"
                onClick={() => handleItemClick("maintainTransport")}
                selected={selectedItem === "maintainTransport"}
                sx={{
                  "&.Mui-selected, &:hover": {
                    color: "#3e8ee6",
                  },
                  "&.Mui-selected:hover": {
                    color: "#2c74d1",
                  },
                  display: "list-item",
                }}
              >
                <ListItemText primary="Manage Transporter" />
              </ListItemButton>
            </List>
          </Collapse>

          {/* Vehicle Management */}
          <ListItemButton
            onClick={() => toggleOpen("vehicle")}
            selected={selectedItem === "vehicle"}
            sx={{
              "&.Mui-selected, &:hover": {
                backgroundColor: "#3e8ee6",
                color: "white",
              },
              "&.Mui-selected:hover": {
                backgroundColor: "#2c74d1",
                color: "white",
              },
            }}
          >
            <ListItemIcon>
              <DirectionsCar />
            </ListItemIcon>
            <ListItemText primary="Vehicle Management" />
            {openStates.vehicle ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openStates.vehicle} timeout="auto" unmountOnExit>
            <List
              component="div"
              disablePadding
              sx={{ paddingLeft: "55px", listStyleType: "disc" }}
            >
              <ListItemButton
                component={Link}
                to="/vehicle"
                onClick={() => handleItemClick("createVehicle")}
                selected={selectedItem === "createVehicle"}
                sx={{
                  "&.Mui-selected, &:hover": {
                    color: "#3e8ee6",
                  },
                  "&.Mui-selected:hover": {
                    color: "#2c74d1",
                  },
                  display: "list-item",
                }}
              >
                <ListItemText primary="Add Vehicle" />
              </ListItemButton>
              <ListItemButton
                component={Link}
                to="/view-vehicle"
                onClick={() => handleItemClick("maintainVehicle")}
                selected={selectedItem === "maintainVehicle"}
                sx={{
                  "&.Mui-selected, &:hover": {
                    color: "#3e8ee6",
                  },
                  "&.Mui-selected:hover": {
                    color: "#2c74d1",
                  },
                  display: "list-item",
                }}
              >
                <ListItemText primary="View Vehicle" />
              </ListItemButton>
            </List>
          </Collapse>

          {/* Supplier Management */}
          <ListItemButton
            onClick={() => toggleOpen("supplier")}
            selected={selectedItem === "supplier"}
            sx={{
              "&.Mui-selected, &:hover": {
                backgroundColor: "#3e8ee6",
                color: "white",
              },
              "&.Mui-selected:hover": {
                backgroundColor: "#2c74d1",
                color: "white",
              },
            }}
          >
            <ListItemIcon>
              <Store />
            </ListItemIcon>
            <ListItemText primary="Supplier Management" />
            {openStates.supplier ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openStates.supplier} timeout="auto" unmountOnExit>
            <List
              component="div"
              disablePadding
              sx={{ paddingLeft: "55px", listStyleType: "disc" }}
            >
              <ListItemButton
                component={Link}
                to="/Supplier"
                onClick={() => handleItemClick("createSupplier")}
                selected={selectedItem === "createSupplier"}
                sx={{
                  "&.Mui-selected, &:hover": {
                    color: "#3e8ee6",
                  },
                  "&.Mui-selected:hover": {
                    color: "#2c74d1",
                  },
                  display: "list-item",
                }}
              >
                <ListItemText primary="Add Supplier" />
              </ListItemButton>
              <ListItemButton
                component={Link}
                to="/view-supplier"
                onClick={() => handleItemClick("maintainSupplier")}
                selected={selectedItem === "maintainSupplier"}
                sx={{
                  "&.Mui-selected, &:hover": {
                    color: "#3e8ee6",
                  },
                  "&.Mui-selected:hover": {
                    color: "#2c74d1",
                  },
                  display: "list-item",
                }}
              >
                <ListItemText primary="Manage Supplier" />
              </ListItemButton>
            </List>
          </Collapse>

          {/* Customer Management */}
          <ListItemButton
            onClick={() => toggleOpen("customer")}
            selected={selectedItem === "customer"}
            sx={{
              "&.Mui-selected, &:hover": {
                backgroundColor: "#3e8ee6",
                color: "white",
              },
              "&.Mui-selected:hover": {
                backgroundColor: "#2c74d1",
                color: "white",
              },
            }}
          >
            <ListItemIcon>
              <Group />
            </ListItemIcon>
            <ListItemText primary="Customer Management" />
            {openStates.customer ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openStates.customer} timeout="auto" unmountOnExit>
            <List
              component="div"
              disablePadding
              sx={{ paddingLeft: "55px", listStyleType: "disc" }}
            >
              <ListItemButton
                component={Link}
                to="/Customer"
                onClick={() => handleItemClick("createCustomer")}
                selected={selectedItem === "createCustomer"}
                sx={{
                  "&.Mui-selected, &:hover": {
                    color: "#3e8ee6",
                  },
                  "&.Mui-selected:hover": {
                    color: "#2c74d1",
                  },
                  display: "list-item",
                }}
              >
                <ListItemText primary="Add Customer" />
              </ListItemButton>
              <ListItemButton
                component={Link}
                to="/view-customer"
                onClick={() => handleItemClick("maintainCustomer")}
                selected={selectedItem === "maintainCustomer"}
                sx={{
                  "&.Mui-selected, &:hover": {
                    color: "#3e8ee6",
                  },
                  "&.Mui-selected:hover": {
                    color: "#2c74d1",
                  },
                  display: "list-item",
                }}
              >
                <ListItemText primary="Manage Customer" />
              </ListItemButton>
            </List>
          </Collapse>

          {/* Material Management */}
          <ListItemButton
            onClick={() => toggleOpen("material")}
            selected={selectedItem === "material"}
            sx={{
              "&.Mui-selected, &:hover": {
                backgroundColor: "#3e8ee6",
                color: "white",
              },
              "&.Mui-selected:hover": {
                backgroundColor: "#2c74d1",
                color: "white",
              },
            }}
          >
            <ListItemIcon>
              <Handyman />
            </ListItemIcon>
            <ListItemText primary="Material Management" />
            {openStates.material ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openStates.material} timeout="auto" unmountOnExit>
            <List
              component="div"
              disablePadding
              sx={{ paddingLeft: "55px", listStyleType: "disc" }}
            >
              <ListItemButton
                component={Link}
                to="/material-management"
                onClick={() => handleItemClick("addMaterial")}
                selected={selectedItem === "addMaterial"}
                sx={{
                  "&.Mui-selected, &:hover": {
                    color: "#3e8ee6",
                  },
                  "&.Mui-selected:hover": {
                    color: "#2c74d1",
                  },
                  display: "list-item",
                }}
              >
                <ListItemText primary="Add Material" />
              </ListItemButton>
              <ListItemButton
                component={Link}
                to="/view-material"
                onClick={() => handleItemClick("viewMaterial")}
                selected={selectedItem === "viewMaterial"}
                sx={{
                  "&.Mui-selected, &:hover": {
                    color: "#3e8ee6",
                  },
                  "&.Mui-selected:hover": {
                    color: "#2c74d1",
                  },
                  display: "list-item",
                }}
              >
                <ListItemText primary="View Material" />
              </ListItemButton>
            </List>
          </Collapse>

          {/* Product Management */}
          <ListItemButton
            onClick={() => toggleOpen("product")}
            selected={selectedItem === "product"}
            sx={{
              "&.Mui-selected, &:hover": {
                backgroundColor: "#3e8ee6",
                color: "white",
              },
              "&.Mui-selected:hover": {
                backgroundColor: "#2c74d1",
                color: "white",
              },
            }}
          >
            <ListItemIcon>
              <ProductionQuantityLimits />
            </ListItemIcon>
            <ListItemText primary="Product Management" />
            {openStates.product ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openStates.product} timeout="auto" unmountOnExit>
            <List
              component="div"
              disablePadding
              sx={{ paddingLeft: "55px", listStyleType: "disc" }}
            >
              <ListItemButton
                component={Link}
                to="/product-management"
                onClick={() => handleItemClick("addProduct")}
                selected={selectedItem === "addProduct"}
                sx={{
                  "&.Mui-selected, &:hover": {
                    color: "#3e8ee6",
                  },
                  "&.Mui-selected:hover": {
                    color: "#2c74d1",
                  },
                  display: "list-item",
                }}
              >
                <ListItemText primary="Add Product" />
              </ListItemButton>
              <ListItemButton
                component={Link}
                to="/view-product"
                onClick={() => handleItemClick("viewProduct")}
                selected={selectedItem === "viewProduct"}
                sx={{
                  "&.Mui-selected, &:hover": {
                    color: "#3e8ee6",
                  },
                  "&.Mui-selected:hover": {
                    color: "#2c74d1",
                  },
                  display: "list-item",
                }}
              >
                <ListItemText primary="View Product" />
              </ListItemButton>
            </List>
          </Collapse>

          {/* Camera Management */}
          <ListItemButton
            onClick={() => toggleOpen("camera")}
            selected={selectedItem === "camera"}
            sx={{
              "&.Mui-selected, &:hover": {
                backgroundColor: "#3e8ee6",
                color: "white",
              },
              "&.Mui-selected:hover": {
                backgroundColor: "#2c74d1",
                color: "white",
              },
            }}
          >
            <ListItemIcon>
              <VideoCallRounded />
            </ListItemIcon>
            <ListItemText primary="Camera Management" />
            {openStates.camera ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openStates.camera} timeout="auto" unmountOnExit>
            <List
              component="div"
              disablePadding
              sx={{ paddingLeft: "55px", listStyleType: "disc" }}
            >
              <ListItemButton
                component={Link}
                to="/CameraMaster"
                onClick={() => handleItemClick("addCamera")}
                selected={selectedItem === "addCamera"}
                sx={{
                  "&.Mui-selected, &:hover": {
                    color: "#3e8ee6",
                  },
                  "&.Mui-selected:hover": {
                    color: "#2c74d1",
                  },
                  display: "list-item",
                }}
              >
                <ListItemText primary="Add Camera" />
              </ListItemButton>
              <ListItemButton
                component={Link}
                to="/view-camera"
                onClick={() => handleItemClick("manageCamera")}
                selected={selectedItem === "manageCamera"}
                sx={{
                  "&.Mui-selected, &:hover": {
                    color: "#3e8ee6",
                  },
                  "&.Mui-selected:hover": {
                    color: "#2c74d1",
                  },
                  display: "list-item",
                }}
              >
                <ListItemText primary="Manage Camera" />
              </ListItemButton>
            </List>
          </Collapse>

          {/* Sign Out */}
          <ListItemButton
            onClick={handleSignOut2}
            sx={{
              "&.Mui-selected, &:hover": {
                backgroundColor: "#3e8ee6",
                color: "white",
              },
              "&.Mui-selected:hover": {
                backgroundColor: "#2c74d1",
                color: "white",
              },
            }}
          >
            <ListItemIcon>
              <ExitToApp />
            </ListItemIcon>
            <ListItemText primary="Sign Out" />
          </ListItemButton>
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          padding: "16px",
          transition: "margin-left 0.3s",
        }}
      >
        {children}
      </Box>
    </>
  );
};

export default SideBar;
