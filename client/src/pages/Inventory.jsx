import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Chip from "@mui/material/Chip";
import { Close } from "@mui/icons-material";

import Grid from "@mui/material/Grid";
import BreadcrumbsComponent from "../parts/BreadcrumbsComponent";
import * as Papa from "papaparse";

import { Modal, Box, Typography, TextField, Select, MenuItem, Button, FormControl, InputLabel, Snackbar, Alert, IconButton } from "@mui/material";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
};

const dateFormatter = new Intl.DateTimeFormat("en-US");

function formatDate(dateString) {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "" : dateFormatter.format(date);
}

export default function Inventory() {
    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        quantity: "",
        price: "",
        cost: "",
        min_stock_level: "",
        reorder_point: "",
        supplier: "",
        warehouse: "",
        dateAdded: "",
        expiryDate: "",
        status: "in stock",
    });
    const [warehouses, setWarehouses] = useState([]);
    const [alertOpen, setAlertOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
    const [statusFilter, setStatusFilter] = useState("");
    const [totalCount, setTotalCount] = useState(0);

    const breadcrumbs = [
        { label: "Home", path: "/" },
        { label: "Inventory", path: "" },
    ];

    const fetchInventoryData = async (page = 1, limit = 10, search = "", status = "") => {
        setLoading(true);
        try {
            const response = await axios.get("/api/inventory", {
                params: {
                    page,
                    limit,
                    search,
                    status,
                },
            });
            setRows(response.data.data);
            setTotalCount(response.data.totalItems);
        } catch (error) {
            console.error("Error fetching inventory data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchWarehouseData = async () => {
        try {
            const response = await axios.get("/api/warehouse/lov");
            setWarehouses(response.data.data);
        } catch (error) {
            console.error("Error fetching warehouse data:", error);
        }
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 1000);

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);

    useEffect(() => {
        fetchInventoryData(currentPage, pageSize, debouncedSearchQuery, statusFilter);
    }, [currentPage, pageSize, debouncedSearchQuery, statusFilter]);

    const handleAlertClose = () => {
        setAlertOpen(false);
    };

    const handleExport = async () => {
        try {
            const response = await axios.get("/api/inventory");
            const data = response.data.data;

            const csv = Papa.unparse(data, {
                header: true,
                columns: [
                    "sku",
                    "name",
                    "description",
                    "category",
                    "quantity",
                    "price",
                    "cost",
                    "min_stock_level",
                    "reorder_point",
                    "supplier",
                    "warehouse",
                    "dateAdded",
                    "expiryDate",
                    "status",
                ],
            });

            // Create a downloadable link
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "inventory.csv");
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

    const handleOpen = () => {
        fetchWarehouseData();
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSelectChange = (e) => {
        setFormData({
            ...formData,
            warehouse: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/api/inventory", formData);
            fetchInventoryData();
            handleClose();
            setFormData({
                name: "",
                description: "",
                category: "",
                quantity: "",
                price: "",
                cost: "",
                min_stock_level: "",
                reorder_point: "",
                supplier: "",
                warehouse: "",
                dateAdded: "",
                expiryDate: "",
                status: "in stock",
            });
        } catch (error) {
            console.error("Error adding item to inventory:", error);
        }
    };

    const columns = [
        {
            field: "status",
            headerName: "Status",
            width: 150, // Constant width
            headerAlign: "center",
            align: "center",
            renderCell: (params) => {
                let chipColor;
                if (params.value === "in stock") {
                    chipColor = "success";
                } else if (params.value === "out of stock") {
                    chipColor = "error";
                } else {
                    chipColor = "default";
                }

                return <Chip label={params.value} color={chipColor} sx={{ width: 100 }} />;
            },
        },
        {
            field: "name",
            headerName: "Item Name",
            width: 150,
            headerAlign: "left",
            align: "left",
        },
        {
            field: "description",
            headerName: "Description",
            width: 200,
            headerAlign: "left",
            align: "left",
        },
        {
            field: "category",
            headerName: "Category",
            width: 150,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "quantity",
            headerName: "Quantity",
            type: "number",
            width: 150,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "price",
            headerName: "Price",
            type: "number",
            width: 150,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "cost",
            headerName: "Cost",
            type: "number",
            width: 150,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "min_stock_level",
            headerName: "Min Stock Level",
            type: "number",
            width: 150,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "reorder_point",
            headerName: "Reorder Point",
            type: "number",
            width: 150,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "supplier",
            headerName: "Supplier",
            width: 150,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "warehouse",
            headerName: "Warehouse",
            width: 150,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "dateAdded",
            headerName: "Date Added",
            valueFormatter: (params) => formatDate(params),
            width: 150,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "expiryDate",
            headerName: "Expiry Date",
            valueFormatter: (params) => formatDate(params),
            width: 150,
            headerAlign: "center",
            align: "center",
        },
    ];

    return (
        <div>
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="h5" gutterBottom sx={{ flexGrow: 1 }}>
                    Inventory
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton size="small" onClick={handleOpen} aria-label="Add Items" sx={{ mr: 1 }}>
                        <AddIcon />
                    </IconButton>
                    <IconButton size="small" onClick={handleExport} aria-label="Export to CSV">
                        <FileDownloadIcon />
                    </IconButton>
                    <TextField
                        label="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        variant="outlined"
                        size="small"
                        InputProps={{
                            style: {
                                borderRadius: "16px",
                            },
                        }}
                    />
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <Select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            displayEmpty
                            sx={{ width: 150, borderRadius: "16px" }}
                        >
                            <MenuItem value="">All Status</MenuItem>
                            <MenuItem value="in stock">In Stock</MenuItem>
                            <MenuItem value="out of stock">Out of Stock</MenuItem>
                            <MenuItem value="discontinued">Discontinued</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Box>
            <BreadcrumbsComponent breadcrumbs={breadcrumbs} />
            <Modal open={open} onClose={handleClose}>
                <Box sx={{ ...style, width: 900, borderRadius: "16px" }}>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
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
                        Add New Item
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <TextField
                                    label="Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    required
                                    InputProps={{
                                        style: { borderRadius: "16px" },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    required
                                    InputProps={{
                                        style: { borderRadius: "16px" },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    required
                                    InputProps={{
                                        style: { borderRadius: "16px" },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Quantity"
                                    name="quantity"
                                    type="number"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    required
                                    InputProps={{
                                        style: { borderRadius: "16px" },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Price"
                                    name="price"
                                    type="number"
                                    value={formData.price}
                                    onChange={handleChange}
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    required
                                    InputProps={{
                                        style: { borderRadius: "16px" },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Cost"
                                    name="cost"
                                    type="number"
                                    value={formData.cost}
                                    onChange={handleChange}
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    required
                                    InputProps={{
                                        style: { borderRadius: "16px" },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Min Stock Level"
                                    name="min_stock_level"
                                    type="number"
                                    value={formData.min_stock_level}
                                    onChange={handleChange}
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    required
                                    InputProps={{
                                        style: { borderRadius: "16px" },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Reorder Point"
                                    name="reorder_point"
                                    type="number"
                                    value={formData.reorder_point}
                                    onChange={handleChange}
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    required
                                    InputProps={{
                                        style: { borderRadius: "16px" },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Supplier"
                                    name="supplier"
                                    value={formData.supplier}
                                    onChange={handleChange}
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    required
                                    InputProps={{
                                        style: { borderRadius: "16px" },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <FormControl fullWidth margin="normal">
                                    <Select name="warehouse" value={formData.warehouse} onChange={handleSelectChange} size="small" label="Role">
                                        <MenuItem value="" disabled>
                                            Select Role
                                        </MenuItem>
                                        {warehouses.map((warehouse) => (
                                            <MenuItem key={warehouse.warehouse_id} value={warehouse.warehouse_id}>
                                                {warehouse.warehouse_id}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Date Added"
                                    name="dateAdded"
                                    type="date"
                                    value={formData.dateAdded}
                                    onChange={handleChange}
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    InputLabelProps={{ shrink: true }}
                                    required
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Expiry Date"
                                    name="expiryDate"
                                    type="date"
                                    value={formData.expiryDate}
                                    onChange={handleChange}
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <InputLabel id="status-label">Status</InputLabel>
                                <Select
                                    labelId="status-label"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    required
                                >
                                    <MenuItem value="in stock">In Stock</MenuItem>
                                    <MenuItem value="out of stock">Out of Stock</MenuItem>
                                    <MenuItem value="discontinued">Discontinued</MenuItem>
                                </Select>
                            </Grid>
                            <Grid item xs={12}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                    }}
                                >
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        sx={{
                                            width: "150px",
                                            borderRadius: "16px",
                                            backgroundColor: "#000000",
                                            "&:hover": {
                                                backgroundColor: "#424242",
                                            },
                                        }}
                                    >
                                        Add
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Modal>
            <Box
                sx={{
                    height: 636,
                    width: "100%",
                    maxWidth: "calc(100vw - 280px)",
                    marginTop: 2,
                    overflowX: "auto",
                }}
            >
                <DataGrid
                    className="custom-data-grid"
                    rows={rows}
                    columns={columns}
                    getRowId={(row) => row._id}
                    paginationMode="server"
                    rowCount={totalCount}
                    pageSizeOptions={[10, 25, 50]}
                    paginationModel={{
                        page: currentPage - 1,
                        pageSize: pageSize,
                    }}
                    onPaginationModelChange={(model) => {
                        setCurrentPage(model.page + 1);
                        setPageSize(model.pageSize);
                    }}
                    disableRowSelectionOnClick
                    checkboxSelection
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
