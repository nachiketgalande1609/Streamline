import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Chip from "@mui/material/Chip";
import { Close } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import Grid from "@mui/material/Grid";
import BreadcrumbsComponent from "../parts/BreadcrumbsComponent";
import * as Papa from "papaparse";

import {
    Modal,
    Box,
    Typography,
    TextField,
    Select,
    MenuItem,
    Button,
    FormControl,
    InputLabel,
    Snackbar,
    Alert,
    IconButton,
    Tooltip,
    InputAdornment,
    CircularProgress,
} from "@mui/material";

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
        on_hand_quantity: "",
        price: "",
        cost: "",
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
    const [searching, setSearching] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
    const [statusFilter, setStatusFilter] = useState("");
    const [totalCount, setTotalCount] = useState(0);

    const [selectedIds, setSelectedIds] = useState([]);
    const [bulkEditOpen, setBulkEditOpen] = useState(false);
    const [bulkEditData, setBulkEditData] = useState({
        status: "",
        supplier: "",
        category: "",
        price: "",
        cost: "",
    });
    const [statusLOV, setStatusLOV] = useState([]);
    const [suppliersLOV, setSuppliersLOV] = useState([]);
    const [categoriesLOV, setCategoriesLOV] = useState([]);

    const breadcrumbs = [
        { label: "Home", path: "/" },
        { label: "Inventory", path: "" },
    ];

    const getEditLOVOptions = async () => {
        const response = await axios.get("/api/inventory/options");
        if (response?.data?.success) {
            setStatusLOV(response?.data?.data?.statuses);
            setSuppliersLOV(response?.data?.data?.suppliers);
            setCategoriesLOV(response?.data?.data?.categories);
        }
    };

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
            setSearching(false);
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

    useEffect(() => {
        if (bulkEditOpen) {
            getEditLOVOptions();
        }
    }, [bulkEditOpen]);

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
                    "on_hand_quantity",
                    "price",
                    "cost",
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

    const handleClose = () => {
        setOpen(false);
        setBulkEditOpen();
    };

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

    const handleBulkEditOpen = () => {
        setBulkEditOpen(true);
    };

    const handleBulkEditClose = () => {
        setBulkEditOpen(false);
    };

    const handleBulkEditChange = (e) => {
        setBulkEditData({
            ...bulkEditData,
            [e.target.name]: e.target.value,
        });
    };

    const handleBulkEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.patch("/api/inventory/bulk-edit", {
                ids: selectedIds,
                ...bulkEditData,
            });
            fetchInventoryData(currentPage, pageSize, debouncedSearchQuery, statusFilter);
            handleBulkEditClose();
        } catch (error) {
            console.error("Error updating items:", error);
        }
    };

    const AddItemModal = () => {
        return (
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
                                    label="On-Hand Quantity"
                                    name="on_hand_quantity"
                                    type="number"
                                    value={formData.on_hand_quantity}
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
                                    <Select
                                        name="warehouse"
                                        displayEmpty
                                        value={formData.warehouse}
                                        onChange={handleSelectChange}
                                        size="small"
                                        label="Role"
                                    >
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
        );
    };

    const EditModal = () => {
        return (
            <Modal open={bulkEditOpen} onClose={handleBulkEditClose}>
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
                        Bulk Edit Selected Items
                    </Typography>
                    <form onSubmit={handleBulkEditSubmit}>
                        {/* Common fields for bulk edit */}
                        <FormControl fullWidth margin="normal">
                            <Select
                                label="Status"
                                name="status"
                                value={bulkEditData.status}
                                onChange={handleBulkEditChange}
                                size="small"
                                fullWidth
                                margin="normal"
                                displayEmpty
                            >
                                <MenuItem value="" disabled>
                                    Select Status
                                </MenuItem>
                                {statusLOV.map((status) => (
                                    <MenuItem key={status} value={status}>
                                        {status}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <Select
                                label="Supplier"
                                name="supplier"
                                value={bulkEditData.supplier}
                                onChange={handleBulkEditChange}
                                size="small"
                                fullWidth
                                margin="normal"
                                displayEmpty
                            >
                                <MenuItem value="" disabled>
                                    Select Supplier
                                </MenuItem>
                                {suppliersLOV.map((supplier) => (
                                    <MenuItem key={supplier._id} value={supplier._id}>
                                        {supplier.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <Select
                                label="Category"
                                name="category"
                                value={bulkEditData.category}
                                onChange={handleBulkEditChange}
                                size="small"
                                fullWidth
                                margin="normal"
                                displayEmpty
                            >
                                <MenuItem value="" disabled>
                                    Select Category
                                </MenuItem>
                                {categoriesLOV.map((category) => (
                                    <MenuItem key={category} value={category}>
                                        {category}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            label="Price"
                            name="price"
                            type="number"
                            value={bulkEditData.price}
                            onChange={handleBulkEditChange}
                            size="small"
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Cost"
                            name="cost"
                            type="number"
                            value={bulkEditData.cost}
                            onChange={handleBulkEditChange}
                            size="small"
                            fullWidth
                            margin="normal"
                        />
                        {/* Add other fields as needed */}
                        <Button type="submit" variant="contained" color="primary">
                            Update
                        </Button>
                    </form>
                </Box>
            </Modal>
        );
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
                on_hand_quantity: "",
                price: "",
                cost: "",
                supplier: "",
                warehouse: "",
                dateAdded: "",
                expiryDate: "",
                status: "",
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
            width: 250,
            headerAlign: "left",
            align: "left",
        },
        {
            field: "description",
            headerName: "Description",
            width: 300,
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
            field: "on_hand_quantity",
            headerName: "On-hand Quantity",
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
                    <Tooltip title="Edit Selected Records" arrow>
                        <IconButton
                            size="small"
                            onClick={handleBulkEditOpen}
                            aria-label="Add Items"
                            disabled={selectedIds.length === 0}
                            sx={{ width: "40px" }}
                        >
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Add Items" arrow>
                        <IconButton size="small" onClick={handleOpen} aria-label="Add Items" sx={{ width: "40px" }}>
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Export Data" arrow>
                        <IconButton size="small" onClick={handleExport} aria-label="Export to CSV" sx={{ width: "40px" }}>
                            <FileDownloadIcon />
                        </IconButton>
                    </Tooltip>
                    <TextField
                        label="Search"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearching(true);
                            setSearchQuery(e.target.value);
                        }}
                        variant="outlined"
                        size="small"
                        sx={{ width: "250px" }}
                        InputProps={{
                            style: {
                                borderRadius: "16px",
                            },
                            endAdornment: <InputAdornment position="end">{searching ? <CircularProgress size={20} /> : null}</InputAdornment>,
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
            <Box
                sx={{
                    height: "calc(100vh - 220px)",
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
                    checkboxSelection
                    onRowSelectionModelChange={(newSelection) => {
                        setSelectedIds(newSelection);
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
                <Alert onClose={handleAlertClose} severity={severity} sx={{ width: "100%" }}>
                    {message}
                </Alert>
            </Snackbar>
            <AddItemModal />
            <EditModal />
        </div>
    );
}
