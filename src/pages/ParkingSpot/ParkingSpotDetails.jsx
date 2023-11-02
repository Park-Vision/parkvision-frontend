import { useNavigate, useParams } from 'react-router-dom';
import { Container, Box, Typography, Paper, CardContent, TextField, Button, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import { MapContainer, TileLayer, FeatureGroup, Polygon, Popup } from 'react-leaflet';
import { EditControl } from "react-leaflet-draw";
import { addReservation } from '../../actions/reservationActions';
import { toast } from "react-toastify";
import { useState, useRef, useEffect } from 'react';
import L from "leaflet";
import { getParkingSpot, updateParkingSpot } from '../../actions/parkingSpotActions';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
});

export default function ParkingSpotDetails(props) {
    const navigate = useNavigate();
    const parking = useSelector(state => state.parkingReducer.parking);
    const parkingSpotReducer = useSelector(state => state.parkingSpotReducer);

    const [spotNumber, setSpotNumber] = useState('');
    const [occupied, setOccupied] = useState('');
    const [active, setActive] = useState('');

    const mapRef = useRef(null);
    const dispatch = useDispatch()
    const params = useParams();

    useEffect(() => {
        // get id from url params
        
        console.log(params);
        dispatch(getParkingSpot(params.parkingSpotId));
    }, [])

    const handleEditClick = (event) => {
        try {
            // dispatch(addReservation(reservation)).then((response) => {
            //TODO
            // toast.success('reservation created, check your email');
            // dispatch({
            //     type: 'GET_PARKING_SPOT',
            //     value: {}
            // })
            // navigate('/');
            // });
        }
        catch (e) {
            console.log(e);
            toast.error('coflict!');
        }
    };


    const mapPonitsToParkingSpot = (points) => {
        const mappedPoints = points[0].map((coord) => {
                console.log(coord);
                return { latitude: coord[1], longitude: coord[0], id: coord[2] };
        });
        
        mappedPoints.pop();
        console.log(mappedPoints);
        const pointsDTO = mappedPoints.map((point) => {
            return {
                    id: point.id,
                    latitude: point.latitude,
                    longitude: point.longitude,
                    parkingSpotDTO: {
                        id: parking.id
                    }
                }
            }
        );

        const editedParkingSpot = {
            id: parkingSpotReducer.parkingSpot.id,
            spotNumber: "newly created spot",
            occupied: parkingSpotReducer.parkingSpot.occupied,
            active: parkingSpotReducer.parkingSpot.active,
            parkingDTO: {
                id: parkingSpotReducer.parkingSpot.parkingDTO.id
            },
            pointsDTO: pointsDTO
        }

        console.log(editedParkingSpot);

        dispatch(updateParkingSpot(editedParkingSpot));
    };

    const handleEditInfo = () => {

        const editedParkingSpot = {
            id: parkingSpotReducer.parkingSpot.id,
            spotNumber: spotNumber,
            occupied: occupied,
            active: active,
            parkingDTO: {
                id: parkingSpotReducer.parkingSpot.parkingDTO.id
            },
            pointsDTO: parkingSpotReducer.parkingSpot.pointsDTO
        }


        dispatch(updateParkingSpot(editedParkingSpot));
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Parking spot details
                </Typography>
                <Paper>
                    <CardContent>
                        <div style={{ height: '500px' }}>
                            {parkingSpotReducer.parkingSpot.id && (
                                <MapContainer
                                    style={{ width: '100%', height: '100%' }}
                                    center={[parkingSpotReducer.parkingSpot.pointsDTO[0].latitude, parkingSpotReducer.parkingSpot.pointsDTO[0].longitude]}
                                    zoom={21}
                                    scrollWheelZoom={true}
                                >
                                    <FeatureGroup>
                                        <EditControl
                                            position='topright'
                                            draw={{
                                                rectangle: false,
                                                circle: false,
                                                circlemarker: false,
                                                marker: false,
                                                polyline: false,
                                                polygon: false,
                                            }}
                                            edit={{
                                                edit: true,
                                                remove: false,
                                                featureGroup: mapRef.current?.leafletElement,
                                            }}
                                            onEdited={e => {
                                                e.layers.eachLayer(a => {
                                                    console.log(a.toGeoJSON().geometry.coordinates);
                                                    mapPonitsToParkingSpot(a.toGeoJSON().geometry.coordinates);
                                                });
                                            }}
                                        />
                                        {parkingSpotReducer.parkingSpot && parkingSpotReducer.parkingSpot.id && (
                                            <Polygon
                                                positions={parkingSpotReducer.parkingSpot.pointsDTO.map((point) => [
                                                    point.latitude,
                                                    point.longitude,
                                                    point.id
                                                ])}
                                                color='blue'
                                                interactive
                                            >
                                            </Polygon>
                                        )}
                                    </FeatureGroup>

                                    <TileLayer
                                        maxNativeZoom={22}
                                        maxZoom={22}
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="http://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                                    />



                                </MapContainer>
                            )}
                        </div>
                        {/* <TextField sx={{ m: 1 }} fullWidth
                            value={`${parkingSpotReducer.parkingSpot.parkingDTO.name}, ${parkingSpotReducer.parkingSpot.parkingDTO.street}, ${parkingSpotReducer.parkingSpot.parkingDTO.city}`}
                            id="outlined-basic"
                            label="Parking name"
                            variant="outlined"
                            InputProps={{
                                readOnly: true,
                            }}
                        /> */}
                        <TextField sx={{ m: 1 }} fullWidth
                            value={parkingSpotReducer.parkingSpot.id}
                            id="outlined-basic"
                            label="Parking spot id"
                            variant="outlined"
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                        <TextField sx={{ m: 1 }} fullWidth
                            value={spotNumber}
                            onChange={(event) => setSpotNumber(event.target.value)}
                            id="outlined-basic"
                            label="Parking spot number"
                            variant="outlined"
                        />
                        <TextField sx={{ m: 1 }} fullWidth
                            value={active}
                            onChange={(event) => setActive(event.target.value)}
                            id="outlined-basic"
                            label="Parking spot active"
                            variant="outlined"
                        />
                        <TextField sx={{ m: 1 }} fullWidth
                            value={occupied}
                            onChange={(event) => setOccupied(event.target.value)}
                            id="outlined-basic"
                            label="Parking spot occupied"
                            variant="outlined"
                        />
                        <Button sx={{ m: 1 }} variant="outlined" onClick={() => handleEditInfo} fullWidth>
                            Edit
                        </Button>
                    </CardContent>
                </Paper>
            </Box>
        </Container>
    )
}