import React from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Card, CardContent, Typography, Divider } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledCard = styled(Card)(({ theme }) => ({
    backgroundColor: "#1d282d", // Dark background color
    color: "#FFFFFF", // White text color
    boxShadow: theme.shadows[5],
    cursor: "pointer", // Pointer cursor for clickable card
    transition: "0.3s", // Smooth transition for hover effect
    "&:hover": {
        backgroundColor: "#243B43", // Slightly lighter background on hover
    },
}));

const CardTitle = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(1),
    fontWeight: "bold",
}));

const CardValue = styled(Typography)(({ theme }) => ({
    fontSize: "1.2rem",
}));

export default function Home() {
    const navigate = useNavigate();

    const handleCardClick = (path) => {
        navigate(path);
    };

    return (
        <div style={{ padding: 20 }}>
            <Typography variant="h4" gutterBottom>
                Welcome to Streamline
            </Typography>
            <Typography variant="h6" paragraph>
                Manage all your enterprise resources efficiently. Use the cards
                below to navigate to different modules of the system. Each card
                provides access to key functionalities, helping you streamline
                your workflow.
            </Typography>
            <Grid container spacing={4}>
                {/* Dashboard Section */}
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <StyledCard onClick={() => handleCardClick("/dashboard")}>
                        <CardContent>
                            <CardTitle>Dashboard</CardTitle>
                            <Divider
                                sx={{ marginY: 2, borderColor: "#FFFFFF" }}
                            />
                            <CardValue>View Overview and Metrics</CardValue>
                        </CardContent>
                    </StyledCard>
                </Grid>

                {/* Users Section */}
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <StyledCard onClick={() => handleCardClick("/users")}>
                        <CardContent>
                            <CardTitle>Users</CardTitle>
                            <Divider
                                sx={{ marginY: 2, borderColor: "#FFFFFF" }}
                            />
                            <CardValue>Manage User Accounts</CardValue>
                        </CardContent>
                    </StyledCard>
                </Grid>

                {/* Inventory Section */}
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <StyledCard onClick={() => handleCardClick("/inventory")}>
                        <CardContent>
                            <CardTitle>Inventory</CardTitle>
                            <Divider
                                sx={{ marginY: 2, borderColor: "#FFFFFF" }}
                            />
                            <CardValue>Track Inventory Levels</CardValue>
                        </CardContent>
                    </StyledCard>
                </Grid>

                {/* Orders Section */}
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <StyledCard onClick={() => handleCardClick("/orders")}>
                        <CardContent>
                            <CardTitle>Orders</CardTitle>
                            <Divider
                                sx={{ marginY: 2, borderColor: "#FFFFFF" }}
                            />
                            <CardValue>View and Manage Orders</CardValue>
                        </CardContent>
                    </StyledCard>
                </Grid>

                {/* Sales Section */}
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <StyledCard onClick={() => handleCardClick("/sales")}>
                        <CardContent>
                            <CardTitle>Sales</CardTitle>
                            <Divider
                                sx={{ marginY: 2, borderColor: "#FFFFFF" }}
                            />
                            <CardValue>Analyze Sales Data</CardValue>
                        </CardContent>
                    </StyledCard>
                </Grid>

                {/* Warehouses Section */}
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <StyledCard onClick={() => handleCardClick("/warehouses")}>
                        <CardContent>
                            <CardTitle>Warehouses</CardTitle>
                            <Divider
                                sx={{ marginY: 2, borderColor: "#FFFFFF" }}
                            />
                            <CardValue>Manage Warehouse Locations</CardValue>
                        </CardContent>
                    </StyledCard>
                </Grid>

                {/* Customers Section */}
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <StyledCard onClick={() => handleCardClick("/customers")}>
                        <CardContent>
                            <CardTitle>Customers</CardTitle>
                            <Divider
                                sx={{ marginY: 2, borderColor: "#FFFFFF" }}
                            />
                            <CardValue>Manage Customer Information</CardValue>
                        </CardContent>
                    </StyledCard>
                </Grid>

                {/* Recent Activities Section */}
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <StyledCard
                        onClick={() => handleCardClick("/recent-activities")}
                    >
                        <CardContent>
                            <CardTitle>Recent Activities</CardTitle>
                            <Divider
                                sx={{ marginY: 2, borderColor: "#FFFFFF" }}
                            />
                            <CardValue>View Recent System Activities</CardValue>
                        </CardContent>
                    </StyledCard>
                </Grid>

                {/* Notifications Section */}
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <StyledCard
                        onClick={() => handleCardClick("/notifications")}
                    >
                        <CardContent>
                            <CardTitle>Notifications</CardTitle>
                            <Divider
                                sx={{ marginY: 2, borderColor: "#FFFFFF" }}
                            />
                            <CardValue>Check System Notifications</CardValue>
                        </CardContent>
                    </StyledCard>
                </Grid>

                {/* Quick Links Section */}
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <StyledCard onClick={() => handleCardClick("/quick-links")}>
                        <CardContent>
                            <CardTitle>Quick Links</CardTitle>
                            <Divider
                                sx={{ marginY: 2, borderColor: "#FFFFFF" }}
                            />
                            <CardValue>Access Important Links</CardValue>
                        </CardContent>
                    </StyledCard>
                </Grid>
            </Grid>
        </div>
    );
}
