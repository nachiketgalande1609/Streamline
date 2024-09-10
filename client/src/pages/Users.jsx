import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";

export default function Users() {
    const [rows, setRows] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get("/api/users");
                setRows(response.data.data); // Ensure this matches the API response structure
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }
        fetchData();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(); // Customize the format as needed
    };

    const columnNames = [
        {
            field: "profile_picture",
            headerName: "",
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
                        src={params.value}
                        alt="Profile"
                        style={{ width: 50, height: 50, borderRadius: "50%" }}
                    />
                </div>
            ),
        },
        { field: "first_name", headerName: "First Name" },
        { field: "last_name", headerName: "Last Name" },
        { field: "email", headerName: "Email" },
        { field: "phone_number", headerName: "Phone Number" },
        { field: "role", headerName: "Role" },
        { field: "status", headerName: "Status" },
        {
            field: "created_at",
            headerName: "Joined",
            valueFormatter: (params) => formatDate(params),
        },
        {
            field: "last_login",
            headerName: "Last Login",
            valueFormatter: (params) => formatDate(params),
        },
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
                Users
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
                    pageSizeOptions={[5, 10, 20]}
                    checkboxSelection
                    disableRowSelectionOnClick
                />
            </Box>
        </div>
    );
}
