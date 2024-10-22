import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
    Box,
    Typography,
    CircularProgress,
    TextField,
    MenuItem,
    Grid,
    Button,
    Snackbar,
    Alert,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Card,
    CardContent,
    Chip,
    IconButton,
    LinearProgress,
    Autocomplete,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BreadcrumbsComponent from "../parts/BreadcrumbsComponent";

const SLA_DURATION = 4 * 60 * 60 * 1000;

export default function IncidentDetails() {
    const { ticketId } = useParams();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [alertOpen, setAlertOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");
    const [formState, setFormState] = useState({});
    const [historyLoading, setHistoryLoading] = useState(true);
    const [comment, setComment] = useState("");
    const [assignees, setAssignees] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

    const breadcrumbs = [
        { label: "Home", path: "/" },
        { label: "Incidents", path: "/incidents" },
        { label: `${ticketId}`, path: "" },
    ];

    const fetchTicketDetails = async () => {
        try {
            const response = await axios.get(`/api/tickets/${ticketId}`);
            if (response.data.success) {
                setTicket(response.data.data);
                setFormState(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching ticket details:", error);
        } finally {
            setLoading(false);
            setHistoryLoading(false);
        }
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 1000);

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);

    const fetchAssignees = async () => {
        try {
            const response = await axios.get(`/api/tickets/assignees`, {
                params: { search: debouncedSearchQuery },
            });
            const assigneeNames = response.data.assignees.map((assignee) => ({
                name: assignee.email, // Map the label to `name` for consistency
                _id: assignee._id, // Keep the ID for selection handling
            }));

            setAssignees(assigneeNames);
        } catch (error) {
            console.error("Error fetching assignees:", error);
        }
    };

    useEffect(() => {
        if (debouncedSearchQuery !== "") {
            fetchAssignees();
        }
    }, [debouncedSearchQuery]);

    const handleAssigneeChange = (event, value) => {
        setFormState((prev) => ({
            ...prev,
            assignedTo: value ? value._id : null,
        }));
    };

    useEffect(() => {
        fetchTicketDetails();
    }, [ticketId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormState((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        const modifiedFields = {};

        Object.keys(formState).forEach((key) => {
            if (formState[key] !== ticket[key]) {
                modifiedFields[key] = formState[key];
            }
        });

        if (Object.keys(modifiedFields).length === 0) {
            setMessage("No changes to save.");
            setSeverity("info");
            setAlertOpen(true);
            return;
        }

        try {
            const response = await axios.put(`/api/tickets/${ticket._id}`, modifiedFields);
            if (response.data.success) {
                setMessage("Ticket Updated Successfully!");
                setSeverity("success");
                setAlertOpen(true);
                setTicket(formState);
            }
        } catch (error) {
            console.error("Error updating ticket:", error);
            setMessage("Failed to update ticket. Please try again.");
            setSeverity("error");
            setAlertOpen(true);
        } finally {
            fetchTicketDetails();
        }
    };

    const handleCommentSubmit = async () => {
        try {
            const response = await axios.put(`/api/tickets/comment/`, comment);
            if (response.data.success) {
                setMessage("Comment Submitted Successfully!");
                setSeverity("success");
                setAlertOpen(true);
                setTicket(formState);
            }
        } catch (error) {
            console.error("Error Submitting Comment:", error);
            setMessage("Failed to submit comment. Please try again.");
            setSeverity("error");
            setAlertOpen(true);
        } finally {
            fetchTicketDetails();
        }
    };

    const handleAlertClose = () => {
        setAlertOpen(false);
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!ticket) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Typography variant="h6" color="error">
                    Ticket not found.
                </Typography>
            </Box>
        );
    }

    const IncidentDetailsAccordion = () => {
        return (
            <Accordion defaultExpanded slotProps={{ heading: { component: "h4" } }}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                    sx={{
                        backgroundColor: "#000",
                        color: "white",
                    }}
                >
                    Incident Details
                </AccordionSummary>
                <AccordionDetails sx={{ padding: "20px " }}>
                    <Grid container spacing={2}>
                        {/* Ticket ID */}
                        <Grid item sm={2} container alignItems="center" justifyContent="flex-end">
                            <Typography variant="body2">Ticket ID</Typography>
                        </Grid>
                        <Grid item sm={4}>
                            <TextField
                                value={formState.ticketId || ""}
                                name="ticketId"
                                sx={{ width: "300px" }}
                                InputProps={{
                                    style: {
                                        borderRadius: "16px",
                                    },
                                }}
                            />
                        </Grid>

                        {/* Issue Type */}
                        <Grid item sm={2} container alignItems="center" justifyContent="flex-end">
                            <Typography variant="body2">Issue Type</Typography>
                        </Grid>
                        <Grid item sm={4}>
                            <TextField
                                value={formState.issueType || ""}
                                name="issueType"
                                sx={{ width: "300px" }}
                                select
                                onChange={handleInputChange}
                                InputProps={{
                                    style: { borderRadius: "16px" },
                                }}
                            >
                                {["Bug", "Billing", "Feature Request", "UI Issues", "Performance", "Other"].map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        {/* Department */}
                        <Grid item sm={2} container alignItems="center" justifyContent="flex-end">
                            <Typography variant="body2">Department</Typography>
                        </Grid>
                        <Grid item sm={4}>
                            <TextField
                                value={formState.department || ""}
                                name="department"
                                sx={{ width: "300px" }}
                                select
                                onChange={handleInputChange}
                                InputProps={{
                                    style: { borderRadius: "16px" },
                                }}
                            >
                                {["Support", "Sales", "Billing", "Technical", "Other"].map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        {/* Subject */}
                        <Grid item sm={2} container alignItems="center" justifyContent="flex-end">
                            <Typography variant="body2">Subject</Typography>
                        </Grid>
                        <Grid item sm={4}>
                            <TextField
                                value={formState.subject || ""}
                                name="subject"
                                sx={{ width: "300px" }}
                                onChange={handleInputChange}
                                InputProps={{
                                    style: { borderRadius: "16px" },
                                }}
                            />
                        </Grid>

                        {/* Priority */}
                        <Grid item sm={2} container alignItems="center" justifyContent="flex-end">
                            <Typography variant="body2">Priority</Typography>
                        </Grid>
                        <Grid item sm={4}>
                            <TextField
                                value={formState.priority || ""}
                                name="priority"
                                sx={{ width: "300px" }}
                                select
                                onChange={handleInputChange}
                                InputProps={{
                                    style: { borderRadius: "16px" },
                                }}
                            >
                                {["low", "medium", "high", "critical"].map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        {/* Status */}
                        <Grid item sm={2} container alignItems="center" justifyContent="flex-end">
                            <Typography variant="body2">Status</Typography>
                        </Grid>
                        <Grid item sm={4}>
                            <TextField
                                value={formState.status || ""}
                                name="status"
                                sx={{ width: "300px" }}
                                select
                                onChange={handleInputChange}
                                InputProps={{
                                    style: { borderRadius: "16px" },
                                }}
                            >
                                {["open", "in progress", "resolved", "closed"].map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item sm={2} container alignItems="center" justifyContent="flex-end">
                            <Typography variant="body2">Assigned To</Typography>
                        </Grid>
                        <Grid item sm={4}>
                            <Autocomplete
                                options={assignees || []} // Corrected: No nested array
                                getOptionLabel={(option) => option.name || ""} // Using `name` consistently
                                value={assignees?.find((a) => a._id === formState.assignedTo) || null}
                                onChange={handleAssigneeChange}
                                onInputChange={(event, newInputValue) => setSearchQuery(newInputValue)} // Update searchQuery as user types
                                isOptionEqualToValue={(option, value) => option._id === value._id} // Match options by unique _id
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Search Assignee"
                                        name="assignedTo"
                                        sx={{ width: "300px" }}
                                        InputProps={{
                                            ...params.InputProps,
                                            style: { borderRadius: "16px" },
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Created Date */}
                        <Grid item sm={2} container alignItems="center" justifyContent="flex-end">
                            <Typography variant="body2">Created Date</Typography>
                        </Grid>
                        <Grid item sm={4}>
                            <TextField
                                value={new Date(formState.createdAt).toLocaleString() || ""}
                                name="createdAt"
                                sx={{ width: "300px" }}
                                InputProps={{
                                    style: { borderRadius: "16px" },
                                }}
                            />
                        </Grid>
                        <Grid item sm={2} container alignItems="center" justifyContent="flex-end">
                            <Typography variant="body2">Last Updated</Typography>
                        </Grid>
                        <Grid item sm={4}>
                            <TextField
                                value={new Date(formState?.updatedAt).toLocaleString() || ""}
                                name="updatedAt"
                                sx={{ width: "300px" }}
                                InputProps={{
                                    style: { borderRadius: "16px" },
                                }}
                            />
                        </Grid>
                        <Grid item sm={2} container alignItems="center" justifyContent="flex-end">
                            <Typography variant="body2">Description</Typography>
                        </Grid>
                        <Grid item sm={4}>
                            <TextField
                                value={formState.description || ""}
                                name="description"
                                sx={{ width: "300px" }}
                                multiline
                                rows={4}
                                onChange={handleInputChange}
                                InputProps={{
                                    style: { borderRadius: "16px" },
                                }}
                            />
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>
        );
    };

    const TicketHistoryAccordion = () => {
        return (
            <Accordion defaultExpanded>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}
                    aria-controls="panel2-content"
                    id="panel2-header"
                    sx={{
                        backgroundColor: "#000000",
                        color: "#fff",
                    }}
                >
                    <Typography>Activity</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ padding: "20px" }}>
                    {historyLoading ? (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                width: "100%",
                            }}
                        >
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            {/* Comment Box for User Input */}
                            <Box
                                component="form"
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    marginBottom: 2,
                                    alignItems: "center",
                                    width: "100%",
                                }}
                                onSubmit={handleCommentSubmit} // Function to handle comment submission
                            >
                                <TextField
                                    label="Add a comment"
                                    multiline
                                    minRows={3}
                                    maxRows={5}
                                    variant="outlined"
                                    value={comment} // State for the comment input
                                    onChange={(e) => setComment(e.target.value)} // Function to update comment state
                                    sx={{ width: "80%" }}
                                    InputProps={{
                                        endAdornment: (
                                            <IconButton
                                                type="submit"
                                                color="primary"
                                                disabled={!comment} // Disable button if no comment is entered
                                            >
                                                <SendIcon />
                                            </IconButton>
                                        ),
                                        style: {
                                            borderRadius: "16px",
                                        },
                                    }}
                                />
                            </Box>

                            {/* History Section */}
                            {ticket.history.length === 0 ? (
                                <Typography color="textSecondary">No history available for this ticket.</Typography>
                            ) : (
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                    }}
                                >
                                    {ticket.history
                                        .slice()
                                        .reverse()
                                        .map((historyItem, index) => (
                                            <Card
                                                key={index}
                                                variant="outlined"
                                                sx={{
                                                    marginBottom: 2,
                                                    borderRadius: "12px",
                                                    border: "1px solid #bdc3c7",
                                                    width: "80%",
                                                }}
                                            >
                                                <CardContent
                                                    sx={{
                                                        position: "relative",
                                                        padding: "16px",
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            position: "absolute",
                                                            top: 10,
                                                            right: 10,
                                                        }}
                                                    >
                                                        <Typography color="textSecondary" variant="caption">
                                                            {new Date(historyItem.timestamp).toLocaleString()}
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="body1" fontWeight="bold">
                                                        {historyItem.updatedByName}
                                                    </Typography>

                                                    {historyItem.changes.map((change, changeIndex) => (
                                                        <Box
                                                            key={changeIndex}
                                                            sx={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                marginTop: 1,
                                                            }}
                                                        >
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    fontWeight: "bold",
                                                                    marginRight: 1,
                                                                }}
                                                            >
                                                                {change.field}
                                                            </Typography>
                                                            <Typography variant="body2" sx={{ marginRight: 2 }}>
                                                                changed from:
                                                            </Typography>
                                                            <Chip
                                                                label={change.oldValue || "Blank"}
                                                                color="default"
                                                                size="small"
                                                                sx={{
                                                                    marginRight: 1,
                                                                    padding: 1,
                                                                }}
                                                            />
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    marginRight: 1,
                                                                    padding: 1,
                                                                }}
                                                            >
                                                                ➔
                                                            </Typography>
                                                            <Chip label={change.newValue} color="primary" size="small" />
                                                        </Box>
                                                    ))}
                                                </CardContent>
                                            </Card>
                                        ))}
                                </Box>
                            )}
                        </>
                    )}
                </AccordionDetails>
            </Accordion>
        );
    };

    const SlaAccordion = ({ createdAt }) => {
        const [progress, setProgress] = useState(0);
        const [elapsedTime, setElapsedTime] = useState(0); // To track elapsed time
        const [remainingTime, setRemainingTime] = useState(SLA_DURATION);

        useEffect(() => {
            const interval = setInterval(() => {
                const now = new Date();
                const createdTime = new Date(createdAt);
                const timeElapsed = now - createdTime; // Time passed in milliseconds
                const timeRemaining = SLA_DURATION - timeElapsed; // Time remaining in milliseconds

                // Calculate progress percentage
                const progressPercentage = Math.min((timeElapsed / SLA_DURATION) * 100, 100); // Cap at 100%

                setProgress(progressPercentage);
                setElapsedTime(timeElapsed); // Update elapsed time
                setRemainingTime(Math.max(timeRemaining, 0)); // Avoid negative remaining time
            }, 1000); // Update every second

            return () => clearInterval(interval); // Cleanup on component unmount
        }, [createdAt]);

        // Helper function to format milliseconds into HH:MM:SS
        const formatTime = (ms) => {
            const totalSeconds = Math.floor(ms / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        };

        const progressColor = () => {
            if (progress < 50) return "primary";
            if (progress < 75) return "warning";
            return "error";
        };

        return (
            <Accordion defaultExpanded>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}
                    aria-controls="panel3-content"
                    id="panel3-header"
                    sx={{
                        backgroundColor: "#000000",
                        color: "#fff",
                    }}
                >
                    <Typography>SLA Progress</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ padding: "20px", display: "flex", justifyContent: "center" }}>
                    <Box sx={{ width: "80%" }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                            <Typography variant="body1">Created: {new Date(createdAt).toLocaleString()}</Typography>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                            <Box sx={{ flexGrow: 1 }}>
                                <LinearProgress
                                    variant="determinate"
                                    value={progress}
                                    color={progressColor()}
                                    sx={{
                                        height: 12,
                                        borderRadius: 5,
                                        backgroundColor: "#e0e0e0",
                                    }}
                                />
                            </Box>
                            <Typography
                                variant="body1"
                                sx={{
                                    ml: 2,
                                    fontWeight: "bold",
                                    color: progress >= 100 ? "red" : "black",
                                }}
                            >
                                {Math.round(progress)}%
                            </Typography>
                        </Box>

                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                            <Typography variant="body2" color="textSecondary">
                                Time Elapsed: {formatTime(elapsedTime)}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Time Remaining: {formatTime(remainingTime)}
                            </Typography>
                        </Box>
                    </Box>
                </AccordionDetails>
            </Accordion>
        );
    };

    return (
        <div>
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="h5" gutterBottom sx={{ flexGrow: 1 }}>
                    Incident Details
                </Typography>
                <Button variant="outlined" color="default" onClick={handleSave} size="medium" sx={{ borderRadius: "16px" }}>
                    Update
                </Button>
            </Box>
            <BreadcrumbsComponent breadcrumbs={breadcrumbs} />

            <IncidentDetailsAccordion />
            <TicketHistoryAccordion />
            <SlaAccordion createdAt={ticket.createdAt} />

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
