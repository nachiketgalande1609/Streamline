import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { Modal, Button, Box, Typography, TextField, Snackbar, Alert, IconButton, FormControl, Select, MenuItem, Tooltip, Chip } from "@mui/material";
import * as Papa from "papaparse";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import SimCardDownloadIcon from "@mui/icons-material/SimCardDownload";
import AddIcon from "@mui/icons-material/Add";
import { Close } from "@mui/icons-material";
import BreadcrumbsComponent from "../parts/BreadcrumbsComponent";

const dateFormatter = new Intl.DateTimeFormat("en-US");

function formatDate(dateString) {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "" : dateFormatter.format(date);
}

export default function Orders() {
    const navigate = useNavigate();

    const [rows, setRows] = useState([]);
    const [alertOpen, setAlertOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [statuses, setStatuses] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedOrderItems, setSelectedOrderItems] = useState([]);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [items, setItems] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState("");
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const [totalCount, setTotalCount] = useState(0);

    const breadcrumbs = [
        { label: "Home", path: "/" },
        { label: "Orders", path: "" },
    ];

    const [newOrder, setNewOrder] = useState({
        customerName: "",
        customerNumber: "",
        customerEmail: "",
        orderDate: new Date().toISOString().split("T")[0],
        shippingAddress: "",
        billingAddress: "",
        paymentMethod: "",
        paymentStatus: "",
        items: [],
    });

    useEffect(() => {
        fetchData(selectedStatus, currentPage, pageSize);
    }, [selectedStatus, currentPage, pageSize]);

    useEffect(() => {
        fetchStatuses();
    }, []);

    const fetchData = async (status = "", page = 1, limit = 10) => {
        setLoading(true);
        try {
            const response = await axios.get("/api/orders", {
                params: { page, limit, status },
            });
            const ordersWithCustomerDetails = response.data.data.map((order) => ({
                ...order,
                customerName: order.customerInfo?.customer_name || "N/A",
                customerNumber: order.customerInfo?.contact_number || "N/A",
                customerEmail: order.customerInfo?.email || "N/A",
                lineCount: order.items.length,
            }));
            setRows(ordersWithCustomerDetails);
            setTotalCount(response.data.totalCount);
        } catch (error) {
            console.error("Error fetching order data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCustomersAndItems = async () => {
        try {
            const response = await axios.get("/api/orders/customers-items");
            if (response.data.success) {
                setCustomers(response.data.data.customers);
                setItems(response.data.data.items);
            } else {
                console.error("Failed to fetch customers.");
            }
        } catch (error) {
            console.error("Error fetching customers:", error);
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
                        <td style="border: 1px solid #ddd; padding: 8px;">${order.orderId}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">Customer ID</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${order.customerId}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">Order Date</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${formatDate(order.orderDate)}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">Shipping Date</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${formatDate(order.shippingDate)}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">Status</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${order.status}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">Total Amount</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${order.totalAmount}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">Tax Amount</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${order.taxAmount}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">Net Amount</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${order.netAmount}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">Payment Method</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${order.paymentMethod}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">Payment Status</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${order.paymentStatus}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">Shipping Address</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${order.shippingAddress}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">Billing Address</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${order.billingAddress}</td>
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

    const handleViewOrder = (orderId) => {
        navigate(`/order/${orderId}`);
    };

    const taxRate = 0.18;

    const calculateAmounts = (orderItems) => {
        const totalAmount = orderItems.reduce((total, item) => {
            return total + item.price * item.quantity;
        }, 0);

        const taxAmount = totalAmount * taxRate;
        const netAmount = totalAmount + taxAmount;

        return { totalAmount, taxAmount, netAmount };
    };

    const handleCreateOrder = async () => {
        try {
            // Calculate totalAmount, taxAmount, and netAmount in one function
            const { totalAmount, taxAmount, netAmount } = calculateAmounts(newOrder.items);

            const orderPayload = {
                ...newOrder,
                totalAmount,
                taxAmount,
                netAmount,
            };

            // Send the new order to the API
            const response = await axios.post("/api/orders", orderPayload);
            if (response.status === 201) {
                setMessage("Order created successfully!");
                setSeverity("success");
                setAlertOpen(true);
                fetchData();
                setOpenCreateModal(false);
            }
        } catch (error) {
            console.error("Error creating order:", error);
            setMessage("Error creating order");
            setSeverity("error");
            setAlertOpen(true);
        }
    };

    const handleCloseCreateModal = () => {
        setOpenCreateModal(false);
    };

    const handleAddItem = () => {
        // Add a new item with default values
        setNewOrder((prev) => ({
            ...prev,
            items: [...prev.items, { itemName: "", quantity: 1, price: 0 }],
        }));
    };

    const handleItemChange = (index, field, value) => {
        const updatedItems = newOrder.items.map((item, i) => {
            if (i === index) {
                if (field === "itemName") {
                    const selectedItem = items.find((item) => item.name === value);
                    return {
                        ...item,
                        itemId: selectedItem._id,
                        itemName: value,
                        price: selectedItem ? selectedItem.price : item.price, // Auto-populate price
                    };
                }
                return { ...item, [field]: value };
            }
            return item;
        });

        setNewOrder({ ...newOrder, items: updatedItems });
    };

    const handleRemoveItem = (index) => {
        const updatedItems = newOrder.items.filter((_, i) => i !== index);
        setNewOrder({ ...newOrder, items: updatedItems });
    };

    const itemColumns = [
        { field: "itemName", headerName: "Item Name", width: 200 },
        { field: "quantity", headerName: "Quantity", width: 100 },
        { field: "price", headerName: "Price", width: 100 },
        { field: "totalPrice", headerName: "Total Price", width: 100 },
    ];

    const CreateOrderModal = () => {
        return (
            <Modal open={openCreateModal} onClose={handleCloseCreateModal}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 800,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: "16px",
                    }}
                >
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseCreateModal}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <Close />
                    </IconButton>
                    <Typography variant="h6" component="h2">
                        Create New Order
                    </Typography>
                    <FormControl fullWidth margin="normal">
                        <Select
                            value={selectedCustomer}
                            onChange={(e) => {
                                const selectedCustomerId = e.target.value;
                                const selectedCust = customers.find((customer) => customer._id === selectedCustomerId);
                                setSelectedCustomer(selectedCustomerId);
                                setNewOrder((prev) => ({
                                    ...prev,
                                    customerId: selectedCustomerId,
                                    customerName: selectedCust?.customer_name || "",
                                    customerNumber: selectedCust?.contact_number || "",
                                    customerEmail: selectedCust?.email || "",
                                    shippingAddress: selectedCust?.address || "",
                                    billingAddress: selectedCust?.address || "",
                                }));
                            }}
                            displayEmpty
                            inputProps={{ "aria-label": "Without label" }}
                            size="small"
                            sx={{
                                borderRadius: "16px",
                            }}
                        >
                            <MenuItem value="" disabled>
                                Select Customer
                            </MenuItem>
                            {customers.map((customer) => (
                                <MenuItem key={customer._id} value={customer._id}>
                                    {customer.customer_name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        label="Customer Number"
                        value={newOrder.customerNumber}
                        onChange={(e) =>
                            setNewOrder({
                                ...newOrder,
                                customerNumber: e.target.value,
                            })
                        }
                        fullWidth
                        margin="normal"
                        size="small"
                        InputProps={{
                            readOnly: true,
                            style: { borderRadius: "16px" },
                        }}
                    />
                    <TextField
                        label="Customer Email"
                        value={newOrder.customerEmail}
                        onChange={(e) =>
                            setNewOrder({
                                ...newOrder,
                                customerEmail: e.target.value,
                            })
                        }
                        fullWidth
                        margin="normal"
                        size="small"
                        InputProps={{
                            readOnly: true,
                            style: { borderRadius: "16px" },
                        }}
                    />
                    <TextField
                        label="Order Date"
                        type="date"
                        value={newOrder.orderDate}
                        onChange={(e) =>
                            setNewOrder({
                                ...newOrder,
                                orderDate: e.target.value,
                            })
                        }
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        size="small"
                        InputProps={{
                            style: { borderRadius: "16px" },
                        }}
                    />
                    <TextField
                        label="Shipping Address"
                        value={newOrder.shippingAddress}
                        onChange={(e) =>
                            setNewOrder({
                                ...newOrder,
                                shippingAddress: e.target.value,
                            })
                        }
                        fullWidth
                        margin="normal"
                        size="small"
                        InputProps={{
                            style: { borderRadius: "16px" },
                        }}
                    />
                    <TextField
                        label="Billing Address"
                        value={newOrder.billingAddress}
                        onChange={(e) =>
                            setNewOrder({
                                ...newOrder,
                                billingAddress: e.target.value,
                            })
                        }
                        fullWidth
                        margin="normal"
                        size="small"
                        InputProps={{
                            style: { borderRadius: "16px" },
                        }}
                    />
                    <FormControl fullWidth margin="normal">
                        <Select
                            value={newOrder.paymentMethod}
                            onChange={(e) =>
                                setNewOrder({
                                    ...newOrder,
                                    paymentMethod: e.target.value,
                                })
                            }
                            displayEmpty
                            size="small"
                            sx={{
                                borderRadius: "16px", // Add border radius here
                            }}
                        >
                            <MenuItem value="">
                                <em>Select Payment Method</em>
                            </MenuItem>
                            <MenuItem value="credit card">Credit Card</MenuItem>
                            <MenuItem value="paypal">PayPal</MenuItem>
                            <MenuItem value="cash on delivery">Cash on Delivery</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <Select
                            value={newOrder.paymentStatus}
                            onChange={(e) =>
                                setNewOrder({
                                    ...newOrder,
                                    paymentStatus: e.target.value,
                                })
                            }
                            displayEmpty
                            size="small"
                            sx={{
                                borderRadius: "16px", // Add border radius here
                            }}
                        >
                            <MenuItem value="">
                                <em>Select Payment Status</em>
                            </MenuItem>
                            <MenuItem value="paid">Paid</MenuItem>
                            <MenuItem value="unpaid">Unpaid</MenuItem>
                            <MenuItem value="pending">Pending</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Item Inputs */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: 1,
                            mt: 1,
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography variant="h6" component="h3">
                            Items
                        </Typography>
                        <IconButton size="small" onClick={handleAddItem} aria-label="Add Items">
                            <AddIcon />
                        </IconButton>
                    </Box>

                    {newOrder.items.map((item, index) => (
                        <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
                            {/* Item Name as a Select dropdown */}
                            <FormControl fullWidth margin="normal">
                                <Select
                                    value={item.itemName}
                                    onChange={(e) => handleItemChange(index, "itemName", e.target.value)}
                                    displayEmpty
                                    size="small"
                                    sx={{
                                        borderRadius: "16px", // Add border radius here
                                    }}
                                >
                                    <MenuItem value="" disabled>
                                        Select Item
                                    </MenuItem>
                                    {items.map((item) => (
                                        <MenuItem key={item._id} value={item.name}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* Quantity */}
                            <TextField
                                label="Quantity"
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                                fullWidth
                                margin="normal"
                                size="small"
                                InputProps={{
                                    style: { borderRadius: "16px" },
                                }}
                                sx={{ mx: 1 }}
                            />

                            {/* Price (optional, you could also auto-populate based on the item) */}
                            <TextField
                                label="Price"
                                type="number"
                                value={item.price}
                                onChange={(e) => handleItemChange(index, "price", e.target.value)}
                                fullWidth
                                margin="normal"
                                size="small"
                                InputProps={{
                                    readOnly: true,
                                    style: { borderRadius: "16px" },
                                }}
                            />
                            <IconButton onClick={() => handleRemoveItem(index)}>
                                <Tooltip title="Remove Item">
                                    <span>&times;</span>
                                </Tooltip>
                            </IconButton>
                        </Box>
                    ))}
                    <Box sx={{ display: "flex", justifyContent: "end" }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCreateOrder}
                            fullWidth
                            sx={{
                                mt: 2,
                                width: "150px",
                                borderRadius: "16px",
                                backgroundColor: "#000000",
                                "&:hover": { backgroundColor: "#424242" },
                            }}
                        >
                            Create Order
                        </Button>
                    </Box>
                </Box>
            </Modal>
        );
    };

    const columns = [
        {
            field: "actions",
            headerName: "Actions",
            renderCell: (params) => (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "8px",
                        height: "100%",
                    }}
                >
                    <Tooltip title="Download Invoice" arrow>
                        <IconButton
                            size="small"
                            onClick={() => handleGenerateInvoice(params.row)}
                            aria-label="Download Invoice"
                            sx={{
                                color: "primary.main",
                                width: "51.33px",
                                "&:hover": {
                                    backgroundColor: "action.hover",
                                },
                            }}
                        >
                            <SimCardDownloadIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            ),
            width: 120,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "orderId",
            headerName: "Order ID",
            width: 150,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => (
                <Tooltip title="View Order" arrow>
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            handleViewOrder(params.id, selectedOrderItems);
                        }}
                        style={{
                            textDecoration: "none",
                            fontWeight: "bold",
                            color: "#1976d2",
                        }} // Adjust color to your theme
                    >
                        {params.value}
                    </a>
                </Tooltip>
            ),
        },
        {
            field: "lineCount",
            headerName: "Line Count",
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
        <div>
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="h5" gutterBottom sx={{ flexGrow: 1 }}>
                    Orders
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                    <Tooltip title="Create Order" arrow>
                        <IconButton
                            size="small"
                            onClick={() => {
                                fetchCustomersAndItems();
                                setOpenCreateModal(true);
                            }}
                            aria-label="Add Items"
                            sx={{ width: "40px" }}
                        >
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Export Data" arrow>
                        <IconButton size="small" onClick={handleExport} aria-label="Export to CSV" sx={{ width: "40px" }}>
                            <FileDownloadIcon />
                        </IconButton>
                    </Tooltip>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <Select
                            value={selectedStatus}
                            onChange={handleStatusChange}
                            displayEmpty
                            sx={{
                                borderRadius: "16px",
                            }}
                        >
                            <MenuItem value="">All Orders</MenuItem>
                            {statuses.map((status) => (
                                <MenuItem key={status} value={status}>
                                    {status}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
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
                    getRowId={(row) => row.orderId}
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
            <CreateOrderModal />
        </div>
    );
}
