import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Paper,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Modal,
    Box,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Tooltip,
} from "@mui/material";
import { UserContext } from "../context/UserContext";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";

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
        lastLogin: "",
    });

    // Define options for status and role
    const roles = ["admin", "sales", "user", "manager"];
    const statuses = ["active", "inactive", "pending"];

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.post("api/users/profile", {
                    email: user?.email,
                });
                setUserData(response?.data?.data);
                setFormData(response?.data?.data); // Initialize form data
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
        return date?.toLocaleDateString(); // Customize the format as needed
    };

    return (
        <div style={{ padding: 20 }}>
            <Typography variant="h4" gutterBottom>
                Profile
            </Typography>
            <Button
                variant="outlined"
                startIcon={<ModeEditOutlineIcon />}
                onClick={handleOpenModal}
                sx={{ marginBottom: 2 }}
            >
                Edit Profile
            </Button>

            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent style={{ textAlign: "center" }}>
                            <img
                                src={
                                    userData?.profilePicture
                                        ? userData?.profilePicture
                                        : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                                }
                                alt="Profile"
                                style={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: "50%",
                                    marginBottom: 16,
                                }}
                            />
                            <Typography variant="h6">
                                {userData?.firstName} {userData?.lastName}
                            </Typography>
                            <Typography variant="body2">
                                {userData?.email}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={8}>
                    <TableContainer component={Card}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        <strong>First Name</strong>
                                    </TableCell>
                                    <TableCell>{userData?.firstName}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        <strong>Last Name</strong>
                                    </TableCell>
                                    <TableCell>{userData?.lastName}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        <strong>Email</strong>
                                    </TableCell>
                                    <TableCell>{userData?.email}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        <strong>Phone Number</strong>
                                    </TableCell>
                                    <TableCell>
                                        {userData?.phoneNumber}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        <strong>Role</strong>
                                    </TableCell>
                                    <TableCell>{userData?.role}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        <strong>Status</strong>
                                    </TableCell>
                                    <TableCell>{userData?.status}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        <strong>Joined</strong>
                                    </TableCell>
                                    <TableCell>
                                        {userData?.createdAt
                                            ? formatDate(userData?.createdAt)
                                            : "N/A"}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        <strong>Last Login</strong>
                                    </TableCell>
                                    <TableCell>
                                        {userData?.lastLogin
                                            ? formatDate(userData?.lastLogin)
                                            : "N/A"}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>

            <Modal
                open={modalOpen}
                onClose={handleCloseModal}
                aria-labelledby="edit-profile-modal"
                aria-describedby="edit-profile-form"
            >
                <Box sx={modalStyle}>
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
                            sx={{ marginTop: "10px" }}
                        >
                            Update
                        </Button>
                    </form>
                </Box>
            </Modal>
        </div>
    );
}
