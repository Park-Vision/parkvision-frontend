import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import Home from "../Home/Home";
import React, {useEffect, useState} from "react";
import {getUserReservations} from "../../actions/reservationActions";
import {
    Box,
    Container,
    List,
    Paper,
    Typography
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import decodeToken from "../../utils/decodeToken";
import convertDate from "../../utils/convertDate";
import IconButton from '@mui/material/IconButton';
import { GET_PARKING_SPOT } from "../../actions/types";

export default function UserReservations() {
    const authenticationReducer = useSelector((state) => state.authenticationReducer);

    const [archivedReservations, setArchivedReservations] = useState([]);
    const [pendingReservations, setPendingReservations] = useState([]);
    const [showArchived, setShowArchived] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const userjson = JSON.parse(localStorage.getItem("user"));
    const user = decodeToken(userjson?.token);

    useEffect(() => {
        dispatch({
            type: GET_PARKING_SPOT,
            value: null
        });
        if (user) {
            dispatch(getUserReservations())
                .then((response) => {
                    setArchivedReservations(response.Archived);
                    setPendingReservations(response.Pending);
                });
        } else {
            navigate('/');
            return;
        }
    }, [user, dispatch]);

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

    const handleEdit = (event) => {
        console.log(event);
        navigate('/reservation-edit/' + event.id);
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    RESERVATIONS
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
                                        <Typography variant="body1">Parking: {reservation.parkingSpotDTO.parkingDTO.name}</Typography>
                                        <Typography variant="body1">Spot Number: {reservation.parkingSpotDTO.spotNumber}</Typography>
                                        <Typography variant="body1">Start: {convertDate(reservation.startDate)}</Typography>
                                        <Typography variant="body1">End: {convertDate(reservation.endDate)}</Typography>
                                        <Typography variant="body1">Registration Number: {reservation.registrationNumber}</Typography>
                                        <Typography variant="body1">Name: {reservation.userDTO.firstName} {reservation.userDTO.lastName}</Typography>
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
                                <Typography variant="body1">Parking: {reservation.parkingSpotDTO.parkingDTO.name}</Typography>
                                <Typography variant="body1">Spot Number: {reservation.parkingSpotDTO.spotNumber}</Typography>
                                <Typography variant="body1">Start: {convertDate(reservation.startDate)}</Typography>
                                <Typography variant="body1">End: {convertDate(reservation.endDate)}</Typography>
                                <Typography variant="body1">Registration Number: {reservation.registrationNumber}</Typography>
                                <Typography variant="body1">Name: {reservation.userDTO.firstName} {reservation.userDTO.lastName}</Typography>
                                <div style={{ textAlign: 'right' }}>
                                    <IconButton style={{ fontSize: 30 }} color="primary" aria-label="edit" onClick={() => handleEdit(reservation)}>
                                        <ModeEditIcon />
                                    </IconButton>
                                    <IconButton style={{ fontSize: 30 }} color="primary" aria-label="cancel">
                                        <DeleteIcon style={{ fontSize: 30 }} />
                                    </IconButton>
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
