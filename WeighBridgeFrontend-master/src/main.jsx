import { Suspense, lazy, startTransition } from "react";
import ReactDOM from "react-dom/client";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import "./index.css";
import Spinner from "./Spinner";

const HomePage1 = lazy(() => import("./components/HomePages/HomePage1.jsx"));
const HomePage2 = lazy(() => import("./components/HomePages/HomePage2.jsx"));
const HomePage3 = lazy(() => import("./components/HomePages/HomePage3.jsx"));
const HomePage4 = lazy(() => import("./components/HomePages/HomePage4.jsx"));
const HomePage5 = lazy(() => import("./components/HomePages/HomePage5.jsx"));
const HomePage6 = lazy(() => import("./components/HomePages/HomePage6.jsx"));

const LoginUser = lazy(() => import("./components/Login/LoginUser.jsx"));
const ResetPassword = lazy(() =>
  import("./components/ResetPassword/ResetPassword.jsx")
);
const Forgot = lazy(() => import("./components/Forgot/Forgot.jsx"));
const CreateUser = lazy(() =>
  import("./components/Admin/CreateUser/CreateUser.jsx")
);
const ManageUser = lazy(() =>
  import("./components/Admin/ManageUser/ManageUser.jsx")
);
const UpdateUser = lazy(() =>
  import("./components/Admin/UpdateUser/UpdateUser.jsx")
);
const CompanyManagement = lazy(() =>
  import("./components/Admin/CompanyManagement/CompanyManagement.jsx")
);
const SiteManagement = lazy(() =>
  import("./components/Admin/SiteManagement/SiteManagement.jsx")
);
const Vehicle = lazy(() => import("./components/Admin/Vehicle/Vehicle.jsx"));
const Transporter = lazy(() =>
  import("./components/Admin/Transporter/Transporter.jsx")
);
const Customer = lazy(() => import("./components/Admin/Customer/Customer.jsx"));
const Supplier = lazy(() => import("./components/Admin/Supplier/Supplier.jsx"));
const ViewCompany = lazy(() =>
  import("./components/Admin/ViewCompany/ViewCompany.jsx")
);
const ViewSupplier = lazy(() =>
  import("./components/Admin/ViewSupplier/ViewSupplier.jsx")
);
const ViewVehicle = lazy(() =>
  import("./components/Admin/ViewVehicle/ViewVehicle.jsx")
);
const ViewCustomer = lazy(() =>
  import("./components/Admin/ViewCustomer/ViewCustomer.jsx")
);
const ViewMaterial = lazy(() =>
  import("./components/Admin/ViewMaterial/ViewMaterial.jsx")
);
const ViewProduct = lazy(() =>
  import("./components/Admin/ViewProduct/ViewProduct.jsx")
);
const MaterialManagement = lazy(() =>
  import("./components/Admin/MaterialManagement/MaterialManagement.jsx")
);
const ProductManagement = lazy(() =>
  import("./components/Admin/ProductManagement/ProductManagement.jsx")
);
const RoleManagement = lazy(() =>
  import("./components/Admin/RoleManagement/RoleManagement.jsx")
);
const ViewTransporter = lazy(() =>
  import("./components/Admin/ViewTranporter/ViewTransporter.jsx")
);
const UpdateTransporter = lazy(() =>
  import("./components/Admin/UpdateTransporter/UpdateTransporter.jsx")
);
const UpdateCustomer = lazy(() =>
  import("./components/Admin/UpdateCustomer/UpdateCustomer.jsx")
);
const UpdateSupplier = lazy(() =>
  import("./components/Admin/UpdateSupplier/UpdateSupplier.jsx")
);
const CameraMaster = lazy(() =>
  import("./components/Admin/CameraMaster/CameraMaster.jsx")
);

const ViewCamera = lazy(() =>
  import("./components/Admin/ViewCamera/ViewCamera.jsx")
);

