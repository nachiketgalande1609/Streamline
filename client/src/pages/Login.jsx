import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
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
} from "@mui/material";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");

    async function loginUser(event) {
        event.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(
                "/api/login",
                {
                    email,
                    password,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data.user) {
                localStorage.setItem("token", response.data.user);
                setMessage("Login Successful");
                setSeverity("success");
                setOpen(true);
                navigate("/");
            } else {
                setMessage("Please check your username/password");
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
                backgroundImage: "url('/assets/duplo30.jpg')",
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
                    <Typography
                        component="h1"
                        variant="h5"
                        sx={{ color: "#37474f" }}
                    >
                        Login
                    </Typography>
                    <Box component="form" onSubmit={loginUser} sx={{ mt: 1 }}>
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
                            sx={{
                                mt: 3,
                                mb: 2,
                                borderRadius: "16px",
                                backgroundColor: "#000000",
                                "&:hover": { backgroundColor: "#424242" },
                            }}
                            disabled={loading}
                        >
                            {loading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                "Login"
                            )}
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link
                                    to="/register"
                                    style={{ textDecoration: "none" }}
                                >
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
                    <Alert
                        onClose={handleClose}
                        severity={severity}
                        sx={{ width: "100%" }}
                    >
                        {message}
                    </Alert>
                </Snackbar>
            </Container>
            <Box sx={{ mt: 5, textAlign: "center" }}>
                <Typography variant="body2" color="textSecondary">
                    © {new Date().getFullYear()} Streamline. All rights
                    reserved.
                </Typography>
            </Box>
        </div>
    );
}
