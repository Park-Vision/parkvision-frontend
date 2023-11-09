import { useNavigate, useParams} from 'react-router-dom';
import { Container, Box, Typography, Paper, CardContent, TextField, Button, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import { MapContainer, TileLayer, FeatureGroup, Polygon, Popup } from 'react-leaflet';
import { addReservation, getReservation, updateReservation } from '../../actions/reservationActions';
import { getParkingSpot } from '../../actions/parkingSpotActions';
import { toast } from "react-toastify";
import { useState, useEffect } from 'react';
import { GET_PARKING_SPOT, GET_RESERVATIONS, UPDATE_RESERVATION } from '../../actions/types';
import { set } from 'react-hook-form';
import { validateRegistraionNumber } from '../../utils/validation';

export default function ReservationEdit(props) {
    const { reservationId } = useParams();
    const navigate = useNavigate();
    const reservation = useSelector(state => state.reservationReducer.reservation);
    const parking = useSelector(state => state.parkingReducer.parking);
    const parkingSpotReducer = useSelector(state => state.parkingSpotReducer);
    const [loading, setLoading] = useState(false);
    const [registrationNumber, setRegistrationNumber] = useState('');

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getReservation(reservationId)).then((response) => {
            dispatch(getParkingSpot(response.parkingSpotDTO.id));

            setRegistrationNumber(response.registrationNumber);
        }
        );
        dispatch({
            type: GET_RESERVATIONS,
            value: []
        });
    }, []);


    const handleReseveClick = (event) => {

        if (!validateRegistraionNumber(registrationNumber)) {
            toast.error('Please enter valid registration number: not empty and no white spaces.');
            return;
        }

        reservation.registrationNumber = registrationNumber;

        try {
            setLoading(true);
            dispatch(updateReservation(reservation))
                .then(response => {
                    setLoading(false);
                    toast.success('reservation updated');
                    navigate('/profile/reservations');
                }
                );
        }
        catch (e) {
            console.log(e);
            setLoading(false);
            toast.error('coflict!');
        }
    };

    const handleEditClick = (event) => {
            navigate('/profile/reservations')
    };

    const handleChangeRegistrationNumber = (value) => {
        if (!validateRegistraionNumber(value)){
            toast.warning('Please enter valid registration number: not empty and no white spaces.');
        }
        setRegistrationNumber(value);
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
                <Paper>
                    <CardContent>
                        <div style={{ height: '500px'}}>
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
                        <Typography sx={{ m: 1 }} fullWidth>
                            Dates and times are based on parking time zone ({parking.timeZone}) compared to UTC.
                        </Typography>
                        <TextField sx={{ m: 1 }} fullWidth
                                value={`${new Date(reservation.startDate).toLocaleString()}`}
                                id="outlined-basic"
                                label="Start date"
                                variant="outlined" 
                                InputProps={{
                                    readOnly: true,
                                }}
                        />
                        <TextField sx={{ m: 1 }} fullWidth
                            value={`${new Date(reservation.endDate).toLocaleString()}`}
                                id="outlined-basic"
                                label="End date"
                                variant="outlined" 
                                InputProps={{
                                    readOnly: true,
                                }}
                        />
                            <TextField sx={{ m: 1 }} fullWidth
                                value={registrationNumber}
                                id="outlined-basic"
                                label="Registration number"
                                variant="outlined" 
                                onChange={(value) => handleChangeRegistrationNumber(value.target.value)}
                        />
                        <TextField sx={{ m: 1 }} fullWidth
                            value={`${reservation.parkingSpotDTO?.parkingDTO.name}, ${reservation.parkingSpotDTO?.parkingDTO.street}, ${reservation.parkingSpotDTO?.parkingDTO.city}`}
                                id="outlined-basic"
                                label="Parking name"
                                variant="outlined" 
                                InputProps={{
                                    readOnly: true,
                                }}
                        />
                            <TextField sx={{ m: 1 }} fullWidth
                                value={reservation.parkingSpotDTO?.id}
                                id="outlined-basic"
                                label="Parking spot"
                                variant="outlined" 
                                InputProps={{
                                    readOnly: true,
                                }}
                        />
                        <Button sx={{ m: 1 }} variant="contained" onClick={handleReseveClick} fullWidth>
                            Save
                        </Button>
                        <Button sx={{ m: 1 }} variant="outlined" onClick={handleEditClick} fullWidth>
                            Cancel
                        </Button>
                        
                    </CardContent>
                </Paper>
            </Box>
        </Container>
    )
}