// Navbar.jsx
import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    Drawer,
    List,
    ListItem,
    ListItemText,
    Toolbar,
    ListItemIcon,
    Typography,
} from "@mui/material";
import { UserContext } from "../context/UserContext";

import HomeIcon from "@mui/icons-material/Home";
import LoginIcon from "@mui/icons-material/Login";
import RegisterIcon from "@mui/icons-material/PersonAdd";
import ProfileIcon from "@mui/icons-material/AccountCircle";
import DashboardIcon from "@mui/icons-material/Dashboard";
import UsersIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory";
import OrdersIcon from "@mui/icons-material/ShoppingCart";
import SalesIcon from "@mui/icons-material/ShowChart";
import LogoutIcon from "@mui/icons-material/Logout";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import ContactsIcon from "@mui/icons-material/Contacts";

import axios from "axios";

const drawerWidth = 240;

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useContext(UserContext);

    const handleLogout = async () => {
        try {
            await axios.post("/api/logout");
            logout(); // Clear user context and localStorage, then navigate to login
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
                    backgroundColor: "#1d282d",
                    color: "#99a6a5",
                },
            }}
            variant="permanent"
            anchor="left"
        >
            <Toolbar>
                <Typography variant="h6">Streamline</Typography>
            </Toolbar>
            <List>
                <ListItem
                    button
                    component={Link}
                    to="/"
                    sx={{
                        backgroundColor: isActive("/")
                            ? "#37474f"
                            : "transparent",
                    }}
                >
                    <ListItemIcon sx={{ color: "#99a6a5" }}>
                        <HomeIcon />
                    </ListItemIcon>
                    <ListItemText primary="Home" />
                </ListItem>

                {!user && (
                    <>
                        <ListItem
                            button
                            component={Link}
                            to="/login"
                            sx={{
                                backgroundColor: isActive("/login")
                                    ? "#37474f"
                                    : "transparent",
                            }}
                        >
                            <ListItemIcon sx={{ color: "#99a6a5" }}>
                                <LoginIcon />
                            </ListItemIcon>
                            <ListItemText primary="Login" />
                        </ListItem>
                        <ListItem
                            button
                            component={Link}
                            to="/register"
                            sx={{
                                backgroundColor: isActive("/register")
                                    ? "#37474f"
                                    : "transparent",
                            }}
                        >
                            <ListItemIcon sx={{ color: "#99a6a5" }}>
                                <RegisterIcon />
                            </ListItemIcon>
                            <ListItemText primary="Register" />
                        </ListItem>
                    </>
                )}

                {user && (
                    <>
                        <ListItem
                            button
                            component={Link}
                            to="/profile"
                            sx={{
                                backgroundColor: isActive("/profile")
                                    ? "#37474f"
                                    : "transparent",
                            }}
                        >
                            <ListItemIcon sx={{ color: "#99a6a5" }}>
                                <ProfileIcon />
                            </ListItemIcon>
                            <ListItemText primary="Profile" />
                        </ListItem>
                        <ListItem
                            button
                            component={Link}
                            to="/dashboard"
                            sx={{
                                backgroundColor: isActive("/dashboard")
                                    ? "#37474f"
                                    : "transparent",
                            }}
                        >
                            <ListItemIcon sx={{ color: "#99a6a5" }}>
                                <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText primary="Dashboard" />
                        </ListItem>
                        <ListItem
                            button
                            component={Link}
                            to="/users"
                            sx={{
                                backgroundColor: isActive("/users")
                                    ? "#37474f"
                                    : "transparent",
                            }}
                        >
                            <ListItemIcon sx={{ color: "#99a6a5" }}>
                                <UsersIcon />
                            </ListItemIcon>
                            <ListItemText primary="Users" />
                        </ListItem>
                        <ListItem
                            button
                            component={Link}
                            to="/inventory"
                            sx={{
                                backgroundColor: isActive("/inventory")
                                    ? "#37474f"
                                    : "transparent",
                            }}
                        >
                            <ListItemIcon sx={{ color: "#99a6a5" }}>
                                <InventoryIcon />
                            </ListItemIcon>
                            <ListItemText primary="Inventory" />
                        </ListItem>
                        <ListItem
                            button
                            component={Link}
                            to="/orders"
                            sx={{
                                backgroundColor: isActive("/orders")
                                    ? "#37474f"
                                    : "transparent",
                            }}
                        >
                            <ListItemIcon sx={{ color: "#99a6a5" }}>
                                <OrdersIcon />
                            </ListItemIcon>
                            <ListItemText primary="Orders" />
                        </ListItem>
                        <ListItem
                            button
                            component={Link}
                            to="/warehouses"
                            sx={{
                                backgroundColor: isActive("/warehouses")
                                    ? "#37474f"
                                    : "transparent",
                            }}
                        >
                            <ListItemIcon sx={{ color: "#99a6a5" }}>
                                <WarehouseIcon />
                            </ListItemIcon>
                            <ListItemText primary="Warehouses" />
                        </ListItem>
                        <ListItem
                            button
                            component={Link}
                            to="/customers"
                            sx={{
                                backgroundColor: isActive("/customers")
                                    ? "#37474f"
                                    : "transparent",
                            }}
                        >
                            <ListItemIcon sx={{ color: "#99a6a5" }}>
                                <ContactsIcon />
                            </ListItemIcon>
                            <ListItemText primary="Customers" />
                        </ListItem>
                        <ListItem
                            button
                            component={Link}
                            to="/sales"
                            sx={{
                                backgroundColor: isActive("/sales")
                                    ? "#37474f"
                                    : "transparent",
                            }}
                        >
                            <ListItemIcon sx={{ color: "#99a6a5" }}>
                                <SalesIcon />
                            </ListItemIcon>
                            <ListItemText primary="Sales" />
                        </ListItem>
                        <ListItem
                            button
                            onClick={handleLogout}
                            sx={{ marginTop: "auto" }}
                        >
                            <ListItemIcon sx={{ color: "#99a6a5" }}>
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText primary="Logout" />
                        </ListItem>
                    </>
                )}
            </List>
        </Drawer>
    );
};

export default Navbar;
