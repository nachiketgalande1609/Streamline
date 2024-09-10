import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { UserContext } from "../context/UserContext";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import InputLabel from "@mui/material/InputLabel";

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
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
    const roles = ["admin", "user", "manager"]; // Example roles
    const statuses = ["active", "inactive", "pending"]; // Example statuses

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

        if (user?.email) {
            fetchUserProfile();
        }
    }, [user?.email]);

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
                email: formData.email,
            });
            setUserData(response?.data?.data);

            handleCloseModal();
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(); // Customize the format as needed
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Profile
            </Typography>
            <Button
                variant="outlined"
                startIcon={<ModeEditOutlineIcon />}
                onClick={handleOpenModal}
            >
                Edit Profile
            </Button>

            {/* Display Profile Picture */}
            {userData?.profilePicture && (
                <div style={{ textAlign: "center", marginBottom: 16 }}>
                    <img
                        src={userData.profilePicture}
                        alt="Profile"
                        style={{
                            width: 100,
                            height: 100,
                            borderRadius: "50%",
                        }}
                    />
                </div>
            )}

            <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableBody>
                        <TableRow>
                            <TableCell>First Name</TableCell>
                            <TableCell>{userData?.firstName}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Last Name</TableCell>
                            <TableCell>{userData?.lastName}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Email</TableCell>
                            <TableCell>{userData?.email}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Phone Number</TableCell>
                            <TableCell>{userData?.phoneNumber}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Role</TableCell>
                            <TableCell>{userData?.role}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Status</TableCell>
                            <TableCell>{userData?.status}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Joined</TableCell>
                            <TableCell>
                                {userData?.createdAt
                                    ? formatDate(userData.createdAt)
                                    : "N/A"}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Last Login</TableCell>
                            <TableCell>
                                {userData?.lastLogin
                                    ? formatDate(userData.lastLogin)
                                    : "N/A"}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

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
                            value={formData.firstName}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Last Name"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Phone Number"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Profile Picture URL"
                            name="profilePicture"
                            value={formData.profilePicture}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <InputLabel>Role</InputLabel>
                        <Select
                            label="Role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        >
                            {roles.map((role) => (
                                <MenuItem key={role} value={role}>
                                    {role}
                                </MenuItem>
                            ))}
                        </Select>
                        <InputLabel>Status</InputLabel>
                        <Select
                            label="Status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        >
                            {statuses.map((status) => (
                                <MenuItem key={status} value={status}>
                                    {status}
                                </MenuItem>
                            ))}
                        </Select>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                        >
                            Save Changes
                        </Button>
                    </form>
                </Box>
            </Modal>
        </div>
    );
}
