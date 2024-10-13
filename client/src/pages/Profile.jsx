import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
    Box,
    Button,
    Card,
    Grid,
    Avatar,
    Typography,
    TextField,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
} from "@mui/material";
import { UserContext } from "../context/UserContext";
import BreadcrumbsComponent from "../parts/BreadcrumbsComponent";
export default function Profile() {
    const { user } = useContext(UserContext);
    const [userData, setUserData] = useState(null);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        profilePicture: "",
        role: "",
        status: "",
        city: "",
        country: "",
    });

    const roles = ["admin", "sales", "user", "manager"];
    const statuses = ["active", "inactive", "pending"];

    const breadcrumbs = [
        { label: "Home", path: "/" },
        { label: "Profile", path: "" },
    ];

    // Move this function out to reuse it
    const fetchUserProfile = async () => {
        try {
            const response = await axios.post("api/users/profile", {
                email: user?.email,
            });
            setUserData(response?.data?.data);
            setFormData(response?.data?.data);
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchUserProfile();
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put("api/users/update", formData);
            // Refetch user data after successful update
            await fetchUserProfile();
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Profile
            </Typography>
            <BreadcrumbsComponent breadcrumbs={breadcrumbs} />
            <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                    <Card
                        sx={{
                            boxShadow: 3,
                            borderRadius: "16px",
                            textAlign: "center",
                            padding: 3,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <Avatar
                            src={
                                userData?.profilePicture ||
                                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                            }
                            alt="Profile"
                            sx={{
                                width: 120,
                                height: 120,
                                borderRadius: "50%",
                                marginBottom: 2,
                            }}
                        />
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            {userData?.firstName} {userData?.lastName}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            {userData?.role}
                        </Typography>
                        {/* Metrics Section */}
                        <Box mt={3}>
                            <Typography>
                                Opportunities applied:{" "}
                                <span style={{ color: "orange" }}>32</span>
                            </Typography>
                            <Typography>
                                Opportunities won:{" "}
                                <span style={{ color: "green" }}>26</span>
                            </Typography>
                            <Typography>
                                Current opportunities:{" "}
                                <span style={{ color: "blue" }}>6</span>
                            </Typography>
                        </Box>
                    </Card>
                </Grid>

                {/* Right Profile Form */}
                <Grid item xs={12} md={8}>
                    <Card
                        sx={{ boxShadow: 3, borderRadius: "16px", padding: 3 }}
                    >
                        <Typography variant="h6" gutterBottom>
                            Account Settings
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                {/* First Name */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="First Name"
                                        name="firstName"
                                        value={formData?.firstName}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="normal"
                                    />
                                </Grid>

                                {/* Last Name */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Last Name"
                                        name="lastName"
                                        value={formData?.lastName}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="normal"
                                    />
                                </Grid>

                                {/* Phone Number */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Phone Number"
                                        name="phoneNumber"
                                        value={formData?.phoneNumber}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="normal"
                                    />
                                </Grid>

                                {/* Email Address */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Email Address"
                                        name="email"
                                        value={formData?.email}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="normal"
                                    />
                                </Grid>

                                {/* City */}
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth margin="normal">
                                        <InputLabel id="status-label">
                                            Status
                                        </InputLabel>
                                        <Select
                                            labelId="status-label"
                                            name="status"
                                            value={formData?.status}
                                            onChange={handleChange}
                                            label="Status"
                                        >
                                            {statuses.map((status) => (
                                                <MenuItem
                                                    key={status}
                                                    value={status}
                                                >
                                                    {status}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* Role */}
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth margin="normal">
                                        <InputLabel id="role-label">
                                            Role
                                        </InputLabel>
                                        <Select
                                            labelId="role-label"
                                            name="role"
                                            value={formData?.role}
                                            onChange={handleChange}
                                            label="Role"
                                        >
                                            {roles.map((role) => (
                                                <MenuItem
                                                    key={role}
                                                    value={role}
                                                >
                                                    {role}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>

                            {/* Update Button */}
                            <Box
                                sx={{ display: "flex", justifyContent: "end" }}
                            >
                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    sx={{
                                        marginTop: 2,
                                        borderRadius: "16px",
                                        width: "150px",
                                        backgroundColor: "#000000",
                                        "&:hover": {
                                            backgroundColor: "#424242",
                                        },
                                    }}
                                >
                                    Update
                                </Button>
                            </Box>
                        </form>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
}
