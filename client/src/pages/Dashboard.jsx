import React, { useEffect, useState } from "react";
import axios from "axios";
import { Grid, Card, CardContent, Typography, Divider } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledCard = styled(Card)(({ theme }) => ({
    backgroundColor: "#1d282d", // Dark background color
    color: "#FFFFFF", // White text color
    boxShadow: theme.shadows[5],
}));

const CardTitle = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(1),
}));

const CardValue = styled(Typography)(({ theme }) => ({
    fontSize: "1.2rem",
}));

export default function Dashboard() {
    const [dashboardData, setDashboardData] = useState({
        userCount: 0,
        warehouseCount: 0,
        orderCount: 0,
    });

    useEffect(() => {
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
    }, []);

    return (
        <div style={{ padding: 20 }}>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <StyledCard>
                        <CardContent>
                            <CardTitle>Total Users</CardTitle>
                            <Divider
                                sx={{ marginY: 2, borderColor: "#FFFFFF" }}
                            />
                            <CardValue>{dashboardData.userCount}</CardValue>
                        </CardContent>
                    </StyledCard>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <StyledCard>
                        <CardContent>
                            <CardTitle>Total Warehouses</CardTitle>
                            <Divider
                                sx={{ marginY: 2, borderColor: "#FFFFFF" }}
                            />
                            <CardValue>
                                {dashboardData.warehouseCount}
                            </CardValue>
                        </CardContent>
                    </StyledCard>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <StyledCard>
                        <CardContent>
                            <CardTitle>Total Orders</CardTitle>
                            <Divider
                                sx={{ marginY: 2, borderColor: "#FFFFFF" }}
                            />
                            <CardValue>{dashboardData.orderCount}</CardValue>
                        </CardContent>
                    </StyledCard>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <StyledCard>
                        <CardContent>
                            {/* Empty Card for future use or design consistency */}
                        </CardContent>
                    </StyledCard>
                </Grid>
            </Grid>
        </div>
    );
}
