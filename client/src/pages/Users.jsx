import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { Box, Typography, Button, Snackbar, Alert, IconButton, MenuItem, FormControl, Select, Chip } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import BreadcrumbsComponent from "../parts/BreadcrumbsComponent";
import * as Papa from "papaparse";

export default function Users() {
    const [rows, setRows] = useState([]);
    const [alertOpen, setAlertOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const [totalCount, setTotalCount] = useState(0);

    const breadcrumbs = [
        { label: "Home", path: "/" },
        { label: "Users", path: "" },
    ];

    useEffect(() => {
        fetchData(selectedRole, selectedStatus, currentPage, pageSize);
    }, [selectedRole, selectedStatus, currentPage, pageSize]);

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            const response = await axios.get("/api/users/roles");
            setRoles(response.data.data);
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    const fetchData = async (role = "", status = "", page = 1, limit = 10) => {
        setLoading(true);
        try {
            const response = await axios.get("/api/users", {
                params: { role, status, page, limit },
            });
            setRows(response.data.data);
            setTotalCount(response.data.totalCount);
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
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
                columns: ["first_name", "last_name", "email", "status", "created_at", "updated_at", "phone_number", "role"],
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
    };

    const handleStatusChange = (event) => {
        const status = event.target.value;
        setSelectedStatus(status);
    };

    const columns = [
        {
            field: "profile_picture",
            headerName: "",
            width: 100,
            headerAlign: "center",
            align: "center",
            filterable: false,
            sortable: false,
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
                                ? `http://localhost:3001${params.value}`
                                : "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg" // Use a direct image URL here
                        }
                        alt="Profile"
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            objectFit: "cover",
                        }}
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

                return <Chip label={params.value} color={chipColor} sx={{ width: 100 }} />;
            },
        },
        {
            field: "created_at",
            headerName: "Joined",
            valueFormatter: (params) => formatDateTime(params),
            width: 200,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "last_login",
            headerName: "Last Login",
            valueFormatter: (params) => formatDateTime(params),
            width: 200,
            headerAlign: "center",
            align: "center",
        },
    ];

    return (
        <div>
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="h5" gutterBottom sx={{ flexGrow: 1 }}>
                    Users
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton size="small" onClick={handleExport} aria-label="Export to CSV" sx={{ width: "40px" }}>
                        <FileDownloadIcon />
                    </IconButton>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <Select
                            value={selectedStatus}
                            onChange={handleStatusChange}
                            displayEmpty
                            sx={{
                                borderRadius: "16px",
                            }}
                        >
                            <MenuItem value="">All Status</MenuItem>
                            <MenuItem value="active">Active</MenuItem>
                            <MenuItem value="inactive">Inactive</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <Select
                            value={selectedRole}
                            onChange={handleRoleChange}
                            displayEmpty
                            sx={{
                                borderRadius: "16px",
                            }}
                        >
                            <MenuItem value="">All Roles</MenuItem>
                            {roles.map((role) => (
                                <MenuItem key={role} value={role}>
                                    {role}
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
                    maxWidth: "calc(100vw - 280px)",
                    marginTop: 2,
                    overflowX: "auto", // Enable horizontal scrolling if content overflows
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
