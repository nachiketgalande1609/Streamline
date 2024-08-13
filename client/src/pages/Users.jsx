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
                setRows(response.data.data);
            } catch (error) {
                console.error("Error fetching inventory data:", error);
            }
        }
        fetchData();
    }, []);

    const columnNames = [
        { field: "name", headerName: "Name" },
        { field: "email", headerName: "Email" },
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
                    pageSizeOptions={[5]}
                    checkboxSelection
                    disableRowSelectionOnClick
                />
            </Box>
        </div>
    );
}
