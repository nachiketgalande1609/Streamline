import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, CircularProgress, Stepper, Step, StepLabel, MenuItem, Select, Button, Snackbar, Alert } from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";
import BreadcrumbsComponent from "../parts/BreadcrumbsComponent";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";

export default function OrderDetails() {
    const navigate = useNavigate();
    const { orderId } = useParams();

    const [alertOpen, setAlertOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");

    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newStatus, setNewStatus] = useState(orderDetails?.status || "");

    const breadcrumbs = [
        { label: "Home", path: "/" },
        { label: "Orders", path: "/orders" },
        { label: `${orderId}`, path: "" },
    ];

    const fetchOrderDetails = async () => {
        try {
            const response = await axios.get(`/api/orders/${orderId}`);
            setOrderDetails(response.data.data);
            setNewStatus(response.data.data.status);
        } catch (error) {
            console.error("Error fetching order details:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderDetails();
    }, []);

    const handleAlertClose = () => {
        setAlertOpen(false);
    };

    const handleStatusChange = (event) => {
        setNewStatus(event.target.value);
    };

    const updateStatus = async () => {
        if (newStatus === orderDetails.status) {
            setMessage("No changes made to the status.");
            setSeverity("info");
            setAlertOpen(true);
            return;
        }
        try {
            await axios.put(`/api/orders/${orderId}/status`, { status: newStatus });
            fetchOrderDetails();
            setMessage("Status updated successfully!");
            setSeverity("success");
            setAlertOpen(true);
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (!orderDetails) {
        return <Typography variant="h6">Order not found.</Typography>;
    }

    const columns = [
        {
            field: "itemName",
            headerName: "Item Name",
            flex: 1,
            headerAlign: "left",
            align: "left",
        },
        {
            field: "quantity",
            headerName: "Quantity",
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "taxRate",
            headerName: "Tax Rate",
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "totalPrice",
            headerName: "Total Price",
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "unitPrice",
            headerName: "Price",
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
    ];

    // Define the steps for the timeline based on order status
    const steps =
        orderDetails.status === "cancelled"
            ? ["Pending", "Cancelled"] // Show only pending and cancelled
            : ["Pending", "Shipped", "Delivered"]; // Show pending, shipped, and delivered

    // Get the current status index based on orderDetails.status
    const statusIndex = steps.findIndex((step) => step.toLowerCase() === orderDetails.status);

    return (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton onClick={() => navigate(`/orders`)} sx={{ mr: 1 }}>
                        <ChevronLeftIcon />
                    </IconButton>
                    <Typography variant="h5" gutterBottom>
                        Order Details for Order ID: {orderId}
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                    <Select value={newStatus} onChange={handleStatusChange} size="small" displayEmpty sx={{ width: 150, borderRadius: "16px" }}>
                        <MenuItem value="" disabled>
                            Select Status
                        </MenuItem>
                        {["pending", "shipped", "delivered", "cancelled"].map((step) => (
                            <MenuItem key={step} value={step.toLowerCase()}>
                                {step}
                            </MenuItem>
                        ))}
                    </Select>
                    <Button
                        variant="contained"
                        onClick={updateStatus}
                        size="small"
                        sx={{
                            width: "100px",
                            borderRadius: "16px",
                            backgroundColor: "#000000",
                            "&:hover": {
                                backgroundColor: "#424242",
                            },
                        }}
                        disabled={newStatus === orderDetails.status}
                    >
                        Update
                    </Button>
                </Box>
            </Box>
            <BreadcrumbsComponent breadcrumbs={breadcrumbs} />
            <Box sx={{ marginTop: "16px" }}>
                <Typography variant="h6">Order Status</Typography>
                <Stepper activeStep={statusIndex} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>
            <Box sx={{ height: 400, width: "100%", marginTop: "16px" }}>
                <DataGrid
                    className="custom-data-grid"
                    rows={orderDetails.items}
                    columns={columns}
                    getRowId={(row) => row.itemId}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    disableRowSelectionOnClick
                    disableColumnMenu
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
        </Box>
    );
}