// import VehicleEntry from "./components/GateUser/src/components/Vehicle_Entry/VehicleEntry.jsx";
const VehicleEntry = lazy(() =>
  import("./components/GateUser/src/components/Vehicle_Entry/VehicleEntry.jsx")
);
// import CompletedTransaction from "./components/GateUser/src/components/Vehicle_Entry/CompletedTransaction.jsx";
const CompletedTransaction = lazy(() =>
  import(
    "./components/GateUser/src/components/Vehicle_Entry/CompletedTransaction.jsx"
  )
);
// import VehicleEntryDetails from "./components/GateUser/src/components/Vehicle_Entry/VehicleEntryDetails.jsx";
const VehicleEntryDetails = lazy(() =>
  import(
    "./components/GateUser/src/components/Vehicle_Entry/VehicleEntryDetails.jsx"
  )
);
// import UpdateGateEntry from "./components/GateUser/src/components/Vehicle_Entry/UpdateGateEntry.jsx";
const UpdateGateEntry = lazy(() =>
  import(
    "./components/GateUser/src/components/Vehicle_Entry/UpdateGateEntry.jsx"
  )
);
// import VehicleOutboundDetails from "./components/GateUser/src/components/Vehicle_Entry/VehicleOutboundDetails.jsx";
const VehicleOutboundDetails = lazy(() =>
  import(
    "./components/GateUser/src/components/Vehicle_Entry/VehicleOutboundDetails.jsx"
  )
);
// import NewVehicleRegistration from "./components/GateUser/src/components/Vehicle_Entry/NewVehicleRegistration.jsx";
const NewVehicleRegistration = lazy(() =>
  import(
    "./components/GateUser/src/components/Vehicle_Entry/NewVehicleRegistration.jsx"
  )
);
// import NewSupplier from "./components/GateUser/src/components/Vehicle_Entry/NewSupplier.jsx";
const NewSupplier = lazy(() =>
  import("./components/GateUser/src/components/Vehicle_Entry/NewSupplier.jsx")
);
// import NewMaterial from "./components/GateUser/src/components/Vehicle_Entry/NewMaterial.jsx";
const NewMaterial = lazy(() =>
  import("./components/GateUser/src/components/Vehicle_Entry/NewMaterial.jsx")
);
// import NewTransporter from "./components/GateUser/src/components/Vehicle_Entry/NewTransporter.jsx";
const NewTransporter = lazy(() =>
  import(
    "./components/GateUser/src/components/Vehicle_Entry/NewTransporter.jsx"
  )
);

const SalesDetails = lazy(() =>
  import("./components/GateUser/src/components/Vehicle_Entry/SalesDetails.jsx")
);
const Report = lazy(() =>
  import("./components/GateUser/src/components/Report/Report.jsx")
);
const DailyReport = lazy(() =>
  import("./components/GateUser/src/components/Report/DailyReport.jsx")
);
const WeeklyReport = lazy(() =>
  import("./components/GateUser/src/components/Report/WeeklyReport.jsx")
);
const MonthlyReport = lazy(() =>
  import("./components/GateUser/src/components/Report/MonthlyReport.jsx")
);
const CustomizedReport = lazy(() =>
  import("./components/GateUser/src/components/Report/CustomizedReport.jsx")
);

const Capture = lazy(() =>
  import("./components/GateUser/src/components/Camera/Capture.jsx")
);

const QualityCheck = lazy(() =>
  import(
    "./components/QualityCheck/src/components/QualityCheck/QualityCheck.jsx"
  )
);
const QualityInboundDashboard = lazy(() =>
  import(
    "./components/QualityCheck/src/components/QualityCheck/QualityInboundDashboard.jsx"
  )
);
const QualityOutboundDashboard = lazy(() =>
  import(
    "./components/QualityCheck/src/components/QualityCheck/QualityOutboundDashboard.jsx"
  )
);
const QPrint = lazy(() =>
  import("./components/QualityCheck/src/components/Print/Print.jsx")
);
const QReport = lazy(() =>
  import("./components/QualityCheck/src/components/Report/QReport.jsx")
);
const QualityInboundDetails = lazy(() =>
  import(
    "./components/QualityCheck/src/components/QualityCheck/QualityInboundDetails.jsx"
  )
);
const QualityOutboundDetails = lazy(() =>
  import(
    "./components/QualityCheck/src/components/QualityCheck/QualityOutboundDetails.jsx"
  )
);
const QualityHomePage = lazy(() =>
  import("./components/QualityCheck/src/components/QHome/QualityHomePage.jsx")
);
const QualityCompleted = lazy(() =>
  import(
    "./components/QualityCheck/src/components/QualityCheck/QualityCompleted.jsx"
  )
);
const PrintTicket = lazy(() =>
  import(
    "./components/QualityCheck/src/components/QualityCheck/PrintTicket.jsx"
  )
);

