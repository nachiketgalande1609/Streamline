import React, { useEffect, useState } from "react";
import { Box, Button, TextField, Typography, Snackbar, Alert } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import BreadcrumbsComponent from "../parts/BreadcrumbsComponent";

const FinancialReconciliation = () => {
    const today = new Date();
    const [reconMonth, setReconMonth] = useState(today.getMonth() + 1); // getMonth() returns 0-indexed month
    const [reconYear, setReconYear] = useState(today.getFullYear());
    const [reconciliations, setReconciliations] = useState([]);
    const [alertOpen, setAlertOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");
    const [loading, setLoading] = useState(true);

    const breadcrumbs = [
        { label: "Home", path: "/" },
        { label: "Reconciliation", path: "" },
    ];

    const fetchReconciliations = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/recon?recon_month=${reconMonth}&recon_year=${reconYear}`);
            setReconciliations(response.data.data); // Adjust based on response structure
        } catch (error) {
            console.error("Error fetching reconciliations:", error);
            setMessage("Failed to fetch reconciliations.");
            setSeverity("error");
            setAlertOpen(true);
        } finally {
            setLoading(false);
        }
    };

    // Define the columns for the DataGrid for reconciliations
    const reconciliationColumns = [
        { field: "reconciliationId", headerName: "Reconciliation ID", flex: 1 },
        { field: "recon_month", headerName: "Reconciliation Month", flex: 1 },
        { field: "recon_year", headerName: "Reconciliation Year", flex: 1 },
        { field: "totalIncome", headerName: "Total Income", flex: 1, type: "number" },
        { field: "totalExpenses", headerName: "Total Expenses", flex: 1, type: "number" },
        { field: "totalReconciled", headerName: "Total Reconciled", flex: 1, type: "number" },
        { field: "createdBy", headerName: "Created By", flex: 1 },
        { field: "updatedBy", headerName: "Updated By", flex: 1 },
    ];

    return (
        <div>
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="h5" gutterBottom sx={{ flexGrow: 1 }}>
                    Sales
                </Typography>
            </Box>
            <BreadcrumbsComponent breadcrumbs={breadcrumbs} />

            <Box sx={{ display: "flex", gap: 2, marginBottom: 2, marginTop: 2, justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField
                        type="number"
                        label="Reconciliation Month"
                        value={reconMonth}
                        size="small"
                        onChange={(e) => setReconMonth(e.target.value)}
                        sx={{ width: "200px" }}
                        InputProps={{ style: { borderRadius: "16px" }, inputProps: { min: 1, max: 12 } }}
                    />
                    <TextField
                        type="number"
                        label="Reconciliation Year"
                        value={reconYear}
                        size="small"
                        onChange={(e) => setReconYear(e.target.value)}
                        sx={{ width: "200px" }}
                        InputProps={{ style: { borderRadius: "16px" }, inputProps: { min: 1900, max: 2100 } }}
                    />
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                        variant="contained"
                        onClick={fetchReconciliations}
                        size="small"
                        sx={{
                            borderRadius: "16px",
                            backgroundColor: "#000000",
                            "&:hover": {
                                backgroundColor: "#424242",
                            },
                        }}
                    >
                        Fetch Reconciliations
                    </Button>
                </Box>
            </Box>
            <Box
                sx={{
                    height: 636,
                    width: "100%",
                    maxWidth: "calc(100vw - 280px)",
                    marginTop: 2,
                    overflowX: "auto", // Enable horizontal scrolling if content overflows
                }}
            >
                <DataGrid
                    className="custom-data-grid"
                    rows={reconciliations}
                    columns={reconciliationColumns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    disableRowSelectionOnClick
                    getRowId={(row) => row._id}
                    disableColumnMenu
                />
            </Box>
            <Snackbar open={alertOpen} autoHideDuration={6000} onClose={() => setAlertOpen(false)}>
                <Alert onClose={() => setAlertOpen(false)} severity={severity}>
                    {message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default FinancialReconciliation;
