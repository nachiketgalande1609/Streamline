import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    IconButton,
    Modal,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    TextField,
    Typography,
    Avatar,
} from "@mui/material";
import { UserContext } from "../context/UserContext";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import { Close } from "@mui/icons-material";

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

export default function Profile() {
    const { user } = useContext(UserContext);
    const [userData, setUserData] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        profilePicture: "",
        role: "",
        status: "",
    });

    const roles = ["admin", "sales", "user", "manager"];
    const statuses = ["active", "inactive", "pending"];

    useEffect(() => {
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
        fetchUserProfile();
    }, [user]);

    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put("api/users/update", formData);
            const response = await axios.post("api/users/profile", {
                email: formData?.email,
            });
            setUserData(response?.data?.data);
            handleCloseModal();
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date?.toLocaleDateString();
    };

    return (
        <Box sx={{ padding: 4, minHeight: "100vh" }}>
            <Typography variant="h4" gutterBottom>
                Profile
            </Typography>

            <Button
                variant="contained"
                startIcon={<ModeEditOutlineIcon />}
                onClick={handleOpenModal}
                sx={{
                    mb: 3,
                    borderRadius: "16px",
                    backgroundColor: "#778887",
                    "&:hover": { backgroundColor: "#1d282d" },
                }}
            >
                Edit Profile
            </Button>

            <Grid container spacing={4}>
                {/* Profile Picture and Basic Info */}
                <Grid item xs={12} md={4}>
                    <Card
                        sx={{
                            boxShadow: 3,
                            textAlign: "center",
                            borderRadius: "16px",
                        }}
                    >
                        <CardContent
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            <Avatar
                                src={
                                    userData?.profilePicture
                                        ? userData?.profilePicture
                                        : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                                }
                                alt="Profile"
                                sx={{
                                    width: 120,
                                    height: 120,
                                    borderRadius: "50%",
                                    marginBottom: 2,
                                }}
                            />
                            <Typography variant="h6" sx={{ color: "#606c76" }}>
                                {userData?.firstName} {userData?.lastName}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {userData?.email}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* User Information Section */}
                <Grid item xs={12} md={8}>
                    <Card sx={{ boxShadow: 3, borderRadius: "16px" }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                User Information
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography>
                                        <strong>First Name:</strong>{" "}
                                        {userData?.firstName}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography>
                                        <strong>Last Name:</strong>{" "}
                                        {userData?.lastName}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography>
                                        <strong>Email:</strong>{" "}
                                        {userData?.email}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography>
                                        <strong>Phone Number:</strong>{" "}
                                        {userData?.phoneNumber}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography>
                                        <strong>Role:</strong> {userData?.role}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography>
                                        <strong>Status:</strong>{" "}
                                        {userData?.status}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography>
                                        <strong>Joined:</strong>{" "}
                                        {userData?.createdAt
                                            ? formatDate(userData?.createdAt)
                                            : "N/A"}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography>
                                        <strong>Last Login:</strong>{" "}
                                        {userData?.lastLogin
                                            ? formatDate(userData?.lastLogin)
                                            : "N/A"}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Edit Modal */}
            <Modal
                open={modalOpen}
                onClose={handleCloseModal}
                aria-labelledby="edit-profile-modal"
                aria-describedby="edit-profile-form"
            >
                <Box sx={modalStyle}>
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseModal}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <Close />
                    </IconButton>
                    <Typography variant="h6" gutterBottom>
                        Edit Profile
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="First Name"
                            name="firstName"
                            value={formData?.firstName}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Last Name"
                            name="lastName"
                            value={formData?.lastName}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Email"
                            name="email"
                            value={formData?.email}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Phone Number"
                            name="phoneNumber"
                            value={formData?.phoneNumber}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Profile Picture URL"
                            name="profilePicture"
                            value={formData?.profilePicture}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="role-label">Role</InputLabel>
                            <Select
                                labelId="role-label"
                                name="role"
                                value={formData?.role}
                                onChange={handleChange}
                                label="Role"
                            >
                                {roles?.map((role) => (
                                    <MenuItem key={role} value={role}>
                                        {role}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel id="status-label">Status</InputLabel>
                            <Select
                                labelId="status-label"
                                name="status"
                                value={formData?.status}
                                onChange={handleChange}
                                label="Status"
                            >
                                {statuses?.map((status) => (
                                    <MenuItem key={status} value={status}>
                                        {status}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{
                                marginTop: "10px",
                                borderRadius: "16px",
                                backgroundColor: "#778887",
                                "&:hover": { backgroundColor: "#1d282d" },
                            }}
                        >
                            Update
                        </Button>
                    </form>
                </Box>
            </Modal>
        </Box>
    );
}
