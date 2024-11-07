import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { Box, Typography, Snackbar, Button, Alert, Tooltip } from "@mui/material";
import BreadcrumbsComponent from "../parts/BreadcrumbsComponent";
import { useNavigate } from "react-router-dom";

export default function TicketTable() {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [alertOpen, setAlertOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const [totalCount, setTotalCount] = useState(0);

    const breadcrumbs = [
        { label: "Home", path: "/" },
        { label: "Incidents", path: "" },
    ];

    useEffect(() => {
        // Fetch data from the API
        const fetchTickets = async () => {
            setLoading(true);
            try {
                const response = await axios.get("/api/tickets");
                if (response.data.success) {
                    setTickets(response.data.data);
                    setTotalCount(response.data.totalCount);
                }
            } catch (error) {
                console.error("Error fetching tickets", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    const handleAlertClose = () => {
        setAlertOpen(false);
    };

    const columns = [
        {
            field: "ticketId",
            headerName: "Ticket ID",
            flex: 1,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => (
                <Tooltip title="View Ticket" arrow>
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate(`/incidents/${params.value}`);
                        }}
                        style={{
                            textDecoration: "none",
                            fontWeight: "bold",
                            color: "#1976d2",
                        }} // Adjust color to your theme
                    >
                        {params.value}
                    </a>
                </Tooltip>
            ),
        },
        {
            field: "subject",
            headerName: "Subject",
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "issueType",
            headerName: "Issue Type",
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "department",
            headerName: "Department",
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "priority",
            headerName: "Priority",
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
        },
        {
            field: "createdAt",
            headerName: "Created Date",
            width: 200,
            valueGetter: (params) => new Date(params).toLocaleDateString(),
            headerAlign: "center",
            align: "center",
        },
    ];

    return (
        <div>
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="h5" gutterBottom sx={{ flexGrow: 1 }}>
                    Incidents
                </Typography>
            </Box>
            <BreadcrumbsComponent breadcrumbs={breadcrumbs} />
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
                    rows={tickets}
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
