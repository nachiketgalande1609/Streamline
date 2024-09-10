import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";

export default function Warehouses() {
    const [rows, setRows] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get("/api/warehouse");
                setRows(response.data.data);
            } catch (error) {
                console.error("Error fetching warehouse data:", error);
            }
        }
        fetchData();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(); // Customize the format as needed
    };

    const columnNames = [
        { field: "warehouse_id", headerName: "Warehouse ID" },
        { field: "name", headerName: "Name" },
        { field: "location", headerName: "Location" },
        { field: "capacity", headerName: "Capacity", type: "number" },
        { field: "current_stock", headerName: "Current Stock", type: "number" },
        { field: "contact_number", headerName: "Contact Number" },
        { field: "status", headerName: "Status" },
        { field: "manager_name", headerName: "Manager" }, // Assuming you will populate this field with manager's name
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
                Warehouses
            </Typography>
            <Box sx={{ height: 631, width: "100%" }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    getRowId={(row) => row.warehouse_id}
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
