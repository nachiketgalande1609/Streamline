import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Divider,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";

const StyledCard = styled(Card)(({ theme }) => ({
    backgroundColor: "#37474f", // Dark background color
    color: "#FFFFFF", // White text color
    boxShadow: theme.shadows[5],
    borderRadius: "16px",
}));

const CardTitle = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(1),
    textAlign: "center",
}));

const CardValue = styled(Typography)(({ theme }) => ({
    fontSize: "1.2rem",
    textAlign: "center",
}));

export default function Dashboard() {
    const [dashboardData, setDashboardData] = useState({
        userCount: 0,
        warehouseCount: 0,
        orderCount: 0,
        customerCount: 0,
        warehouse_summary: [],
    });

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

    const CountCards = () => {
        return (
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
                            <CardTitle>Total Customers</CardTitle>
                            <Divider
                                sx={{ marginY: 2, borderColor: "#FFFFFF" }}
                            />
                            <CardValue>{dashboardData.customerCount}</CardValue>
                        </CardContent>
                    </StyledCard>
                </Grid>
            </Grid>
        );
    };

    const WarehouseGauge = () => {
        return (
            <Accordion
                defaultExpanded
                sx={{ marginTop: 2, borderRadius: "4px", boxShadow: 2 }}
            >
                <AccordionSummary
                    sx={(theme) => ({
                        backgroundColor: "#37474f",
                        color: "#ffffff",
                        borderRadius: "4px",
                    })}
                    expandIcon={<ExpandMoreIcon sx={{ color: "#ffffff" }} />}
                >
                    <Typography>Warehouse Stock vs Capacity</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid
                        container
                        justifyContent="center"
                        alignItems="center"
                        marginTop={2}
                        marginBottom={2}
                        gap={5}
                    >
                        {dashboardData.warehouse_summary.map(
                            (warehouse, index) => {
                                const stockPercentage =
                                    (warehouse.currentStock /
                                        warehouse.capacity) *
                                    100;

                                const [animatedValue, setAnimatedValue] =
                                    useState(0);

                                useEffect(() => {
                                    let start = null;
                                    const duration = 1000;

                                    const animate = (timestamp) => {
                                        if (!start) start = timestamp;
                                        const progress = timestamp - start;
                                        const newValue = Math.min(
                                            Math.floor(
                                                (progress / duration) *
                                                    stockPercentage
                                            ),
                                            Math.floor(stockPercentage)
                                        );
                                        setAnimatedValue(newValue);
                                        if (progress < duration) {
                                            requestAnimationFrame(animate);
                                        }
                                    };

                                    requestAnimationFrame(animate);
                                }, [stockPercentage]); // Run the animation when stockPercentage changes

                                // Determine color based on stockPercentage
                                const gaugeColor =
                                    stockPercentage > 70 &&
                                    stockPercentage <= 100
                                        ? "#D2222D"
                                        : stockPercentage > 30 &&
                                          stockPercentage <= 70
                                        ? "#FFBF00"
                                        : "#349934";

                                return (
                                    <Grid
                                        item
                                        xs={12}
                                        sm={6}
                                        md={4}
                                        lg={2}
                                        key={index}
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Typography
                                            variant="subtitle1"
                                            align="center"
                                            sx={{ fontWeight: "600" }}
                                        >
                                            {warehouse.warehouse_id}
                                        </Typography>
                                        <Gauge
                                            value={animatedValue} // Use animated value for display
                                            startAngle={0}
                                            innerRadius="75%"
                                            outerRadius="100%"
                                            width={120}
                                            height={120}
                                            cornerRadius="50%"
                                            arcBackgroundColor="#fff"
                                            sx={(theme) => ({
                                                [`& .${gaugeClasses.valueText}`]:
                                                    {
                                                        fontSize: 20,
                                                    },
                                                [`& .${gaugeClasses.valueArc}`]:
                                                    {
                                                        fill: gaugeColor, // Use constant gauge color
                                                    },
                                                [`& .${gaugeClasses.referenceArc}`]:
                                                    {
                                                        fill: "#cee2ed",
                                                    },
                                            })}
                                        />
                                        <Typography
                                            variant="body2"
                                            align="center"
                                            marginTop={2}
                                        >
                                            Current Stock:{" "}
                                            {warehouse.currentStock}/
                                            {warehouse.capacity}
                                        </Typography>
                                    </Grid>
                                );
                            }
                        )}
                    </Grid>
                </AccordionDetails>
            </Accordion>
        );
    };

    return (
        <div style={{ padding: 20 }}>
            <CountCards />
            <WarehouseGauge />
        </div>
    );
}
