import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
    Box,
    Typography,
    CircularProgress,
    TextField,
    MenuItem,
    Paper,
    Grid,
    Button,
    Snackbar,
    Alert,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemText,
    Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BreadcrumbsComponent from "../parts/BreadcrumbsComponent";

export default function IncidentDetails() {
    const { ticketId } = useParams();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [alertOpen, setAlertOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");
    const [formState, setFormState] = useState({});
    const [historyLoading, setHistoryLoading] = useState(true);
    const [ticketHistory, setTicketHistory] = useState([]);

    const breadcrumbs = [
        { label: "Home", path: "/" },
        { label: "Incidents", path: "/incidents" },
        { label: `${ticketId}`, path: "" },
    ];

    useEffect(() => {
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
            }
        };

        const fetchTicketHistory = async () => {
            try {
                const response = await axios.get(
                    `/api/tickets/${ticketId}/history`
                );
                if (response.data.success) {
                    setTicketHistory(response.data.history);
                }
            } catch (error) {
                console.error("Error fetching ticket history:", error);
            } finally {
                setHistoryLoading(false);
            }
        };

        fetchTicketDetails();
        fetchTicketHistory();
    }, [ticketId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormState((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const response = await axios.put(
                `/api/tickets/${ticketId}`,
                formState
            );
            if (response.data.success) {
                setMessage("Ticket Updated Successfully!");
                setSeverity("success");
                setAlertOpen(true);
            }
        } catch (error) {
            console.error("Error updating ticket:", error);
            setMessage("Failed to update ticket. Please try again.");
            setSeverity("success");
            setAlertOpen(true);
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

    return (
        <div>
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="h5" gutterBottom sx={{ flexGrow: 1 }}>
                    Incident Details
                </Typography>
                <Button
                    variant="outlined"
                    color="default"
                    onClick={handleSave}
                    size="medium"
                    sx={{ borderRadius: "16px" }}
                >
                    Update
                </Button>
            </Box>
            <BreadcrumbsComponent breadcrumbs={breadcrumbs} />

            {/* Accordion for Incident Details */}
            <Accordion
                defaultExpanded
                slotProps={{ heading: { component: "h4" } }}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                    sx={{
                        backgroundColor: "#000",
                        color: "white",
                    }}
                >
                    Accordion
                </AccordionSummary>
                <AccordionDetails sx={{ padding: "20px " }}>
                    <Grid container spacing={2}>
                        {/* Ticket ID */}
                        <Grid
                            item
                            sm={2}
                            container
                            alignItems="center"
                            justifyContent="flex-end"
                        >
                            <Typography variant="body1">Ticket ID</Typography>
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
                        <Grid
                            item
                            sm={2}
                            container
                            alignItems="center"
                            justifyContent="flex-end"
                        >
                            <Typography variant="body1">Issue Type</Typography>
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
                                {[
                                    "Bug",
                                    "Billing",
                                    "Feature Request",
                                    "UI Issues",
                                    "Performance",
                                    "Other",
                                ].map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        {/* Department */}
                        <Grid
                            item
                            sm={2}
                            container
                            alignItems="center"
                            justifyContent="flex-end"
                        >
                            <Typography variant="body1">Department</Typography>
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
                                {[
                                    "Support",
                                    "Sales",
                                    "Billing",
                                    "Technical",
                                    "Other",
                                ].map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        {/* Subject */}
                        <Grid
                            item
                            sm={2}
                            container
                            alignItems="center"
                            justifyContent="flex-end"
                        >
                            <Typography variant="body1">Subject</Typography>
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
                        <Grid
                            item
                            sm={2}
                            container
                            alignItems="center"
                            justifyContent="flex-end"
                        >
                            <Typography variant="body1">Priority</Typography>
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
                                {["low", "medium", "high", "urgent"].map(
                                    (option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    )
                                )}
                            </TextField>
                        </Grid>

                        {/* Status */}
                        <Grid
                            item
                            sm={2}
                            container
                            alignItems="center"
                            justifyContent="flex-end"
                        >
                            <Typography variant="body1">Status</Typography>
                        </Grid>
                        <Grid item sm={4}>
                            <TextField
                                value={formState.status || ""}
                                name="state"
                                sx={{ width: "300px" }}
                                select
                                onChange={handleInputChange}
                                InputProps={{
                                    style: { borderRadius: "16px" },
                                }}
                            >
                                {[
                                    "open",
                                    "in progress",
                                    "resolved",
                                    "closed",
                                ].map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        {/* Created Date */}
                        <Grid
                            item
                            sm={2}
                            container
                            alignItems="center"
                            justifyContent="flex-end"
                        >
                            <Typography variant="body1">
                                Created Date
                            </Typography>
                        </Grid>
                        <Grid item sm={4}>
                            <TextField
                                value={
                                    new Date(
                                        formState.createdDate
                                    ).toLocaleString() || ""
                                }
                                name="createdDate"
                                sx={{ width: "300px" }}
                                InputProps={{
                                    style: { borderRadius: "16px" },
                                }}
                            />
                        </Grid>
                        <Grid
                            item
                            sm={2}
                            container
                            alignItems="center"
                            justifyContent="flex-end"
                        >
                            <Typography variant="body1">
                                Last Updated
                            </Typography>
                        </Grid>
                        <Grid item sm={4}>
                            <TextField
                                value={
                                    new Date(
                                        formState?.updatedDate
                                    ).toLocaleString() || ""
                                }
                                name="updatedDate"
                                sx={{ width: "300px" }}
                                InputProps={{
                                    style: { borderRadius: "16px" },
                                }}
                            />
                        </Grid>
                        <Grid
                            item
                            sm={2}
                            container
                            alignItems="center"
                            justifyContent="flex-end"
                        >
                            <Typography variant="body1">Description</Typography>
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

            {/* Accordion for History */}
            <Accordion
                defaultExpanded
                slotProps={{ heading: { component: "h4" } }}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                    sx={{
                        backgroundColor: "#000",
                        color: "white",
                    }}
                >
                    Accordion
                </AccordionSummary>
                <AccordionDetails sx={{ padding: "20px " }}>
                    {historyLoading ? (
                        <CircularProgress />
                    ) : (
                        <>
                            {ticketHistory.length === 0 ? (
                                <Typography>
                                    No history available for this ticket.
                                </Typography>
                            ) : (
                                <List>
                                    {ticketHistory.map((historyItem, index) => (
                                        <React.Fragment key={index}>
                                            <ListItem>
                                                <ListItemText
                                                    primary={historyItem.action}
                                                    secondary={`Updated by ${
                                                        historyItem.updatedBy
                                                    } on ${new Date(
                                                        historyItem.timestamp
                                                    ).toLocaleString()}`}
                                                />
                                            </ListItem>
                                            {index <
                                                ticketHistory.length - 1 && (
                                                <Divider />
                                            )}
                                        </React.Fragment>
                                    ))}
                                </List>
                            )}
                        </>
                    )}
                </AccordionDetails>
            </Accordion>

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
                <Alert
                    onClose={handleAlertClose}
                    severity={severity}
                    sx={{ width: "100%" }}
                >
                    {message}
                </Alert>
            </Snackbar>
        </div>
    );
}
