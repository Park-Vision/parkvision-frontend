import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import MenuIcon from '@mui/icons-material/Menu';
import {useNavigate, useParams} from 'react-router-dom';
import IconButton from "@mui/material/IconButton";
import {Button, Drawer, List, ListItem, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getParking} from "../redux/actions/parkingActions";

const ManagerNavigation = (props) => {
    const { parkingId } = useParams();
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const parking = useSelector((state) => state.parkingReducer.parking);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getParking(parkingId));
    }, );

    const handleDrawerToggle = () => {
        setDrawerOpen(!isDrawerOpen);
    };

    const handleGoToParking = () => {
        navigate(`/parking/${parkingId}`);
    };

    const handleGoToEditor = () => {
        navigate(`/parking/${parkingId}/editor`);
    };

    const handleGoToReservations = () => {
        navigate(`/parking/${parkingId}/reservations`);
    };

    const handleGoToDroneManager = () => {
        navigate(`/parking/${parkingId}/drone`);
    };

    const handleGoToParkingDetails = () => {
        navigate(`/parking/${parkingId}/details`);
    };

    const handleGoToMission = () => {
        navigate(`/parking/${parkingId}/missions`);
    };

    const handleGoToDashboard = () => {
        navigate(`/parking/${parkingId}/dashboard`);
    };

    return (
        <>
            <AppBar position="relative" color="default">
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleDrawerToggle}>
                        <MenuIcon />
                    </IconButton>
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
                </Toolbar>
            </AppBar>
            <Drawer anchor="left" open={isDrawerOpen} onClose={handleDrawerToggle}>
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