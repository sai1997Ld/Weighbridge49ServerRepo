import React, { useState, useEffect } from 'react';
import { Button, Card, Input, Form } from 'antd';
import SideBar3 from "../../../../SideBar/SideBar3";

const QPrint = () => {
  const [ticketNo, setTicketNo] = useState('');

  const userId = sessionStorage.getItem("userId");

  const [isOutbound, setIsOutbound] = useState(false);
  const [transactionType, setTransactionType] = useState('');

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `http://49.249.180.125:8080/api/v1/qualities/report-response/${ticketNo}?userId=${userId}`,
        {
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      handlePrint(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch data for printing. Please try again later.");
    }
  };
  const handleClear = () => {
    setTicketNo('');
    console.log('Clear clicked');
  };

  const handlePrint = (data) => {
    const labels = [
      "Ticket No",
      "Company Name",
      "Company Address",
      "Date",
      "Vehicle No",
      data.transactionType === "outbound" ? "Product" : "Material",
      data.transactionType === "outbound" ? "Product Type" : "Material Type",
      data.transactionType === "outbound" ? "Customer Name" : "Supplier",
      data.transactionType === "outbound" ? "Customer Address" : "Supplier Address",
      "Transaction Type"
    ];

    const printableContent = `
      <h2>${data.companyName}</h2>
      <p>${data.companyAddress}</p>
      <p>Generated on: ${new Date().toLocaleDateString()}</p>
      <table>
        <tbody>
          ${labels
        .map((label) => {
          const propertyName = label.toLowerCase().replace(/ /g, "");
          let value;
          switch (propertyName) {
            case "ticketno":
              value = data.ticketNo;
              break;
            case "companyname":
              value = data.companyName;
              break;
            case "companyaddress":
              value = data.companyAddress;
              break;
            case "date":
              value = data.date;
              break;
            case "vehicleno":
              value = data.vehicleNo;
              break;
            case "product":
            case "material":
              value = data.materialOrProduct;
              break;
            case "producttype":
            case "materialtype":
              value = data.materialTypeOrProductType;
              break;
            case "customername":
            case "supplier":
              value = data.supplierOrCustomerName;
              break;
            case "customeraddress":
            case "supplieraddress":
              value = data.supplierOrCustomerAddress;
              break;
            case "transactiontype":
              value = data.transactionType.charAt(0).toUpperCase() + data.transactionType.slice(1);
              break;
            default:
              value = undefined;
          }
          return `<tr><th>${label}</th><td>${typeof value === "object" ? JSON.stringify(value) : value}</td></tr>`;
        })
        .join("")}
          ${data.qualityParameters
        ? `<tr>
                    <th>Quality Parameters</th>
                    <td>
                      <table class="nested-table">
                        <tr>
                          <th>Parameter</th>
                          <th>Value</th>
                        </tr>
                        ${Object.entries({
                ...data.qualityParameters,
                size: data.size // Add the size to the quality parameters
              })
                .filter(([key, value]) => value !== null && value !== undefined && value !== "")
                .map(
                  ([key, value]) =>
                    `<tr><td>${key}</td><td>${value}</td></tr>`
                )
                .join("")}
                      </table>
                    </td>
                  </tr>`
        : ""
      }
        </tbody>
      </table>
      <div class="signature-line">
        <p>Chief Chemist</p>
        <p>For ${data.companyName}</p>
        </br>
        </br>
        <p>Authorised Signatory</p>
      </div>
    `;

    // Create a new window or take over the current window
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Report</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: Arial, sans-serif;
              font-size: 12px;
              line-height: 1.3;
              padding: 20px;
              max-width: 800px;
              margin: 0 auto;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th, td {
              padding: 8px;
              text-align: left;
              border-bottom: 1px solid #ddd;
            }
            th {
              background-color: #0077b6;
              color: white;
            }
            .nested-table {
              font-size: 11px;
            }
            .signature-line {
              margin-top: 30px;
            }
            .signature-line p {
              margin: 5px 0;
            }
            @media print {
              body {
                padding: 0;
              }
              .no-print {
                display: none;
              }
            }
            @media screen and (max-width: 600px) {
              body {
                font-size: 10px;
                padding: 10px;
              }
              th, td {
                padding: 5px;
              }
            }
          </style>
        </head>
        <body>
          ${printableContent}
          <div class="no-print" style="margin-top: 20px;">
            <button onclick="window.print()">Print</button>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <SideBar3>
      <Card
        title="Print Card"
        style={{
          width: 400,
          margin: '100px auto 0', // Adjusted margin to bring the card further down
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Added box shadow
        }}
      >
        <Form layout="vertical">
          <Form.Item label="Ticket Number">
            <Input
              placeholder="Search by Ticket Number"
              value={ticketNo}
              onChange={(e) => setTicketNo(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={handleSearch} style={{ marginRight: '10px' }}>
              Search
            </Button>
            <Button onClick={handleClear}>Clear</Button>
          </Form.Item>
        </Form>
      </Card>
    </SideBar3>
  );
};

export default QPrint;
