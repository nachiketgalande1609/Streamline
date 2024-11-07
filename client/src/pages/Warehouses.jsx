import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import {
    Modal,
    Box,
    Typography,
    Button,
    Snackbar,
    Alert,
    IconButton,
    FormControl,
    Select,
    MenuItem,
    Grid,
    TextField,
    Chip,
    Tooltip,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import AddIcon from "@mui/icons-material/Add";
import { Close } from "@mui/icons-material";
import BreadcrumbsComponent from "../parts/BreadcrumbsComponent";

import * as Papa from "papaparse";

export default function Warehouses() {
    const [rows, setRows] = useState([]);
    const [alertOpen, setAlertOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");
    const [statuses, setStatuses] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        warehouse_id: "",
        name: "",
        location: "",
        capacity: "",
        current_stock: "",
        contact_number: "",
        status: "",
        manager_id: "",
        manager_name: "",
    });

    const breadcrumbs = [
        { label: "Home", path: "/" },
        { label: "Warehouses", path: "" },
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        fetchData(selectedStatus, currentPage, pageSize);
    }, [selectedStatus, currentPage, pageSize]);

    useEffect(() => {
        fetchStatuses();
    }, []);

    const fetchStatuses = async () => {
        try {
            const response = await axios.get("/api/warehouse/status");
            setStatuses(response.data.data);
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    const fetchData = async (status = "", page = 1, limit = 10) => {
        setLoading(true);
        try {
            const response = await axios.get("/api/warehouse", {
                params: { page, limit, status },
            });
            const warehouseDetails = response.data.data.map((warehouse) => ({
                ...warehouse,
                managerName: warehouse.managerInfo?.first_name + " " + warehouse.managerInfo?.last_name || "N/A",
                managerNumber: warehouse.managerInfo?.phone_number || "N/A",
                managerEmail: warehouse.managerInfo?.email || "N/A",
            }));
            setRows(warehouseDetails);
            setTotalCount(response.data.totalCount);
        } catch (error) {
            console.error("Error fetching warehouse data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (event) => {
        const selectedStatus = event.target.value;
        setSelectedStatus(selectedStatus);
        fetchData(selectedStatus);
    };

    const handleAlertClose = () => {
        setAlertOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleExport = async () => {
        try {
            const response = await axios.get("/api/warehouse");
            const data = response.data.data;

            const csv = Papa.unparse(data, {
                header: true,
                columns: ["warehouse_id", "name", "location", "capacity", "current_stock", "contact_number", "status", "manager_name"],
            });

            // Create a downloadable link
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "warehouse.csv");
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
            field: "status",
            headerName: "Status",
            width: 100,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => {
                let chipColor;
                if (params.value === "active") {
                    chipColor = "success";
                } else if (params.value === "inactive") {
                    chipColor = "error";
                } else {
                    chipColor = "default";
                }

                return <Chip label={params.value} color={chipColor} sx={{ width: 100 }} />;
            },
        },
        {
            field: "warehouse_id",
            headerName: "Warehouse ID",
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "name",
            headerName: "Name",
            flex: 1,
            headerAlign: "left",
            align: "left",
        },
        {
            field: "location",
            headerName: "Location",
            flex: 1,
            headerAlign: "left",
            align: "left",
        },
        {
            field: "capacity",
            headerName: "Capacity",
            type: "number",
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "current_stock",
            headerName: "Current Stock",
            type: "number",
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "managerName",
            headerName: "Manager",
            flex: 1,
            headerAlign: "left",
            align: "left",
        },
        {
            field: "managerNumber",
            headerName: "Manager Contact",
            flex: 1,
            headerAlign: "left",
            align: "left",
        },
        {
            field: "managerEmail",
            headerName: "Manager Email",
            flex: 1,
            headerAlign: "left",
            align: "left",
        },
        {
            field: "contact_number",
            headerName: "Contact Number",
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/api/warehouse", formData);
            fetchData();
            handleClose();
            setMessage("Warehouse added successfully!");
            setSeverity("success");
            setAlertOpen(true);
            setFormData({
                warehouse_id: "",
                name: "",
                location: "",
                capacity: "",
                current_stock: "",
                contact_number: "",
                status: "",
                manager_id: "",
                manager_name: "",
            });
        } catch (error) {
            console.error("Error adding item to inventory:", error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div>
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="h5" gutterBottom sx={{ flexGrow: 1 }}>
                    Warehouses
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                    <Tooltip title="Add Warehouse" arrow>
                        <IconButton size="small" onClick={handleOpen} aria-label="Add Items" sx={{ width: "40px" }}>
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
                            <MenuItem value="">All Warehouses</MenuItem>
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
                    overflowX: "auto",
                }}
            >
                <DataGrid
                    className="custom-data-grid"
                    rows={rows}
                    columns={columns}
                    getRowId={(row) => row.warehouse_id}
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
            <Modal open={open} onClose={handleClose}>
                <Box sx={{ ...style, width: 900 }}>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                            borderRadius: "16px",
                        }}
                    >
                        <Close />
                    </IconButton>
                    <Typography variant="h6" component="h2">
                        Add New Warehouse
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <TextField
                                    label="Warehouse ID"
                                    name="warehouse_id"
                                    value={formData.warehouse_id}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    required
                                    size="small"
                                    InputProps={{
                                        style: { borderRadius: "16px" },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    required
                                    size="small"
                                    InputProps={{
                                        style: { borderRadius: "16px" },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    required
                                    size="small"
                                    InputProps={{
                                        style: { borderRadius: "16px" },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Capacity"
                                    name="capacity"
                                    type="number"
                                    value={formData.capacity}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    required
                                    size="small"
                                    InputProps={{
                                        style: { borderRadius: "16px" },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Contact Number"
                                    name="contact_number"
                                    value={formData.contact_number}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    required
                                    size="small"
                                    InputProps={{
                                        style: { borderRadius: "16px" },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <FormControl fullWidth size="small" margin="normal">
                                    <Select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        displayEmpty
                                        sx={{
                                            borderRadius: "16px",
                                        }}
                                    >
                                        <MenuItem value="" disabled>
                                            Select Status
                                        </MenuItem>
                                        {statuses.map((status) => (
                                            <MenuItem key={status} value={status}>
                                                {status}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Manager ID"
                                    name="manager_id"
                                    value={formData.manager_id}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    required
                                    size="small"
                                    InputProps={{
                                        style: { borderRadius: "16px" },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Manager Name"
                                    name="manager_name"
                                    value={formData.manager_name}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    required
                                    size="small"
                                    InputProps={{
                                        style: { borderRadius: "16px" },
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                mt: 2,
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
                                {"Add"}
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Modal>
        </div>
    );
}

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: "16px",
};
