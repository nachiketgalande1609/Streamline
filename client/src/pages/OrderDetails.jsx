import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, CircularProgress } from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";
import BreadcrumbsComponent from "../parts/BreadcrumbsComponent";

export default function OrderDetails() {
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
        { field: "itemName", headerName: "Item Name", flex: 1 },
        { field: "quantity", headerName: "Quantity", flex: 1 },
        { field: "taxRate", headerName: "Tax Rate", flex: 1 },
        { field: "totalPrice", headerName: "Total Price", flex: 1 },
        { field: "unitPrice", headerName: "Price", flex: 1 },
    ];

    return (
        <Box sx={{ display: "flex", flexDirection: "column", mb: 2 }}>
            <Typography variant="h4" gutterBottom>
                Order Details for Order ID: {orderId}
            </Typography>
            <BreadcrumbsComponent breadcrumbs={breadcrumbs} />
            <Box sx={{ height: 400, width: "100%" }}>
                <DataGrid
                    rows={orderDetails.items}
                    columns={columns}
                    getRowId={(row) => row.itemId}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    sx={{ borderRadius: "16px" }}
                />
            </Box>
        </Box>
    );
}
