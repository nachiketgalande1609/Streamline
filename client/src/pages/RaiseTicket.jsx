import React, { useState, useContext } from "react";
import axios from "axios";
import { Box, TextField, Typography, Button, Snackbar, Alert, MenuItem, Select, FormControl, InputLabel, Grid } from "@mui/material";
import BreadcrumbsComponent from "../parts/BreadcrumbsComponent";
import { UserContext } from "../context/UserContext";

export default function RaiseTicket() {
    const { user } = useContext(UserContext);
    const [issueType, setIssueType] = useState("");
    const [priority, setPriority] = useState("");
    const [subject, setSubject] = useState("");
    const [description, setDescription] = useState("");
    const [department, setDepartment] = useState("");
    const [alertOpen, setAlertOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [alertSeverity, setAlertSeverity] = useState("success");

    const breadcrumbs = [
        { label: "Home", path: "/" },
        { label: "Raise Ticket", path: "" },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!issueType || !subject || !description) {
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
            formData.append("department", department);
            formData.append("userId", user.id);

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
        setPriority("");
        setSubject("");
        setDescription("");
        setDepartment("");
    };

    const handleAlertClose = () => {
        setAlertOpen(false);
    };

    return (
        <div>
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="h5" gutterBottom sx={{ flexGrow: 1 }}>
                    Raise Ticket
                </Typography>
            </Box>

            <BreadcrumbsComponent breadcrumbs={breadcrumbs} />

            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    maxWidth: "600px",
                    margin: "auto",
                    marginTop: 3,
                    padding: 3,
                    boxShadow: 2,
                    borderRadius: "16px",
                    bgcolor: "background.paper",
                }}
            >
                <FormControl fullWidth required>
                    <InputLabel id="issue-type-label">Issue Type</InputLabel>
                    <Select labelId="issue-type-label" value={issueType} onChange={(e) => setIssueType(e.target.value)} sx={{ borderRadius: "16px" }}>
                        <MenuItem value="Bug">Bug</MenuItem>
                        <MenuItem value="Billing">Billing</MenuItem>
                        <MenuItem value="Feature Request">Feature Request</MenuItem>
                        <MenuItem value="UI Issue">UI Issue</MenuItem>
                        <MenuItem value="Performance">Performance</MenuItem>
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
                    <InputLabel id="priority-label">Priority</InputLabel>
                    <Select labelId="priority-label" value={priority} onChange={(e) => setPriority(e.target.value)} sx={{ borderRadius: "16px" }}>
                        <MenuItem value="low">Low</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="high">High</MenuItem>
                        <MenuItem value="critical">Critical</MenuItem>
                    </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel id="department-label">Department</InputLabel>
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

                <Button
                    variant="contained"
                    type="submit"
                    sx={{
                        borderRadius: "16px",
                        backgroundColor: "#000000",
                        "&:hover": {
                            backgroundColor: "#424242",
                        },
                        mt: 2,
                    }}
                >
                    Submit Ticket
                </Button>
            </Box>

            <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleAlertClose} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
                <Alert onClose={handleAlertClose} severity={alertSeverity} sx={{ width: "100%" }}>
                    {message}
                </Alert>
            </Snackbar>
        </div>
    );
}
