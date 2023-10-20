import { useNavigate} from 'react-router-dom';
import { Container, Box, Typography, Paper, CardContent, TextField, Button } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import { MapContainer, TileLayer, FeatureGroup, Polygon, Popup } from 'react-leaflet';
import { addReservation } from '../../actions/reservationActions';
import {toast} from "react-toastify";

export default function ReservationDetails(props) {
    const navigate = useNavigate();
    const reservation = useSelector(state => state.reservationReducer.reservation);
    const parking = useSelector(state => state.parkingReducer.parking);
    const parkingSpotReducer = useSelector(state => state.parkingSpotReducer);

    const dispatch = useDispatch()

    const handleReseveClick = (event) => {
        dispatch(addReservation(reservation))
        toast.success('reservation created');
        navigate('/');
    };

    const handleEditClick = (event) => {
        // navigate back
        navigate('/parking/' + parking.id);
    };

    // useEffect(() => {
    //     // Check if reservation is not found in Redux state
    //     if (reservation.id === undefined) {
    //         // Redirect to the '/reservations' route
    //         navigate('/parkings');
    //     }
    // }, [reservation]);
    
    
    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
            Rerservation Details
                </Typography>
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
                                value={new Date(reservation.startDate).toLocaleString()}
                                id="outlined-basic"
                                label="Start date"
                                variant="outlined" 
                                InputProps={{
                                    readOnly: true,
                                }}
                        />
                        <TextField sx={{ m: 1 }} fullWidth
                                value={new Date(reservation.endDate).toLocaleString()}
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