// BreadcrumbsComponent.js
import React from "react";
import { emphasize, styled } from "@mui/material/styles";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Chip from "@mui/material/Chip";
import HomeIcon from "@mui/icons-material/Home";

const StyledBreadcrumb = styled(Chip)(({ theme, active }) => {
    const backgroundColor =
        theme.palette.mode === "light"
            ? theme.palette.grey[100]
            : theme.palette.grey[800];

    return {
        backgroundColor: active ? "#000000" : backgroundColor,
        padding: "10px 5px 10px",
        color: active ? theme.palette.common.white : theme.palette.text.primary,
        fontWeight: active
            ? theme.typography.fontWeightBold
            : theme.typography.fontWeightRegular,
        "&:hover, &:focus": {
            backgroundColor: active
                ? "#000000"
                : emphasize(backgroundColor, 0.06),
        },
        "&:active": {
            boxShadow: theme.shadows[1],
            backgroundColor: active
                ? "#000000"
                : emphasize(backgroundColor, 0.12),
        },
    };
});

const BreadcrumbsComponent = ({ breadcrumbs }) => {
    return (
        <Breadcrumbs
            aria-label="breadcrumb"
            separator="›"
            sx={{ marginBottom: "10px" }}
        >
            {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return isLast ? (
                    <StyledBreadcrumb
                        key={crumb.label}
                        label={crumb.label}
                        active={true}
                        icon={
                            index === 0 && breadcrumbs.length === 1 ? (
                                <HomeIcon fontSize="small" />
                            ) : null
                        }
                    />
                ) : (
                    <StyledBreadcrumb
                        key={crumb.label}
                        component="a"
                        href={crumb.path}
                        label={crumb.label}
                        icon={
                            index === 0 ? <HomeIcon fontSize="small" /> : null
                        }
                    />
                );
            })}
        </Breadcrumbs>
    );
};

export default BreadcrumbsComponent;
