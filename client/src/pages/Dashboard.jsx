import React, { useEffect, useState } from "react";
import axios from "axios";
import { Grid, Card, CardContent, Typography, Divider, CircularProgress, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import BreadcrumbsComponent from "../parts/BreadcrumbsComponent";

const StyledCard = styled(Card)(({ theme, cardcolor }) => ({
    backgroundColor: "transparent", // Transparent card background
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
        ];

        return (
            <Grid container spacing={3} style={{ marginTop: "16px" }}>
                {cardDetails.map((card, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index} style={{ padding: "0 20px" }}>
                        <StyledCard>
                            <CardTitle>{card.title}</CardTitle>
                            <StyledDivider />
                            <CardValue>{card.value}</CardValue>
                        </StyledCard>
                    </Grid>
                ))}
            </Grid>
        );
    };

    const WarehouseGauge = () => {
        return (
            <Grid container spacing={3} marginTop={3}>
                {dashboardData.warehouse_summary.map((warehouse, index) => {
                    const stockPercentage = (warehouse.currentStock / warehouse.capacity) * 100;

                    // Dynamically set the gauge color based on stock levels
                    const gaugeColor = stockPercentage > 70 ? "#FF5252" : stockPercentage > 50 ? "#FFC107" : "#4CAF50";

                    return (
                        <Grid item xs={12} sm={6} md={2.4} lg={2.4} key={index}>
                            <StyledCard>
                                <CardTitle>{`Warehouse ${warehouse.warehouse_id}`}</CardTitle>
                                <StyledDivider />
                                <Box position="relative" display="inline-flex">
                                    <CircularProgress
                                        variant="determinate"
                                        value={100} // To create the full background track
                                        size={80}
                                        thickness={6}
                                        sx={{
                                            color: "#dbdbdb", // Color of the track
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
                                </Box>
                                <Typography
                                    sx={{ marginTop: "10px", color: "#000" }}
                                >{`Stock: ${warehouse.currentStock}/${warehouse.capacity}`}</Typography>
                            </StyledCard>
                        </Grid>
                    );
                })}
            </Grid>
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
