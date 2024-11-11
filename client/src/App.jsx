import { React, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Typography } from "@mui/material";
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
import RaiseTicket from "./pages/RaiseTicket";
import Incidents from "./pages/Incidents";
import IncidentDetails from "./pages/IncidentDetails";
import FinancialReconciliation from "./pages/FinancialReconciliation";

axios.defaults.baseURL = "https://streamline-backend.onrender.com";

function Layout() {
    const location = useLocation();
    const [profileImage, setProfileImage] = useState(localStorage.getItem("userProfile"));

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        const userEmail = localStorage.getItem("userEmail");
        const userName = localStorage.getItem("userName");

        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            axios.defaults.headers.common["user_id"] = userId;
            axios.defaults.headers.common["user_email"] = userEmail;
            axios.defaults.headers.common["user_name"] = userName;
        }
    }, []);

    const hideNavbarAndFooter = location.pathname === "/login" || location.pathname === "/register";
    return (
        <div
            style={{
                display: "flex",
                height: "100vh",
                backgroundColor: "#000000",
            }}
        >
            {!hideNavbarAndFooter && <Navbar profileImage={profileImage} setProfileImage={setProfileImage} />}
            <main
                style={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    overflowX: "hidden",
                }}
            >
                <div
                    style={{
                        ...(!hideNavbarAndFooter
                            ? {
                                  flexGrow: 1,
                                  padding: "20px",
                                  backgroundColor: "#fff",
                                  minHeight: `calc(100vh - 120px)`,
                                  borderRadius: "30px 30px 30px 30px",
                                  marginTop: "40px",
                                  marginRight: "20px",
                                  overflowY: "auto",
                              }
                            : {}),
                    }}
                >
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/profile" element={<Profile profileImage={profileImage} setProfileImage={setProfileImage} />} />
                        <Route path="/users" element={<Users />} />
                        <Route path="/inventory" element={<Inventory />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/sales" element={<Sales />} />
                        <Route path="/warehouses" element={<Warehouses />} />
                        <Route path="/customers" element={<Customers />} />
                        <Route path="/raise-ticket" element={<RaiseTicket />} />
                        <Route path="/incidents" element={<Incidents />} />
                        <Route path="/recon" element={<FinancialReconciliation />} />
                        <Route path="/order/:orderId" element={<OrderDetails />} />
                        <Route path="/incidents/:ticketId" element={<IncidentDetails />} />
                    </Routes>
                </div>
                {!hideNavbarAndFooter && (
                    <footer
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "#000000",
                            textAlign: "center",
                            marginTop: "auto",
                        }}
                    >
                        <Typography variant="body2" sx={{ color: (theme) => theme.palette.grey[500] }}>
                            © {new Date().getFullYear()} Streamline. All rights reserved.
                        </Typography>
                    </footer>
                )}
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
