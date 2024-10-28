// Navbar.jsx
import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Drawer, List, ListItem, ListItemText, Toolbar, ListItemIcon, Typography, Box } from "@mui/material";
import { UserContext } from "../context/UserContext";

import LoginIcon from "@mui/icons-material/Login";
import RegisterIcon from "@mui/icons-material/PersonAdd";
import ProfileIcon from "@mui/icons-material/AccountCircle";
import DashboardIcon from "@mui/icons-material/Dashboard";
import UsersIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory";
import OrdersIcon from "@mui/icons-material/ShoppingCart";
import SalesIcon from "@mui/icons-material/ShowChart";
import LogoutIcon from "@mui/icons-material/Logout";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import ContactsIcon from "@mui/icons-material/Contacts";
import WarningIcon from "@mui/icons-material/Warning";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

import axios from "axios";

const drawerWidth = 240;

const Navbar = ({ profileImage, setProfileImage }) => {
    const location = useLocation();
    const { user, logout } = useContext(UserContext);
    const token = localStorage.getItem("token");

    const handleLogout = async () => {
        try {
            await axios.post("/api/logout");
            logout();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const isActive = (path) => location.pathname === path;

    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    boxSizing: "border-box",
                    backgroundColor: "#000000",
                    color: "#ffffff",
                    display: "flex",
                    flexDirection: "column",
                },
            }}
            variant="permanent"
            anchor="left"
        >
            <Toolbar>
                <Typography variant="h6">Streamline</Typography>
            </Toolbar>
            <List sx={{ flexGrow: 1 }}>
                {!token && (
                    <>
                        <ListItem
                            button
                            component={Link}
                            to="/login"
                            sx={{
                                backgroundColor: isActive("/login") ? "#424242" : "transparent",
                            }}
                        >
                            <ListItemIcon sx={{ color: "#ffffff" }}>
                                <LoginIcon />
                            </ListItemIcon>
                            <ListItemText primary="Login" sx={{ color: "#ffffff" }} />
                        </ListItem>
                        <ListItem
                            button
                            component={Link}
                            to="/register"
                            sx={{
                                backgroundColor: isActive("/register") ? "#424242" : "transparent",
                            }}
                        >
                            <ListItemIcon sx={{ color: "#ffffff" }}>
                                <RegisterIcon />
                            </ListItemIcon>
                            <ListItemText primary="Register" sx={{ color: "#ffffff" }} />
                        </ListItem>
                    </>
                )}

                {token && (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            height: "100%",
                        }}
                    >
                        <List sx={{ flexGrow: 1 }}>
                            <ListItem
                                button
                                component={Link}
                                to="/"
                                sx={{
                                    backgroundColor: isActive("/") ? "#424242" : "transparent",
                                    "&:hover": {
                                        backgroundColor: "#2b2b2b",
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ color: "#ffffff" }}>
                                    <DashboardIcon />
                                </ListItemIcon>
                                <ListItemText primary="Dashboard" sx={{ color: "#ffffff" }} />
                            </ListItem>
                            <ListItem
                                button
                                component={Link}
                                to="/profile"
                                sx={{
                                    backgroundColor: isActive("/profile") ? "#424242" : "transparent",
                                    "&:hover": {
                                        backgroundColor: "#2b2b2b",
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ color: "#ffffff" }}>
                                    <ProfileIcon />
                                </ListItemIcon>
                                <ListItemText primary="Profile" sx={{ color: "#ffffff" }} />
                            </ListItem>
                            <ListItem
                                button
                                component={Link}
                                to="/users"
                                sx={{
                                    backgroundColor: isActive("/users") ? "#424242" : "transparent",
                                    "&:hover": {
                                        backgroundColor: "#2b2b2b",
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ color: "#ffffff" }}>
                                    <UsersIcon />
                                </ListItemIcon>
                                <ListItemText primary="Users" sx={{ color: "#ffffff" }} />
                            </ListItem>
                            <ListItem
                                button
                                component={Link}
                                to="/inventory"
                                sx={{
                                    backgroundColor: isActive("/inventory") ? "#424242" : "transparent",
                                    "&:hover": {
                                        backgroundColor: "#2b2b2b",
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ color: "#ffffff" }}>
                                    <InventoryIcon />
                                </ListItemIcon>
                                <ListItemText primary="Inventory" sx={{ color: "#ffffff" }} />
                            </ListItem>
                            <ListItem
                                button
                                component={Link}
                                to="/orders"
                                sx={{
                                    backgroundColor: isActive("/orders") ? "#424242" : "transparent",
                                    "&:hover": {
                                        backgroundColor: "#2b2b2b",
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ color: "#ffffff" }}>
                                    <OrdersIcon />
                                </ListItemIcon>
                                <ListItemText primary="Orders" sx={{ color: "#ffffff" }} />
                            </ListItem>
                            <ListItem
                                button
                                component={Link}
                                to="/warehouses"
                                sx={{
                                    backgroundColor: isActive("/warehouses") ? "#424242" : "transparent",
                                    "&:hover": {
                                        backgroundColor: "#2b2b2b",
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ color: "#ffffff" }}>
                                    <WarehouseIcon />
                                </ListItemIcon>
                                <ListItemText primary="Warehouses" sx={{ color: "#ffffff" }} />
                            </ListItem>
                            <ListItem
                                button
                                component={Link}
                                to="/customers"
                                sx={{
                                    backgroundColor: isActive("/customers") ? "#424242" : "transparent",
                                    "&:hover": {
                                        backgroundColor: "#2b2b2b",
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ color: "#ffffff" }}>
                                    <ContactsIcon />
                                </ListItemIcon>
                                <ListItemText primary="Customers" sx={{ color: "#ffffff" }} />
                            </ListItem>
                            <ListItem
                                button
                                component={Link}
                                to="/sales"
                                sx={{
                                    backgroundColor: isActive("/sales") ? "#424242" : "transparent",
                                    "&:hover": {
                                        backgroundColor: "#2b2b2b",
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ color: "#ffffff" }}>
                                    <SalesIcon />
                                </ListItemIcon>
                                <ListItemText primary="Sales" sx={{ color: "#ffffff" }} />
                            </ListItem>

                            <ListItem
                                button
                                component={Link}
                                to="/incidents"
                                sx={{
                                    backgroundColor: isActive("/incidents") ? "#424242" : "transparent",
                                    "&:hover": {
                                        backgroundColor: "#2b2b2b",
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ color: "#ffffff" }}>
                                    <WarningIcon />
                                </ListItemIcon>
                                <ListItemText primary="Incidents" sx={{ color: "#ffffff" }} />
                            </ListItem>

                            <ListItem
                                button
                                component={Link}
                                to="/raise-ticket"
                                sx={{
                                    backgroundColor: isActive("/raise-ticket") ? "#424242" : "transparent",
                                    "&:hover": {
                                        backgroundColor: "#2b2b2b",
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ color: "#ffffff" }}>
                                    <ContactSupportIcon />
                                </ListItemIcon>
                                <ListItemText primary="Raise Ticket" sx={{ color: "#ffffff" }} />
                            </ListItem>

                            <ListItem
                                button
                                component={Link}
                                to="/recon"
                                sx={{
                                    backgroundColor: isActive("/recon") ? "#424242" : "transparent",
                                    "&:hover": {
                                        backgroundColor: "#2b2b2b",
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ color: "#ffffff" }}>
                                    <CurrencyRupeeIcon />
                                </ListItemIcon>
                                <ListItemText primary="Reconciliation" sx={{ color: "#ffffff" }} />
                            </ListItem>

                            <ListItem
                                button
                                component={Link}
                                onClick={handleLogout}
                                sx={{
                                    backgroundColor: isActive("/logout") ? "#424242" : "transparent",
                                    "&:hover": {
                                        backgroundColor: "#2b2b2b",
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ color: "#ffffff" }}>
                                    <LogoutIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Logout"
                                    sx={{
                                        color: "#ffffff",
                                        typography: "body2",
                                    }}
                                />
                            </ListItem>
                        </List>

                        <ListItem
                            sx={{
                                padding: "16px",
                                display: "flex",
                                alignItems: "center",
                                marginTop: "auto",
                            }}
                            component={Link}
                            to="/profile"
                        >
                            <img
                                src={
                                    profileImage
                                        ? `http://localhost:3001${profileImage}`
                                        : "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg"
                                }
                                alt="Profile"
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: "50%",
                                    marginRight: 12,
                                    border: "2px solid #fff",
                                    objectFit: "cover",
                                }}
                            />
                            <ListItemText
                                primary={user?.email}
                                sx={{
                                    color: "#ffffff",
                                    typography: "subtitle2",
                                }}
                            />
                        </ListItem>
                    </Box>
                )}
            </List>
        </Drawer>
    );
};

export default Navbar;
