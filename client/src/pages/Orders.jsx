import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import {
    Modal,
    Button,
    Divider,
    Box,
    Typography,
    Snackbar,
    Alert,
    IconButton,
    FormControl,
    Select,
    MenuItem,
    Tooltip,
} from "@mui/material";
import * as Papa from "papaparse";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import SimCardDownloadIcon from "@mui/icons-material/SimCardDownload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
const dateFormatter = new Intl.DateTimeFormat("en-US");

function formatDate(dateString) {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "" : dateFormatter.format(date);
}

export default function Orders() {
    const [rows, setRows] = useState([]);
    const [alertOpen, setAlertOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [statuses, setStatuses] = useState([]);

    useEffect(() => {
        fetchStatuses();
        fetchData();
    }, []);

    const fetchData = async (status = "") => {
        try {
            const response = await axios.get("/api/orders", {
                params: { status },
            });
            const ordersWithCustomerDetails = response.data.data.map(
                (order) => ({
                    ...order,
                    customerName: order.customerInfo?.customer_name || "N/A",
                    customerNumber: order.customerInfo?.contact_number || "N/A",
                    customerEmail: order.customerInfo?.email || "N/A",
                })
            );
            setRows(ordersWithCustomerDetails);
        } catch (error) {
            console.error("Error fetching order data:", error);
        }
    };

    const fetchStatuses = async () => {
        try {
            const response = await axios.get("/api/orders/status");
            setStatuses(response.data.data);
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    const handleAlertClose = () => {
        setAlertOpen(false);
    };

    const handleExport = async () => {
        try {
            const response = await axios.get("/api/orders");
            const data = response.data.data;

            const csv = Papa.unparse(data, {
                header: true,
                columns: [
                    "orderId",
                    "customerName",
                    "customerNumber",
                    "customerEmail",
                    "orderDate",
                    "shippingDate",
                    "status",
                    "totalAmount",
                    "taxAmount",
                    "discount",
                    "netAmount",
                    "paymentMethod",
                    "paymentStatus",
                    "paymentDate",
                    "shippingAddress",
                    "billingAddress",
                ],
            });

            // Create a downloadable link
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "orders.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setMessage("Exported file downloaded successfully!");
            setSeverity("success");
            setAlertOpen(true);
        } catch (error) {
            console.error("Error exporting customer data:", error);
        }
    };

    const handleStatusChange = (event) => {
        const selectedStatus = event.target.value;
        setSelectedStatus(selectedStatus);
        fetchData(selectedStatus);
    };

    const handleGenerateInvoice = async (order) => {
        const doc = new jsPDF();

        // Create a temporary div to hold the invoice content
        const invoiceContainer = document.createElement("div");
        invoiceContainer.innerHTML = `
        <div style="padding: 20px;">
            <h1>Invoice</h1>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th style="border: 1px solid #ddd; padding: 8px;">Field</th>
                        <th style="border: 1px solid #ddd; padding: 8px;">Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">Order ID</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${
                            order.orderId
                        }</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">Customer ID</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${
                            order.customerId
                        }</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">Order Date</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${formatDate(
                            order.orderDate
                        )}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">Shipping Date</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${formatDate(
                            order.shippingDate
                        )}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">Status</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${
                            order.status
                        }</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">Total Amount</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${
                            order.totalAmount
                        }</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">Tax Amount</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${
                            order.taxAmount
                        }</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">Discount</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${
                            order.discount
                        }</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">Net Amount</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${
                            order.netAmount
                        }</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">Payment Method</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${
                            order.paymentMethod
                        }</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">Payment Status</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${
                            order.paymentStatus
                        }</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">Shipping Address</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${
                            order.shippingAddress
                        }</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">Billing Address</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${
                            order.billingAddress
                        }</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;

        // Append the temporary div to the body
        document.body.appendChild(invoiceContainer);

        try {
            // Use html2canvas to capture the content
            const canvas = await html2canvas(invoiceContainer);
            const imgData = canvas.toDataURL("image/png");

            // Add image to PDF
            doc.addImage(imgData, "PNG", 10, 10, 180, 0);
            doc.save(`invoice_${order.orderId}.pdf`);

            setMessage("Invoice generated successfully!");
            setSeverity("success");
            setAlertOpen(true);
        } catch (error) {
            console.error("Error generating invoice:", error);
            setMessage("Error generating invoice");
            setSeverity("error");
            setAlertOpen(true);
        } finally {
            // Remove the temporary div from the body
            document.body.removeChild(invoiceContainer);
        }
    };

    const columns = [
        {
            field: "actions",
            headerName: "Actions",
            renderCell: (params) => (
                <Tooltip title="Download Invoice" arrow>
                    <IconButton
                        size="small"
                        onClick={handleExport}
                        aria-label="Download Invoice"
                        sx={{
                            color: "primary.main",
                            "&:hover": {
                                backgroundColor: "action.hover",
                            },
                        }}
                    >
                        <SimCardDownloadIcon />
                    </IconButton>
                </Tooltip>
            ),
            width: 100,
            headerAlign: "center",
            align: "center",
        },

        {
            field: "orderId",
            headerName: "Order ID",
            width: 150,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "customerName",
            headerName: "Customer Name",
            width: 150,
            headerAlign: "left",
            align: "left",
        },
        {
            field: "customerNumber",
            headerName: "Customer Number",
            width: 150,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "customerEmail",
            headerName: "Customer Email",
            width: 250,
            headerAlign: "left",
            align: "left",
        },
        {
            field: "orderDate",
            headerName: "Order Date",
            valueFormatter: (params) => formatDate(params),
            width: 150,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "shippingDate",
            headerName: "Shipping Date",
            valueFormatter: (params) => formatDate(params),
            width: 150,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "status",
            headerName: "Status",
            width: 150,
            headerAlign: "left",
            align: "left",
        },
        {
            field: "totalAmount",
            headerName: "Total Amount",
            type: "number",
            width: 150,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "taxAmount",
            headerName: "Tax Amount",
            type: "number",
            width: 150,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "discount",
            headerName: "Discount",
            type: "number",
            width: 150,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "netAmount",
            headerName: "Net Amount",
            type: "number",
            width: 150,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "paymentMethod",
            headerName: "Payment Method",
            width: 150,
            headerAlign: "left",
            align: "left",
        },
        {
            field: "paymentStatus",
            headerName: "Payment Status",
            width: 150,
            headerAlign: "left",
            align: "left",
        },
        {
            field: "shippingAddress",
            headerName: "Shipping Address",
            width: 200,
            headerAlign: "left",
            align: "left",
        },
        {
            field: "billingAddress",
            headerName: "Billing Address",
            width: 200,
            headerAlign: "left",
            align: "left",
        },
    ];

    return (
        <div style={{ padding: 20 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography variant="h4" gutterBottom sx={{ flexGrow: 1 }}>
                    Orders
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton
                        size="small"
                        onClick={handleExport}
                        aria-label="Export to CSV"
                    >
                        <FileDownloadIcon />
                    </IconButton>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <Select
                            value={selectedStatus}
                            onChange={handleStatusChange}
                            displayEmpty
                        >
                            <MenuItem value="">
                                <em>All Orders</em>
                            </MenuItem>
                            {statuses.map((status) => (
                                <MenuItem key={status} value={status}>
                                    {status}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </Box>
            <Box
                sx={{
                    height: 631,
                    width: "100%",
                    maxWidth: "calc(100vw - 280px)",
                    marginTop: 2,
                    overflowX: "auto", // Enable horizontal scrolling if content overflows
                }}
            >
                <DataGrid
                    rows={rows}
                    columns={columns}
                    getRowId={(row) => row.orderId}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 10,
                            },
                        },
                    }}
                    pageSizeOptions={[5]}
                    checkboxSelection
                    disableRowSelectionOnClick
                    sx={{
                        "& .MuiDataGrid-columnHeader": {
                            backgroundColor: "#37474f",
                            color: "#fff",
                        },
                        "& .MuiDataGrid-columnHeader .MuiSvgIcon-root": {
                            color: "#fff",
                        },
                    }}
                />
            </Box>

            <Snackbar
                open={alertOpen}
                autoHideDuration={6000}
                onClose={handleAlertClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                action={
                    <Button color="inherit" onClick={handleAlertClose}>
                        Close
                    </Button>
                }
            >
                <Alert
                    onClose={handleAlertClose}
                    severity={severity}
                    sx={{ width: "100%" }}
                >
                    {message}
                </Alert>
            </Snackbar>
        </div>
    );
}
