import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { Modal, Button, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const dateFormatter = new Intl.DateTimeFormat("en-US");

function formatDate(dateString) {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "" : dateFormatter.format(date);
}

export default function Orders() {
    const [rows, setRows] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get("/api/orders");
                setRows(response.data.data);
            } catch (error) {
                console.error("Error fetching order data:", error);
            }
        }
        fetchData();
    }, []);

    const handleViewClick = (order) => {
        setSelectedOrder(order);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedOrder(null);
    };

    const columns = [
        {
            field: "orderId",
            headerName: "Order ID",
            flex: 1,
            headerAlign: "left",
            align: "left",
        },
        {
            field: "customerId",
            headerName: "Customer ID",
            flex: 1,
            headerAlign: "left",
            align: "left",
        },
        {
            field: "orderDate",
            headerName: "Order Date",
            valueFormatter: (params) => formatDate(params),
            flex: 1,
            headerAlign: "left",
            align: "left",
        },
        {
            field: "shippingDate",
            headerName: "Shipping Date",
            valueFormatter: (params) => formatDate(params),
            flex: 1,
            headerAlign: "left",
            align: "left",
        },
        {
            field: "status",
            headerName: "Status",
            flex: 1,
            headerAlign: "left",
            align: "left",
        },
        {
            field: "totalAmount",
            headerName: "Total Amount",
            type: "number",
            flex: 1,
            headerAlign: "left",
            align: "left",
        },
        {
            field: "shippingAddress",
            headerName: "Shipping Address",
            flex: 2,
            headerAlign: "left",
            align: "left",
        },
        {
            field: "billingAddress",
            headerName: "Billing Address",
            flex: 2,
            headerAlign: "left",
            align: "left",
        },
        {
            field: "view",
            headerName: "View",
            renderCell: (params) => (
                <Button onClick={() => handleViewClick(params.row)}>
                    View
                </Button>
            ),
            flex: 1,
            headerAlign: "left",
            align: "left",
        },
    ];

    // Define columns for the line items DataGrid
    const lineItemColumns = [
        {
            field: "productId",
            headerName: "Product Id",
            flex: 1,
            headerAlign: "left",
            align: "left",
        },
        {
            field: "productName",
            headerName: "Product Name",
            flex: 1,
            headerAlign: "left",
            align: "left",
        },
        {
            field: "quantity",
            headerName: "Quantity",
            type: "number",
            flex: 1,
            headerAlign: "left",
            align: "left",
        },
        {
            field: "unitPrice",
            headerName: "Unit Price",
            type: "number",
            flex: 1,
            headerAlign: "left",
            align: "left",
        },
    ];

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Orders Management
            </Typography>
            <Box sx={{ height: 631, width: "100%" }}>
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
                    pageSizeOptions={[5]}
                    checkboxSelection
                    disableRowSelectionOnClick
                />
            </Box>

            <Modal open={openModal} onClose={handleCloseModal}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 800,
                        bgcolor: "background.paper",
                        border: "2px solid #000",
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography variant="h6" component="h2">
                        Order Details
                    </Typography>
                    <Button
                        onClick={handleCloseModal}
                        sx={{ position: "absolute", top: 10, right: 10 }}
                    >
                        <CloseIcon />
                    </Button>
                    <Divider sx={{ my: 2 }} />
                    {selectedOrder ? (
                        <Box sx={{ height: 400, width: "100%" }}>
                            <Typography variant="h6">Line Items:</Typography>
                            <DataGrid
                                rows={selectedOrder.items}
                                columns={lineItemColumns}
                                getRowId={(row) =>
                                    row.productName + row.unitPrice
                                } // Unique key for each row
                                pageSize={5}
                                checkboxSelection
                                disableRowSelectionOnClick
                            />
                        </Box>
                    ) : (
                        <Typography>No details available</Typography>
                    )}
                </Box>
            </Modal>
        </div>
    );
}
