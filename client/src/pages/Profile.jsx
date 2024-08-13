import React, { useContext } from "react";
import {
    Card,
    CardContent,
    Typography,
    Avatar,
    Grid,
    Button,
    Divider,
} from "@mui/material";
import { styled } from "@mui/system";
import { UserContext } from "../context/UserContext";

// Create a styled Card
const StyledCard = styled(Card)(({ theme }) => ({
    maxWidth: 600,
    margin: "auto",
    marginTop: theme.spacing(4),
}));

// Create a styled Avatar
const StyledAvatar = styled(Avatar)({
    width: 120,
    height: 120,
    margin: "auto",
});

// Create a styled Button
const StyledButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
}));

export default function Profile() {
    const { user, updateUser } = useContext(UserContext);

    return (
        <StyledCard>
            <CardContent>
                <Grid container direction="column" alignItems="center">
                    <StyledAvatar
                        alt="User Name"
                        src="/path/to/profile-pic.jpg"
                    />
                    <Typography variant="h4" component="h1" gutterBottom>
                        {user.name}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        {user.email}
                    </Typography>
                </Grid>
            </CardContent>
        </StyledCard>
    );
}
