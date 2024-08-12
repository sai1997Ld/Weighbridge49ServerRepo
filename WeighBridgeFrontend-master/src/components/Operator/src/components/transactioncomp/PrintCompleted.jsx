import React from "react";
import PropTypes from "prop-types";

const PrintCompleted = React.forwardRef((props, ref) => {
  const { ticketData } = props;

  if (!ticketData) {
    return null;
  }

  // Filter fields based on transaction type
  const { transactionType } = ticketData;
  const filteredFields = [
    { label: "Product", value: ticketData.productName, condition: transactionType !== "Inbound" },
    { label: "Material", value: ticketData.materialName, condition: transactionType !== "Outbound" },
    { label: "Transporter", value: ticketData.transporterName, condition: true },
    { label: "Customer", value: ticketData.customerName, condition: transactionType !== "Inbound" },
    { label: "Supplier", value: ticketData.supplierName, condition: transactionType !== "Outbound" },
    { label: "Challan", value: ticketData.challanNo, condition: transactionType !== "Outbound" },
  ].filter(field => field.condition);

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
      }}
    >
      <header style={{ textAlign: "center", marginBottom: "5mm" }}>
        <h1 style={{ margin: "0", fontSize: "16pt", color: "#0056b3" }}>
          {ticketData.companyName}
        </h1>
        <p style={{ margin: "2mm 0 0", fontSize: "10pt" }}>
          {ticketData.companyAdress}
        </p>
      </header>

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
          Weight Ticket
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

      <div style={{ marginBottom: "5mm" }}>
        <h3 style={{ margin: "0 0 2mm", color: "#0056b3", fontSize: "12pt" }}>
          Weight Information
        </h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            {[
              {
                label: "Gross Weight",
                value: `${ticketData.grossWeight} kg`,
                date: ticketData.grossWeightDate,
                time: ticketData.grossWeightTime,
              },
              {
                label: "Tare Weight",
                value: `${ticketData.tareWeight} kg`,
                date: ticketData.tareWeightDate,
                time: ticketData.tareWeightTime,
              },
              {
                label: "Net Weight",
                value: `${ticketData.netWeight} kg`,
                date: "",
                time: "",
              },
            ].map((item, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #dee2e6" }}>
                <td
                  style={{ padding: "2mm", fontWeight: "bold", width: "25%" }}
                >
                  {item.label}:
                </td>
                <td style={{ padding: "2mm", width: "25%" }}>{item.value}</td>
                <td style={{ padding: "2mm", width: "25%" }}>
                  {item.date && `Date: ${item.date}`}
                </td>
                <td style={{ padding: "2mm", width: "25%" }}>
                  {item.time && `Time: ${item.time}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
          {["Issued by", "Approved by", "Loaded by", "Security Officer"].map(
            (item, index) => (
              <div key={index} style={{ width: "45%", marginBottom: "5mm" }}>
                <p style={{ margin: "0", fontSize: "9pt" }}>{item}</p>
                <div
                  style={{ borderBottom: "1px solid black", height: "15mm" }}
                ></div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
});
PrintCompleted.displayName = "PrintCompleted";

PrintCompleted.propTypes = {
  ticketData: PropTypes.shape({
    companyName: PropTypes.string.isRequired,
    companyAdress: PropTypes.string.isRequired,
    tareWeight: PropTypes.number.isRequired,
    tareWeightDate: PropTypes.string.isRequired,
    tareWeightTime: PropTypes.string.isRequired,
    netWeight: PropTypes.number.isRequired,
    ticketNo: PropTypes.string.isRequired,
    vehicleNo: PropTypes.string.isRequired,
    productName: PropTypes.string,
    materialName: PropTypes.string.isRequired,
    transporterName: PropTypes.string.isRequired,
    customerName: PropTypes.string,
    supplierName: PropTypes.string,
    challanNo: PropTypes.string,
    grossWeight: PropTypes.number.isRequired,
    grossWeightDate: PropTypes.string.isRequired,
    grossWeightTime: PropTypes.string.isRequired,
  }).isRequired,
};

export default PrintCompleted;
