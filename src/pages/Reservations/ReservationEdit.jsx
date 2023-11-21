import { useNavigate, useParams } from 'react-router-dom';
import { Container, Box, Typography, Paper, CardContent, TextField, Button, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import { MapContainer, TileLayer, FeatureGroup, Polygon, Popup } from 'react-leaflet';
import { addReservation, getReservation, updateReservation } from '../../actions/reservationActions';
import { getParkingSpot } from '../../actions/parkingSpotActions';
import { toast } from "react-toastify";
import { useState, useEffect } from 'react';
import { GET_PARKING_SPOT, GET_RESERVATIONS, UPDATE_RESERVATION } from '../../actions/types';
import { validateRegistraionNumber } from '../../utils/validation';
import decodeToken from '../../utils/decodeToken';
import { getUserReservations } from '../../actions/reservationActions';
import convertDate from '../../utils/convertDate';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import getLocalISOTime from '../../utils/getLocalISOTime';
import { checkParkingSpotAviability } from '../../actions/parkingSpotActions';
export default function ReservationEdit(props) {
    const { reservationId } = useParams();
    const navigate = useNavigate();
    const reservation = useSelector(state => state.reservationReducer.reservation);
    const parking = useSelector(state => state.parkingReducer.parking);
    const parkingSpotReducer = useSelector(state => state.parkingSpotReducer);
    const [loading, setLoading] = useState(false);
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [startDate, setStartDate] = useState(dayjs());
    const [endDate, setEndDate] = useState(dayjs());
    const [duration, setDuration] = useState(0);

    const dispatch = useDispatch()

    const userjson = JSON.parse(localStorage.getItem("user"));
    const user = decodeToken(userjson?.token);
    useEffect(() => {
        dispatch(getReservation(reservationId)).then((response) => {
            setStartDate(dayjs(response.startDate));
            setEndDate(dayjs(response.endDate));
            setDuration(dayjs(response.endDate).diff(dayjs(response.startDate), 'minutes'));
            dispatch(getParkingSpot(response.parkingSpotDTO.id));
            setRegistrationNumber(response.registrationNumber);
        });
        if (user) {
            dispatch(getUserReservations())
                .then(() => {
                });
        } else {
            navigate('/');
            return;
        }
    }, []);


    const handleAnyChangeOfTime = (startDate, endDate, parking) => {
        // check if there no resevrations in this time
        // if (!isParking24h(parking)) {
        //     if (startDate.toDate().getDate() !== dayjs(parkingTime).toDate().getDate()) {
        //         endDate = startDate;
        //     }
        // }
        endDate = startDate.add(duration, 'minutes');

        if (!parking.timeZone) {
            return;
        }

        setStartDate(startDate);
        const start = getLocalISOTime(startDate, parking.timeZone);

        setEndDate(endDate);
        const end = getLocalISOTime(endDate, parking.timeZone);

        dispatch(checkParkingSpotAviability(parking.id, reservation.id, start, end));
    }


    const transformResevationDates = (reservation, parking) => {
        debugger
        const start = getLocalISOTime(startDate, parking.timeZone);
        const end = getLocalISOTime(endDate, parking.timeZone);
        return {
            ...reservation,
            startDate: start,
            endDate: end,
        };
    }

    const handleEditClick = (parking) => {
        if (!validateRegistraionNumber(registrationNumber)) {
            toast.error('Please enter valid registration number: not empty and no white spaces.');
            return;
        }

        reservation.registrationNumber = registrationNumber;

        try {
            setLoading(true);
            dispatch(updateReservation(transformResevationDates(reservation, parking)))
                .then(response => {
                    setLoading(false);
                    toast.success('reservation updated');
                    navigate(-1);
                }, error => {
                    setLoading(false);
                    console.log(error);
                    toast.error(error.message);
                }
                );
        }
        catch (e) {
            console.log(e);
            setLoading(false);
            toast.error('coflict!');
        }
    };

    const handleExitClick = () => {
        navigate(-1);
    };

    const handleChangeRegistrationNumber = (value) => {
        if (!validateRegistraionNumber(value)) {
            toast.warning('Please enter valid registration number: not empty and no white spaces.');
        }
        setRegistrationNumber(value);
    }

    const minEndDate = () => {
        return startDate.add(duration, 'minutes');
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Rerservation Edit
                </Typography>
                {loading && <Box
                    sx={{
                        display: "flex",
                        "align-content": "center",
                        "justify-content": "center",
                        "flex-direction": "row",
                        "flex-wrap": "wrap",
                    }}
                    style={{ width: "100%", height: "100%" }}
                >
                    <CircularProgress />
                </Box>}
                {reservation && reservation.id && (
                    <Paper>
                        <CardContent>
                            <div style={{ height: '500px' }}>
                                {parkingSpotReducer.parkingSpot && parkingSpotReducer.parkingSpot.id && (
                                    <MapContainer
                                        style={{ width: '100%', height: '100%' }}
                                        center={[parkingSpotReducer.parkingSpot.pointsDTO[0].latitude, parkingSpotReducer.parkingSpot.pointsDTO[0].longitude]}
                                        zoom={21}
                                        scrollWheelZoom={true}
                                    >
                                        <FeatureGroup>
                                        </FeatureGroup>

                                        <TileLayer
                                            maxNativeZoom={22}
                                            maxZoom={22}
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            url="http://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                                        />
                                        {parkingSpotReducer.parkingSpot && parkingSpotReducer.parkingSpot.id && (
                                            <Polygon
                                                positions={parkingSpotReducer.parkingSpot.pointsDTO.map((point) => [
                                                    point.latitude,
                                                    point.longitude,
                                                ])}
                                                color='orange'
                                                interactive
                                            >
                                                <Popup>{`Selected Parking Spot ID: ${parkingSpotReducer.parkingSpot.id}`} <br></br> Click to deselect</Popup>
                                            </Polygon>
                                        )}


                                    </MapContainer>
                                )}
                            </div>
                            <Typography margin='normal'>
                                Dates and times are based on parking time zone ({reservation?.parkingSpotDTO?.parkingDTO?.timeZone}) compared to UTC.
                            </Typography>
                            <LocalizationProvider

                                dateAdapter={AdapterDayjs}>
                                <MobileDateTimePicker

                                    label="Start date"
                                    value={startDate}
                                    slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
                                    ampm={false}
                                    minutesStep={15}
                                    disablePast={true}
                                    onChange={(value) => handleAnyChangeOfTime(value, endDate, reservation.parkingSpotDTO?.parkingDTO)}
                                    minDateTime={dayjs(reservation.startDate)}
                                />
                            </LocalizationProvider>
                            <LocalizationProvider
                                dateAdapter={AdapterDayjs}>
                                <MobileDateTimePicker
                                    margin='normal'
                                    label="End date"
                                    value={endDate}
                                    slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
                                    ampm={false}
                                    minutesStep={15}
                                    minDateTime={minEndDate()}
                                    onChange={(value) => handleAnyChangeOfTime(startDate, value, reservation.parkingSpotDTO?.parkingDTO)}
                                    disabled={true}

                                />
                            </LocalizationProvider>
                            {parkingSpotReducer.freeParkingSpots && parkingSpotReducer.freeParkingSpots.find(spot => spot.id === reservation.parkingSpotDTO.id) && (
                                <Typography
                                    margin='normal'>
                                    Spot available
                                </Typography>
                            )}
                            <TextField fullWidth
                                margin='normal'
                                value={reservation.amount + ' ' + reservation.parkingSpotDTO?.parkingDTO?.currency}
                                label="Amount"
                                variant="outlined"
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                            <TextField fullWidth
                                margin='normal'
                                value={registrationNumber}
                                label="Registration number"
                                variant="outlined"
                                onChange={(value) => handleChangeRegistrationNumber(value.target.value)}
                            />
                            <TextField fullWidth
                                margin='normal'
                                value={`${reservation.parkingSpotDTO?.parkingDTO.name}, ${reservation.parkingSpotDTO?.parkingDTO.street}, ${reservation.parkingSpotDTO?.parkingDTO.city}`}
                                label="Parking name"
                                variant="outlined"
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                            <TextField fullWidth
                                margin='normal'
                                value={reservation.parkingSpotDTO?.spotNumber}
                                label="Parking spot"
                                variant="outlined"
                                InputProps={{
                                    readOnly: true,
                                }}
                                InputLabelProps={{ shrink: true }}


                            />
                            <Button
                                sx={{ mt: 2 }}
                                margin='normal'
                                variant="contained"
                                onClick={() => handleEditClick(reservation.parkingSpotDTO.parkingDTO)}
                                fullWidth>
                                Save
                            </Button>
                            <Button
                                sx={{ mt: 2 }}
                                variant="outlined"
                                onClick={handleExitClick}
                                fullWidth>
                                Exit
                            </Button>

                        </CardContent>
                    </Paper>
                )}
            </Box>
        </Container>
    )
}