const ManagementHome = lazy(() =>
  import("./components/Management/src/components/Home/ManagementHome.jsx")
);
const ManagementCamera = lazy(() =>
  import("./components/Management/src/components/Camera/Camera.jsx")
);
const ManagementReport = lazy(() =>
  import("./components/Management/src/components/Report/Report.jsx")
);
const ManagementGateEntry = lazy(() =>
  import("./components/Management/src/components/GateEntry/GateEntry.jsx")
);
const ManagementGateExit = lazy(() =>
  import("./components/Management/src/components/GateExit/GateExit.jsx")
);
const ManagementWeighbridge = lazy(() =>
  import("./components/Management/src/components/Weighbridge/Weighbridge.jsx")
);
const ManagementQuality = lazy(() =>
  import("./components/Management/src/components/Quality/Quality.jsx")
);
const ManagementTransaction = lazy(() =>
  import("./components/Management/src/components/Transaction/Transaction.jsx")
);
const ManagementLocation = lazy(() =>
  import("./components/Management/src/components/Location/Location.jsx")
);
const ManagementDailyReport = lazy(() =>
  import("./components/Management/src/components/dailyreport/dailyreport.jsx")
);
const ManagementWeeklyReport = lazy(() =>
  import("./components/Management/src/components/weeklyreport/weeklyreport.jsx")
);
const ManagementMonthlyReport = lazy(() =>
  import(
    "./components/Management/src/components/monthlyreport/monthlyreport.jsx"
  )
);
const ManagementCustomizedReport = lazy(() =>
  import("./components/Management/src/components/customized/customized.jsx")
);

const OperatorTransaction = lazy(() =>
  import("./components/Operator/src/components/transaction/Transaction.jsx")
);
const OperatorTransactionComp = lazy(() =>
  import(
    "./components/Operator/src/components/transactioncomp/Transactioncomp.jsx"
  )
);
const OperatorReport = lazy(() =>
  import("./components/Operator/src/components/report/Report.jsx")
);
const OperatorTransactionFromInbound = lazy(() =>
  import(
    "./components/Operator/src/components/transactionform/TransactionFrom.jsx"
  )
);
const OperatorCompletedTransactionFromInbound = lazy(() =>
  import("./components/Operator/src/components/compinbound/compinbound.jsx")
);
const OperatorCompletedTransactionFromOutbound = lazy(() =>
  import("./components/Operator/src/components/compoutbound/compoutbound.jsx")
);
const OperatorTransactionFromOutbound = lazy(() =>
  import(
    "./components/Operator/src/components/transactionform1/Transactionform1.jsx"
  )
);
const OperatorDailyReport = lazy(() =>
  import("./components/Operator/src/components/dailyreport/dailyreport.jsx")
);
const OperatorWeeklyReport = lazy(() =>
  import("./components/Operator/src/components/weeklyreport/weeklyreport.jsx")
);
const OperatorMonthlyReport = lazy(() =>
  import("./components/Operator/src/components/monthlyreport/monthlyreport.jsx")
);
const OperatorCustomizedReport = lazy(() =>
  import("./components/Operator/src/components/customized/customized.jsx")
);

const SalesOrder = lazy(() =>
  import("./components/Sales/SalesOrder/SalesOrder.jsx")
);
const ProcessOrder = lazy(() =>
  import("./components/Sales/ProcessOrder/ProcessOrder.jsx")
);

const SideBar = lazy(() => import("./components/SideBar/SideBar.jsx"));
const SideBar2 = lazy(() => import("./components/SideBar/SideBar2.jsx"));
const SideBar3 = lazy(() => import("./components/SideBar/SideBar3.jsx"));
const SideBar4 = lazy(() => import("./components/SideBar/SideBar4.jsx"));
const SideBar5 = lazy(() => import("./components/SideBar/SideBar5.jsx"));
const SideBar6 = lazy(() => import("./components/SideBar/Sidebar6.jsx"));

const SalesDisplay = lazy(() =>
  import("./components/Sales/SalesDisplay/SalesDisplay.jsx")
);
const SalesCustomer = lazy(() =>
  import("./components/Sales/SalesCustomer/SalesCustomer.jsx")
);
const SalesTransporter = lazy(() =>
  import("./components/Sales/SalesTransporter/SalesTranporter.jsx")
);
const SalesVehicle = lazy(() =>
  import("./components/Sales/SalesVehicle/SalesVehicle.jsx")
);
const Ongoing_Transaction = lazy(() =>
  import("./components/Sales/Ongoing_Transaction/Ongoing_Transaction.jsx")
);

