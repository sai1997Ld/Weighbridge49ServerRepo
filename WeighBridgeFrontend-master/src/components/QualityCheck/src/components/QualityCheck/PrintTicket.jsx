import React from "react";
import { Font, View, StyleSheet } from "@react-pdf/renderer";

// Register font
Font.register({
  family: "Arial",
  src: `https://cdn.jsdelivr.net/npm/open-sans-fonts@1.1.1/apache/open-sans-regular.ttf`,
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    padding: 20,
    fontFamily: "Arial",
  },
  header: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },
  subheader: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  details: {
    fontSize: 12,
    marginBottom: 5,
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCol: {
    display: "table-cell",
    verticalAlign: "middle",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  tableHeader: {
    backgroundColor: "#0077b6",
    color: "#fff",
    fontWeight: "bold",
  },
});

const PrintTicket = React.forwardRef((props, ref) => {
  const { ticketData } = props;

  const formatDate = (date) => {
    const d = new Date(date);
    let day = d.getDate();
    let month = d.getMonth() + 1;
    const year = d.getFullYear();

    if (day < 10) {
      day = `0${day}`;
    }
    if (month < 10) {
      month = `0${month}`;
    }
    return `${day}-${month}-${year}`;
  };

  if (!ticketData) {
    return null;
  }

  return (
    <View style={styles.container} ref={ref}>
      <View style={styles.header}>
        <span>{ticketData?.companyName}</span>
      </View>
      <View style={styles.subheader}>
        <span>{ticketData?.companyAddress}</span>
        <span>Generated on: {formatDate(new Date())}</span>
      </View>
      <View style={styles.details}>
        <span>Ticket No: {ticketData.ticketNo}</span>
      </View>
      <View style={styles.details}>
        <span>Date: {ticketData.date}</span>
      </View>
      <View style={styles.details}>
        <span>Vehicle No: {ticketData.vehicleNo}</span>
      </View>
      <View style={styles.details}>
        <span>Material/Product: {ticketData.materialOrProduct}</span>
      </View>
      <View style={styles.details}>
        <span>Material/Product Type: {ticketData.materialTypeOrProductType}</span>
      </View>
      <View style={styles.details}>
        <span>Supplier/Customer Name: {ticketData.supplierOrCustomerName}</span>
      </View>
      <View style={styles.details}>
        <span>Supplier/Customer Address: {ticketData.supplierOrCustomerAddress}</span>
      </View>
      <View style={styles.details}>
        <span>Transaction Type: {ticketData.transactionType}</span>
      </View>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <View style={styles.tableCol}>
            <span>Field</span>
          </View>
          <View style={styles.tableCol}>
            <span>Value</span>
          </View>
        </View>
        {Object.entries(ticketData.qualityParameters).map(
          ([key, value], index) =>
            value !== null &&
            value !== undefined &&
            value !== "" && (
              <View key={index} style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <span>{key}</span>
                </View>
                <View style={styles.tableCol}>
                  <span>{value}</span>
                </View>
              </View>
            )
        )}
      </View>
    </View>
  );
});

export default PrintTicket;