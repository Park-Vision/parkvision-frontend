import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Home from "../Home/Home";
import React, { useEffect, useState } from "react";
import { deleteReservation, getUserReservations } from "../../actions/reservationActions";
import {
    Box,
    Container,
    List,
    Paper,
    Typography,
    Tooltip,
    Card,
    CardHeader,
    CardContent,
    CardActions
} from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import decodeToken from "../../utils/decodeToken";
import convertDate from "../../utils/convertDate";
import IconButton from '@mui/material/IconButton';
import { GET_PARKING_SPOT } from "../../actions/types";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { toast } from "react-toastify";
import { GradientButton } from "../../components/GradientButton";

export default function UserReservations() {
    const authenticationReducer = useSelector((state) => state.authenticationReducer);
    const hourRule = process.env.REACT_APP_HOUR_RULE;
    const pendingReservations = useSelector((state) => state.reservationReducer.reservationsPending);
    const archivedReservations = useSelector((state) => state.reservationReducer.reservationsArchived);
    const [showArchived, setShowArchived] = useState(false);

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const twoHoursFromNow = new Date();
    twoHoursFromNow.setHours(twoHoursFromNow.getHours() + parseInt(hourRule));


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
                });
        } else {
            navigate('/');
            return;
        }
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

    const handleEdit = (event) => {
        navigate('/reservation-edit/' + event.id);
    }

    const openCancelDialog = (reservation) => {
        setSelectedReservation(reservation);
        setOpenDialog(true);
    };

    const handleCancel = (event) => {
        openCancelDialog(event);
    }

    const cancelReservation = () => {
        dispatch(deleteReservation(selectedReservation.id)).then(() => {
            toast.success('Reservation deleted successfully.');
        }).catch((error) => {
            toast.error('Error deleting reservation: ' + error.message);
        });
    }

    const isReservationEditable = (reservation) => {
        return new Date(reservation.startDate) > (user.role === "USER" ? twoHoursFromNow : new Date());
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    RESERVATIONS
                </Typography>
                <div style={{ margin: '20px' }}>
                    <Grid container spacing={2} justifyContent="center">
                        <GradientButton
                            variant="contained"
                            onClick={handleShowPending}
                            style={{ marginRight: '10px' }}
                            disabled={!showArchived}
                        >
                            Pending
                        </GradientButton>
                        <GradientButton
                            variant="contained"
                            onClick={handleShowArchived}
                            disabled={showArchived}
                        >
                            Archived
                        </GradientButton>
                    </Grid>
                </div>
            </Box>
            {showArchived ? (
                <Grid item xs={12}>
                    {archivedReservations && archivedReservations?.length > 0 ? (
                        <List>
                            {archivedReservations.map((reservation) => (
                                <Card key={reservation.id} elevation={3} style={{ padding: 20, margin: 10 }}>
                                    <CardHeader
                                        title={
                                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                                                Reservation ID: {reservation.id}
                                            </Typography>
                                        }
                                        action={
                                            <Tooltip title={`You cannot edit or cancel reservation`} arrow placement="top">
                                                <IconButton>
                                                    <InfoIcon />
                                                </IconButton>
                                            </Tooltip>
                                        }>
                                    </CardHeader>
                                    <CardContent>
                                        <Typography variant="body1">Parking: {reservation.parkingSpotDTO.parkingDTO.name}</Typography>
                                        <Typography variant="body1">Spot Number: {reservation.parkingSpotDTO.spotNumber}</Typography>
                                        <Typography variant="body1">Start: {convertDate(reservation.startDate)}</Typography>
                                        <Typography variant="body1">End: {convertDate(reservation.endDate)}</Typography>
                                        <Typography variant="body1">Registration Number: {reservation.registrationNumber}</Typography>
                                        <Typography variant="body1">Name: {reservation.userDTO.firstName} {reservation.userDTO.lastName}</Typography>
                                        <Typography variant="body1">Amount: {reservation.amount} {reservation.parkingSpotDTO.parkingDTO.currency}</Typography>
                                    </CardContent>
                                </Card>
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
                    {pendingReservations && pendingReservations?.length > 0 ? (
                        pendingReservations.map((reservation) => (
                            <Card key={reservation.id} elevation={3} style={{ padding: 20, margin: 10 }}>
                                <CardHeader
                                    title={
                                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                                            Reservation ID: {reservation.id}
                                        </Typography>
                                    }
                                    action={
                                        isReservationEditable(reservation) ? (
                                            <Tooltip title={`You can edit or cancel reservation up to ${hourRule} 
                                        hours before the start time and still get a refund.`} arrow placement="top">
                                                <IconButton>
                                                    <InfoIcon />
                                                </IconButton>
                                            </Tooltip>
                                        ) : (
                                            <Tooltip title={`You cannot edit or cancel reservation`} arrow placement="top">
                                                <IconButton>
                                                    <InfoIcon />
                                                </IconButton>
                                            </Tooltip>
                                        )

                                    }>
                                </CardHeader>
                                <CardContent>
                                    <Typography variant="body1">Parking: {reservation.parkingSpotDTO.parkingDTO.name}</Typography>
                                    <Typography variant="body1">Spot Number: {reservation.parkingSpotDTO.spotNumber}</Typography>
                                    <Typography variant="body1">Start: {convertDate(reservation.startDate)}</Typography>
                                    <Typography variant="body1">End: {convertDate(reservation.endDate)}</Typography>
                                    <Typography variant="body1">Registration Number: {reservation.registrationNumber}</Typography>
                                    <Typography variant="body1">Name: {reservation.userDTO.firstName} {reservation.userDTO.lastName}</Typography>
                                    <Typography variant="body1">Amount: {reservation.amount} {reservation.parkingSpotDTO.parkingDTO.currency}</Typography>
                                </CardContent>
                                <CardActions>
                                    {
                                        isReservationEditable(reservation) && (
                                            <div style={{ textAlign: 'right' }}>
                                                <IconButton style={{ fontSize: 30 }} color="primary" aria-label="edit" onClick={() => handleEdit(reservation)}>
                                                    <ModeEditIcon />
                                                </IconButton>
                                                <IconButton style={{ fontSize: 30 }} color="primary" aria-label="cancel" onClick={() => handleCancel(reservation)}>
                                                    <DeleteIcon style={{ fontSize: 30 }} />
                                                </IconButton>
                                            </div>
                                        )
                                    }
                                </CardActions>
                            </Card>
                        ))
                    ) : (
                        <Typography variant="body1" align="center">
                            No pending reservations found.
                        </Typography>
                    )}
                </Grid>
            )
            }
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Confirmation"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to cancel this reservation?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => {
                        cancelReservation();
                        setOpenDialog(false)
                    }} color="primary" autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Container >

    );
}
