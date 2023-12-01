import * as React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import IconButton from "@mui/material/IconButton";
import { Button, Drawer, List, ListItem, Typography } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";

const ManagerNavigation = () => {
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const parking = useSelector((state) => state.parkingReducer.parking);
    const navigate = useNavigate();

    const handleDrawerToggle = () => {
        setDrawerOpen(!isDrawerOpen);
    };

    const handleGoToParking = () => {
        navigate(`/parking/${parking.id}`);
    };

    const handleGoToEditor = () => {
        navigate(`/parking/${parking.id}/editor`);
    };

    const handleGoToReservations = () => {
        navigate(`/parking/${parking.id}/reservations`);
    };

    const handleGoToDroneManager = () => {
        navigate(`/parking/${parking.id}/drone`);
    };

    const handleGoToParkingDetails = () => {
        navigate(`/parking/${parking.id}/details`);
    };

    const handleGoToMission = () => {
        navigate(`/parking/${parking.id}/missions`);
    };

    const handleGoToDashboard = () => {
        navigate(`/parking/${parking.id}/dashboard`);
    };

    return (
        <>
            <IconButton edge="start" color="inherit" onClick={handleDrawerToggle} sx={{ m: 1 }}>
                <MenuIcon />
            </IconButton>
            <Drawer anchor="right" open={isDrawerOpen} onClose={handleDrawerToggle}>
                <List>
                    <ListItem>
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href=""
                            sx={{
                                mr: 2,
                                display: { xs: 'flex', md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            {parking.name}
                        </Typography>
                    </ListItem>
                    <ListItem onClick={handleGoToParking}>
                        <Button>
                            Parking
                        </Button>
                    </ListItem>
                    <ListItem onClick={handleGoToDashboard}>
                        <Button>
                            Dashboard
                        </Button>
                    </ListItem>
                    <ListItem onClick={handleGoToEditor}>
                        <Button>
                            Editor
                        </Button>
                    </ListItem>
                    <ListItem onClick={handleGoToReservations}>
                        <Button>
                            Reservations
                        </Button>
                    </ListItem>
                    <ListItem onClick={handleGoToParkingDetails}>
                        <Button>
                            change details
                        </Button>
                    </ListItem>
                    <ListItem onClick={handleGoToMission}>
                        <Button>
                            drone mission
                        </Button>
                    </ListItem>
                    <ListItem onClick={handleGoToDroneManager}>
                        <Button>
                            drone manager
                        </Button>
                    </ListItem>
                </List>
            </Drawer>
        </>
    );
};

export default ManagerNavigation;