import { useNavigate} from 'react-router-dom';
import { Container, Box, Typography, Paper, CardContent, TextField, Button, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import { MapContainer, TileLayer, FeatureGroup, Polygon, Popup } from 'react-leaflet';
import { addReservation } from '../../actions/reservationActions';
import { toast } from "react-toastify";
import { useState } from 'react';

export default function ReservationDetails(props) {
    const navigate = useNavigate();
    const reservation = useSelector(state => state.reservationReducer.reservation);
    const parking = useSelector(state => state.parkingReducer.parking);
    const parkingSpotReducer = useSelector(state => state.parkingSpotReducer);
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch()

    const handleReseveClick = (event) => {
        try {
            setLoading(true);
            dispatch(addReservation(reservation))
                .then(response => {
                    setLoading(false);
                    toast.success('reservation created');
                    navigate('/');
                    dispatch({
                        type: 'GET_PARKING_SPOT',
                        value: {}
                    })
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
        navigate('/parking/' + parking.id);
    };
    
    
    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
            Rerservation Details
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
                        {parkingSpotReducer.parkingSpot.id && (
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
                        <TextField sx={{ m: 1 }} fullWidth
                                value={`${new Date(reservation.startDate).toLocaleString()} (${parking.timeZone})`}
                                id="outlined-basic"
                                label="Start date"
                                variant="outlined" 
                                InputProps={{
                                    readOnly: true,
                                }}
                        />
                        <TextField sx={{ m: 1 }} fullWidth
                            value={`${new Date(reservation.endDate).toLocaleString()} (${parking.timeZone})`}
                                id="outlined-basic"
                                label="End date"
                                variant="outlined" 
                                InputProps={{
                                    readOnly: true,
                                }}
                        />
                            <TextField sx={{ m: 1 }} fullWidth
                                value={reservation.registrationNumber}
                                id="outlined-basic"
                                label="Registration number"
                                variant="outlined" 
                                InputProps={{
                                    readOnly: true,
                                }}
                        />
                        <TextField sx={{ m: 1 }} fullWidth
                            value={`${parking.name}, ${parking.street}, ${parking.city}`}
                                id="outlined-basic"
                                label="Parking name"
                                variant="outlined" 
                                InputProps={{
                                    readOnly: true,
                                }}
                        />
                            <TextField sx={{ m: 1 }} fullWidth
                                value={1}
                                id="outlined-basic"
                                label="Parking spot"
                                variant="outlined" 
                                InputProps={{
                                    readOnly: true,
                                }}
                        />
                        <Button sx={{ m: 1 }} variant="contained" onClick={handleReseveClick} fullWidth>
                            Reserve
                        </Button>
                        <Button sx={{ m: 1 }} variant="outlined" onClick={handleEditClick} fullWidth>
                            Edit
                        </Button>
                        
                    </CardContent>
                </Paper>
            </Box>
        </Container>
    )
}