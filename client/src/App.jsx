import React from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import {
    Drawer,
    List,
    ListItem,
    ListItemText,
    Toolbar,
    AppBar,
    Typography,
    Divider,
} from "@mui/material";
import Navbar from "./parts/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard/";
import Users from "./pages/Users";
import Inventory from "./pages/Inventory";
import Orders from "./pages/Orders";
import Sales from "./pages/Sales";
import Warehouses from "./pages/Warehouses";
import Customers from "./pages/Customers";
import axios from "axios";
import "@fontsource/roboto/400.css";
import "./App.css";
import { UserProvider } from "./context/UserContext";
import OrderDetails from "./pages/OrderDetails";

axios.defaults.baseURL = "http://localhost:3001";
axios.defaults.headers.common["token"] = `Bearer ${localStorage.getItem(
    "token"
)}`;

const drawerWidth = 240;

function Layout() {
    const location = useLocation();
    const hideNavbar =
        location.pathname === "/login" || location.pathname === "/register";
    return (
        <div
            style={{
                display: "flex",
                height: "100vh",
                backgroundColor: "#000000",
            }}
        >
            {!hideNavbar && <Navbar />}
            <main
                style={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "20px",
                    overflowX: "hidden",
                }}
            >
                <div
                    style={{
                        flexGrow: 1,
                        padding: "20px",
                        backgroundColor: "#fff",
                        minHeight: `calc(100vh - 120px)`,
                        borderRadius: "30px",
                        marginTop: "40px",
                        marginRight: "20px",
                    }}
                >
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/users" element={<Users />} />
                        <Route path="/inventory" element={<Inventory />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/sales" element={<Sales />} />
                        <Route path="/warehouses" element={<Warehouses />} />
                        <Route path="/customers" element={<Customers />} />
                        <Route
                            path="/order/:orderId"
                            element={<OrderDetails />}
                        />
                    </Routes>
                </div>
                <footer
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "#000000",
                        textAlign: "center",
                        marginTop: "auto",
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{ color: (theme) => theme.palette.grey[500] }}
                    >
                        © {new Date().getFullYear()} Streamline. All rights
                        reserved.
                    </Typography>
                </footer>
            </main>
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <UserProvider>
                <Layout />
            </UserProvider>
        </BrowserRouter>
    );
}
