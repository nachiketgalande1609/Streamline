import React, { useState, useContext } from "react";
import axios from "axios";
import {
    Box,
    TextField,
    Typography,
    Button,
    Snackbar,
    Alert,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Grid,
} from "@mui/material";
import BreadcrumbsComponent from "../parts/BreadcrumbsComponent";
import { UserContext } from "../context/UserContext";

export default function Contact() {
    const { user } = useContext(UserContext);
    const [issueType, setIssueType] = useState("");
    const [priority, setPriority] = useState("low");
    const [subject, setSubject] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [department, setDepartment] = useState("");
    const [alertOpen, setAlertOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [alertSeverity, setAlertSeverity] = useState("success");

    const breadcrumbs = [
        { label: "Home", path: "/" },
        { label: "Contact", path: "" },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!issueType || !subject || !description || !email) {
            setMessage("Please fill out all required fields.");
            setAlertSeverity("warning");
            setAlertOpen(true);
            return;
        }

        try {
            const formData = new FormData();
            formData.append("issueType", issueType);
            formData.append("priority", priority);
            formData.append("subject", subject);
            formData.append("description", description);
            formData.append("name", name);
            formData.append("email", email);
            formData.append("phone", phone);
            formData.append("department", department);
            formData.append("userId", user.id);
            if (file) formData.append("file", file);

            await axios.post("/api/tickets", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setMessage("Ticket submitted successfully!");
            setAlertSeverity("success");
            setAlertOpen(true);
            resetForm();
        } catch (error) {
            console.error("Error submitting ticket:", error);
            setMessage("Failed to submit the ticket. Please try again.");
            setAlertSeverity("error");
            setAlertOpen(true);
        }
    };

    const resetForm = () => {
        setIssueType("");
        setPriority("low");
        setSubject("");
        setDescription("");
        setFile(null);
        setName("");
        setEmail("");
        setPhone("");
        setDepartment("");
    };

    const handleAlertClose = () => {
        setAlertOpen(false);
    };

    return (
        <div>
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="h5" gutterBottom sx={{ flexGrow: 1 }}>
                    Contact Us
                </Typography>
            </Box>

            <BreadcrumbsComponent breadcrumbs={breadcrumbs} />

            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    maxWidth: "600px",
                    margin: "auto",
                    marginTop: 3,
                    padding: 3,
                    boxShadow: 2,
                    borderRadius: "16px",
                    bgcolor: "background.paper",
                }}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth required>
                            <InputLabel id="issue-type-label">
                                Issue Type
                            </InputLabel>
                            <Select
                                labelId="issue-type-label"
                                value={issueType}
                                onChange={(e) => setIssueType(e.target.value)}
                                sx={{ borderRadius: "16px" }}
                            >
                                <MenuItem value="Bug">Bug</MenuItem>
                                <MenuItem value="Billing">Billing</MenuItem>
                                <MenuItem value="Feature Request">
                                    Feature Request
                                </MenuItem>
                                <MenuItem value="UI Issue">UI Issue</MenuItem>
                                <MenuItem value="Performance">
                                    Performance
                                </MenuItem>
                                <MenuItem value="Other">Other</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            label="Subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            fullWidth
                            required
                            sx={{ mt: 2 }}
                            InputProps={{ style: { borderRadius: "16px" } }}
                        />

                        <TextField
                            label="Description"
                            multiline
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            fullWidth
                            required
                            sx={{ mt: 2 }}
                            InputProps={{ style: { borderRadius: "16px" } }}
                        />

                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel id="priority-label">
                                Priority
                            </InputLabel>
                            <Select
                                labelId="priority-label"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                sx={{ borderRadius: "16px" }}
                            >
                                <MenuItem value="low">Low</MenuItem>
                                <MenuItem value="medium">Medium</MenuItem>
                                <MenuItem value="high">High</MenuItem>
                                <MenuItem value="critical">Critical</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            fullWidth
                            required
                            InputProps={{ style: { borderRadius: "16px" } }}
                        />
                        <TextField
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            fullWidth
                            required
                            sx={{ mt: 2 }}
                            InputProps={{ style: { borderRadius: "16px" } }}
                        />
                        <TextField
                            label="Phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            fullWidth
                            sx={{ mt: 2 }}
                            InputProps={{ style: { borderRadius: "16px" } }}
                        />

                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel id="department-label">
                                Department
                            </InputLabel>
                            <Select
                                labelId="department-label"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                sx={{ borderRadius: "16px" }}
                            >
                                <MenuItem value="Support">Support</MenuItem>
                                <MenuItem value="Sales">Sales</MenuItem>
                                <MenuItem value="Billing">Billing</MenuItem>
                                <MenuItem value="Technical">Technical</MenuItem>
                                <MenuItem value="Other">Other</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                {/* Submit Button */}
                <Button
                    variant="contained"
                    component="label"
                    sx={{
                        mt: 2,
                        width: "100%",
                        borderRadius: "16px",
                        backgroundColor: "#000000",
                        "&:hover": {
                            backgroundColor: "#424242",
                        },
                    }}
                >
                    Upload Attachment
                    <input
                        type="file"
                        hidden
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                </Button>
                {file && <Typography sx={{ mt: 1 }}>{file.name}</Typography>}
                <Button
                    variant="contained"
                    type="submit"
                    sx={{
                        borderRadius: "16px",
                        backgroundColor: "#000000",
                        "&:hover": {
                            backgroundColor: "#424242",
                        },
                    }}
                >
                    Submit Ticket
                </Button>
            </Box>

            <Snackbar
                open={alertOpen}
                autoHideDuration={6000}
                onClose={handleAlertClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert
                    onClose={handleAlertClose}
                    severity={alertSeverity}
                    sx={{ width: "100%" }}
                >
                    {message}
                </Alert>
            </Snackbar>
        </div>
    );
}
