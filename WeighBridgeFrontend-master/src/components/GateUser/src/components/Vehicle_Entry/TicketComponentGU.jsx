import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import QRCode from "qrcode";

const TicketPrintComponentGU = React.forwardRef((props, ref) => {
  const { ticketData } = props;
  const qrCodeRef = useRef(null);

  useEffect(() => {
    if (ticketData && qrCodeRef.current) {
      QRCode.toCanvas(
        qrCodeRef.current,
        JSON.stringify({ ticketNo: ticketData.ticketNo }),
        { width: 64, margin: 0 },
        (error) => {
          if (error) console.error('Error generating QR code', error);
        }
      );
    }
  }, [ticketData]);

  if (!ticketData) {
    return null;
  }

  const { transactionType } = ticketData;

  // Filter fields based on transaction type
  const filteredFields = [
    {label:"VehicleIn", value: ticketData.vehicleIn, condition: true},
    { label: "Product", value: ticketData.productName, condition: transactionType !== "Inbound" },
    { label: "Product Type", value: ticketData.productType, condition: transactionType !== "Inbound" },
    { label: "Material", value: ticketData.material, condition: transactionType !== "Outbound" },
    {label: "Material Type", value: ticketData.materialType, condition: transactionType !== "Outbound"},
    { label: "Transporter", value: ticketData.transporter, condition: true },
    { label: "Customer", value: ticketData.customer, condition: transactionType !== "Inbound" },
    { label: "Supplier", value: ticketData.supplier, condition: transactionType !== "Outbound" },
    { label: "Challan", value: ticketData.challanNo, condition: transactionType !== "Outbound" },
    { label: "TP No", value: ticketData.tpNo, condition: true },
    { label: "TP Net Weight", value: ticketData.tpNetWeight, condition: transactionType !== "Outbound" },
    { label: "PO No", value: ticketData.poNo, condition: true },
    { label: "Challan Date", value: ticketData.challanDate, condition: true },
  ].filter(field => field.condition);

  // Define signatures based on transaction type
  const signatures = transactionType === "Inbound"
    ? [
        { label: "Loaded by", value: ticketData.loadedBy },
        { label: "Security Officer", value: ticketData.securityOfficer },
      ]
    : [
        { label: "Issued by", value: ticketData.issuedBy },
        { label: "Approved by", value: ticketData.approvedBy },
        { label: "Loaded by", value: ticketData.loadedBy },
        { label: "Security Officer", value: ticketData.securityOfficer },
      ];

  return (
    <div
      ref={ref}
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "10mm",
        margin: "auto",
        backgroundColor: "white",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        fontFamily: "Arial, sans-serif",
        color: "#333",
        fontSize: "9pt",
        lineHeight: "1.4",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      <header style={{ textAlign: "center", marginBottom: "5mm" }}>
        <h1 style={{ margin: "0", fontSize: "16pt", color: "#0056b3" }}>
          {ticketData.companyName}
        </h1>
        <p style={{ margin: "2mm 0 0", fontSize: "10pt" }}>
          {ticketData.siteName}
        </p>
      </header>

      {/* QR Code */}
      <div style={{ position: "absolute", top: "10mm", right: "10mm", width: "64px", height: "64px" }}>
        <canvas ref={qrCodeRef} />
      </div>

      <div
        style={{
          border: "1px solid #0056b3",
          padding: "3mm",
          marginBottom: "5mm",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            margin: "0 0 3mm",
            color: "#0056b3",
            fontSize: "14pt",
          }}
        >
          {transactionType === "Inbound" ? "Material Entry Slip" : "Vehicle Loading Slip"}
        </h2>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <strong>Ticket No: {ticketData.ticketNo}</strong>
          <strong>Vehicle No: {ticketData.vehicleNo}</strong>
        </div>
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "5mm",
        }}
      >
        <tbody>
          {filteredFields.map((item, index) => (
            <tr key={index} style={{ borderBottom: "1px solid #dee2e6" }}>
              <td style={{ padding: "2mm", fontWeight: "bold", width: "30%" }}>
                {item.label}:
              </td>
              <td style={{ padding: "2mm" }}>{item.value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "10mm" }}>
        <h3
          style={{
            color: "#0056b3",
            borderBottom: "1px solid #0056b3",
            paddingBottom: "1mm",
            fontSize: "12pt",
          }}
        >
          Signatures
        </h3>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          {signatures.map((item, index) => (
            <div key={index} style={{ width: transactionType === "Inbound" ? "45%" : "22%", marginBottom: "5mm" }}>
              <p style={{ margin: "0", fontSize: "9pt" }}>{item.label}</p>
              <div style={{ borderBottom: "1px solid black", height: "15mm" }}></div>
              <p style={{ margin: "2mm 0 0", fontSize: "9pt" }}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

TicketPrintComponentGU.displayName = "TicketPrintComponentGU";

TicketPrintComponentGU.propTypes = {
  ticketData: PropTypes.shape({
    companyName: PropTypes.string.isRequired,
    siteName: PropTypes.string.isRequired,
    ticketNo: PropTypes.string.isRequired,
    vehicleNo: PropTypes.string.isRequired,
    vehicleIn: PropTypes.string.isRequired,
    vehicleOut: PropTypes.string.isRequired,
    transporter: PropTypes.string.isRequired,
    supplier: PropTypes.string,
    customer: PropTypes.string,
    material: PropTypes.string,
    materialType: PropTypes.string,
    productName: PropTypes.string,
    productType: PropTypes.string,
    tpNo: PropTypes.string.isRequired,
    tpNetWeight: PropTypes.string.isRequired,
    poNo: PropTypes.string.isRequired,
    challanNo: PropTypes.string,
    challanDate: PropTypes.string,
    transactionDate: PropTypes.string.isRequired,
    transactionType: PropTypes.oneOf(['Inbound', 'Outbound']).isRequired,
    grossWeight: PropTypes.number.isRequired,
    tareWeight: PropTypes.number.isRequired,
    netWeight: PropTypes.number.isRequired,
    issuedBy: PropTypes.string,
    approvedBy: PropTypes.string,
    loadedBy: PropTypes.string.isRequired,
    securityOfficer: PropTypes.string.isRequired,
  }).isRequired,
};

export default TicketPrintComponentGU;