import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { Box, Typography, Button, Snackbar, Alert, IconButton, Chip, Tooltip } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import BreadcrumbsComponent from "../parts/BreadcrumbsComponent";
import * as Papa from "papaparse";

export default function Sales() {
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [alertOpen, setAlertOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const [totalCount, setTotalCount] = useState(0);

    const breadcrumbs = [
        { label: "Home", path: "/" },
        { label: "Sales", path: "" },
    ];

    const fetchData = async (page = 1, limit = 10) => {
        setLoading(true);
        try {
            const response = await axios.get("/api/sales", {
                params: { page, limit },
            });
            const flattenedData = response.data.data.map((sale) => ({
                ...sale,
                customerName: sale.customerInfo?.customer_name || "N/A",
                customerEmail: sale.customerInfo?.email || "N/A",
                customerPhone: sale.customerInfo?.contact_number || "N/A",
            }));
            setRows(flattenedData);
            setTotalCount(response.data.totalCount);
        } catch (error) {
            console.error("Error fetching sales data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(currentPage, pageSize);
    }, [currentPage, pageSize]);

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
            renderCell: (params) => (
                <a
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        navigate(`/order/${params.value}`);
                    }}
                    style={{
                        textDecoration: "none",
                        fontWeight: "bold",
                        color: "#1976d2",
                    }} // Adjust color to your theme
                >
                    {params.value}
                </a>
            ),
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
            renderCell: (params) => {
                let chipColor;
                let chipVariant = "outlined";

                switch (params.value) {
                    case "pending":
                        chipColor = "warning";
                        break;
                    case "paid":
                        chipColor = "success";
                        break;
                    case "failed":
                        chipColor = "error";
                        break;
                    default:
                        chipColor = "default";
                }

                return <Chip label={params.value} color={chipColor} variant={chipVariant} sx={{ width: 100 }} />;
            },
        },
        {
            field: "orderStatus",
            headerName: "Order Status",
            flex: 1,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => {
                let chipColor;
                let chipVariant = "filled";

                switch (params.value) {
                    case "pending":
                        chipColor = "warning";
                        break;
                    case "shipped":
                        chipColor = "primary";
                        break;
                    case "delivered":
                        chipColor = "success";
                        break;
                    case "cancelled":
                        chipColor = "error";
                        break;
                    default:
                        chipColor = "default";
                }

                return <Chip label={params.value} color={chipColor} variant={chipVariant} sx={{ width: 100 }} />;
            },
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
        <div>
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="h5" gutterBottom sx={{ flexGrow: 1 }}>
                    Sales
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                    <Tooltip title="Export Data" arrow>
                        <IconButton size="small" onClick={handleExport} aria-label="Export to CSV" sx={{ width: "40px" }}>
                            <FileDownloadIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
            <BreadcrumbsComponent breadcrumbs={breadcrumbs} />
            <Box
                sx={{
                    height: 636,
                    width: "100%",
                    maxWidth: "calc(100vw - 280px)",
                    marginTop: 2,
                    overflowX: "auto", // Enable horizontal scrolling if content overflows
                }}
            >
                <DataGrid
                    className="custom-data-grid"
                    rows={rows}
                    columns={columns}
                    getRowId={(row) => row._id}
                    paginationMode="server"
                    rowCount={totalCount}
                    pageSizeOptions={[25, 50, 100]}
                    paginationModel={{
                        page: currentPage - 1,
                        pageSize: pageSize,
                    }}
                    onPaginationModelChange={(model) => {
                        setCurrentPage(model.page + 1);
                        setPageSize(model.pageSize);
                    }}
                    disableRowSelectionOnClick
                    disableColumnMenu
                    loading={loading}
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
                <Alert onClose={handleAlertClose} severity={severity} sx={{ width: "100%" }}>
                    {message}
                </Alert>
            </Snackbar>
        </div>
    );
}
