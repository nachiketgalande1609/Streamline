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
    Snackbar,
    Alert,
    Tooltip,
} from "@mui/material";
import { CameraAlt } from "@mui/icons-material";
import { UserContext } from "../context/UserContext";
import BreadcrumbsComponent from "../parts/BreadcrumbsComponent";

export default function Profile({ profileImage, setProfileImage }) {
    const { user, updateUser } = useContext(UserContext);
    const [alertOpen, setAlertOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");
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

    const handleAlertClose = () => {
        setAlertOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleProfilePictureChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("profilePicture", file);

            try {
                const response = await axios.post("api/users/uploadProfilePicture", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                const newProfilePicture = response?.data?.data?.profilePicture;

                if (newProfilePicture) {
                    localStorage.setItem("userProfile", newProfilePicture);
                    setProfileImage(newProfilePicture);
                    setMessage("Profile Picture uploaded successfully!");
                    setSeverity("success");
                    setAlertOpen(true);
                }
            } catch (error) {
                console.error("Error uploading profile picture:", error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put("api/users/update", formData);
            await fetchUserProfile();
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    console.log(userData);

    return (
        <div>
            <Typography variant="h5" gutterBottom>
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
                            height: "calc(411.5px - 48px)",
                            justifyContent: "center",
                        }}
                    >
                        <input
                            type="file"
                            accept="image/*"
                            id="upload-profile-picture"
                            style={{ display: "none" }}
                            onChange={handleProfilePictureChange}
                        />
                        <label htmlFor="upload-profile-picture" style={{ position: "relative" }}>
                            <Tooltip title="Upload Profile Image" placement="top" arrow>
                                <Box
                                    sx={{
                                        position: "relative",
                                        "&:hover .overlay": {
                                            opacity: 1,
                                            cursor: "pointer",
                                        },
                                    }}
                                >
                                    <Avatar
                                        src={
                                            profileImage
                                                ? `http://localhost:3001${profileImage}`
                                                : "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg"
                                        }
                                        alt="Profile"
                                        sx={{
                                            width: 180,
                                            height: 180,
                                            borderRadius: "50%",
                                            marginBottom: 2,
                                            border: "4px solid #1E1E1E",
                                            cursor: "pointer",
                                        }}
                                    />
                                    <Box
                                        className="overlay"
                                        sx={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            width: "100%",
                                            height: "100%",
                                            borderRadius: "50%",
                                            backgroundColor: "rgba(0, 0, 0, 0.3)",
                                            opacity: 0,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            transition: "opacity 0.3s ease",
                                        }}
                                    >
                                        <CameraAlt sx={{ color: "#fff", fontSize: 30 }} />
                                    </Box>
                                </Box>
                            </Tooltip>
                        </label>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            {userData?.firstName} {userData?.lastName}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            {userData?.role}
                        </Typography>
                    </Card>
                </Grid>

                {/* Right Profile Form */}
                <Grid item xs={12} md={8}>
                    <Card sx={{ boxShadow: 3, borderRadius: "16px", padding: 3 }}>
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
                                        <InputLabel id="status-label">Status</InputLabel>
                                        <Select labelId="status-label" name="status" value={formData?.status} onChange={handleChange} label="Status">
                                            {statuses.map((status) => (
                                                <MenuItem key={status} value={status}>
                                                    {status}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* Role */}
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth margin="normal">
                                        <InputLabel id="role-label">Role</InputLabel>
                                        <Select labelId="role-label" name="role" value={formData?.role} onChange={handleChange} label="Role">
                                            {roles.map((role) => (
                                                <MenuItem key={role} value={role}>
                                                    {role}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>

                            {/* Update Button */}
                            <Box sx={{ display: "flex", justifyContent: "end" }}>
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
            <Snackbar
                open={alertOpen}
                autoHideDuration={6000}
                onClose={handleAlertClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                action={
                    <Button color="inherit" onClick={handleAlertClose}>
                        Close
                    </Button>
                }
            >
                <Alert onClose={handleAlertClose} severity={severity} sx={{ width: "100%" }}>
                    {message}
                </Alert>
            </Snackbar>
        </div>
    );
}
