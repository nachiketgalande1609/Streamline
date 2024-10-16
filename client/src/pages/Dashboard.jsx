import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Divider,
    CircularProgress,
    Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import BreadcrumbsComponent from "../parts/BreadcrumbsComponent";

const StyledCard = styled(Card)(({ theme, cardcolor }) => ({
    backgroundColor: cardcolor || "#1E1E1E", // Dark card background
    color: "#FFFFFF", // White text
    borderRadius: "16px",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
}));

const CardTitle = styled(Typography)({
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: "8px",
});

const CardValue = styled(Typography)({
    fontSize: "2rem",
    fontWeight: "600",
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

    const breadcrumbs = [{ label: "Home", path: "" }];

    const fetchData = () => {
        axios
            .get("/api/dashboard")
            .then((response) => {
                if (response.data.success) {
                    setDashboardData(response.data.data);
                }
            })
            .catch((error) => {
                console.error(
                    "There was an error fetching the dashboard data!",
                    error
                );
            });
    };

    useEffect(() => fetchData(), []);

    // Color mappings for the cards
    const cardColors = ["#4CAF50", "#FF9800", "#2196F3", "#F44336"];

    const CountCards = () => {
        const cardDetails = [
            { title: "Total Users", value: dashboardData.userCount },
            { title: "Total Warehouses", value: dashboardData.warehouseCount },
            { title: "Total Orders", value: dashboardData.orderCount },
            { title: "Total Customers", value: dashboardData.customerCount },
        ];

        return (
            <Grid container spacing={3}>
                {cardDetails.map((card, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <StyledCard cardcolor={cardColors[index]}>
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
                    const stockPercentage =
                        (warehouse.currentStock / warehouse.capacity) * 100;

                    // Dynamically set the gauge color based on stock levels
                    const gaugeColor =
                        stockPercentage > 70
                            ? "#FF5252"
                            : stockPercentage > 50
                            ? "#FFC107"
                            : "#4CAF50";

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
                                <Typography sx={{ marginTop: "30px" }}>
                                    {`Stock: ${warehouse.currentStock}/${warehouse.capacity}`}
                                </Typography>
                            </StyledCard>
                        </Grid>
                    );
                })}
            </Grid>
        );
    };

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
