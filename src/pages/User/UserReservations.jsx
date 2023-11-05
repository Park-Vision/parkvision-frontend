import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import Home from "../Home/Home";
import React, {useEffect, useState} from "react";
import {getUserReservations} from "../../actions/reservationActions";
import {
    Box,
    Container,
    List,
    ListItem,
    ListItemText,
    Paper,
    TableCell,
    TableHead,
    Table,
    TableContainer,
    TableBody,
    TableRow,
    Typography
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import ListIcon from "@mui/icons-material/List";
import PlaceIcon from "@mui/icons-material/Place";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function UserReservations() {
    const authenticationReducer = useSelector((state) => state.authenticationReducer);
    const reservations = useSelector((state) => state.reservationReducer.reservations);
    const [archivedReservations, setArchivedReservations] = useState([]);
    const [pendingReservations, setPendingReservations] = useState([]);
    const [showArchived, setShowArchived] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getUserReservations());
        setArchivedReservations(reservations.Archived);
        setPendingReservations(reservations.Pending);
    }, []);

    const handleShowArchived = () => {
        setShowArchived(true);
    };

    const handleShowPending = () => {
        setShowArchived(false);
    };

    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZone: 'UTC' };
        return date.toLocaleString('en-US', options);
    }


    console.log(archivedReservations);
    console.log(pendingReservations);


    if (!authenticationReducer.decodedUser || authenticationReducer.decodedUser.role !== 'USER') {
        navigate('/');
        return <Home />;
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    USER RESERVATIONS
                </Typography>
                <div style={{ margin: '20px' }}>
                    <Grid container spacing={2} justifyContent="center">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleShowPending}
                            style={{ marginRight: '10px' }}
                            disabled={!showArchived}
                        >
                            Pending
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleShowArchived}
                            disabled={showArchived}
                        >
                            Archived
                        </Button>
                    </Grid>
                </div>
            </Box>
            {showArchived ? (
                <Grid item xs={12}>
                    {archivedReservations && archivedReservations.length > 0 ? (
                            <List>
                                {archivedReservations.map((reservation) => (
                                    <Paper key={reservation.id} elevation={3} style={{ padding: 20, margin: 10 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                                            Reservation ID: {reservation.id}
                                        </Typography>
                                        <Typography variant="body1">Start Date: {formatDate(reservation.startDate)}</Typography>
                                        <Typography variant="body1">End Date: {formatDate(reservation.endDate)}</Typography>
                                        <Typography variant="body1">Registration Number: {reservation.registrationNumber}</Typography>
                                        <Typography variant="body1">User: {reservation.userDTO.firstName} {reservation.userDTO.lastName}</Typography>
                                        <Typography variant="body1">Parking Spot Number: {reservation.parkingSpotDTO.spotNumber}</Typography>
                                    </Paper>
                                ))}
                            </List>
                    ) : (
                        <Typography variant="body1" align="center">
                            No archived reservations found.
                        </Typography>
                    )}
                </Grid>
            ) : (
                <Grid item xs={12}>
                    {pendingReservations && pendingReservations.length > 0 ? (
                        pendingReservations.map((reservation) => (
                            <Paper key={reservation.id} elevation={3} style={{ padding: 20, margin: 10 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                                    Reservation ID: {reservation.id}
                                </Typography>
                                <Typography variant="body1">Start Date: {formatDate(reservation.startDate)}</Typography>
                                <Typography variant="body1">End Date: {formatDate(reservation.endDate)}</Typography>
                                <Typography variant="body1">Registration Number: {reservation.registrationNumber}</Typography>
                                <Typography variant="body1">User: {reservation.userDTO.firstName} {reservation.userDTO.lastName}</Typography>
                                <Typography variant="body1">Parking Spot Number: {reservation.parkingSpotDTO.spotNumber}</Typography>
                                <div style={{ textAlign: 'right' }}>
                                    <ModeEditIcon style={{ fontSize: 30 }} />
                                    <DeleteIcon style={{ fontSize: 30 }} />
                                </div>
                            </Paper>
                        ))
                    ) : (
                        <Typography variant="body1" align="center">
                            No pending reservations found.
                        </Typography>
                    )}
                </Grid>
            )}
        </Container>
        );
}




