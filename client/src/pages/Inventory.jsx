import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import axios from "axios";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import AddIcon from "@mui/icons-material/Add";
import Grid from "@mui/material/Grid";

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

    const fetchInventoryData = async () => {
        try {
            const response = await axios.get("/api/inventory");
            setRows(response.data.data);
        } catch (error) {
            console.error("Error fetching inventory data:", error);
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
        fetchInventoryData();
    }, []);

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

    const columnNames = [
        { field: "name", headerName: "Name" },
        { field: "description", headerName: "Description" },
        { field: "category", headerName: "Category" },
        { field: "quantity", headerName: "Quantity", type: "number" },
        { field: "price", headerName: "Price", type: "number" },
        { field: "cost", headerName: "Cost", type: "number" },
        {
            field: "min_stock_level",
            headerName: "Min Stock Level",
            type: "number",
        },
        { field: "reorder_point", headerName: "Reorder Point", type: "number" },
        { field: "supplier", headerName: "Supplier" },
        { field: "warehouse", headerName: "Warehouse" },
        {
            field: "dateAdded",
            headerName: "Date Added",
            valueFormatter: (params) => formatDate(params),
        },
        {
            field: "expiryDate",
            headerName: "Expiry Date",
            valueFormatter: (params) => formatDate(params),
        },
        { field: "status", headerName: "Status" },
    ];

    const columns = columnNames.map((col) => ({
        ...col,
        flex: 1,
        headerAlign: "left",
        align: "left",
    }));

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Inventory Management
            </Typography>
            <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleOpen}
            >
                Add Items
            </Button>
            <Modal open={open} onClose={handleClose}>
                <Box sx={{ ...style, width: 900 }}>
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
                                    fullWidth
                                    margin="normal"
                                    required
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    required
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    required
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Quantity"
                                    name="quantity"
                                    type="number"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    required
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Price"
                                    name="price"
                                    type="number"
                                    value={formData.price}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    required
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Cost"
                                    name="cost"
                                    type="number"
                                    value={formData.cost}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    required
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Min Stock Level"
                                    name="min_stock_level"
                                    type="number"
                                    value={formData.min_stock_level}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    required
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Reorder Point"
                                    name="reorder_point"
                                    type="number"
                                    value={formData.reorder_point}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    required
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Supplier"
                                    name="supplier"
                                    value={formData.supplier}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    required
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <InputLabel>Warehouse</InputLabel>
                                <Select
                                    value={formData.warehouse}
                                    onChange={handleSelectChange}
                                    fullWidth
                                    name="warehouse"
                                    margin="normal"
                                    required
                                >
                                    {warehouses.map((warehouse) => (
                                        <MenuItem
                                            key={warehouse.warehouse_id}
                                            value={warehouse.warehouse_id}
                                        >
                                            {warehouse.warehouse_id}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Date Added"
                                    name="dateAdded"
                                    type="date"
                                    value={formData.dateAdded}
                                    onChange={handleChange}
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
                                    fullWidth
                                    margin="normal"
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    required
                                >
                                    <MenuItem value="in stock">
                                        In Stock
                                    </MenuItem>
                                    <MenuItem value="out of stock">
                                        Out of Stock
                                    </MenuItem>
                                    <MenuItem value="discontinued">
                                        Discontinued
                                    </MenuItem>
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
                                    >
                                        Add
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Modal>
            <Box sx={{ height: 631, width: "100%", marginTop: 2 }}>
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
        </div>
    );
}

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};
