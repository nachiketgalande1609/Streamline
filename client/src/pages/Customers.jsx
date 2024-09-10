import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";

export default function Customers() {
    const [rows, setRows] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get("/api/customers");
                setRows(response.data.data); // Ensure this matches the API response structure
            } catch (error) {
                console.error("Error fetching customer data:", error);
            }
        }
        fetchData();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(); // Customize the format as needed
    };

    const columnNames = [
        { field: "customer_name", headerName: "Customer Name" },
        { field: "contact_number", headerName: "Contact Number" },
        { field: "email", headerName: "Email" },
        { field: "address", headerName: "Address" },
        { field: "city", headerName: "City" },
        { field: "state", headerName: "State" },
        { field: "zip_code", headerName: "Zip Code" },
        { field: "country", headerName: "Country" },
        { field: "company_name", headerName: "Company Name" },
        { field: "customer_type", headerName: "Customer Type" },
        { field: "credit_limit", headerName: "Credit Limit" },
        { field: "balance_due", headerName: "Balance Due" },
        {
            field: "created_at",
            headerName: "Created At",
            valueFormatter: (params) => formatDate(params),
        },
        {
            field: "updated_at",
            headerName: "Updated At",
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
                Customers
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
