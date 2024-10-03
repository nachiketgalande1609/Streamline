import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import {
    Box,
    Typography,
    Button,
    Snackbar,
    Alert,
    IconButton,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

import * as Papa from "papaparse";

export default function Sales() {
    const [rows, setRows] = useState([]);
    const [alertOpen, setAlertOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get("/api/sales");
                const flattenedData = response.data.data.map((sale) => ({
                    ...sale,
                    customerName: sale.customer?.name || "N/A",
                    customerEmail: sale.customer?.email || "N/A",
                    customerPhone: sale.customer?.phone || "N/A",
                }));
                setRows(flattenedData);
            } catch (error) {
                console.error("Error fetching sales data:", error);
            }
        }
        fetchData();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(); // Customize the format as needed
    };

    const handleAlertClose = () => {
        setAlertOpen(false);
    };

    const handleExport = async () => {
        try {
            const response = await axios.get("/api/sales");
            const flattenedData = response.data.data.map((sale) => ({
                ...sale,
                customerName: sale.customer?.name || "N/A",
                customerEmail: sale.customer?.email || "N/A",
                customerPhone: sale.customer?.phone || "N/A",
            }));

            const csv = Papa.unparse(flattenedData, {
                header: true,
                columns: [
                    "customerName",
                    "customerEmail",
                    "customerPhone",
                    "orderNumber",
                    "totalAmount",
                    "paymentStatus",
                    "orderStatus",
                    "createdAt",
                    "items",
                    "updatedAt",
                ],
            });

            // Create a downloadable link
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "sales.csv");
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

    const columns = [
        {
            field: "orderNumber",
            headerName: "Order Number",
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "customerName",
            headerName: "Customer Name",
            flex: 1,
            headerAlign: "left",
            align: "left",
        },
        {
            field: "customerEmail",
            headerName: "Customer Email",
            flex: 1,
            headerAlign: "left",
            align: "left",
        },
        {
            field: "customerPhone",
            headerName: "Customer Phone",
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "totalAmount",
            headerName: "Total Amount",
            flex: 1,
            valueFormatter: (params) => `$${params.toFixed(2)}`,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "paymentStatus",
            headerName: "Payment Status",
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "orderStatus",
            headerName: "Order Status",
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "createdAt",
            headerName: "Ordered Date",
            flex: 1,
            valueFormatter: (params) => formatDate(params),
            headerAlign: "center",
            align: "center",
        },
    ];

    return (
        <div style={{ padding: 20 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography variant="h4" gutterBottom sx={{ flexGrow: 1 }}>
                    Sales
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton
                        size="small"
                        onClick={handleExport}
                        aria-label="Export to CSV"
                    >
                        <FileDownloadIcon />
                    </IconButton>
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
                    getRowId={(row) => row._id}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 10,
                            },
                        },
                    }}
                    pageSizeOptions={[5, 10, 20]}
                    checkboxSelection
                    disableRowSelectionOnClick
                    sx={{
                        borderRadius: "16px",
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
