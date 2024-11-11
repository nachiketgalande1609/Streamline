import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import backgroundImage from "../../assets/duplo30.jpg";

import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    CircularProgress,
    Snackbar,
    Alert,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");

    const [tenant, setTenant] = useState("");
    const [tenantList, setTenantList] = useState([]);

    useEffect(() => {
        const fetchTenants = async () => {
            try {
                const response = await axios.get("/api/tenants");
                setTenantList(response?.data?.data);
            } catch (error) {
                console.error("Error fetching tenants:", error);
                setTenantList([]);
            }
        };

        fetchTenants();
    }, []);

    async function loginUser(event) {
        event.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(
                "/api/login",
                {
                    email,
                    password,
                    tenant,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const loggedinUser = response?.data?.user;

            if (response?.data?.token) {
                localStorage.setItem("token", response?.data?.token);
                localStorage.setItem("userId", loggedinUser?.user_id);
                localStorage.setItem("userEmail", loggedinUser?.user_email);
                localStorage.setItem("userProfile", loggedinUser?.user_profile);
                localStorage.setItem("userTenant", loggedinUser?.user_tenant);
                localStorage.setItem("userName", loggedinUser?.user_first_name + " " + loggedinUser?.user_last_name);

                axios.defaults.headers.common["Authorization"] = `Bearer ${response?.data?.token}`;
                axios.defaults.headers.common["user_id"] = `${localStorage?.getItem("userId")}`;
                axios.defaults.headers.common["user_email"] = `${localStorage?.getItem("userEmail")}`;
                axios.defaults.headers.common["user_name"] = `${localStorage?.getItem("userName")}`;
                axios.defaults.headers.common["user_tenant"] = `${localStorage?.getItem("userTenant")}`;
                setMessage("Login Successful");
                setSeverity("success");
                setOpen(true);
                navigate("/");
            } else {
                setMessage(response?.data?.data);
                setSeverity("error");
                setOpen(true);
            }
        } catch (error) {
            setMessage("An error occurred. Please try again.");
            setSeverity("error");
            setOpen(true);
        } finally {
            setLoading(false);
        }
    }

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                height: "100vh",
                justifyContent: "center",
                alignItems: "center",
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            <Container component="main" maxWidth="xs">
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        mt: 8,
                        p: 3,
                        borderRadius: "16px",
                        boxShadow: 3,
                        backgroundColor: "#ffffff",
                    }}
                >
                    <Typography component="h1" variant="h5" sx={{ color: "#37474f" }}>
                        Login
                    </Typography>
                    <Box component="form" onSubmit={loginUser} sx={{ mt: 1 }}>
                        <FormControl fullWidth margin="normal" required>
                            <InputLabel id="tenant-select-label">Select Tenant</InputLabel>
                            <Select
                                labelId="tenant-select-label"
                                value={tenant}
                                onChange={(e) => setTenant(e?.target?.value)}
                                variant="outlined"
                                sx={{ borderRadius: "16px" }}
                            >
                                {tenantList?.map((tenant) => (
                                    <MenuItem key={tenant?._id} value={tenant?._id}>
                                        {tenant?.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e?.target?.value)}
                            autoComplete="email"
                            autoFocus
                            InputProps={{
                                style: {
                                    borderRadius: "16px",
                                },
                            }}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e?.target?.value)}
                            autoComplete="current-password"
                            InputProps={{
                                style: {
                                    borderRadius: "16px",
                                },
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 3,
                                mb: 2,
                                borderRadius: "16px",
                                backgroundColor: "#000000",
                                "&:hover": { backgroundColor: "#424242" },
                            }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link to="/register" style={{ textDecoration: "none" }}>
                                    <Button
                                        variant="text"
                                        sx={{
                                            color: "#37474f",
                                            "&:hover": {
                                                backgroundColor: "#ffffff",
                                            },
                                        }}
                                    >
                                        Don't have an account? Register
                                    </Button>
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Snackbar
                    open={open}
                    autoHideDuration={6000}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                    action={
                        <Button color="inherit" onClick={handleClose}>
                            Close
                        </Button>
                    }
                >
                    <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
                        {message}
                    </Alert>
                </Snackbar>
            </Container>
            <Box sx={{ mt: 5, textAlign: "center" }}>
                <Typography variant="body2" color="textSecondary">
                    © {new Date().getFullYear()} Streamline. All rights reserved.
                </Typography>
            </Box>
        </div>
    );
}