const Completed_Transaction = lazy(() =>
  import("./components/Sales/Completed_Transaction/Completed_Transaction.jsx")
);
const SalesReport = lazy(() =>
  import("./components/Sales/SalesReport/SalesReport.jsx")
);
const SalesDailyReport = lazy(() =>
  import("./components/Sales/SalesReport/SalesDailyReport.jsx")
);

const SalesWeeklyReport = lazy(() =>
  import("./components/Sales/SalesReport/SailyWeeklyReport.jsx")
);
const SalesMonthlyReport = lazy(() =>
  import("./components/Sales/SalesReport/SalesMonthlyReport.jsx")
);
const SalesCustomReport = lazy(() =>
  import("./components/Sales/SalesReport/SalesCustomReport.jsx")
);
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<LoginUser />} />
      <Route path="/forgot-password" element={<Forgot />} />
      <Route path="/admin-dashboard" element={<HomePage1 />} />
      <Route path="/quality-dashboard" element={<HomePage2 />} />
      <Route path="/gate-dashboard" element={<HomePage3 />} />
      <Route path="/weighbridge-dashboard" element={<HomePage4 />} />
      <Route path="/management-dashboard" element={<HomePage5 />} />
      <Route path="/sales-dashboard" element={<HomePage6 />} />
      <Route path="/create-user" element={<CreateUser />} />
      <Route path="/manage-user" element={<ManageUser />} />
      <Route path="/update-user" element={<UpdateUser />} />
      <Route path="/company-management" element={<CompanyManagement />} />
      <Route path="/site-management" element={<SiteManagement />} />
      <Route path="/vehicle" element={<Vehicle />} />
      <Route path="/transporter" element={<Transporter />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/Customer" element={<Customer />} />
      <Route path="/Supplier" element={<Supplier />} />
      <Route path="/view-company" element={<ViewCompany />} />
      <Route path="/view-supplier" element={<ViewSupplier />} />
      <Route path="/view-vehicle" element={<ViewVehicle />} />
      <Route path="/view-customer" element={<ViewCustomer />} />
      <Route path="/view-transporter" element={<ViewTransporter />} />
      <Route path="/view-material" element={<ViewMaterial />} />
      <Route path="/view-product" element={<ViewProduct />} />
      <Route path="/material-management" element={<MaterialManagement />} />
      <Route path="/product-management" element={<ProductManagement />} />
      <Route path="/role-management" element={<RoleManagement />} />
      <Route path="/update-transporter" element={<UpdateTransporter />} />
      <Route path="/update-customer" element={<UpdateCustomer />} />
      <Route path="/update-supplier" element={<UpdateSupplier />} />
      <Route path="/SalesOrder" element={<SalesOrder />} />
      <Route path="/ProcessOrder" element={<ProcessOrder />} />
      <Route path="/Sidebar" element={<SideBar />} />
      <Route path="/Sidebar2" element={<SideBar2 />} />
      <Route path="/Sidebar3" element={<SideBar3 />} />
      <Route path="/Sidebar4" element={<SideBar4 />} />
      <Route path="/Sidebar5" element={<SideBar5 />} />
      <Route path="/Sidebar6" element={<SideBar6 />} />
      <Route path="/SalesDisplay" element={<SalesDisplay />} />
      <Route path="/SalesCustomer" element={<SalesCustomer />} />
      <Route path="/SalesTransporter" element={<SalesTransporter />} />
      <Route path="/SalesVehicle" element={<SalesVehicle />} />
      <Route path="/VehicleEntry" element={<VehicleEntry />} />
      <Route path="/completed-transaction" element={<CompletedTransaction />} />
      <Route path="/VehicleEntryDetails" element={<VehicleEntryDetails />} />
      <Route path="/UpdateGateEntry" element={<UpdateGateEntry />} />
      <Route
        path="/VehicleEntry-Outbound"
        element={<VehicleOutboundDetails />}
      />
      <Route
        path="/vehicle-registration"
        element={<NewVehicleRegistration />}
      />
      <Route path="/new-supplier" element={<NewSupplier />} />
      <Route path="/new-material" element={<NewMaterial />} />
      <Route path="/new-transporter" element={<NewTransporter />} />
      <Route path="/Sales-Details" element={<SalesDetails />} />
      <Route path="/reports" element={<Report />} />
      <Route path="/DailyReport" element={<DailyReport />} />
      <Route path="/WeeklyReport" element={<WeeklyReport />} />
      <Route path="/MonthlyReport" element={<MonthlyReport />} />
      <Route path="/CustomizedReport" element={<CustomizedReport />} />
      <Route path="/Capture" element={<Capture />} />
      <Route path="/QualityHomePage" element={<QualityHomePage />} />
      <Route path="/QualityCheck" element={<QualityCheck />} />
      <Route path="/QualityCompleted" element={<QualityCompleted />} />
      <Route path="/QPrint" element={<QPrint />} />
      <Route path="/QReport" element={<QReport />} />
      <Route
        path="/QualityInboundDetails"
        element={<QualityInboundDetails />}
      />
      <Route
        path="/QualityOutboundDetails"
        element={<QualityOutboundDetails />}
      />
      <Route
        path="/QualityInboundDashboard"
        element={<QualityInboundDashboard />}
      />
      <Route
        path="/QualityOutboundDashboard"
        element={<QualityOutboundDashboard />}
      />
      <Route path="/PrintTicket" element={<PrintTicket />} />
      <Route path="/ManagementHome" element={<ManagementHome />} />
      <Route path="/ManagementCamera" element={<ManagementCamera />} />
      <Route path="/ManagementReport" element={<ManagementReport />} />
      <Route path="/ManagementGateEntry" element={<ManagementGateEntry />} />
      <Route path="/ManagementGateExit" element={<ManagementGateExit />} />
      <Route
        path="/ManagementWeighbridge"
        element={<ManagementWeighbridge />}
      />
      <Route path="/ManagementQuality" element={<ManagementQuality />} />
      <Route
        path="/ManagementTransaction"
        element={<ManagementTransaction />}
      />
      <Route path="/ManagementLocation" element={<ManagementLocation />} />
      <Route
        path="/ManagementDailyReport"
        element={<ManagementDailyReport />}
      />
      <Route
        path="/ManagementWeeklyReport"
        element={<ManagementWeeklyReport />}
      />
      <Route
        path="/ManagementMonthlyReport"
        element={<ManagementMonthlyReport />}
      />
      <Route
        path="/ManagementCustomizedReport"
        element={<ManagementCustomizedReport />}
      />

      <Route path="/OperatorTransaction" element={<OperatorTransaction />} />
      <Route
        path="/OperatorTransactionComp"
        element={<OperatorTransactionComp />}
      />
      <Route path="/OperatorReport" element={<OperatorReport />} />
      <Route
        path="/OperatorTransactionFromInbound"
        element={<OperatorTransactionFromInbound />}
      />
      <Route
        path="/OperatorCompletedTransactionFromInbound"
        element={<OperatorCompletedTransactionFromInbound />}
      />
      <Route
        path="/OperatorCompletedTransactionFromOutbound"
        element={<OperatorCompletedTransactionFromOutbound />}
      />
      <Route
        path="/OperatorTransactionFromOutbound"
        element={<OperatorTransactionFromOutbound />}
      />
      <Route path="/OperatorDailyReport" element={<OperatorDailyReport />} />
      <Route path="/OperatorWeeklyReport" element={<OperatorWeeklyReport />} />
      <Route
        path="/OperatorMonthlyReport"
        element={<OperatorMonthlyReport />}
      />
      <Route
        path="/OperatorCustomizedReport"
        element={<OperatorCustomizedReport />}
      />
      <Route path="/Spinner" element={<Spinner />} />
      <Route path="/CameraMaster" element={<CameraMaster />} />
      <Route path="/view-camera" element={<ViewCamera />} />
      <Route path="/CompletedTransaction" element={<Completed_Transaction />} />
      <Route path="/OnGoingTransaction" element={<Ongoing_Transaction />} />
      <Route path="/SalesReport" element={<SalesReport />} />
      <Route path="/SalesDailyReport" element={<SalesDailyReport />} />
      <Route path="/SalesWeeklyReport" element={<SalesWeeklyReport />} />
      <Route path="/SalesMonthlyReport" element={<SalesMonthlyReport />} />
      <Route path="/SalesCustomReport" element={<SalesCustomReport />} />
    </Route>
  )
);

startTransition(() => {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <Suspense fallback={<Spinner />}>
      <RouterProvider router={router} />
    </Suspense>
  );
});
