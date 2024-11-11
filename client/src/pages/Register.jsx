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

export default function Register() {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
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

    async function registerUser(event) {
        event.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(
                "/api/register",
                {
                    firstName,
                    lastName,
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

            if (!response.data.error) {
                setMessage("Registration successful. Please log in.");
                setSeverity("success");
                setOpen(true);
                navigate("/login");
            } else {
                setMessage(response.data.data);
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
                        Register
                    </Typography>
                    <Box component="form" onSubmit={registerUser} sx={{ mt: 1 }}>
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
                            label="First Name"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            autoComplete="firstName"
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
                            label="Last Name"
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            autoComplete="lastName"
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
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
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
                            onChange={(e) => setPassword(e.target.value)}
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
                            color="primary"
                            sx={{
                                mt: 3,
                                mb: 2,
                                borderRadius: "16px",
                                backgroundColor: "#000000",
                                "&:hover": { backgroundColor: "#424242" },
                            }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : "Register"}
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link to="/login" style={{ textDecoration: "none" }}>
                                    <Button
                                        variant="text"
                                        sx={{
                                            color: "#37474f",
                                            "&:hover": {
                                                backgroundColor: "#ffffff",
                                            },
                                        }}
                                    >
                                        Already have an account? Login
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
