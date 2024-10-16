import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, CircularProgress } from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";
import BreadcrumbsComponent from "../parts/BreadcrumbsComponent";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";

export default function OrderDetails() {
    const navigate = useNavigate();
    const { orderId } = useParams();
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    const breadcrumbs = [
        { label: "Home", path: "/" },
        { label: "Orders", path: "/orders" },
        { label: `${orderId}`, path: "" },
    ];

    const fetchOrderDetails = async () => {
        try {
            const response = await axios.get(`/api/orders/${orderId}`);
            setOrderDetails(response.data.data);
        } catch (error) {
            console.error("Error fetching order details:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderDetails();
    }, []);

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

    return (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton onClick={() => navigate(`/orders`)} sx={{ mr: 1 }}>
                    <ChevronLeftIcon />
                </IconButton>
                <Typography variant="h5" gutterBottom>
                    Order Details for Order ID: {orderId}
                </Typography>
            </Box>
            <BreadcrumbsComponent breadcrumbs={breadcrumbs} />
            <Box sx={{ height: 400, width: "100%", marginTop: "6px" }}>
                <DataGrid
                    rows={orderDetails.items}
                    columns={columns}
                    getRowId={(row) => row.itemId}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    checkboxSelection
                    disableRowSelectionOnClick
                    sx={{
                        borderRadius: "16px",
                        "& .MuiDataGrid-columnHeader": {
                            backgroundColor: "#000000",
                            color: "#fff",
                        },
                        "& .MuiDataGrid-columnHeader .MuiSvgIcon-root": {
                            color: "#fff",
                        },
                    }}
                />
            </Box>
        </Box>
    );
}
