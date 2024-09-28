import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import axios from "axios";
import {
    IconButton,
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    Snackbar,
    Alert,
    Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import * as Papa from "papaparse";

export default function Customers() {
    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");

    const [formData, setFormData] = useState({});
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentCustomerId, setCurrentCustomerId] = useState(null);

    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        bgcolor: "background.paper",
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await axios.get("/api/customers");
            setRows(response.data.data); // Ensure this matches the API response structure
        } catch (error) {
            console.error("Error fetching customer data:", error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(); // Customize the format as needed
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/customers/${id}`);
            fetchCustomers();
        } catch (error) {
            console.error("Error deleting customer:", error);
        }
    };

    const handleEdit = (id) => {
        const customer = rows.find((row) => row._id === id);
        if (customer) {
            setFormData({
                customerName: customer.customer_name,
                contactNumber: customer.contact_number,
                email: customer.email,
                address: customer.address,
                city: customer.city,
                state: customer.state,
                zipCode: customer.zip_code,
                country: customer.country,
                customerType: customer.customer_type,
                companyName: customer.company_name,
                creditLimit: customer.credit_limit,
                balanceDue: customer.balance_due,
            });
            setCurrentCustomerId(id);
            setIsEditMode(true);
            setOpen(true);
        }
    };

    const handleOpen = () => {
        setFormData({
            customerName: "",
            contactNumber: "",
            email: "",
            address: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
            customerType: "",
            companyName: "",
            creditLimit: "",
            balanceDue: "",
        });
        setIsEditMode(false);
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleAlertClose = () => {
        setAlertOpen(false);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                await axios.put(
                    `/api/customers/${currentCustomerId}`,
                    formData
                );
            } else {
                await axios.post("/api/customers", formData);
            }
            fetchCustomers();
            handleClose();
        } catch (error) {
            console.error("Error saving customer data:", error);
        }
    };

    const handleExport = async () => {
        try {
            const response = await axios.get("/api/customers");
            const data = response.data.data;

            const csv = Papa.unparse(data, {
                header: true,
                columns: [
                    "customer_name",
                    "contact_number",
                    "email",
                    "address",
                    "city",
                    "state",
                    "zip_code",
                    "country",
                    "company_name",
                    "customer_type",
                    "credit_limit",
                    "balance_due",
                    "created_at",
                    "updated_at",
                ],
            });

            // Create a downloadable link
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "customers.csv");
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
                    <Tooltip title="Delete" arrow>
                        <IconButton
                            onClick={() => handleDelete(params.row._id)}
                            aria-label="Delete"
                            sx={{
                                color: "error.main",
                                "&:hover": {
                                    backgroundColor: "action.hover",
                                },
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit" arrow>
                        <IconButton
                            onClick={() => handleEdit(params.row._id)}
                            aria-label="Edit"
                            sx={{
                                color: "primary.main",
                                "&:hover": {
                                    backgroundColor: "action.hover",
                                },
                            }}
                        >
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            ),
            width: 150,
            headerAlign: "center",
            align: "center",
        },

        {
            field: "customer_name",
            headerName: "Customer Name",
            width: 150,
            headerAlign: "left",
            align: "left",
        },
        {
            field: "contact_number",
            headerName: "Contact Number",
            width: 150,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "email",
            headerName: "Email",
            width: 150,
            headerAlign: "left",
            align: "left",
        },
        {
            field: "address",
            headerName: "Address",
            width: 150,
            headerAlign: "left",
            align: "left",
        },
        {
            field: "city",
            headerName: "City",
            width: 100,
            headerAlign: "left",
            align: "left",
        },
        {
            field: "state",
            headerName: "State",
            width: 100,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "zip_code",
            headerName: "Zip Code",
            width: 150,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "country",
            headerName: "Country",
            width: 150,
            headerAlign: "left",
            align: "left",
        },
        {
            field: "company_name",
            headerName: "Company Name",
            width: 150,
            headerAlign: "left",
            align: "left",
        },
        {
            field: "customer_type",
            headerName: "Customer Type",
            width: 150,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "credit_limit",
            headerName: "Credit Limit",
            width: 150,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "balance_due",
            headerName: "Balance Due",
            width: 150,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "created_at",
            headerName: "Created At",
            valueFormatter: (params) => formatDate(params),
            width: 150,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "updated_at",
            headerName: "Updated At",
            valueFormatter: (params) => formatDate(params),
            width: 150,
            headerAlign: "center",
            align: "center",
        },
    ];

    return (
        <div style={{ padding: 20 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography variant="h4" gutterBottom sx={{ flexGrow: 1 }}>
                    Customers
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton
                        size="small"
                        onClick={handleOpen}
                        aria-label="Add Items"
                        sx={{ mr: 1 }}
                    >
                        <AddIcon />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={handleExport}
                        aria-label="Export to CSV"
                    >
                        <FileDownloadIcon />
                    </IconButton>
                </Box>
            </Box>
            <Modal open={open} onClose={handleClose}>
                <Box sx={{ ...style, width: 900 }}>
                    <Typography variant="h6" component="h2">
                        {isEditMode ? "Edit Customer" : "Add New Customer"}
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <TextField
                                    label="Customer Name"
                                    name="customerName"
                                    value={formData.customerName}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    required
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Contact Number"
                                    name="contactNumber"
                                    value={formData.contactNumber}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    required
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    required
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    required
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="City"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    required
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="State"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    required
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Zip Code"
                                    name="zipCode"
                                    value={formData.zipCode}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    required
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Country"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    required
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Customer Type"
                                    name="customerType"
                                    value={formData.customerType}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    required
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Company Name"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    required
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Credit Limit"
                                    name="creditLimit"
                                    type="number"
                                    value={formData.creditLimit}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    required
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Balance Due"
                                    name="balanceDue"
                                    type="number"
                                    value={formData.balanceDue}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    size="small"
                                />
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
                                        {isEditMode ? "Update" : "Add"}
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Modal>
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
                    getRowId={(row) => row._id}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 10,
                            },
                        },
                    }}
                    pageSizeOptions={[5, 10, 20]}
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