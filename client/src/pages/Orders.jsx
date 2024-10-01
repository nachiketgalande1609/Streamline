import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import {
  Modal,
  Button,
  Box,
  Typography,
  TextField,
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
import AddIcon from "@mui/icons-material/Add";

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
  const [openModal, setOpenModal] = useState(false);
  const [selectedOrderItems, setSelectedOrderItems] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [newOrder, setNewOrder] = useState({
    customerName: "",
    customerNumber: "",
    customerEmail: "",
    orderDate: "",
    shippingAddress: "",
    billingAddress: "",
    paymentMethod: "",
    items: [],
  });

  useEffect(() => {
    fetchStatuses();
    fetchData();
  }, []);

  const fetchData = async (status = "") => {
    try {
      const response = await axios.get("/api/orders", {
        params: { status },
      });
      const ordersWithCustomerDetails = response.data.data.map((order) => ({
        ...order,
        customerName: order.customerInfo?.customer_name || "N/A",
        customerNumber: order.customerInfo?.contact_number || "N/A",
        customerEmail: order.customerInfo?.email || "N/A",
        lineCount: order.items.length,
      }));
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

  const handleViewItems = (items) => {
    setSelectedOrderItems(items);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleCreateOrder = async () => {
    try {
      const response = await axios.post("/api/orders", newOrder);
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
    { field: "productName", headerName: "Product Name", width: 200 },
    { field: "quantity", headerName: "Quantity", width: 100 },
    { field: "unitPrice", headerName: "Unit Price", width: 100 },
    { field: "discount", headerName: "Discount", width: 100 },
    { field: "totalPrice", headerName: "Total Price", width: 100 },
  ];

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
          }}
        >
          <Tooltip title="Download Invoice" arrow>
            <IconButton
              size="small"
              onClick={() => handleGenerateInvoice(params.row)}
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
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleViewItems(params.row.items);
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
          <IconButton
            size="small"
            onClick={() => setOpenCreateModal(true)}
            aria-label="Add Items"
            sx={{ mr: 1 }}
          >
            <AddIcon />
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

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="order-items-modal"
        aria-describedby="order-items-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            bgcolor: "background.paper",
            borderRadius: 1,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Order Items
          </Typography>
          <Box sx={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={selectedOrderItems}
              columns={itemColumns}
              getRowId={(row) => row.productId}
              pageSize={5}
              rowsPerPageOptions={[5]}
            />
          </Box>
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={handleCloseModal}>Close</Button>
          </Box>
        </Box>
      </Modal>

      <Modal open={openCreateModal} onClose={handleCloseCreateModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            Create New Order
          </Typography>
          <TextField
            label="Customer Name"
            value={newOrder.customerName}
            onChange={(e) =>
              setNewOrder({ ...newOrder, customerName: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Customer Number"
            value={newOrder.customerNumber}
            onChange={(e) =>
              setNewOrder({ ...newOrder, customerNumber: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Customer Email"
            value={newOrder.customerEmail}
            onChange={(e) =>
              setNewOrder({ ...newOrder, customerEmail: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Order Date"
            type="date"
            value={newOrder.orderDate}
            onChange={(e) =>
              setNewOrder({ ...newOrder, orderDate: e.target.value })
            }
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Shipping Address"
            value={newOrder.shippingAddress}
            onChange={(e) =>
              setNewOrder({ ...newOrder, shippingAddress: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Billing Address"
            value={newOrder.billingAddress}
            onChange={(e) =>
              setNewOrder({ ...newOrder, billingAddress: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <Select
              value={newOrder.paymentMethod}
              onChange={(e) =>
                setNewOrder({ ...newOrder, paymentMethod: e.target.value })
              }
              displayEmpty
            >
              <MenuItem value="">
                <em>Select Payment Method</em>
              </MenuItem>
              <MenuItem value="Credit Card">Credit Card</MenuItem>
              <MenuItem value="PayPal">PayPal</MenuItem>
              <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
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
            <IconButton
              size="small"
              onClick={handleAddItem}
              aria-label="Add Items"
            >
              <AddIcon />
            </IconButton>
          </Box>

          {newOrder.items.map((item, index) => (
            <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
              <TextField
                label="Item Name"
                value={item.itemName}
                onChange={(e) =>
                  handleItemChange(index, "itemName", e.target.value)
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Quantity"
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(index, "quantity", e.target.value)
                }
                fullWidth
                margin="normal"
                sx={{ mx: 1 }}
              />
              <TextField
                label="Price"
                type="number"
                value={item.price}
                onChange={(e) =>
                  handleItemChange(index, "price", e.target.value)
                }
                fullWidth
                margin="normal"
              />
              <IconButton onClick={() => handleRemoveItem(index)}>
                <Tooltip title="Remove Item">
                  <span>&times;</span>
                </Tooltip>
              </IconButton>
            </Box>
          ))}
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateOrder}
            fullWidth
            sx={{ mt: 2 }}
          >
            Create Order
          </Button>
        </Box>
      </Modal>

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
