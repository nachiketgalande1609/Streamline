import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import {
    Box,
    Typography,
    Button,
    Snackbar,
    Alert,
    IconButton,
    MenuItem,
    FormControl,
    Select,
    Chip,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import * as Papa from "papaparse";

export default function Users() {
    const [rows, setRows] = useState([]);
    const [alertOpen, setAlertOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState("");

    useEffect(() => {
        fetchRoles(); // Fetch roles when component mounts
        fetchData(); // Fetch user data when component mounts
    }, []);

    // Fetch roles from the backend or define them statically
    const fetchRoles = async () => {
        try {
            const response = await axios.get("/api/users/roles");
            setRoles(response.data.data);
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    // Fetch user data with optional role filtering
    const fetchData = async (role = "") => {
        try {
            const response = await axios.get("/api/users", {
                params: { role }, // Send selected role as query parameter
            });
            setRows(response.data.data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(); // Customize the format as needed
    };

    const handleAlertClose = () => {
        setAlertOpen(false);
    };

    const handleExport = async () => {
        try {
            const response = await axios.get("/api/users");
            const data = response.data.data;

            const csv = Papa.unparse(data, {
                header: true,
                columns: [
                    "first_name",
                    "last_name",
                    "email",
                    "status",
                    "created_at",
                    "updated_at",
                    "phone_number",
                    "role",
                ],
            });

            // Create a downloadable link
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "users.csv");
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

    const handleRoleChange = (event) => {
        const selectedRole = event.target.value;
        setSelectedRole(selectedRole);
        fetchData(selectedRole); // Fetch data filtered by the selected role
    };

    const columns = [
        {
            field: "profile_picture",
            headerName: "",
            width: 100,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                    }}
                >
                    <img
                        src={
                            params.value
                                ? params.value
                                : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" // Use a direct image URL here
                        }
                        alt="Profile"
                        style={{ width: 40, height: 40, borderRadius: "50%" }}
                    />
                </div>
            ),
        },
        {
            field: "first_name",
            headerName: "First Name",
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "last_name",
            headerName: "Last Name",
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "email",
            headerName: "Email",
            width: 250,
            headerAlign: "left",
            align: "left",
        },
        {
            field: "phone_number",
            headerName: "Phone Number",
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "role",
            headerName: "Role",
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "status",
            headerName: "Status",
            flex: 1,
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

                return (
                    <Chip
                        label={params.value}
                        color={chipColor}
                        sx={{ width: 100 }}
                    />
                );
            },
        },
        {
            field: "created_at",
            headerName: "Joined",
            valueFormatter: (params) => formatDate(params),
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "last_login",
            headerName: "Last Login",
            valueFormatter: (params) => formatDate(params),
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
    ];

    return (
        <div style={{ padding: 20 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography variant="h4" gutterBottom sx={{ flexGrow: 1 }}>
                    Users
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton
                        size="small"
                        onClick={handleExport}
                        aria-label="Export to CSV"
                    >
                        <FileDownloadIcon />
                    </IconButton>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <Select
                            value={selectedRole}
                            onChange={handleRoleChange}
                            displayEmpty
                        >
                            <MenuItem value="">
                                <em>All Roles</em>
                            </MenuItem>
                            {roles.map((role) => (
                                <MenuItem key={role} value={role}>
                                    {role}
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
