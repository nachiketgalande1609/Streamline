import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Typography, Divider, CircularProgress, Box, Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";
import BreadcrumbsComponent from "../parts/BreadcrumbsComponent";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const StyledCard = styled(Card)(({ theme }) => ({
    backgroundColor: "#ffffff", // Transparent card background
    color: "#FFFFFF", // White text
    borderRadius: "16px",
    boxShadow: "0px 4px 8px rgba(0,0,0,0.15)", // Softer shadow
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    border: "1px solid #333", // Border for a cleaner look
}));

const CardTitle = styled(Typography)({
    fontSize: "1rem",
    fontWeight: "bold",
    color: "#000", // Lighter color for the title
    marginBottom: "8px",
    textAlign: "center",
});

const CardValue = styled(Typography)({
    fontSize: "1.5rem",
    fontWeight: "500",
    color: "#000",
});

const StyledDivider = styled(Divider)({
    backgroundColor: "#3E3E3E",
    margin: "10px 0",
});

export default function Dashboard() {
    const [dashboardData, setDashboardData] = useState({
        userCount: 0,
        warehouseCount: 0,
        orderCount: 0,
        customerCount: 0,
        warehouse_summary: [],
    });

    const [loading, setLoading] = useState(true);

    const breadcrumbs = [{ label: "Home", path: "" }];

    const fetchData = () => {
        setLoading(true);
        axios
            .get("/api/dashboard")
            .then((response) => {
                if (response.data.success) {
                    setDashboardData(response.data.data);
                }
            })
            .catch((error) => {
                console.error("There was an error fetching the dashboard data!", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => fetchData(), []);

    const CountCards = () => {
        const cardDetails = [
            { title: "Total Users", value: dashboardData.userCount },
            { title: "Total Warehouses", value: dashboardData.warehouseCount },
            { title: "Total Orders", value: dashboardData.orderCount },
            { title: "Total Customers", value: dashboardData.customerCount },
            { title: "Total Tickets", value: dashboardData.ticketCount },
        ];

        return (
            <Box display="flex" flexWrap="wrap" justifyContent="space-between" sx={{ marginTop: "12px", gap: "16px" }}>
                {cardDetails.map((card, index) => (
                    <Box
                        key={index}
                        sx={{
                            flex: "1 1 calc(20% - 20px)", // Adjusting width
                        }}
                    >
                        <StyledCard>
                            <CardTitle>{card.title}</CardTitle>
                            <StyledDivider />
                            <CardValue>{card.value}</CardValue>
                        </StyledCard>
                    </Box>
                ))}
            </Box>
        );
    };

    const WarehouseGauge = () => {
        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    padding: "20px",
                    borderRadius: "16px",
                    boxShadow: "0px 4px 8px rgba(0,0,0,0.40)",
                    marginTop: "20px",
                    gap: "16px",
                }}
            >
                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Typography variant="h6">Warehouses</Typography>
                    <Tooltip title="This section provides a quick view of each warehouse's total and available capacity" placement="right">
                        <InfoOutlinedIcon sx={{ width: "20px", ml: 1, color: "#aaa" }} />
                    </Tooltip>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "16px",
                        overflowX: "auto",
                        paddingBottom: "20px",
                    }}
                >
                    {dashboardData.warehouse_summary.map((warehouse, index) => {
                        const stockPercentage = Math.round((warehouse.currentStock / warehouse.capacity) * 100);
                        const gaugeColor = stockPercentage > 70 ? "#FF5252" : stockPercentage > 50 ? "#FFC107" : "#4CAF50";

                        return (
                            <StyledCard key={index} sx={{ minWidth: "200px" }}>
                                <CardTitle>{`Warehouse ${warehouse.warehouse_id}`}</CardTitle>
                                <StyledDivider />
                                <Box position="relative" display="inline-flex">
                                    <CircularProgress
                                        variant="determinate"
                                        value={100}
                                        size={80}
                                        thickness={6}
                                        sx={{
                                            color: "#dbdbdb",
                                            position: "absolute",
                                        }}
                                    />
                                    <CircularProgress
                                        variant="determinate"
                                        value={stockPercentage}
                                        size={80}
                                        thickness={6}
                                        sx={{
                                            color: gaugeColor,
                                        }}
                                    />
                                    {/* Display Percentage at the Center */}
                                    <Box
                                        sx={{
                                            top: 0,
                                            left: 0,
                                            bottom: 0,
                                            right: 0,
                                            position: "absolute",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Typography variant="caption" component="div" color="textSecondary">
                                            {`${stockPercentage}%`}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Typography sx={{ marginTop: "10px", color: "#000" }}>
                                    {`Stock: ${warehouse.currentStock}/${warehouse.capacity}`}
                                </Typography>
                            </StyledCard>
                        );
                    })}
                </Box>
            </Box>
        );
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="calc(100vh - 120px)">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <div>
            <Typography variant="h5" sx={{ marginBottom: "12px" }}>
                Dashboard
            </Typography>
            <BreadcrumbsComponent breadcrumbs={breadcrumbs} />
            <CountCards />
            <WarehouseGauge />
        </div>
    );
}
